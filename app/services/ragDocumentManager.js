// RAG Document Management Service for bitscribe
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class RAGDocumentManager {
  constructor() {
    this.client = null;
    this.db = null;
    this.documentsCollection = null;
    this.vectorCollection = null;
    this.isConnected = false;
    this.connectionString = process.env.MONGODB_URI;
    this.embeddingModel = 'text-embedding-3-small'; // OpenAI embedding model
  }

  async connect() {
    if (this.isConnected) return;

    try {
      if (!this.connectionString) {
        throw new Error('MongoDB connection string not provided');
      }

      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      
      this.db = this.client.db('design-review-scribe');
      this.documentsCollection = this.db.collection('rag_documents');
      this.vectorCollection = this.db.collection('document_vectors');
      
      // Create vector search index if it doesn't exist
      await this.createVectorSearchIndex();
      
      this.isConnected = true;
      console.log('🔗 RAG Document Manager connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect RAG Document Manager:', error);
      throw error;
    }
  }

  async createVectorSearchIndex() {
    try {
      // Check if vector search index exists
      const indexes = await this.vectorCollection.listIndexes().toArray();
      const vectorIndexExists = indexes.some(index => index.name === 'vector_index');

      if (!vectorIndexExists) {
        // Create Atlas Vector Search index
        await this.vectorCollection.createSearchIndex({
          name: 'vector_index',
          definition: {
            fields: [
              {
                type: 'vector',
                path: 'embedding',
                numDimensions: 1536, // OpenAI text-embedding-3-small dimensions
                similarity: 'cosine'
              },
              {
                type: 'filter',
                path: 'documentId'
              },
              {
                type: 'filter', 
                path: 'documentType'
              }
            ]
          }
        });
        console.log('✅ Vector search index created');
      }
    } catch (error) {
      console.log('ℹ️ Vector search index creation skipped (may already exist):', error.message);
    }
  }

  async uploadDocument(filePath, metadata = {}) {
    await this.connect();

    try {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      
      // Read and parse document content
      let content = '';
      switch (fileExtension) {
        case '.txt':
          content = await fs.promises.readFile(filePath, 'utf8');
          break;
        case '.pdf':
          const pdfBuffer = await fs.promises.readFile(filePath);
          const pdfData = await pdf(pdfBuffer);
          content = pdfData.text;
          break;
        case '.docx':
          const docxBuffer = await fs.promises.readFile(filePath);
          const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
          content = docxResult.value;
          break;
        case '.md':
          content = await fs.promises.readFile(filePath, 'utf8');
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      if (!content || content.trim().length === 0) {
        throw new Error('Document appears to be empty');
      }

      // Create document record
      const document = {
        fileName,
        fileType: fileExtension,
        content,
        metadata: {
          ...metadata,
          uploadedAt: new Date(),
          size: content.length,
          wordCount: content.split(/\s+/).length
        },
        isActive: true
      };

      // Insert document
      const result = await this.documentsCollection.insertOne(document);
      const documentId = result.insertedId;

      // Process document for vector storage
      await this.processDocumentForVectorSearch(documentId, content, metadata);

      console.log(`📄 Document uploaded: ${fileName} (${document.metadata.wordCount} words)`);
      return {
        success: true,
        documentId,
        fileName,
        wordCount: document.metadata.wordCount
      };

    } catch (error) {
      console.error('Document upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processDocumentForVectorSearch(documentId, content, metadata) {
    // Split content into chunks for better retrieval
    const chunks = this.splitIntoChunks(content, 1000, 200); // 1000 chars with 200 char overlap
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        // Generate embedding (you'll need to implement this with your LLM provider)
        const embedding = await this.generateEmbedding(chunk);
        
        // Store vector with metadata
        await this.vectorCollection.insertOne({
          documentId,
          chunkIndex: i,
          content: chunk,
          embedding,
          documentType: metadata.type || 'general',
          category: metadata.category || 'uncategorized',
          createdAt: new Date()
        });
      } catch (error) {
        console.error(`Failed to process chunk ${i} for document ${documentId}:`, error);
      }
    }
  }

  splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);
      
      // Try to break at word boundaries
      if (end < text.length && chunk.lastIndexOf(' ') > chunk.length - 100) {
        const lastSpace = chunk.lastIndexOf(' ');
        chunks.push(chunk.slice(0, lastSpace));
        start += lastSpace - overlap;
      } else {
        chunks.push(chunk);
        start += chunkSize - overlap;
      }
    }
    
    return chunks.filter(chunk => chunk.trim().length > 0);
  }

  async generateEmbedding(text) {
    // This will be integrated with your existing LLM providers
    // For now, return a placeholder - you'll implement this with OpenAI/other providers
    const { generateEmbedding } = require('./llmProviders');
    return await generateEmbedding(text);
  }

  async searchDocuments(query, options = {}) {
    await this.connect();

    try {
      const {
        limit = 5,
        documentType = null,
        category = null,
        threshold = 0.7
      } = options;

      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // Build vector search pipeline
      const pipeline = [
        {
          $vectorSearch: {
            index: 'vector_index',
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: limit * 2 // Get more candidates for filtering
          }
        },
        {
          $addFields: {
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ];

      // Add filters if specified
      const matchStage = {};
      if (documentType) matchStage.documentType = documentType;
      if (category) matchStage.category = category;
      
      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      // Filter by similarity threshold
      pipeline.push({
        $match: {
          score: { $gte: threshold }
        }
      });

      // Limit results
      pipeline.push({ $limit: limit });

      // Lookup document metadata
      pipeline.push({
        $lookup: {
          from: 'rag_documents',
          localField: 'documentId',
          foreignField: '_id',
          as: 'document'
        }
      });

      const results = await this.vectorCollection.aggregate(pipeline).toArray();

      return {
        success: true,
        results: results.map(result => ({
          content: result.content,
          score: result.score,
          documentId: result.documentId,
          fileName: result.document[0]?.fileName || 'Unknown',
          chunkIndex: result.chunkIndex,
          documentType: result.documentType,
          category: result.category
        }))
      };

    } catch (error) {
      console.error('Document search failed:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  async getDocuments() {
    await this.connect();

    try {
      const documents = await this.documentsCollection
        .find({ isActive: true })
        .sort({ 'metadata.uploadedAt': -1 })
        .toArray();

      return {
        success: true,
        documents: documents.map(doc => ({
          id: doc._id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          wordCount: doc.metadata.wordCount,
          uploadedAt: doc.metadata.uploadedAt,
          type: doc.metadata.type || 'general',
          category: doc.metadata.category || 'uncategorized'
        }))
      };
    } catch (error) {
      console.error('Failed to retrieve documents:', error);
      return {
        success: false,
        error: error.message,
        documents: []
      };
    }
  }

  async deleteDocument(documentId) {
    await this.connect();

    try {
      // Mark document as inactive
      await this.documentsCollection.updateOne(
        { _id: documentId },
        { $set: { isActive: false, deletedAt: new Date() } }
      );

      // Remove vectors
      await this.vectorCollection.deleteMany({ documentId });

      return { success: true };
    } catch (error) {
      console.error('Failed to delete document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getDocumentStats() {
    await this.connect();

    try {
      const [docCount, vectorCount] = await Promise.all([
        this.documentsCollection.countDocuments({ isActive: true }),
        this.vectorCollection.countDocuments()
      ]);

      return {
        success: true,
        stats: {
          totalDocuments: docCount,
          totalChunks: vectorCount,
          avgChunksPerDoc: docCount > 0 ? Math.round(vectorCount / docCount) : 0
        }
      };
    } catch (error) {
      console.error('Failed to get document stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 RAG Document Manager disconnected');
    }
  }
}

module.exports = RAGDocumentManager;
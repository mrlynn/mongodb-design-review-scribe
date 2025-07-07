// RAG-Enhanced Transcript Processor
const RAGDocumentManager = require('./ragDocumentManager');
const { generateCompletion } = require('./llmProviders');

class RAGEnhancedProcessor {
  constructor() {
    this.ragManager = new RAGDocumentManager();
    this.isEnabled = false;
    this.contextLimit = 3; // Number of relevant documents to include
    this.relevanceThreshold = 0.7; // Minimum similarity score
  }

  async initialize() {
    try {
      await this.ragManager.connect();
      this.isEnabled = true;
      console.log('🧠 RAG Enhanced Processor initialized');
    } catch (error) {
      console.error('Failed to initialize RAG processor:', error);
      this.isEnabled = false;
    }
  }

  async enhanceTopicExtraction(transcript) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // Search for relevant documents
      const relevantDocs = await this.ragManager.searchDocuments(
        transcript,
        {
          limit: this.contextLimit,
          threshold: this.relevanceThreshold,
          documentType: 'best-practices'
        }
      );

      if (!relevantDocs.success || relevantDocs.results.length === 0) {
        return null;
      }

      // Build enhanced context
      const context = this.buildRAGContext(relevantDocs.results);
      
      // Enhanced topic extraction prompt
      const prompt = `You are analyzing a conversation transcript with access to relevant best practices documentation.

RELEVANT DOCUMENTATION CONTEXT:
${context}

CONVERSATION TRANSCRIPT:
${transcript}

Based on the conversation and the relevant documentation, extract:
1. Key topics discussed
2. Best practice violations or concerns
3. Recommended actions based on the documentation
4. Questions that should be asked based on best practices

Respond with JSON only:
{
  "topics": ["topic1", "topic2"],
  "bestPracticeViolations": [
    {
      "issue": "description of violation",
      "recommendation": "specific recommendation from docs",
      "documentSource": "source document name"
    }
  ],
  "recommendedActions": ["action1", "action2"],
  "suggestedQuestions": ["question1", "question2"],
  "documentSources": ["doc1", "doc2"]
}`;

      const response = await generateCompletion(prompt, { format: 'json' });
      const result = JSON.parse(response);

      console.log('✅ RAG Enhanced topic extraction completed');
      return result;

    } catch (error) {
      console.error('RAG enhanced topic extraction failed:', error);
      return null;
    }
  }

  async enhanceInsightGeneration(transcript, currentInsights = []) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // Search for relevant documents for insight generation
      const relevantDocs = await this.ragManager.searchDocuments(
        transcript,
        {
          limit: this.contextLimit,
          threshold: this.relevanceThreshold
        }
      );

      if (!relevantDocs.success || relevantDocs.results.length === 0) {
        return null;
      }

      const context = this.buildRAGContext(relevantDocs.results);

      const prompt = `You are generating insights for a conversation with access to relevant documentation.

RELEVANT DOCUMENTATION:
${context}

CONVERSATION TRANSCRIPT:
${transcript}

CURRENT INSIGHTS:
${currentInsights.map(insight => `- ${insight.content}`).join('\n')}

Generate new insights that:
1. Reference the documentation when relevant
2. Provide actionable guidance
3. Highlight potential issues or opportunities
4. Don't repeat existing insights

Respond with JSON only:
{
  "insights": [
    {
      "type": "strategic|tactical|warning|opportunity",
      "content": "insight text with documentation reference",
      "confidence": 0.8,
      "documentSource": "source document name",
      "actionable": true,
      "priority": "high|medium|low"
    }
  ]
}`;

      const response = await generateCompletion(prompt, { format: 'json' });
      const result = JSON.parse(response);

      console.log('✅ RAG Enhanced insights generated');
      return result.insights || [];

    } catch (error) {
      console.error('RAG enhanced insight generation failed:', error);
      return [];
    }
  }

  async enhanceMeetingNotes(transcript, topics, research) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // Search for documents relevant to the meeting content
      const searchQuery = `${topics.join(' ')} ${transcript.substring(0, 500)}`;
      const relevantDocs = await this.ragManager.searchDocuments(
        searchQuery,
        {
          limit: 5,
          threshold: 0.6
        }
      );

      if (!relevantDocs.success || relevantDocs.results.length === 0) {
        return null;
      }

      const context = this.buildRAGContext(relevantDocs.results);

      const prompt = `Generate comprehensive meeting notes with best practice recommendations.

RELEVANT BEST PRACTICES DOCUMENTATION:
${context}

MEETING TRANSCRIPT:
${transcript}

IDENTIFIED TOPICS:
${topics.join(', ')}

RESEARCH CONTEXT:
${research.map(r => `${r.topic}: ${r.summary}`).join('\n')}

Create detailed meeting notes that include:
1. Executive summary with key decisions
2. Action items with ownership and deadlines
3. Best practice recommendations based on documentation
4. Risk assessments based on documented guidelines
5. Follow-up questions and next steps

Respond with JSON only:
{
  "executiveSummary": "2-3 sentence summary",
  "keyDecisions": ["decision1", "decision2"],
  "actionItems": [
    {
      "task": "specific task",
      "owner": "suggested owner or role",
      "deadline": "suggested timeline",
      "priority": "high|medium|low",
      "bestPracticeRef": "reference to documentation if applicable"
    }
  ],
  "riskAssessments": [
    {
      "risk": "identified risk",
      "severity": "high|medium|low",
      "mitigation": "recommended mitigation from docs",
      "documentSource": "source document"
    }
  ],
  "bestPracticeRecommendations": [
    {
      "recommendation": "specific recommendation",
      "reasoning": "why this applies",
      "documentSource": "source document",
      "implementation": "how to implement"
    }
  ],
  "followUpQuestions": ["question1", "question2"],
  "documentSources": ["doc1", "doc2"]
}`;

      const response = await generateCompletion(prompt, { format: 'json' });
      const result = JSON.parse(response);

      console.log('✅ RAG Enhanced meeting notes generated');
      return result;

    } catch (error) {
      console.error('RAG enhanced meeting notes generation failed:', error);
      return null;
    }
  }

  buildRAGContext(relevantDocs) {
    return relevantDocs.map((doc, index) => 
      `[Document ${index + 1}: ${doc.fileName} (Score: ${doc.score.toFixed(2)})]\n${doc.content}\n`
    ).join('\n---\n');
  }

  async searchRelevantContext(query, options = {}) {
    if (!this.isEnabled) {
      return { success: false, results: [] };
    }

    return await this.ragManager.searchDocuments(query, options);
  }

  async getDocumentStats() {
    if (!this.isEnabled) {
      return { success: false, stats: {} };
    }

    return await this.ragManager.getDocumentStats();
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`🧠 RAG Enhanced Processor ${enabled ? 'enabled' : 'disabled'}`);
  }

  setRelevanceThreshold(threshold) {
    this.relevanceThreshold = Math.max(0.1, Math.min(1.0, threshold));
    console.log(`🎯 RAG relevance threshold set to: ${this.relevanceThreshold}`);
  }

  setContextLimit(limit) {
    this.contextLimit = Math.max(1, Math.min(10, limit));
    console.log(`📚 RAG context limit set to: ${this.contextLimit}`);
  }
}

module.exports = RAGEnhancedProcessor;
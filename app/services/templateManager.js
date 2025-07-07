// Template Manager Service - Handles template operations and variable substitution
const { createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate, incrementTemplateUsage } = require('./mongoStorage');
const localStorage = require('./localTemplateStorage');

class TemplateManagerService {
  constructor() {
    this.defaultTemplates = this.initializeDefaultTemplates();
    this.useLocalStorage = false;
  }

  // Determine which storage to use based on MongoDB availability
  async getStorageProvider() {
    if (this.useLocalStorage) {
      return localStorage;
    }
    
    try {
      // Test MongoDB connection by trying to get templates
      await getTemplates();
      return { createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate, incrementTemplateUsage };
    } catch (error) {
      console.warn('MongoDB not available, falling back to local storage:', error.message);
      this.useLocalStorage = true;
      return localStorage;
    }
  }

  initializeDefaultTemplates() {
    return [
      {
        name: "MongoDB Design Review Report",
        description: "Expert MongoDB schema and data model review with actionable recommendations and references.",
        category: "Technology",
        version: "1.0.0",
        icon: "🍃",
        prompt: `You are a world-class MongoDB Design Review Assistant. Your job is to review MongoDB data models and schemas, offering actionable feedback and recommendations that align with MongoDB's best practices.

When you begin, always check if the following context is present in the transcript or provided variables. If not, politely prompt for it in your executive summary:
- Application or business use case overview
- MongoDB schema(s) and collection structure (ERD or summary)
- List of common/important queries and update patterns (access patterns)
- Information about scale (document counts, growth, read/write/query velocities)
- Any non-obvious business or compliance requirements

Transcript:
{{transcript}}

{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}

Please generate a MongoDB Design Review Report in the following format:

1. Executive Summary
   - Briefly summarize the review and, if any required context is missing, list what is needed for a more thorough review.

2. What We Heard
   - Echo back the main discussion topics and customer concerns in clear, simple language.
   - Summarize the application's goals and context as understood from the transcript.

3. Issues
   - Identify issues, antipatterns, or pain points revealed in the transcript.
   - Explicitly call out patterns that are suboptimal in MongoDB (e.g., overuse of $lookup, unnecessary normalization, large unbounded arrays, excessive collections, etc.).
   - Flag any risks to scalability, performance, or maintainability.

4. Recommendations
   - Give direct, prioritized recommendations using MongoDB schema and data modeling best practices.
   - For each issue, explain why the recommendation is optimal for MongoDB.
   - Provide improved schema examples or patterns where appropriate.
   - Prefer embedding, denormalization, and designing around the queries unless there's a strong reason not to.
   - Suggest indexing, sharding, data partitioning, or advanced features if relevant (e.g., change streams, schema validation, TTL indexes).

5. References
   - List official MongoDB documentation links that back up your recommendations.
   - Link to specific pages, not just the main docs.
   - Example links:
     - https://www.mongodb.com/docs/manual/core/data-modeling-introduction/
     - https://www.mongodb.com/docs/manual/core/schema-design-best-practices/
     - https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
     - https://www.mongodb.com/docs/manual/core/indexes/
     - https://www.mongodb.com/docs/manual/core/sharding/
     - https://www.mongodb.com/docs/manual/core/changeStreams/

Format the output in clean markdown with clear headers and formatting. Communicate in a way that's clear for technical audiences but easy to digest. Do not recommend relational/SQL features or approaches. Do not speculate or make assumptions without first asking clarifying questions.`,
        variables: [
          {
            name: "additionalContext",
            type: "textarea",
            label: "Additional Context",
            placeholder: "Any additional context about the design review (optional)",
            required: false,
            default: ""
          }
        ],
        outputFormat: "markdown",
        sections: [
          {
            title: "Executive Summary",
            key: "execSummary",
            required: true,
            description: "Brief summary of the review and any missing context needed for a more thorough review."
          },
          {
            title: "What We Heard",
            key: "whatWeHeard",
            required: true,
            description: "Main discussion topics, customer concerns, and application context."
          },
          {
            title: "Issues",
            key: "issues",
            required: true,
            description: "Identified issues, antipatterns, and risks for MongoDB."
          },
          {
            title: "Recommendations",
            key: "recommendations",
            required: true,
            description: "Actionable, prioritized recommendations with explanations and schema examples."
          },
          {
            title: "References",
            key: "references",
            required: true,
            description: "Official MongoDB documentation links supporting the recommendations."
          }
        ],
        metadata: {
          author: "MongoDB Design Review Team",
          createdAt: new Date().toISOString(),
          tags: ["mongodb", "design review", "schema", "data modeling", "technology"],
          isDefault: true,
          minimumTranscriptLength: 100,
          estimatedTokens: 700,
          language: "en"
        },
        isActive: true,
        isDefault: true
      },
      {
        name: "Meeting Minutes",
        description: "Professional meeting minutes with action items and decisions",
        category: "Business",
        icon: "MeetingRoom",
        prompt: `You are a professional meeting secretary. Analyze the following transcript and create structured meeting minutes.

Transcript:
{{transcript}}

{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}

Please generate meeting minutes with the following sections:
1. Meeting Summary (2-3 sentences)
2. Key Discussion Points (bullet points)
3. Decisions Made (with context and impact)
4. Action Items (with assignees and deadlines if mentioned)
5. Next Steps

Format the output in clean markdown with clear headers and formatting.`,
        variables: [
          {
            name: "additionalContext",
            type: "text",
            required: false,
            default: "",
            placeholder: "Any additional context about the meeting (optional)"
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "MongoDB Design Review Summary", key: "designReviewSummary", required: true },
          { title: "Meeting Summary", key: "summary", required: true },
          { title: "Key Discussion Points", key: "keyPoints", required: true },
          { title: "Decisions Made", key: "decisions", required: true },
          { title: "Action Items", key: "actionItems", required: true },
          { title: "Next Steps", key: "nextSteps", required: false }
        ]
      },
      {
        name: "Interview Summary",
        description: "Comprehensive interview report with candidate assessment",
        category: "HR",
        icon: "Person",
        prompt: `You are an experienced HR professional. Analyze this interview transcript and create a comprehensive summary.

Candidate Name: {{candidateName}}
Position: {{position}}
Interview Date: {{interviewDate}}

Transcript:
{{transcript}}

Please provide:
1. Candidate Overview (background, first impression)
2. Key Qualifications Discussed
3. Technical Skills Assessment
4. Behavioral Responses Analysis
5. Strengths and Weaknesses
6. Cultural Fit Assessment
7. Recommendation (with reasoning)

Be objective and base assessments only on what was discussed in the interview.`,
        variables: [
          {
            name: "candidateName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Enter candidate's name"
          },
          {
            name: "position",
            type: "text",
            required: true,
            default: "",
            placeholder: "Position being interviewed for"
          },
          {
            name: "interviewDate",
            type: "date",
            required: true,
            default: new Date().toISOString().split('T')[0]
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Candidate Overview", key: "overview", required: true },
          { title: "Key Qualifications", key: "qualifications", required: true },
          { title: "Technical Skills", key: "technicalSkills", required: true },
          { title: "Behavioral Analysis", key: "behavioral", required: true },
          { title: "Strengths & Weaknesses", key: "strengthsWeaknesses", required: true },
          { title: "Cultural Fit", key: "culturalFit", required: true },
          { title: "Recommendation", key: "recommendation", required: true }
        ]
      },
      {
        name: "Sales Call Report",
        description: "Sales call analysis with opportunity assessment",
        category: "Sales",
        icon: "Phone",
        prompt: `You are a sales analyst. Review this sales call transcript and create a comprehensive report.

Company: {{companyName}}
Sales Rep: {{salesRep}}
Call Type: {{callType}}

Transcript:
{{transcript}}

Analyze and provide:
1. Call Summary
2. Customer Pain Points Identified
3. Product/Solution Fit Assessment
4. Objections Raised and Responses
5. Competitive Mentions
6. Budget Discussion (if any)
7. Next Steps and Follow-up Actions
8. Deal Probability Assessment (High/Medium/Low with reasoning)

Focus on actionable insights for the sales team.`,
        variables: [
          {
            name: "companyName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Customer company name"
          },
          {
            name: "salesRep",
            type: "text",
            required: true,
            default: "",
            placeholder: "Sales representative name"
          },
          {
            name: "callType",
            type: "select",
            required: true,
            default: "discovery",
            options: ["discovery", "demo", "follow-up", "negotiation", "closing"]
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Call Summary", key: "summary", required: true },
          { title: "Pain Points", key: "painPoints", required: true },
          { title: "Solution Fit", key: "solutionFit", required: true },
          { title: "Objections", key: "objections", required: false },
          { title: "Competition", key: "competition", required: false },
          { title: "Budget", key: "budget", required: false },
          { title: "Next Steps", key: "nextSteps", required: true },
          { title: "Deal Assessment", key: "dealAssessment", required: true }
        ]
      },
      {
        name: "Medical Consultation",
        description: "Medical consultation notes with assessment and plan",
        category: "Healthcare",
        icon: "LocalHospital",
        prompt: `You are a medical scribe. Create clinical documentation from this consultation transcript.

Patient ID: {{patientId}}
Provider: {{providerName}}
Visit Type: {{visitType}}

Transcript:
{{transcript}}

Generate clinical notes including:
1. Chief Complaint
2. History of Present Illness
3. Review of Systems (if mentioned)
4. Physical Exam Findings (if mentioned)
5. Assessment
6. Plan
7. Follow-up Instructions

Use standard medical documentation format. Only include information explicitly mentioned in the transcript.`,
        variables: [
          {
            name: "patientId",
            type: "text",
            required: true,
            default: "",
            placeholder: "Patient ID (anonymized)"
          },
          {
            name: "providerName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Healthcare provider name"
          },
          {
            name: "visitType",
            type: "select",
            required: true,
            default: "routine",
            options: ["routine", "urgent", "follow-up", "consultation", "telehealth"]
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Chief Complaint", key: "chiefComplaint", required: true },
          { title: "History of Present Illness", key: "hpi", required: true },
          { title: "Review of Systems", key: "ros", required: false },
          { title: "Physical Exam", key: "physicalExam", required: false },
          { title: "Assessment", key: "assessment", required: true },
          { title: "Plan", key: "plan", required: true },
          { title: "Follow-up", key: "followUp", required: true }
        ]
      },
      {
        name: "Legal Deposition Summary",
        description: "Legal deposition summary with key testimony highlights",
        category: "Legal",
        icon: "Gavel",
        prompt: `You are a legal assistant. Summarize this deposition transcript.

Case: {{caseNumber}}
Deponent: {{deponentName}}
Date: {{depositionDate}}
Examining Attorney: {{examiningAttorney}}

Transcript:
{{transcript}}

Provide:
1. Deponent Background (as revealed in testimony)
2. Key Facts Established
3. Critical Admissions
4. Inconsistencies or Contradictions
5. Objections and Rulings
6. Exhibits Referenced
7. Follow-up Needed

Maintain objectivity and accuracy. Use exact quotes for critical testimony.`,
        variables: [
          {
            name: "caseNumber",
            type: "text",
            required: true,
            default: "",
            placeholder: "Case number"
          },
          {
            name: "deponentName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Name of person being deposed"
          },
          {
            name: "depositionDate",
            type: "date",
            required: true,
            default: new Date().toISOString().split('T')[0]
          },
          {
            name: "examiningAttorney",
            type: "text",
            required: true,
            default: "",
            placeholder: "Examining attorney name"
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Deponent Background", key: "background", required: true },
          { title: "Key Facts", key: "keyFacts", required: true },
          { title: "Critical Admissions", key: "admissions", required: true },
          { title: "Inconsistencies", key: "inconsistencies", required: false },
          { title: "Objections", key: "objections", required: false },
          { title: "Exhibits", key: "exhibits", required: false },
          { title: "Follow-up Needed", key: "followUp", required: true }
        ]
      },
      {
        name: "MongoDB Design Review",
        description: "Comprehensive MongoDB design review report for customer interviews",
        category: "Technology",
        icon: "Storage",
        prompt: `You are a MongoDB solutions architect analyzing a customer design review interview. Create a comprehensive design review report.

Customer: {{customerName}}
Project: {{projectName}}
Date: {{reviewDate}}
MongoDB Version: {{mongodbVersion}}

Transcript:
{{transcript}}

{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}

Please generate a MongoDB Design Review Report with the following sections:

1. What We Heard
   - Customer's current architecture and pain points
   - Use cases and business requirements
   - Performance and scale requirements
   - Current challenges with their data model or queries

2. Issues with the Design
   - Schema design anti-patterns identified
   - Query performance concerns
   - Indexing strategy gaps
   - Scalability limitations
   - Security or operational concerns

3. What We Recommend
   - Schema design improvements with specific examples
   - Indexing strategy recommendations
   - Query optimization suggestions
   - Sharding strategy (if applicable)
   - Best practices for their use case
   - Migration approach if redesign is needed

4. References
   - Links to relevant MongoDB documentation
   - Best practices guides
   - Similar use case examples
   - Recommended MongoDB University courses

Format the output in clean markdown with clear headers, code examples where applicable, and actionable recommendations.`,
        variables: [
          {
            name: "customerName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Customer/Company name"
          },
          {
            name: "projectName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Project or application name"
          },
          {
            name: "reviewDate",
            type: "date",
            required: true,
            default: new Date().toISOString().split('T')[0]
          },
          {
            name: "mongodbVersion",
            type: "select",
            required: true,
            default: "7.0",
            options: ["4.4", "5.0", "6.0", "7.0", "Atlas"]
          },
          {
            name: "additionalContext",
            type: "textarea",
            required: false,
            default: "",
            placeholder: "Any additional context about the customer's environment or requirements (optional)"
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "What We Heard", key: "whatWeHeard", required: true },
          { title: "Issues with the Design", key: "designIssues", required: true },
          { title: "What We Recommend", key: "recommendations", required: true },
          { title: "References", key: "references", required: true }
        ]
      }
    ];
  }

  // Initialize default templates in database
  async initializeDatabase() {
    try {
      const storage = await this.getStorageProvider();
      const existingTemplates = await storage.getTemplates();
      
      // Always ensure MongoDB Design Review template exists
      const mongoDBTemplate = this.defaultTemplates.find(t => t.name === 'MongoDB Design Review Report');
      if (mongoDBTemplate) {
        const existingMongoTemplate = existingTemplates.find(t => t.name === 'MongoDB Design Review Report');
        if (!existingMongoTemplate) {
          console.log('Adding MongoDB Design Review template...');
          await storage.createTemplate({
            ...mongoDBTemplate,
            metadata: {
              ...mongoDBTemplate.metadata,
              author: 'MongoDB Design Review Team',
              isDefault: true
            }
          });
          console.log('MongoDB Design Review template added successfully');
        }
      }
      
      if (existingTemplates.length === 0) {
        console.log('Initializing default templates...');
        
        for (const template of this.defaultTemplates) {
          await storage.createTemplate({
            ...template,
            metadata: {
              author: 'System',
              isDefault: true
            }
          });
        }
        
        console.log('Default templates initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing default templates:', error);
      // Fallback to direct MongoDB call if storage provider fails
      try {
        const existingTemplates = await getTemplates();
        
        // Always ensure MongoDB Design Review template exists (fallback)
        const mongoDBTemplate = this.defaultTemplates.find(t => t.name === 'MongoDB Design Review Report');
        if (mongoDBTemplate) {
          const existingMongoTemplate = existingTemplates.find(t => t.name === 'MongoDB Design Review Report');
          if (!existingMongoTemplate) {
            console.log('Fallback: Adding MongoDB Design Review template...');
            await createTemplate({
              ...mongoDBTemplate,
              metadata: {
                ...mongoDBTemplate.metadata,
                author: 'MongoDB Design Review Team',
                isDefault: true
              }
            });
          }
        }
        
        if (existingTemplates.length === 0) {
          console.log('Fallback: Initializing default templates in MongoDB...');
          
          for (const template of this.defaultTemplates) {
            await createTemplate({
              ...template,
              metadata: {
                author: 'System',
                isDefault: true
              }
            });
          }
          
          console.log('Default templates initialized successfully via fallback');
        }
      } catch (fallbackError) {
        console.error('Both storage provider and fallback failed:', fallbackError);
      }
    }
  }

  // Variable substitution using Handlebars-like syntax
  substituteVariables(template, variables) {
    let prompt = template.prompt;
    
    // Simple variable substitution
    Object.keys(variables).forEach(key => {
      const value = variables[key];
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      prompt = prompt.replace(regex, value || '');
    });
    
    // Handle conditional blocks {{#if variable}}...{{/if}}
    prompt = prompt.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });
    
    return prompt;
  }

  // Validate variables against template requirements
  validateVariables(template, providedVariables) {
    const errors = [];
    
    template.variables.forEach(variable => {
      if (variable.required && !providedVariables[variable.name]) {
        errors.push(`Required variable '${variable.name}' is missing`);
      }
      
      if (variable.type === 'select' && providedVariables[variable.name]) {
        if (!variable.options.includes(providedVariables[variable.name])) {
          errors.push(`Invalid value for '${variable.name}'. Must be one of: ${variable.options.join(', ')}`);
        }
      }
    });
    
    return errors;
  }

  // Get template with usage tracking
  async getTemplateForUse(templateId) {
    try {
      // First try with the storage provider to handle MongoDB/local storage
      const storage = await this.getStorageProvider();
      const template = await storage.getTemplateById(templateId);
      
      if (template) {
        await storage.incrementTemplateUsage(templateId);
      }
      
      return template;
    } catch (error) {
      console.error('Error getting template for use:', error);
      // Fallback to direct MongoDB call if storage provider fails
      try {
        const template = await getTemplateById(templateId);
        if (template) {
          await incrementTemplateUsage(templateId);
        }
        return template;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error(`Could not retrieve template: ${error.message}`);
      }
    }
  }

  // Template CRUD operations with validation
  async createCustomTemplate(templateData) {
    // Validate template structure
    const requiredFields = ['name', 'description', 'category', 'prompt'];
    const missingFields = requiredFields.filter(field => !templateData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Set defaults
    const template = {
      ...templateData,
      icon: templateData.icon || 'Description',
      variables: templateData.variables || [],
      outputFormat: templateData.outputFormat || 'markdown',
      sections: templateData.sections || []
    };
    
    return await createTemplate(template);
  }

  async updateCustomTemplate(templateId, updates) {
    // Don't allow updating system templates
    const template = await getTemplateById(templateId);
    
    if (template?.metadata?.isDefault) {
      throw new Error('Cannot modify default templates');
    }
    
    // Save current version before updating
    if (template) {
      const { saveTemplateVersion } = require('./mongoStorage');
      try {
        await saveTemplateVersion(templateId, template, 'pre_update');
      } catch (error) {
        console.warn('Failed to save template version:', error);
      }
    }
    
    const result = await updateTemplate(templateId, updates);
    
    // Save new version after updating
    if (result) {
      const { saveTemplateVersion } = require('./mongoStorage');
      try {
        const updatedTemplate = await getTemplateById(templateId);
        await saveTemplateVersion(templateId, updatedTemplate, 'updated');
      } catch (error) {
        console.warn('Failed to save updated template version:', error);
      }
    }
    
    return result;
  }

  async deleteCustomTemplate(templateId) {
    // Don't allow deleting system templates
    const template = await getTemplateById(templateId);
    
    if (template?.metadata?.isDefault) {
      throw new Error('Cannot delete default templates');
    }
    
    return await deleteTemplate(templateId);
  }

  // Get templates by category
  async getTemplatesByCategory(category) {
    return await getTemplates({ category });
  }

  // Search templates
  async searchTemplates(searchTerm) {
    return await getTemplates({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ]
    });
  }

  // Template validation using JSON schema
  validateTemplateSchema(templateData) {
    const errors = [];
    
    // Required fields
    const requiredFields = ['name', 'description', 'category', 'prompt', 'version'];
    for (const field of requiredFields) {
      if (!templateData[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Version format validation
    if (templateData.version && !/^\d+\.\d+\.\d+$/.test(templateData.version)) {
      errors.push('Version must be in format x.y.z (e.g., 1.0.0)');
    }
    
    // Category validation
    const validCategories = ['Business', 'HR', 'Sales', 'Healthcare', 'Legal', 'Education', 'Technology', 'Finance', 'Custom'];
    if (templateData.category && !validCategories.includes(templateData.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
    
    // Variables validation
    if (templateData.variables) {
      if (!Array.isArray(templateData.variables)) {
        errors.push('Variables must be an array');
      } else {
        templateData.variables.forEach((variable, index) => {
          if (!variable.name) {
            errors.push(`Variable ${index + 1}: Missing name`);
          } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(variable.name)) {
            errors.push(`Variable ${index + 1}: Name must start with letter and contain only letters, numbers, and underscores`);
          }
          
          const validTypes = ['text', 'textarea', 'select', 'date', 'number', 'email', 'url'];
          if (!variable.type || !validTypes.includes(variable.type)) {
            errors.push(`Variable ${index + 1}: Invalid type. Must be one of: ${validTypes.join(', ')}`);
          }
          
          if (variable.type === 'select' && (!variable.options || !Array.isArray(variable.options) || variable.options.length === 0)) {
            errors.push(`Variable ${index + 1}: Select type variables must have options array`);
          }
        });
      }
    }
    
    // Output format validation
    const validFormats = ['markdown', 'html', 'json', 'plain'];
    if (templateData.outputFormat && !validFormats.includes(templateData.outputFormat)) {
      errors.push(`Invalid output format. Must be one of: ${validFormats.join(', ')}`);
    }
    
    return errors;
  }

  // Import template from JSON
  async importTemplate(templateJson) {
    try {
      let templateData;
      
      // Parse JSON if it's a string
      if (typeof templateJson === 'string') {
        templateData = JSON.parse(templateJson);
      } else {
        templateData = templateJson;
      }
      
      // Validate schema
      const validationErrors = this.validateTemplateSchema(templateData);
      if (validationErrors.length > 0) {
        throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Get storage provider (MongoDB or local fallback)
      const storage = await this.getStorageProvider();
      
      // Check for name conflicts
      try {
        const existingTemplates = await storage.getTemplates({ name: templateData.name });
        if (existingTemplates.length > 0) {
          throw new Error(`Template with name "${templateData.name}" already exists`);
        }
      } catch (dbError) {
        console.warn('Could not check for conflicts, proceeding with import:', dbError.message);
      }
      
      // Set metadata
      const now = new Date().toISOString();
      const processedTemplate = {
        ...templateData,
        metadata: {
          ...templateData.metadata,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          rating: 0,
          isDefault: false,
          author: templateData.metadata?.author || 'User Import'
        }
      };
      
      // Create template using appropriate storage
      const result = await storage.createTemplate(processedTemplate);
      
      console.log('Template imported successfully:', result.name);
      return result;
      
    } catch (error) {
      console.error('Error importing template:', error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Export template to JSON
  async exportTemplate(templateId) {
    try {
      const storage = await this.getStorageProvider();
      const template = await storage.getTemplateById(templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      // Create exportable template (remove MongoDB _id and internal metadata)
      const exportTemplate = {
        name: template.name,
        description: template.description,
        category: template.category,
        version: template.version || '1.0.0',
        icon: template.icon || '📄',
        prompt: template.prompt,
        variables: template.variables || [],
        outputFormat: template.outputFormat || 'markdown',
        sections: template.sections || [],
        metadata: {
          author: template.metadata?.author || 'Unknown',
          createdAt: template.metadata?.createdAt,
          tags: template.metadata?.tags || [],
          minimumTranscriptLength: template.metadata?.minimumTranscriptLength || 50,
          estimatedTokens: template.metadata?.estimatedTokens,
          language: template.metadata?.language || 'en'
        }
      };
      
      return {
        success: true,
        template: exportTemplate,
        filename: `${template.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-template.json`
      };
      
    } catch (error) {
      console.error('Error exporting template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export all templates
  async exportAllTemplates() {
    try {
      const storage = await this.getStorageProvider();
      const templates = await storage.getTemplates();
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        templates: templates.map(template => ({
          name: template.name,
          description: template.description,
          category: template.category,
          version: template.version || '1.0.0',
          icon: template.icon || '📄',
          prompt: template.prompt,
          variables: template.variables || [],
          outputFormat: template.outputFormat || 'markdown',
          sections: template.sections || [],
          metadata: {
            author: template.metadata?.author || 'Unknown',
            createdAt: template.metadata?.createdAt,
            tags: template.metadata?.tags || [],
            isDefault: template.metadata?.isDefault || false,
            minimumTranscriptLength: template.metadata?.minimumTranscriptLength || 50,
            estimatedTokens: template.metadata?.estimatedTokens,
            language: template.metadata?.language || 'en'
          }
        }))
      };
      
      return {
        success: true,
        data: exportData,
        filename: `mongodb-design-review-templates-${new Date().toISOString().split('T')[0]}.json`
      };
      
    } catch (error) {
      console.error('Error exporting all templates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Import multiple templates from export file
  async importTemplateCollection(collectionJson) {
    try {
      let collectionData;
      
      // Parse JSON if it's a string
      if (typeof collectionJson === 'string') {
        collectionData = JSON.parse(collectionJson);
      } else {
        collectionData = collectionJson;
      }
      
      if (!collectionData.templates || !Array.isArray(collectionData.templates)) {
        throw new Error('Invalid template collection format. Expected "templates" array.');
      }
      
      const results = {
        imported: [],
        skipped: [],
        errors: []
      };
      
      for (const templateData of collectionData.templates) {
        try {
          const imported = await this.importTemplate(templateData);
          results.imported.push({ name: templateData.name, id: imported._id });
        } catch (error) {
          if (error.message.includes('already exists')) {
            results.skipped.push({ name: templateData.name, reason: 'Already exists' });
          } else {
            results.errors.push({ name: templateData.name, error: error.message });
          }
        }
      }
      
      return {
        success: true,
        results: results,
        summary: `Imported: ${results.imported.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`
      };
      
    } catch (error) {
      console.error('Error importing template collection:', error);
      throw new Error(`Collection import failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const templateManager = new TemplateManagerService();

module.exports = {
  templateManager,
  initializeDatabase: () => templateManager.initializeDatabase(),
  substituteVariables: (template, variables) => templateManager.substituteVariables(template, variables),
  validateVariables: (template, variables) => templateManager.validateVariables(template, variables),
  getTemplateForUse: (templateId) => templateManager.getTemplateForUse(templateId),
  createCustomTemplate: (templateData) => templateManager.createCustomTemplate(templateData),
  updateCustomTemplate: (templateId, updates) => templateManager.updateCustomTemplate(templateId, updates),
  deleteCustomTemplate: (templateId) => templateManager.deleteCustomTemplate(templateId),
  getTemplatesByCategory: (category) => templateManager.getTemplatesByCategory(category),
  searchTemplates: (searchTerm) => templateManager.searchTemplates(searchTerm),
  // Import/Export functions
  validateTemplateSchema: (templateData) => templateManager.validateTemplateSchema(templateData),
  importTemplate: (templateJson) => templateManager.importTemplate(templateJson),
  exportTemplate: (templateId) => templateManager.exportTemplate(templateId),
  exportAllTemplates: () => templateManager.exportAllTemplates(),
  importTemplateCollection: (collectionJson) => templateManager.importTemplateCollection(collectionJson)
};
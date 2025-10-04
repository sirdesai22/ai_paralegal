import { AIAgent, AnalysisRequest, AnalysisResult, AnalysisFinding } from "../types/ai-agents";
import { AI_AGENTS, findAgentById } from "../data/ai-agents";
import { flaskAPIService } from "./flask-api-service";

class AIAnalysisService {
  private async simulateAIAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    const agent = findAgentById(request.agentId);
    if (!agent) {
      throw new Error(`AI Agent with ID ${request.agentId} not found`);
    }

    // Check if this is a TinyLlama agent and use Flask API
    if (agent.modelType === 'tinyllama-qlora') {
      return await this.analyzeWithTinyLlama(agent, request);
    }

    // Simulate AI processing time for other agents
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock analysis based on agent type and document
    return this.generateMockAnalysis(agent, request);
  }

  private async analyzeWithTinyLlama(agent: AIAgent, request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      // Build the question for TinyLlama
      let question = `Analyze this ${request.documentType} document`;
      
      if (request.documentText) {
        question += `:\n\n${request.documentText.substring(0, 2000)}`; // Limit text length
      } else if (request.uploadedFile) {
        question += ` (file: ${request.uploadedFile.name})`;
      }
      
      if (request.specificInstructions) {
        question += `\n\nFocus on: ${request.specificInstructions}`;
      }

      // Call Flask API
      const answer = await flaskAPIService.analyzeWithTinyLlama({
        question: question,
        document_type: request.documentType,
        specific_instructions: request.specificInstructions
      });

      // Convert Flask API response to AnalysisResult format
      return {
        id: `analysis-${Date.now()}`,
        agentId: agent.id,
        summary: this.extractSummary(answer),
        keyFindings: this.extractFindings(answer, agent),
        riskScore: this.calculateRiskScore(answer),
        recommendations: this.extractRecommendations(answer),
        citations: this.extractCitations(answer),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('TinyLlama analysis failed:', error);
      // Fallback to mock analysis if Flask API fails
      return this.generateMockAnalysis(agent, request);
    }
  }

  private extractSummary(answer: string): string {
    // Extract first paragraph as summary
    const sentences = answer.split('. ');
    return sentences.slice(0, 2).join('. ') + '.';
  }

  private extractFindings(answer: string, agent: AIAgent): AnalysisFinding[] {
    const findings: AnalysisFinding[] = [];
    
    // Simple extraction logic - in production, you'd want more sophisticated parsing
    if (answer.toLowerCase().includes('risk') || answer.toLowerCase().includes('warning')) {
      findings.push({
        type: "warning",
        title: "Potential Risk Identified",
        description: "The analysis indicates areas requiring careful review.",
        severity: "medium"
      });
    }
    
    if (answer.toLowerCase().includes('compliance') || answer.toLowerCase().includes('regulation')) {
      findings.push({
        type: "info",
        title: "Compliance Considerations",
        description: "Regulatory and compliance aspects have been analyzed.",
        severity: "low"
      });
    }
    
    // Add a positive finding if no major issues
    if (findings.length === 0) {
      findings.push({
        type: "positive",
        title: "Generally Well-Structured",
        description: "The document appears to follow standard legal formatting.",
        severity: "low"
      });
    }
    
    return findings;
  }

  private calculateRiskScore(answer: string): number {
    // Simple risk scoring based on content analysis
    let score = 70; // Base score
    
    if (answer.toLowerCase().includes('high risk') || answer.toLowerCase().includes('critical')) {
      score -= 30;
    } else if (answer.toLowerCase().includes('risk') || answer.toLowerCase().includes('warning')) {
      score -= 15;
    } else if (answer.toLowerCase().includes('good') || answer.toLowerCase().includes('proper')) {
      score += 10;
    }
    
    return Math.max(30, Math.min(95, score));
  }

  private extractRecommendations(answer: string): string[] {
    const recommendations: string[] = [];
    const sentences = answer.split('. ');
    
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes('recommend') || 
          sentence.toLowerCase().includes('suggest') ||
          sentence.toLowerCase().includes('should')) {
        recommendations.push(sentence.trim());
      }
    });
    
    // Fallback recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        "Review document for completeness and accuracy",
        "Verify compliance with applicable laws and regulations",
        "Consider consultation with specialized legal counsel for complex matters"
      );
    }
    
    return recommendations.slice(0, 3);
  }

  private extractCitations(answer: string): string[] {
    const citations: string[] = [];
    
    // Extract potential legal citations
    const legalTerms = [
      'IPC', 'CrPC', 'CPC', 'Companies Act', 'Contract Act', 
      'Evidence Act', 'Constitution', 'Article', 'Section'
    ];
    
    legalTerms.forEach(term => {
      if (answer.includes(term)) {
        citations.push(`Reference to ${term} provisions`);
      }
    });
    
    // Fallback citations
    if (citations.length === 0) {
      citations.push(
        "Applicable statutory provisions",
        "Relevant case law precedents",
        "Standard legal practice guidelines"
      );
    }
    
    return citations.slice(0, 3);
  }

  private generateMockAnalysis(agent: AIAgent, request: AnalysisRequest): AnalysisResult {
    const isIndianLegalGPT = agent.modelType === 'indian-legal-gpt';
    const isTinyLlama = agent.modelType === 'tinyllama-qlora';
    const isCorporate = agent.category === 'corporate';
    
    const baseAnalysis: AnalysisResult = {
      id: `analysis-${Date.now()}`,
      agentId: agent.id,
      summary: this.generateSummary(agent, request, isIndianLegalGPT, isTinyLlama),
      keyFindings: this.generateFindings(agent, request, isIndianLegalGPT, isTinyLlama),
      riskScore: Math.floor(Math.random() * 40) + 60, // 60-100
      recommendations: this.generateRecommendations(agent, isIndianLegalGPT, isTinyLlama),
      citations: this.generateCitations(agent, isIndianLegalGPT, isTinyLlama),
      timestamp: new Date().toISOString()
    };

    if (isCorporate) {
      baseAnalysis.complianceScore = Math.floor(Math.random() * 30) + 70; // 70-100
    }

    return baseAnalysis;
  }

  private generateSummary(agent: AIAgent, request: AnalysisRequest, isIndianLegalGPT: boolean, isTinyLlama: boolean): string {
    let base = `The ${request.documentType} has been analyzed by ${agent.name}. `;
    
    if (isTinyLlama) {
      return base + `Analysis conducted using efficient QLoRA fine-tuned model with comprehensive Indian legal knowledge across multiple domains including constitutional law, criminal law, civil procedure, and corporate regulations.`;
    }
    
    if (isIndianLegalGPT) {
      return base + `Analysis focused on Indian legal framework compliance and regulatory requirements under relevant Indian statutes including Companies Act 2013, SEBI regulations, and applicable Indian case law precedents.`;
    }
    
    return base + `Analysis conducted with focus on ${agent.specialty} using advanced legal language processing.`;
  }

  private generateFindings(agent: AIAgent, request: AnalysisRequest, isIndianLegalGPT: boolean, isTinyLlama: boolean): AnalysisFinding[] {
    const findings: AnalysisFinding[] = [
      {
        type: "positive",
        title: "Well-Structured Document",
        description: "Document follows standard legal formatting and contains all essential elements.",
        severity: "low"
      },
      {
        type: "warning",
        title: isTinyLlama ? "Comprehensive Review Recommended" : 
               isIndianLegalGPT ? "Companies Act Compliance Required" : "Regulatory Compliance Check",
        description: isTinyLlama 
          ? "While initial analysis is complete, detailed legal review is recommended for complex matters."
          : isIndianLegalGPT 
          ? "Ensure compliance with Section 188 of Companies Act 2013 for related party transactions."
          : "Review required for specific regulatory compliance sections.",
        severity: "medium"
      }
    ];

    if (agent.modelType === 'inlegalbert') {
      findings.push({
        type: "info",
        title: "Advanced Clause Analysis",
        description: "AI detected sophisticated contractual language with potential for optimization.",
        severity: "low"
      });
    }

    if (isTinyLlama) {
      findings.push({
        type: "info",
        title: "Multi-Domain Analysis",
        description: "Analysis covers multiple legal domains including constitutional, criminal, civil, and corporate law.",
        severity: "low"
      });
    }

    return findings;
  }

  private generateRecommendations(agent: AIAgent, isIndianLegalGPT: boolean, isTinyLlama: boolean): string[] {
    const recommendations = [
      "Review termination clauses for clarity",
      "Verify indemnification limits",
      "Check dispute resolution mechanisms"
    ];

    if (isTinyLlama) {
      recommendations.push(
        "Consider comprehensive legal review for complex matters",
        "Verify compliance with all applicable Indian laws",
        "Consult specialized counsel for domain-specific issues"
      );
    } else if (isIndianLegalGPT) {
      recommendations.push(
        "Verify compliance with Indian Stamp Act requirements",
        "Ensure proper execution as per Indian Contract Act",
        "Check jurisdiction clause validity under Indian law"
      );
    }

    if (agent.modelType === 'inlegalbert') {
      recommendations.push(
        "Consider adding force majeure clause",
        "Review confidentiality provisions"
      );
    }

    return recommendations;
  }

  private generateCitations(agent: AIAgent, isIndianLegalGPT: boolean, isTinyLlama: boolean): string[] {
    if (isTinyLlama) {
      return [
        "Indian Contract Act, 1872 - General Provisions",
        "Relevant Constitutional Articles",
        "Applicable IPC/CrPC Sections",
        "Civil Procedure Code Guidelines"
      ];
    }

    if (isIndianLegalGPT) {
      return [
        "Indian Contract Act, 1872 - Section 10",
        "Companies Act, 2013 - Relevant Provisions",
        "Specific Relief Act, 1963 - Applicable Sections",
        "Indian Evidence Act, 1872 - Admissibility Clauses"
      ];
    }

    return [
      "Uniform Commercial Code - Relevant Articles",
      "Restatement (Second) of Contracts",
      "Applicable Federal Regulations",
      "State Business Corporation Laws"
    ];
  }

  async analyzeDocument(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      return await this.simulateAIAnalysis(request);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSupportedAgents(documentType: string, category?: 'corporate' | 'litigation'): Promise<AIAgent[]> {
    const agents = category 
      ? AI_AGENTS.filter(agent => agent.category === category)
      : AI_AGENTS;

    return agents.filter(agent => 
      agent.supportedDocumentTypes.includes('All Contract Types') ||
      agent.supportedDocumentTypes.some(type => 
        documentType.toLowerCase().includes(type.toLowerCase()) ||
        type.toLowerCase().includes(documentType.toLowerCase())
      )
    );
  }
}

export const aiAnalysisService = new AIAnalysisService();
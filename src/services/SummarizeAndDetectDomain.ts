import { DocumentSummary, DocumentDomain } from '../types';

export class SummarizeAndDetectDomain {
  /**
   * Analyze document content and generate summary with main ideas and topics
   */
  static async analyzeDocument(text: string): Promise<DocumentSummary> {
    // In a real implementation, this would use an AI service like OpenAI, Claude, or local models
    // For now, we'll create a mock implementation that simulates the analysis
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary: DocumentSummary = {
          mainIdeas: this.extractMainIdeas(text),
          topics: this.extractTopics(text),
          keyTerms: this.extractKeyTerms(text),
          abstract: this.generateAbstract(text),
        };
        resolve(summary);
      }, 1000); // Simulate processing time
    });
  }

  /**
   * Detect document domain and terminology preferences
   */
  static async detectDomain(text: string): Promise<DocumentDomain> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const domain = this.classifyDomain(text);
        resolve(domain);
      }, 500);
    });
  }

  /**
   * Extract main ideas from text (simplified implementation)
   */
  private static extractMainIdeas(text: string): string[] {
    // In a real implementation, this would use NLP techniques or AI
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Simple heuristic: take first few sentences as main ideas
    return sentences.slice(0, 3).map(s => s.trim()).filter(s => s.length > 0);
  }

  /**
   * Extract topics from text (simplified implementation)
   */
  private static extractTopics(text: string): string[] {
    // In a real implementation, this would use topic modeling or keyword extraction
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Count word frequency
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Return top 5 most frequent words as topics
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Extract key terms from text (simplified implementation)
   */
  private static extractKeyTerms(text: string): string[] {
    // In a real implementation, this would use named entity recognition
    const sentences = text.split(/[.!?]+/);
    const terms: string[] = [];
    
    // Look for capitalized words (potential proper nouns)
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2 && word[0] === word[0].toUpperCase() && word[1] === word[1].toLowerCase()) {
          if (!terms.includes(word)) {
            terms.push(word);
          }
        }
      });
    });
    
    return terms.slice(0, 10); // Return top 10 key terms
  }

  /**
   * Generate abstract from text (simplified implementation)
   */
  private static generateAbstract(text: string): string {
    // In a real implementation, this would use text summarization techniques
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length <= 2) {
      return text.substring(0, 200) + '...';
    }
    
    // Take first sentence and a middle sentence as abstract
    const firstSentence = sentences[0].trim();
    const middleSentence = sentences[Math.floor(sentences.length / 2)].trim();
    
    return `${firstSentence}. ${middleSentence}...`;
  }

  /**
   * Classify document domain based on content analysis
   */
  private static classifyDomain(text: string): DocumentDomain {
    const lowerText = text.toLowerCase();
    
    // Legal domain indicators
    const legalTerms = ['contract', 'agreement', 'terms', 'conditions', 'liability', 'legal', 'court', 'law', 'statute', 'regulation'];
    const legalScore = legalTerms.reduce((score, term) => score + (lowerText.includes(term) ? 1 : 0), 0);
    
    // Medical domain indicators
    const medicalTerms = ['patient', 'diagnosis', 'treatment', 'medical', 'clinical', 'symptoms', 'disease', 'health', 'therapy', 'medication'];
    const medicalScore = medicalTerms.reduce((score, term) => score + (lowerText.includes(term) ? 1 : 0), 0);
    
    // Technical domain indicators
    const technicalTerms = ['system', 'software', 'hardware', 'algorithm', 'database', 'network', 'protocol', 'api', 'function', 'method'];
    const technicalScore = technicalTerms.reduce((score, term) => score + (lowerText.includes(term) ? 1 : 0), 0);
    
    // Marketing domain indicators
    const marketingTerms = ['marketing', 'brand', 'customer', 'sales', 'promotion', 'advertisement', 'campaign', 'target', 'audience', 'strategy'];
    const marketingScore = marketingTerms.reduce((score, term) => score + (lowerText.includes(term) ? 1 : 0), 0);
    
    // Academic domain indicators
    const academicTerms = ['research', 'study', 'analysis', 'hypothesis', 'methodology', 'conclusion', 'findings', 'literature', 'references', 'citation'];
    const academicScore = academicTerms.reduce((score, term) => score + (lowerText.includes(term) ? 1 : 0), 0);
    
    // Determine domain with highest score
    const scores = [
      { type: 'legal' as const, score: legalScore },
      { type: 'medical' as const, score: medicalScore },
      { type: 'technical' as const, score: technicalScore },
      { type: 'marketing' as const, score: marketingScore },
      { type: 'academic' as const, score: academicScore },
    ];
    
    const maxScore = Math.max(...scores.map(s => s.score));
    const domainType = maxScore > 0 ? scores.find(s => s.score === maxScore)?.type || 'general' : 'general';
    
    // Generate domain-specific terminology mapping
    const terminology = this.generateDomainTerminology(domainType);
    
    return {
      type: domainType,
      confidence: Math.min(0.9, maxScore / 10), // Normalize confidence
      terminology,
    };
  }

  /**
   * Generate domain-specific terminology mapping
   */
  private static generateDomainTerminology(domainType: DocumentDomain['type']): Record<string, string> {
    const terminologyMaps: Record<string, Record<string, string>> = {
      legal: {
        'contract': 'contrato',
        'agreement': 'acuerdo',
        'liability': 'responsabilidad',
        'court': 'tribunal',
        'statute': 'estatuto',
      },
      medical: {
        'patient': 'paciente',
        'diagnosis': 'diagnóstico',
        'treatment': 'tratamiento',
        'symptoms': 'síntomas',
        'therapy': 'terapia',
      },
      technical: {
        'system': 'sistema',
        'software': 'software',
        'hardware': 'hardware',
        'algorithm': 'algoritmo',
        'database': 'base de datos',
      },
      marketing: {
        'brand': 'marca',
        'customer': 'cliente',
        'sales': 'ventas',
        'campaign': 'campaña',
        'strategy': 'estrategia',
      },
      academic: {
        'research': 'investigación',
        'study': 'estudio',
        'analysis': 'análisis',
        'hypothesis': 'hipótesis',
        'methodology': 'metodología',
      },
    };
    
    return terminologyMaps[domainType] || {};
  }

  /**
   * Get domain-specific translation preferences
   */
  static getDomainPreferences(domain: DocumentDomain['type']) {
    const preferences = {
      general: {
        tone: 'neutral',
        formality: 'medium',
        terminology: 'standard',
      },
      legal: {
        tone: 'formal',
        formality: 'high',
        terminology: 'legal',
      },
      medical: {
        tone: 'professional',
        formality: 'high',
        terminology: 'medical',
      },
      technical: {
        tone: 'precise',
        formality: 'medium',
        terminology: 'technical',
      },
      marketing: {
        tone: 'engaging',
        formality: 'low',
        terminology: 'marketing',
      },
      academic: {
        tone: 'scholarly',
        formality: 'high',
        terminology: 'academic',
      },
    };
    
    return preferences[domain];
  }
}

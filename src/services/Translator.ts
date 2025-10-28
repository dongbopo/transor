import { Translation, WordAlignment, DocumentDomain } from '../types';

export class Translator {
  /**
   * Translate text to target language with domain awareness
   */
  static async translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    domain: DocumentDomain
  ): Promise<Translation> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const translatedText = this.performTranslation(text, sourceLanguage, targetLanguage, domain);
        const wordAlignments = this.generateWordAlignments(text, translatedText);
        
        const translation: Translation = {
          id: crypto.randomUUID(),
          originalText: text,
          translatedText,
          targetLanguage,
          sourceLanguage,
          confidence: this.calculateConfidence(text, translatedText, domain),
          wordAlignments,
          createdAt: new Date(),
        };
        
        resolve(translation);
      }, 1500); // Simulate processing time
    });
  }

  /**
   * Perform the actual translation (mock implementation)
   */
  private static performTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    domain: DocumentDomain
  ): string {
    // In a real implementation, this would use a translation API like Google Translate, DeepL, or OpenAI
    // For now, we'll create a mock translation that simulates the process
    
    let translatedText = text;

    // Apply domain-specific terminology
    translatedText = this.applyDomainTerminology(translatedText, domain);

    // Apply language-specific transformations (mock)
    if (targetLanguage === 'es') {
      translatedText = this.mockSpanishTranslation(translatedText);
    } else if (targetLanguage === 'fr') {
      translatedText = this.mockFrenchTranslation(translatedText);
    } else if (targetLanguage === 'de') {
      translatedText = this.mockGermanTranslation(translatedText);
    } else if (targetLanguage === 'zh') {
      translatedText = this.mockChineseTranslation(translatedText);
    } else if (targetLanguage === 'ar') {
      translatedText = this.mockArabicTranslation(translatedText);
    } else {
      // Default mock translation
      translatedText = text.split(' ').map(word => `${word} (${targetLanguage})`).join(' ');
    }

    return translatedText;
  }

  /**
   * Apply domain-specific terminology
   */
  private static applyDomainTerminology(text: string, domain: DocumentDomain): string {
    let processedText = text;

    // Apply terminology mappings
    Object.entries(domain.terminology).forEach(([source, target]) => {
      const regex = new RegExp(`\\b${source}\\b`, 'gi');
      processedText = processedText.replace(regex, target);
    });

    return processedText;
  }

  /**
   * Generate word alignments between source and target text
   */
  private static generateWordAlignments(sourceText: string, targetText: string): WordAlignment[] {
    const sourceWords = sourceText.split(/\s+/);
    const targetWords = targetText.split(/\s+/);
    const alignments: WordAlignment[] = [];

    // Simple 1:1 alignment for mock purposes
    const maxLength = Math.min(sourceWords.length, targetWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      alignments.push({
        sourceWord: sourceWords[i],
        targetWord: targetWords[i],
        sourcePosition: i,
        targetPosition: i,
        confidence: 0.8 + Math.random() * 0.2, // Random confidence between 0.8-1.0
      });
    }

    return alignments;
  }

  /**
   * Calculate translation confidence
   */
  private static calculateConfidence(
    sourceText: string,
    translatedText: string,
    domain: DocumentDomain
  ): number {
    let confidence = 0.9; // Base confidence

    // Adjust confidence based on domain familiarity
    if (domain.confidence > 0.8) {
      confidence += 0.05;
    } else if (domain.confidence < 0.5) {
      confidence -= 0.1;
    }

    // Adjust confidence based on text complexity
    const complexityScore = this.calculateComplexity(sourceText);
    if (complexityScore > 0.7) {
      confidence -= 0.05;
    }

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Calculate text complexity score
   */
  private static calculateComplexity(text: string): number {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Higher complexity for longer sentences and more words
    return Math.min(1.0, (avgWordsPerSentence - 10) / 20);
  }

  /**
   * Mock Spanish translation
   */
  private static mockSpanishTranslation(text: string): string {
    const translations: Record<string, string> = {
      'the': 'el/la',
      'and': 'y',
      'of': 'de',
      'to': 'a',
      'in': 'en',
      'is': 'es',
      'it': 'eso',
      'you': 'tú/usted',
      'that': 'que',
      'he': 'él',
      'was': 'fue',
      'for': 'para',
      'on': 'en',
      'are': 'son',
      'as': 'como',
      'with': 'con',
      'his': 'su',
      'they': 'ellos',
      'i': 'yo',
      'at': 'en',
      'be': 'ser',
      'this': 'este',
      'have': 'tener',
      'from': 'de',
      'or': 'o',
      'one': 'uno',
      'had': 'tenía',
      'by': 'por',
      'word': 'palabra',
      'but': 'pero',
      'not': 'no',
      'what': 'qué',
      'all': 'todo',
      'were': 'eran',
      'we': 'nosotros',
      'when': 'cuando',
      'your': 'tu',
      'can': 'poder',
      'said': 'dijo',
      'each': 'cada',
      'which': 'cual',
      'she': 'ella',
      'do': 'hacer',
      'how': 'cómo',
      'their': 'su',
      'if': 'si',
      'will': 'voluntad',
      'up': 'arriba',
      'other': 'otro',
      'about': 'acerca de',
      'out': 'fuera',
      'many': 'muchos',
      'then': 'entonces',
      'them': 'ellos',
      'these': 'estos',
      'so': 'así',
      'some': 'algunos',
      'her': 'su',
      'would': 'haría',
      'make': 'hacer',
      'like': 'como',
      'into': 'en',
      'him': 'él',
      'time': 'tiempo',
      'has': 'tiene',
      'two': 'dos',
      'more': 'más',
      'go': 'ir',
      'no': 'no',
      'way': 'manera',
      'could': 'podría',
      'my': 'mi',
      'than': 'que',
      'first': 'primero',
      'been': 'sido',
      'call': 'llamar',
      'who': 'quién',
      'oil': 'aceite',
      'its': 'su',
      'now': 'ahora',
      'find': 'encontrar',
      'long': 'largo',
      'down': 'abajo',
      'day': 'día',
      'did': 'hizo',
      'get': 'obtener',
      'come': 'venir',
      'made': 'hecho',
      'may': 'mayo',
      'part': 'parte',
    };

    return this.applyWordTranslations(text, translations);
  }

  /**
   * Mock French translation
   */
  private static mockFrenchTranslation(text: string): string {
    const translations: Record<string, string> = {
      'the': 'le/la',
      'and': 'et',
      'of': 'de',
      'to': 'à',
      'in': 'dans',
      'is': 'est',
      'it': 'il/elle',
      'you': 'tu/vous',
      'that': 'que',
      'he': 'il',
      'was': 'était',
      'for': 'pour',
      'on': 'sur',
      'are': 'sont',
      'as': 'comme',
      'with': 'avec',
      'his': 'son',
      'they': 'ils',
      'i': 'je',
      'at': 'à',
      'be': 'être',
      'this': 'ce',
      'have': 'avoir',
      'from': 'de',
      'or': 'ou',
      'one': 'un',
      'had': 'avait',
      'by': 'par',
      'word': 'mot',
      'but': 'mais',
      'not': 'pas',
      'what': 'quoi',
      'all': 'tout',
      'were': 'étaient',
      'we': 'nous',
      'when': 'quand',
      'your': 'ton',
      'can': 'peut',
      'said': 'dit',
      'each': 'chaque',
      'which': 'qui',
      'she': 'elle',
      'do': 'faire',
      'how': 'comment',
      'their': 'leur',
      'if': 'si',
      'will': 'volonté',
      'up': 'haut',
      'other': 'autre',
      'about': 'sur',
      'out': 'dehors',
      'many': 'beaucoup',
      'then': 'alors',
      'them': 'eux',
      'these': 'ces',
      'so': 'donc',
      'some': 'quelques',
      'her': 'son',
      'would': 'voudrait',
      'make': 'faire',
      'like': 'comme',
      'into': 'dans',
      'him': 'lui',
      'time': 'temps',
      'has': 'a',
      'two': 'deux',
      'more': 'plus',
      'go': 'aller',
      'no': 'non',
      'way': 'façon',
      'could': 'pourrait',
      'my': 'mon',
      'than': 'que',
      'first': 'premier',
      'been': 'été',
      'call': 'appeler',
      'who': 'qui',
      'oil': 'huile',
      'its': 'son',
      'now': 'maintenant',
      'find': 'trouver',
      'long': 'long',
      'down': 'bas',
      'day': 'jour',
      'did': 'fait',
      'get': 'obtenir',
      'come': 'venir',
      'made': 'fait',
      'may': 'mai',
      'part': 'partie',
    };

    return this.applyWordTranslations(text, translations);
  }

  /**
   * Mock German translation
   */
  private static mockGermanTranslation(text: string): string {
    const translations: Record<string, string> = {
      'the': 'der/die/das',
      'and': 'und',
      'of': 'von',
      'to': 'zu',
      'in': 'in',
      'is': 'ist',
      'it': 'es',
      'you': 'du/Sie',
      'that': 'dass',
      'he': 'er',
      'was': 'war',
      'for': 'für',
      'on': 'auf',
      'are': 'sind',
      'as': 'als',
      'with': 'mit',
      'his': 'sein',
      'they': 'sie',
      'i': 'ich',
      'at': 'bei',
      'be': 'sein',
      'this': 'dies',
      'have': 'haben',
      'from': 'von',
      'or': 'oder',
      'one': 'ichten',
      'had': 'hatte',
      'by': 'von',
      'word': 'Wort',
      'but': 'aber',
      'not': 'nicht',
      'what': 'was',
      'all': 'alle',
      'were': 'waren',
      'we': 'wir',
      'when': 'wann',
      'your': 'dein',
      'can': 'kann',
      'said': 'sagte',
      'each': 'jeder',
      'which': 'welcher',
      'she': 'sie',
      'do': 'tun',
      'how': 'wie',
      'their': 'ihr',
      'if': 'wenn',
      'will': 'Wille',
      'up': 'oben',
      'other': 'anderer',
      'about': 'über',
      'out': 'heraus',
      'many': 'viele',
      'then': 'dann',
      'them': 'sie',
      'these': 'diese',
      'so': 'so',
      'some': 'einige',
      'her': 'ihr',
      'would': 'würde',
      'make': 'machen',
      'like': 'wie',
      'into': 'in',
      'him': 'ihm',
      'time': 'Zeit',
      'has': 'hat',
      'two': 'zwei',
      'more': 'mehr',
      'go': 'gehen',
      'no': 'nein',
      'way': 'Weg',
      'could': 'könnte',
      'my': 'mein',
      'than': 'als',
      'first': 'erste',
      'been': 'gewesen',
      'call': 'anrufen',
      'who': 'wer',
      'oil': 'Öl',
      'its': 'sein',
      'now': 'jetzt',
      'find': 'finden',
      'long': 'lang',
      'down': 'unten',
      'day': 'Tag',
      'did': 'tat',
      'get': 'bekommen',
      'come': 'kommen',
      'made': 'gemacht',
      'may': 'Mai',
      'part': 'Teil',
    };

    return this.applyWordTranslations(text, translations);
  }

  /**
   * Mock Chinese translation
   */
  private static mockChineseTranslation(text: string): string {
    // Simplified mock - in reality, Chinese translation would be much more complex
    return text.split(' ').map(word => `${word} (中文)`).join(' ');
  }

  /**
   * Mock Arabic translation
   */
  private static mockArabicTranslation(text: string): string {
    // Simplified mock - in reality, Arabic translation would be much more complex
    return text.split(' ').map(word => `${word} (عربي)`).join(' ');
  }

  /**
   * Apply word translations to text
   */
  private static applyWordTranslations(text: string, translations: Record<string, string>): string {
    let result = text;
    
    Object.entries(translations).forEach(([source, target]) => {
      const regex = new RegExp(`\\b${source}\\b`, 'gi');
      result = result.replace(regex, target);
    });
    
    return result;
  }

  /**
   * Translate with context awareness
   */
  static async translateWithContext(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    domain: DocumentDomain,
    context?: string
  ): Promise<Translation> {
    // This would use more sophisticated translation models that consider context
    return this.translateText(text, sourceLanguage, targetLanguage, domain);
  }

  /**
   * Batch translate multiple texts
   */
  static async translateBatch(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    domain: DocumentDomain
  ): Promise<Translation[]> {
    const translations = await Promise.all(
      texts.map(text => this.translateText(text, sourceLanguage, targetLanguage, domain))
    );
    
    return translations;
  }
}

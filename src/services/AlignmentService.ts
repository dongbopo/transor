import { DocumentSegment, SegmentAlignment, WordAlignment } from '../types';

export class AlignmentService {
  /**
   * Create sentence-aligned segments for bilingual view
   */
  static async createBilingualAlignment(
    originalSegments: DocumentSegment[],
    translatedSegments: DocumentSegment[]
  ): Promise<SegmentAlignment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alignments = this.performAlignment(originalSegments, translatedSegments);
        resolve(alignments);
      }, 500);
    });
  }

  /**
   * Perform sentence-level alignment
   */
  private static performAlignment(
    originalSegments: DocumentSegment[],
    translatedSegments: DocumentSegment[]
  ): SegmentAlignment[] {
    const alignments: SegmentAlignment[] = [];

    // Simple 1:1 alignment for mock purposes
    // In a real implementation, this would use more sophisticated alignment algorithms
    const maxLength = Math.min(originalSegments.length, translatedSegments.length);

    for (let i = 0; i < maxLength; i++) {
      const sourceSegment = originalSegments[i];
      const targetSegment = translatedSegments[i];

      const wordAlignments = this.alignWords(sourceSegment, targetSegment);

      alignments.push({
        sourceSegmentId: sourceSegment.id,
        targetSegmentId: targetSegment.id,
        confidence: this.calculateAlignmentConfidence(sourceSegment, targetSegment),
        wordAlignments,
      });
    }

    return alignments;
  }

  /**
   * Align words within segments
   */
  private static alignWords(
    sourceSegment: DocumentSegment,
    targetSegment: DocumentSegment
  ): WordAlignment[] {
    const alignments: WordAlignment[] = [];
    const sourceWords = sourceSegment.wordTokens;
    const targetWords = targetSegment.wordTokens;

    // Simple alignment algorithm - in practice, this would be much more sophisticated
    const maxLength = Math.min(sourceWords.length, targetWords.length);

    for (let i = 0; i < maxLength; i++) {
      alignments.push({
        sourceWord: sourceWords[i].text,
        targetWord: targetWords[i].text,
        sourcePosition: i,
        targetPosition: i,
        confidence: this.calculateWordAlignmentConfidence(
          sourceWords[i].text,
          targetWords[i].text
        ),
      });
    }

    return alignments;
  }

  /**
   * Calculate alignment confidence between segments
   */
  private static calculateAlignmentConfidence(
    sourceSegment: DocumentSegment,
    targetSegment: DocumentSegment
  ): number {
    // Base confidence on length similarity and word overlap
    const sourceLength = sourceSegment.text.length;
    const targetLength = targetSegment.text.length;
    const lengthRatio = Math.min(sourceLength, targetLength) / Math.max(sourceLength, targetLength);

    // Calculate word overlap (simplified)
    const sourceWords = sourceSegment.text.toLowerCase().split(/\s+/);
    const targetWords = targetSegment.text.toLowerCase().split(/\s+/);
    const commonWords = sourceWords.filter(word => targetWords.includes(word));
    const wordOverlap = commonWords.length / Math.max(sourceWords.length, targetWords.length);

    // Combine factors
    const confidence = (lengthRatio * 0.3) + (wordOverlap * 0.7);
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Calculate word alignment confidence
   */
  private static calculateWordAlignmentConfidence(
    sourceWord: string,
    targetWord: string
  ): number {
    // Simple confidence based on length and character similarity
    const lengthRatio = Math.min(sourceWord.length, targetWord.length) / 
                       Math.max(sourceWord.length, targetWord.length);
    
    // Character overlap
    const sourceChars = sourceWord.toLowerCase().split('');
    const targetChars = targetWord.toLowerCase().split('');
    const commonChars = sourceChars.filter(char => targetChars.includes(char));
    const charOverlap = commonChars.length / Math.max(sourceChars.length, targetChars.length);

    return (lengthRatio * 0.4) + (charOverlap * 0.6);
  }

  /**
   * Create synchronized scrolling positions
   */
  static createScrollPositions(
    alignments: SegmentAlignment[],
    containerHeight: number
  ): Map<string, number> {
    const positions = new Map<string, number>();
    
    alignments.forEach((alignment, index) => {
      const position = (index / alignments.length) * containerHeight;
      positions.set(alignment.sourceSegmentId, position);
      positions.set(alignment.targetSegmentId, position);
    });

    return positions;
  }

  /**
   * Find corresponding segment for a given position
   */
  static findCorrespondingSegment(
    segmentId: string,
    alignments: SegmentAlignment[],
    isSource: boolean
  ): string | null {
    const alignment = alignments.find(align => 
      isSource ? align.sourceSegmentId === segmentId : align.targetSegmentId === segmentId
    );

    if (!alignment) return null;

    return isSource ? alignment.targetSegmentId : alignment.sourceSegmentId;
  }

  /**
   * Calculate scroll synchronization ratio
   */
  static calculateSyncRatio(
    sourceScrollTop: number,
    sourceScrollHeight: number,
    sourceClientHeight: number,
    targetScrollHeight: number,
    targetClientHeight: number
  ): number {
    const sourceScrollRatio = sourceScrollTop / (sourceScrollHeight - sourceClientHeight);
    return sourceScrollRatio * (targetScrollHeight - targetClientHeight);
  }

  /**
   * Create word-level tooltip data
   */
  static createWordTooltipData(
    word: string,
    alignment: WordAlignment,
    context: string
  ): any {
    return {
      word,
      translation: alignment.targetWord,
      explanation: this.generateWordExplanation(word, alignment.targetWord, context),
      partOfSpeech: this.detectPartOfSpeech(word),
      pronunciation: this.generatePronunciation(word),
      context,
      alternatives: this.generateAlternatives(alignment.targetWord),
    };
  }

  /**
   * Generate word explanation
   */
  private static generateWordExplanation(
    sourceWord: string,
    targetWord: string,
    context: string
  ): string {
    // Simplified explanation generation
    return `"${sourceWord}" translates to "${targetWord}" in this context.`;
  }

  /**
   * Detect part of speech (simplified)
   */
  private static detectPartOfSpeech(word: string): string {
    // Very basic POS detection
    if (word.endsWith('ing')) return 'verb (present participle)';
    if (word.endsWith('ed')) return 'verb (past tense)';
    if (word.endsWith('ly')) return 'adverb';
    if (word.endsWith('tion') || word.endsWith('sion')) return 'noun';
    if (word.endsWith('er') || word.endsWith('or')) return 'noun (agent)';
    
    return 'noun'; // Default
  }

  /**
   * Generate pronunciation
   */
  private static generatePronunciation(word: string): string {
    // Simplified pronunciation - in reality, this would use IPA or phonetic transcription
    return `/${word.toLowerCase()}/`;
  }

  /**
   * Generate alternative translations
   */
  private static generateAlternatives(targetWord: string): string[] {
    // Mock alternatives
    return [
      `${targetWord}-alt1`,
      `${targetWord}-alt2`,
    ];
  }

  /**
   * Validate alignment quality
   */
  static validateAlignment(alignment: SegmentAlignment): boolean {
    return alignment.confidence > 0.3 && alignment.wordAlignments.length > 0;
  }

  /**
   * Improve alignment using feedback
   */
  static async improveAlignment(
    alignment: SegmentAlignment,
    userFeedback: 'correct' | 'incorrect' | 'partial'
  ): Promise<SegmentAlignment> {
    // In a real implementation, this would use machine learning to improve alignments
    return new Promise((resolve) => {
      setTimeout(() => {
        let improvedConfidence = alignment.confidence;
        
        switch (userFeedback) {
          case 'correct':
            improvedConfidence = Math.min(1.0, improvedConfidence + 0.1);
            break;
          case 'incorrect':
            improvedConfidence = Math.max(0.1, improvedConfidence - 0.2);
            break;
          case 'partial':
            improvedConfidence = Math.max(0.1, improvedConfidence - 0.05);
            break;
        }

        resolve({
          ...alignment,
          confidence: improvedConfidence,
        });
      }, 200);
    });
  }
}

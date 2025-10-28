import { SourceFixes, TextChange } from '../types';

export class SourceCleanser {
  /**
   * Apply grammar and style corrections to source text
   */
  static async cleanDocument(text: string): Promise<SourceFixes> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fixes = this.applyCorrections(text);
        resolve(fixes);
      }, 800); // Simulate processing time
    });
  }

  /**
   * Apply various corrections to the text
   */
  private static applyCorrections(text: string): SourceFixes {
    let correctedText = text;
    const changes: TextChange[] = [];
    let changeCounter = 0;

    // Common grammar corrections
    correctedText = this.fixCommonGrammarErrors(correctedText, changes, changeCounter);
    
    // Punctuation corrections
    correctedText = this.fixPunctuation(correctedText, changes, changeCounter);
    
    // Style improvements
    correctedText = this.improveStyle(correctedText, changes, changeCounter);

    return {
      originalText: text,
      correctedText,
      changes,
      explanation: this.generateExplanation(changes),
    };
  }

  /**
   * Fix common grammar errors
   */
  private static fixCommonGrammarErrors(text: string, changes: TextChange[], changeCounter: number): string {
    let corrected = text;

    // Fix common typos
    const typos = [
      { from: /\bteh\b/g, to: 'the', type: 'spelling' as const },
      { from: /\badn\b/g, to: 'and', type: 'spelling' as const },
      { from: /\byuo\b/g, to: 'you', type: 'spelling' as const },
      { from: /\bthier\b/g, to: 'their', type: 'spelling' as const },
      { from: /\brecieve\b/g, to: 'receive', type: 'spelling' as const },
      { from: /\bseperate\b/g, to: 'separate', type: 'spelling' as const },
    ];

    typos.forEach(typo => {
      const matches = corrected.match(typo.from);
      if (matches) {
        corrected = corrected.replace(typo.from, typo.to);
        matches.forEach((match, index) => {
          const position = corrected.indexOf(typo.to);
          changes.push({
            type: typo.type,
            original: match,
            corrected: typo.to,
            position: position + (index * (typo.to.length - match.length)),
            explanation: `Corrected spelling error: "${match}" → "${typo.to}"`,
          });
        });
      }
    });

    // Fix double spaces
    corrected = corrected.replace(/  +/g, ' ');
    
    // Fix capitalization after periods
    corrected = corrected.replace(/\.\s+([a-z])/g, (match, letter) => {
      changes.push({
        type: 'punctuation',
        original: match,
        corrected: `. ${letter.toUpperCase()}`,
        position: corrected.indexOf(match),
        explanation: 'Capitalized letter after period',
      });
      return `. ${letter.toUpperCase()}`;
    });

    return corrected;
  }

  /**
   * Fix punctuation issues
   */
  private static fixPunctuation(text: string, changes: TextChange[], changeCounter: number): string {
    let corrected = text;

    // Fix missing spaces after punctuation
    corrected = corrected.replace(/([.!?])([A-Za-z])/g, (match, punct, letter) => {
      changes.push({
        type: 'punctuation',
        original: match,
        corrected: `${punct} ${letter}`,
        position: corrected.indexOf(match),
        explanation: 'Added space after punctuation',
      });
      return `${punct} ${letter}`;
    });

    // Fix double punctuation
    corrected = corrected.replace(/[.!?]{2,}/g, (match) => {
      changes.push({
        type: 'punctuation',
        original: match,
        corrected: match[0],
        position: corrected.indexOf(match),
        explanation: 'Removed duplicate punctuation',
      });
      return match[0];
    });

    // Fix comma spacing
    corrected = corrected.replace(/,([A-Za-z])/g, (match, letter) => {
      changes.push({
        type: 'punctuation',
        original: match,
        corrected: `, ${letter}`,
        position: corrected.indexOf(match),
        explanation: 'Added space after comma',
      });
      return `, ${letter}`;
    });

    return corrected;
  }

  /**
   * Improve writing style
   */
  private static improveStyle(text: string, changes: TextChange[], changeCounter: number): string {
    let corrected = text;

    // Replace weak words with stronger alternatives
    const styleImprovements = [
      { from: /\bvery\s+(\w+)/g, to: '$1', type: 'style' as const, explanation: 'Removed unnecessary "very"' },
      { from: /\breally\s+(\w+)/g, to: '$1', type: 'style' as const, explanation: 'Removed unnecessary "really"' },
      { from: /\bquite\s+(\w+)/g, to: '$1', type: 'style' as const, explanation: 'Removed unnecessary "quite"' },
    ];

    styleImprovements.forEach(improvement => {
      const matches = corrected.match(improvement.from);
      if (matches) {
        corrected = corrected.replace(improvement.from, improvement.to);
        matches.forEach((match, index) => {
          const position = corrected.indexOf(improvement.to);
          changes.push({
            type: improvement.type,
            original: match,
            corrected: improvement.to,
            position: position + (index * (improvement.to.length - match.length)),
            explanation: improvement.explanation,
          });
        });
      }
    });

    // Fix sentence fragments
    corrected = corrected.replace(/\b(However|Therefore|Moreover|Furthermore|Additionally),?\s*([a-z])/g, (match, word, letter) => {
      changes.push({
        type: 'style',
        original: match,
        corrected: `${word}, ${letter.toUpperCase()}`,
        position: corrected.indexOf(match),
        explanation: 'Improved sentence structure',
      });
      return `${word}, ${letter.toUpperCase()}`;
    });

    return corrected;
  }

  /**
   * Generate explanation for the applied fixes
   */
  private static generateExplanation(changes: TextChange[]): string {
    if (changes.length === 0) {
      return 'No corrections were needed. The text is already well-written.';
    }

    const changeTypes = changes.reduce((acc, change) => {
      acc[change.type] = (acc[change.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const explanations: string[] = [];
    
    if (changeTypes.spelling) {
      explanations.push(`${changeTypes.spelling} spelling correction${changeTypes.spelling > 1 ? 's' : ''}`);
    }
    
    if (changeTypes.punctuation) {
      explanations.push(`${changeTypes.punctuation} punctuation improvement${changeTypes.punctuation > 1 ? 's' : ''}`);
    }
    
    if (changeTypes.style) {
      explanations.push(`${changeTypes.style} style enhancement${changeTypes.style > 1 ? 's' : ''}`);
    }

    return `Applied ${changes.length} correction${changes.length > 1 ? 's' : ''}: ${explanations.join(', ')}.`;
  }

  /**
   * Get detailed change report
   */
  static getChangeReport(fixes: SourceFixes): string {
    if (fixes.changes.length === 0) {
      return 'No changes were made to the original text.';
    }

    const report = [`Document Correction Report (${fixes.changes.length} changes):`];
    
    fixes.changes.forEach((change, index) => {
      report.push(`${index + 1}. [${change.type.toUpperCase()}] ${change.explanation}`);
      report.push(`   Original: "${change.original}"`);
      report.push(`   Corrected: "${change.corrected}"`);
      report.push('');
    });

    return report.join('\n');
  }

  /**
   * Validate if a correction is appropriate
   */
  static validateCorrection(original: string, corrected: string): boolean {
    // Basic validation rules
    const rules = [
      // Don't change proper nouns
      (orig: string, corr: string) => {
        const properNouns = orig.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
        return properNouns.every(noun => corr.includes(noun));
      },
      
      // Don't change numbers
      (orig: string, corr: string) => {
        const numbers = orig.match(/\b\d+(?:\.\d+)?\b/g) || [];
        return numbers.every(num => corr.includes(num));
      },
      
      // Don't change URLs or emails
      (orig: string, corr: string) => {
        const urls = orig.match(/https?:\/\/[^\s]+/g) || [];
        const emails = orig.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
        return [...urls, ...emails].every(item => corr.includes(item));
      },
    ];

    return rules.every(rule => rule(original, corrected));
  }
}

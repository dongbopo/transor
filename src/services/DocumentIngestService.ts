import mammoth from 'mammoth';
import { DocumentContent, DocumentStructure, DocumentImage, DocumentMetadata } from '../types';

export class DocumentIngestService {
  /**
   * Parse a DOCX file and extract content with structure preservation
   */
  static async parseDocx(file: File): Promise<DocumentContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          
          // Extract text content
          const textResult = await mammoth.extractRawText({ arrayBuffer });
          
          // Parse HTML to extract structure
          const structure = this.parseHtmlStructure(result.value);
          
          // Extract images
          const images = await this.extractImages(arrayBuffer);
          
          // Generate metadata
          const metadata: DocumentMetadata = {
            pageCount: this.estimatePageCount(textResult.value),
            wordCount: this.countWords(textResult.value),
            characterCount: textResult.value.length,
            language: await this.detectLanguage(textResult.value),
          };

          resolve({
            text: textResult.value,
            structure,
            images,
            metadata,
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse a PDF file using basic text extraction
   * Note: This is a simplified implementation. For production, you'd want to use a more robust PDF parser
   */
  static async parsePdf(file: File): Promise<DocumentContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          // This is a placeholder implementation
          // In a real application, you'd use a PDF parsing library like pdf-parse
          const text = 'PDF content would be extracted here. This is a placeholder implementation.';
          
          const structure = this.parseTextStructure(text);
          const images: DocumentImage[] = []; // PDF images would be extracted here
          
          const metadata: DocumentMetadata = {
            pageCount: 1, // Would be extracted from PDF
            wordCount: this.countWords(text),
            characterCount: text.length,
            language: await this.detectLanguage(text),
          };

          resolve({
            text,
            structure,
            images,
            metadata,
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse RTF file
   */
  static async parseRtf(file: File): Promise<DocumentContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          // RTF parsing would be implemented here
          // This is a simplified version
          const text = 'RTF content would be parsed here.';
          
          const structure = this.parseTextStructure(text);
          const images: DocumentImage[] = [];
          
          const metadata: DocumentMetadata = {
            pageCount: 1,
            wordCount: this.countWords(text),
            characterCount: text.length,
            language: this.detectLanguage(text),
          };

          resolve({
            text,
            structure,
            images,
            metadata,
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse ODT file
   */
  static async parseOdt(file: File): Promise<DocumentContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          // ODT parsing would be implemented here
          // This is a simplified version
          const text = 'ODT content would be parsed here.';
          
          const structure = this.parseTextStructure(text);
          const images: DocumentImage[] = [];
          
          const metadata: DocumentMetadata = {
            pageCount: 1,
            wordCount: this.countWords(text),
            characterCount: text.length,
            language: this.detectLanguage(text),
          };

          resolve({
            text,
            structure,
            images,
            metadata,
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Main parsing method that routes to appropriate parser based on file type
   */
  static async parseDocument(file: File): Promise<DocumentContent> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (fileType.includes('wordprocessingml') || fileName.endsWith('.docx')) {
      return this.parseDocx(file);
    } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return this.parsePdf(file);
    } else if (fileType.includes('rtf') || fileName.endsWith('.rtf')) {
      return this.parseRtf(file);
    } else if (fileType.includes('opendocument') || fileName.endsWith('.odt')) {
      return this.parseOdt(file);
    } else if (fileName.endsWith('.doc')) {
      // Legacy DOC files would need special handling
      throw new Error('Legacy DOC files are not supported. Please convert to DOCX format.');
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Parse HTML structure from mammoth output
   */
  private static parseHtmlStructure(html: string): DocumentStructure {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const headings: any[] = [];
    const paragraphs: any[] = [];
    const lists: any[] = [];
    const tables: any[] = [];
    const footnotes: any[] = [];

    // Extract headings
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingElements.forEach((element, index) => {
      const level = parseInt(element.tagName.charAt(1));
      headings.push({
        id: `heading-${index}`,
        level,
        text: element.textContent || '',
        position: index,
      });
    });

    // Extract paragraphs
    const paragraphElements = doc.querySelectorAll('p');
    paragraphElements.forEach((element, index) => {
      paragraphs.push({
        id: `paragraph-${index}`,
        text: element.textContent || '',
        position: index,
      });
    });

    // Extract lists
    const listElements = doc.querySelectorAll('ul, ol');
    listElements.forEach((listElement, index) => {
      const items: any[] = [];
      const listItems = listElement.querySelectorAll('li');
      
      listItems.forEach((item, itemIndex) => {
        items.push({
          id: `list-${index}-item-${itemIndex}`,
          text: item.textContent || '',
          level: 0, // Would need to calculate based on nesting
        });
      });

      lists.push({
        id: `list-${index}`,
        type: listElement.tagName === 'ol' ? 'ordered' : 'unordered',
        items,
        position: index,
      });
    });

    // Extract tables
    const tableElements = doc.querySelectorAll('table');
    tableElements.forEach((tableElement, index) => {
      const headers: string[] = [];
      const rows: string[][] = [];

      const headerRow = tableElement.querySelector('thead tr, tr:first-child');
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th, td');
        headerCells.forEach(cell => {
          headers.push(cell.textContent || '');
        });
      }

      const bodyRows = tableElement.querySelectorAll('tbody tr, tr:not(:first-child)');
      bodyRows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const rowData: string[] = [];
        cells.forEach(cell => {
          rowData.push(cell.textContent || '');
        });
        if (rowData.length > 0) {
          rows.push(rowData);
        }
      });

      tables.push({
        id: `table-${index}`,
        headers,
        rows,
        position: index,
      });
    });

    return {
      headings,
      paragraphs,
      lists,
      tables,
      footnotes,
    };
  }

  /**
   * Parse text structure for simple text files
   */
  private static parseTextStructure(text: string): DocumentStructure {
    const paragraphs = text.split('\n\n').filter(p => p.trim()).map((para, index) => ({
      id: `paragraph-${index}`,
      text: para.trim(),
      position: index,
    }));

    return {
      headings: [],
      paragraphs,
      lists: [],
      tables: [],
      footnotes: [],
    };
  }

  /**
   * Extract images from DOCX file
   */
  private static async extractImages(arrayBuffer: ArrayBuffer): Promise<DocumentImage[]> {
    // This would extract images from the DOCX file
    // For now, return empty array
    return [];
  }

  /**
   * Count words in text
   */
  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Estimate page count based on text length
   */
  private static estimatePageCount(text: string): number {
    // Rough estimate: 250 words per page
    const wordsPerPage = 250;
    const wordCount = this.countWords(text);
    return Math.max(1, Math.ceil(wordCount / wordsPerPage));
  }

  /**
   * Detect language of text (simplified implementation)
   */
  private static async detectLanguage(text: string): Promise<string> {
    // This would use a language detection library
    // For now, return 'en' as default
    return 'en';
  }
}

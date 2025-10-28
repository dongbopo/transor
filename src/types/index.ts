export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  uploadedAt: Date;
}

export interface ParsedDocument {
  id: string;
  originalFile: DocumentFile;
  content: DocumentContent;
  summary?: DocumentSummary;
  domain?: DocumentDomain;
  status: ProcessingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentContent {
  text: string;
  structure: DocumentStructure;
  images: DocumentImage[];
  metadata: DocumentMetadata;
}

export interface DocumentStructure {
  headings: Heading[];
  paragraphs: Paragraph[];
  lists: List[];
  tables: Table[];
  footnotes: Footnote[];
}

export interface Heading {
  id: string;
  level: number;
  text: string;
  position: number;
}

export interface Paragraph {
  id: string;
  text: string;
  position: number;
  style?: string;
}

export interface List {
  id: string;
  type: 'ordered' | 'unordered';
  items: ListItem[];
  position: number;
}

export interface ListItem {
  id: string;
  text: string;
  level: number;
}

export interface Table {
  id: string;
  headers: string[];
  rows: string[][];
  position: number;
}

export interface Footnote {
  id: string;
  text: string;
  reference: string;
  position: number;
}

export interface DocumentImage {
  id: string;
  src: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
}

export interface DocumentMetadata {
  pageCount: number;
  wordCount: number;
  characterCount: number;
  language?: string;
  author?: string;
  title?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface DocumentSummary {
  mainIdeas: string[];
  topics: string[];
  keyTerms: string[];
  abstract: string;
}

export interface DocumentDomain {
  type: 'general' | 'legal' | 'medical' | 'technical' | 'marketing' | 'academic';
  confidence: number;
  terminology: Record<string, string>;
}

export interface SourceFixes {
  originalText: string;
  correctedText: string;
  changes: TextChange[];
  explanation: string;
}

export interface TextChange {
  type: 'grammar' | 'punctuation' | 'spelling' | 'style';
  original: string;
  corrected: string;
  position: number;
  explanation: string;
}

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  sourceLanguage: string;
  confidence: number;
  wordAlignments: WordAlignment[];
  createdAt: Date;
}

export interface WordAlignment {
  sourceWord: string;
  targetWord: string;
  sourcePosition: number;
  targetPosition: number;
  confidence: number;
}

export interface WordTooltip {
  word: string;
  translation: string;
  explanation: string;
  partOfSpeech: string;
  pronunciation: string;
  audioUrl?: string;
  context: string;
  alternatives: string[];
}

export interface ProcessingStatus {
  stage: 'uploading' | 'parsing' | 'analyzing' | 'cleaning' | 'translating' | 'completed' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface ViewMode {
  type: 'original' | 'bilingual';
  showSourceFixes: boolean;
  showTooltips: boolean;
  showTTS: boolean;
  zoom: number;
}

export interface BilingualView {
  originalSegments: DocumentSegment[];
  translatedSegments: DocumentSegment[];
  alignments: SegmentAlignment[];
}

export interface DocumentSegment {
  id: string;
  text: string;
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'footnote';
  position: number;
  wordTokens: WordToken[];
}

export interface WordToken {
  id: string;
  text: string;
  position: number;
  partOfSpeech?: string;
  pronunciation?: string;
}

export interface SegmentAlignment {
  sourceSegmentId: string;
  targetSegmentId: string;
  confidence: number;
  wordAlignments: WordAlignment[];
}

export interface ExportOptions {
  format: 'docx' | 'pdf' | 'txt';
  includeSourceFixes: boolean;
  includeBilingual: boolean;
  preserveImages: boolean;
  preserveFormatting: boolean;
}

export interface StorageOptions {
  provider: 'local' | 'lovable' | 's3';
  bucket?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
}

export interface UserSettings {
  defaultTargetLanguage: string;
  defaultDomain: DocumentDomain['type'];
  storageProvider: StorageOptions['provider'];
  storageConfig?: StorageOptions;
  showPrivacyNotice: boolean;
  rtlSupport: boolean;
  keyboardShortcuts: boolean;
}

export interface GlossaryEntry {
  id: string;
  source: string;
  target: string;
  domain?: DocumentDomain['type'];
  context?: string;
  doNotTranslate: boolean;
}

export interface ProjectGlossary {
  id: string;
  name: string;
  entries: GlossaryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Authentication & User Types
export type LLMProvider = 'openai' | 'gemini' | 'grok' | 'claude';

export interface APIKeys {
  openai?: string;
  gemini?: string;
  grok?: string;
  claude?: string;
}

export interface UserPreferences {
  defaultProvider: LLMProvider;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  apiKeys: APIKeys;
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TokenUsage {
  documentId: string;
  provider: LLMProvider;
  tokensUsed: number;
  timestamp: Date;
  cost?: number;
}

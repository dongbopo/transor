import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ParsedDocument, DocumentFile, ProcessingStatus, ViewMode, Translation, BilingualView, LLMProvider } from '../types';
import { LLMTranslationService } from '../services/LLMTranslationService';
import toast from 'react-hot-toast';

interface DocumentState {
  documents: ParsedDocument[];
  currentDocument: ParsedDocument | null;
  translations: Translation[];
  currentTranslation: Translation | null;
  bilingualView: BilingualView | null;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
}

type DocumentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_DOCUMENT'; payload: ParsedDocument }
  | { type: 'UPDATE_DOCUMENT'; payload: ParsedDocument }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: ParsedDocument | null }
  | { type: 'ADD_TRANSLATION'; payload: Translation }
  | { type: 'SET_CURRENT_TRANSLATION'; payload: Translation | null }
  | { type: 'SET_BILINGUAL_VIEW'; payload: BilingualView | null }
  | { type: 'SET_VIEW_MODE'; payload: Partial<ViewMode> }
  | { type: 'UPDATE_DOCUMENT_STATUS'; payload: { id: string; status: ProcessingStatus } };

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  translations: [],
  currentTranslation: null,
  bilingualView: null,
  viewMode: {
    type: 'original',
    showSourceFixes: false,
    showTooltips: true,
    showTTS: false,
    zoom: 1,
  },
  isLoading: false,
  error: null,
};

function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        ),
        currentDocument: state.currentDocument?.id === action.payload.id 
          ? action.payload 
          : state.currentDocument,
      };
    case 'SET_CURRENT_DOCUMENT':
      return { ...state, currentDocument: action.payload };
    case 'ADD_TRANSLATION':
      return { ...state, translations: [...state.translations, action.payload] };
    case 'SET_CURRENT_TRANSLATION':
      return { ...state, currentTranslation: action.payload };
    case 'SET_BILINGUAL_VIEW':
      return { ...state, bilingualView: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: { ...state.viewMode, ...action.payload } };
    case 'UPDATE_DOCUMENT_STATUS':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id
            ? { ...doc, status: action.payload.status }
            : doc
        ),
        currentDocument: state.currentDocument?.id === action.payload.id
          ? { ...state.currentDocument, status: action.payload.status }
          : state.currentDocument,
      };
    default:
      return state;
  }
}

interface DocumentContextType {
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
  // Helper functions
  uploadDocument: (file: File) => Promise<void>;
  processDocument: (documentId: string) => Promise<void>;
  translateDocument: (documentId: string, targetLanguage: string, provider: LLMProvider, apiKey: string) => Promise<void>;
  exportDocument: (documentId: string, options: any) => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  const uploadDocument = async (file: File): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // This will be implemented with the document parsing service
      // For now, create a mock document
      const document: ParsedDocument = {
        id: crypto.randomUUID(),
        originalFile: {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          uploadedAt: new Date(),
        },
        content: {
          text: '',
          structure: {
            headings: [],
            paragraphs: [],
            lists: [],
            tables: [],
            footnotes: [],
          },
          images: [],
          metadata: {
            pageCount: 0,
            wordCount: 0,
            characterCount: 0,
          },
        },
        status: {
          stage: 'uploading',
          progress: 0,
          message: 'Uploading document...',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_DOCUMENT', payload: document });
      dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Upload failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processDocument = async (documentId: string): Promise<void> => {
    // Implementation will be added with document processing services
    console.log('Processing document:', documentId);
  };

  const translateDocument = async (
    documentId: string,
    targetLanguage: string,
    provider: LLMProvider,
    apiKey: string
  ): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const document = state.documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }

      // Update status
      dispatch({
        type: 'UPDATE_DOCUMENT_STATUS',
        payload: {
          id: documentId,
          status: {
            stage: 'translating',
            progress: 0,
            message: `Translating to ${targetLanguage}...`,
          },
        },
      });

      // Extract text from document
      const textToTranslate = document.content.text || 'No content available';

      // For long documents, use chunking
      let translatedText: string;
      if (textToTranslate.length > 2000) {
        translatedText = await LLMTranslationService.translateLongText(
          textToTranslate,
          targetLanguage,
          apiKey,
          provider
        );
      } else {
        const result = await LLMTranslationService.translate({
          text: textToTranslate,
          sourceLanguage: 'auto', // Could detect from document metadata
          targetLanguage,
          apiKey,
          provider,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        translatedText = result.translatedText;
      }

      // Create translation object
      const translation: Translation = {
        id: crypto.randomUUID(),
        originalText: textToTranslate,
        translatedText,
        targetLanguage,
        sourceLanguage: document.content.metadata.language || 'auto',
        confidence: 0.95, // Could calculate based on API response
        wordAlignments: [],
        createdAt: new Date(),
      };

      dispatch({ type: 'ADD_TRANSLATION', payload: translation });
      dispatch({ type: 'SET_CURRENT_TRANSLATION', payload: translation });

      // Update document status
      dispatch({
        type: 'UPDATE_DOCUMENT_STATUS',
        payload: {
          id: documentId,
          status: {
            stage: 'completed',
            progress: 100,
            message: 'Translation completed',
          },
        },
      });

      toast.success('Document translated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({
        type: 'UPDATE_DOCUMENT_STATUS',
        payload: {
          id: documentId,
          status: {
            stage: 'error',
            progress: 0,
            message: errorMessage,
          },
        },
      });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const exportDocument = async (documentId: string, options: any): Promise<void> => {
    // Implementation will be added with export services
    console.log('Exporting document:', documentId, 'with options:', options);
  };

  const value: DocumentContextType = {
    state,
    dispatch,
    uploadDocument,
    processDocument,
    translateDocument,
    exportDocument,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook for accessing the DocumentContext
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

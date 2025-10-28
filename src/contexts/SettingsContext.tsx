import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { UserSettings, StorageOptions, ProjectGlossary } from '../types';

interface SettingsState {
  settings: UserSettings;
  glossaries: ProjectGlossary[];
  isLoading: boolean;
  error: string | null;
}

type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'ADD_GLOSSARY'; payload: ProjectGlossary }
  | { type: 'UPDATE_GLOSSARY'; payload: ProjectGlossary }
  | { type: 'DELETE_GLOSSARY'; payload: string }
  | { type: 'SET_GLOSSARIES'; payload: ProjectGlossary[] };

const defaultSettings: UserSettings = {
  defaultTargetLanguage: 'en',
  defaultDomain: 'general',
  storageProvider: 'local',
  showPrivacyNotice: true,
  rtlSupport: false,
  keyboardShortcuts: true,
};

const initialState: SettingsState = {
  settings: defaultSettings,
  glossaries: [],
  isLoading: false,
  error: null,
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'ADD_GLOSSARY':
      return { ...state, glossaries: [...state.glossaries, action.payload] };
    case 'UPDATE_GLOSSARY':
      return {
        ...state,
        glossaries: state.glossaries.map(glossary =>
          glossary.id === action.payload.id ? action.payload : glossary
        ),
      };
    case 'DELETE_GLOSSARY':
      return {
        ...state,
        glossaries: state.glossaries.filter(glossary => glossary.id !== action.payload),
      };
    case 'SET_GLOSSARIES':
      return { ...state, glossaries: action.payload };
    default:
      return state;
  }
}

interface SettingsContextType {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addGlossary: (glossary: ProjectGlossary) => void;
  updateGlossary: (glossary: ProjectGlossary) => void;
  deleteGlossary: (glossaryId: string) => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const savedSettings = localStorage.getItem('transor-settings');
      const savedGlossaries = localStorage.getItem('transor-glossaries');
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsedSettings });
      }
      
      if (savedGlossaries) {
        const parsedGlossaries = JSON.parse(savedGlossaries);
        dispatch({ type: 'SET_GLOSSARIES', payload: parsedGlossaries });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load settings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('transor-settings', JSON.stringify(state.settings));
      localStorage.setItem('transor-glossaries', JSON.stringify(state.glossaries));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save settings' });
    }
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    // Auto-save settings
    setTimeout(() => {
      const newSettings = { ...state.settings, ...settings };
      localStorage.setItem('transor-settings', JSON.stringify(newSettings));
    }, 100);
  };

  const addGlossary = (glossary: ProjectGlossary) => {
    dispatch({ type: 'ADD_GLOSSARY', payload: glossary });
    // Auto-save glossaries
    setTimeout(() => {
      const newGlossaries = [...state.glossaries, glossary];
      localStorage.setItem('transor-glossaries', JSON.stringify(newGlossaries));
    }, 100);
  };

  const updateGlossary = (glossary: ProjectGlossary) => {
    dispatch({ type: 'UPDATE_GLOSSARY', payload: glossary });
    // Auto-save glossaries
    setTimeout(() => {
      const newGlossaries = state.glossaries.map(g => g.id === glossary.id ? glossary : g);
      localStorage.setItem('transor-glossaries', JSON.stringify(newGlossaries));
    }, 100);
  };

  const deleteGlossary = (glossaryId: string) => {
    dispatch({ type: 'DELETE_GLOSSARY', payload: glossaryId });
    // Auto-save glossaries
    setTimeout(() => {
      const newGlossaries = state.glossaries.filter(g => g.id !== glossaryId);
      localStorage.setItem('transor-glossaries', JSON.stringify(newGlossaries));
    }, 100);
  };

  const value: SettingsContextType = {
    state,
    dispatch,
    updateSettings,
    addGlossary,
    updateGlossary,
    deleteGlossary,
    loadSettings,
    saveSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bookmark,
  Highlighter,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Type,
  Moon,
  Sun,
} from 'lucide-react';
import { ReadingMode, ReadingProgress } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface EbookReaderProps {
  documentId: string;
  documentName: string;
  totalPages: number;
}

interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  theme: 'light' | 'dark' | 'sepia';
  fontFamily: 'serif' | 'sans' | 'mono';
}

const EbookReader: React.FC<EbookReaderProps> = ({ documentId, documentName, totalPages }) => {
  const { user, updatePreferences } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [readingMode, setReadingMode] = useState<ReadingMode>(
    user?.preferences.defaultReadingMode || 'parallel'
  );
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: user?.preferences.fontSize || 16,
    lineHeight: user?.preferences.lineHeight || 1.6,
    theme: 'light',
    fontFamily: 'serif',
  });

  // Mock content (replace with actual document content)
  const originalContent = `This is the original text from the document. In a real implementation, this would be loaded from the document file. The content would be parsed and displayed page by page.`;
  
  const translatedContent = `Đây là văn bản đã được dịch từ tài liệu. Trong triển khai thực tế, nội dung này sẽ được tải từ file tài liệu. Nội dung sẽ được phân tích và hiển thị theo từng trang.`;

  const readingProgress: ReadingProgress = {
    documentId,
    currentPage,
    totalPages,
    progressPercentage: (currentPage / totalPages) * 100,
    lastReadingMode: readingMode,
    totalReadingTimeMinutes: 0,
    lastReadAt: new Date(),
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSettingsChange = (key: keyof ReaderSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update user preferences for font settings
    if (key === 'fontSize' || key === 'lineHeight') {
      updatePreferences({ [key]: value });
    }
  };

  const themeColors = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    sepia: 'bg-amber-50 text-amber-900',
  };

  const fontFamilies = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Reader Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {documentName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages} • {readingProgress.progressPercentage.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Reading Mode Selector */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setReadingMode('original')}
              className={`
                px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${readingMode === 'original'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              Original
            </button>
            <button
              onClick={() => setReadingMode('translation')}
              className={`
                px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${readingMode === 'translation'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              Translation
            </button>
            <button
              onClick={() => setReadingMode('parallel')}
              className={`
                px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${readingMode === 'parallel'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              Parallel
            </button>
          </div>

          {/* Reader Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <Highlighter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`
                p-2 rounded transition-colors
                ${showSettings
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="grid grid-cols-4 gap-4 max-w-4xl">
                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSettingsChange('fontSize', Math.max(settings.fontSize - 1, 12))}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium w-12 text-center">
                      {settings.fontSize}px
                    </span>
                    <button
                      onClick={() => handleSettingsChange('fontSize', Math.min(settings.fontSize + 1, 24))}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Line Height
                  </label>
                  <select
                    value={settings.lineHeight}
                    onChange={(e) => handleSettingsChange('lineHeight', parseFloat(e.target.value))}
                    className="input text-sm w-full"
                  >
                    <option value={1.4}>Compact</option>
                    <option value={1.6}>Normal</option>
                    <option value={1.8}>Relaxed</option>
                    <option value={2.0}>Loose</option>
                  </select>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => handleSettingsChange('fontFamily', e.target.value)}
                    className="input text-sm w-full"
                  >
                    <option value="serif">Serif</option>
                    <option value="sans">Sans-serif</option>
                    <option value="mono">Monospace</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSettingsChange('theme', 'light')}
                      className={`
                        p-2 rounded border-2 transition-all
                        ${settings.theme === 'light'
                          ? 'border-blue-500 bg-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white'
                        }
                      `}
                      title="Light"
                    >
                      <Sun className="w-4 h-4 text-yellow-500" />
                    </button>
                    <button
                      onClick={() => handleSettingsChange('theme', 'dark')}
                      className={`
                        p-2 rounded border-2 transition-all
                        ${settings.theme === 'dark'
                          ? 'border-blue-500 bg-gray-900'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-900'
                        }
                      `}
                      title="Dark"
                    >
                      <Moon className="w-4 h-4 text-gray-200" />
                    </button>
                    <button
                      onClick={() => handleSettingsChange('theme', 'sepia')}
                      className={`
                        p-2 rounded border-2 transition-all
                        ${settings.theme === 'sepia'
                          ? 'border-blue-500 bg-amber-50'
                          : 'border-gray-300 dark:border-gray-600 bg-amber-50'
                        }
                      `}
                      title="Sepia"
                    >
                      <Type className="w-4 h-4 text-amber-700" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reader Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${readingMode}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {readingMode === 'parallel' ? (
                <div className="grid grid-cols-2 gap-6">
                  {/* Original Text */}
                  <div
                    className={`
                      p-8 rounded-lg shadow-sm
                      ${themeColors[settings.theme]}
                      ${fontFamilies[settings.fontFamily]}
                    `}
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      lineHeight: settings.lineHeight,
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                      Original
                    </h3>
                    <div className="prose max-w-none">
                      {originalContent}
                    </div>
                  </div>

                  {/* Translated Text */}
                  <div
                    className={`
                      p-8 rounded-lg shadow-sm
                      ${themeColors[settings.theme]}
                      ${fontFamilies[settings.fontFamily]}
                    `}
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      lineHeight: settings.lineHeight,
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                      Translation
                    </h3>
                    <div className="prose max-w-none">
                      {translatedContent}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`
                    max-w-4xl mx-auto p-8 rounded-lg shadow-sm
                    ${themeColors[settings.theme]}
                    ${fontFamilies[settings.fontFamily]}
                  `}
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                    {readingMode === 'original' ? 'Original' : 'Translation'}
                  </h3>
                  <div className="prose max-w-none">
                    {readingMode === 'original' ? originalContent : translatedContent}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Page Indicator */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
              className="input w-20 text-center"
              min={1}
              max={totalPages}
            />
            <span className="text-gray-600 dark:text-gray-400">of {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${readingProgress.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;


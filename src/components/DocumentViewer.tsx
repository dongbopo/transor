import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ParsedDocument, ViewMode, WordTooltip } from '../types';
import WordTooltipComponent from './WordTooltip';

interface DocumentViewerProps {
  document: ParsedDocument;
  viewMode: ViewMode;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, viewMode }) => {
  const [hoveredWord, setHoveredWord] = useState<WordTooltip | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Mock word tooltip data - in real implementation, this would come from the translation service
  const getWordTooltip = (word: string): WordTooltip => ({
    word,
    translation: `${word} (translated)`,
    explanation: `This word fits the context because...`,
    partOfSpeech: 'noun',
    pronunciation: `/pronunciation/`,
    context: 'Sample context sentence',
    alternatives: [`alt-${word}-1`, `alt-${word}-2`],
  });

  const handleWordHover = (event: React.MouseEvent<HTMLSpanElement>, word: string) => {
    if (!viewMode.showTooltips) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const viewerRect = viewerRef.current?.getBoundingClientRect();
    
    if (viewerRect) {
      setTooltipPosition({
        x: rect.left - viewerRect.left + rect.width / 2,
        y: rect.top - viewerRect.top - 10,
      });
    }

    setHoveredWord(getWordTooltip(word));
    setShowTooltip(true);
  };

  const handleWordLeave = () => {
    setShowTooltip(false);
    setHoveredWord(null);
  };

  // Split text into words for tooltip functionality
  const renderTextWithTooltips = (text: string) => {
    if (!viewMode.showTooltips) {
      return <span>{text}</span>;
    }

    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      if (/\s/.test(word)) {
        return <span key={index}>{word}</span>;
      }
      
      return (
        <span
          key={index}
          className="hover:bg-yellow-200 hover:cursor-help transition-colors duration-150 rounded-sm px-1"
          onMouseEnter={(e) => handleWordHover(e, word)}
          onMouseLeave={handleWordLeave}
        >
          {word}
        </span>
      );
    });
  };

  // Mock source fixes - in real implementation, this would come from the source cleaning service
  const getSourceFixes = (text: string) => {
    return {
      originalText: text,
      correctedText: text.replace(/typo/g, 'typo (corrected)'),
      changes: [],
      explanation: 'Minor grammar and punctuation corrections applied.',
    };
  };

  return (
    <div className="relative p-8 min-h-96" ref={viewerRef}>
      {/* Document Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {document.originalFile.name}
        </h1>
        {document.summary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Document Summary</h3>
            <p className="text-blue-800">{document.summary.abstract}</p>
            
            {document.summary.topics.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-blue-900 mb-1">Key Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {document.summary.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Document Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none"
      >
        {document.content.structure.headings.map((heading) => (
          <div key={heading.id} className={`mb-4 ${heading.level === 1 ? 'text-2xl' : heading.level === 2 ? 'text-xl' : 'text-lg'} font-semibold text-gray-900`}>
            {renderTextWithTooltips(heading.text)}
          </div>
        ))}

        {document.content.structure.paragraphs.map((paragraph) => {
          const sourceFixes = viewMode.showSourceFixes ? getSourceFixes(paragraph.text) : null;
          
          return (
            <div key={paragraph.id} className="mb-4">
              {sourceFixes && (
                <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-green-800 font-medium">Source Fixes Applied:</p>
                      <p className="text-sm text-green-700">{sourceFixes.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-gray-800 leading-relaxed">
                {renderTextWithTooltips(sourceFixes?.correctedText || paragraph.text)}
              </p>
            </div>
          );
        })}

        {document.content.structure.lists.map((list) => (
          <div key={list.id} className="mb-4">
            {list.items.map((item) => (
              <div key={item.id} className={`ml-${item.level * 4} mb-2`}>
                <span className="text-gray-800">
                  {list.type === 'ordered' ? '• ' : '• '}
                  {renderTextWithTooltips(item.text)}
                </span>
              </div>
            ))}
          </div>
        ))}

        {document.content.structure.tables.map((table) => (
          <div key={table.id} className="mb-6 overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {table.headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 border-b border-gray-200 text-gray-800">
                        {renderTextWithTooltips(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {document.content.images.map((image) => (
          <div key={image.id} className="mb-6 text-center">
            <img
              src={image.src}
              alt={image.alt || 'Document image'}
              className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
              style={{
                maxWidth: image.width ? `${image.width}px` : '100%',
                maxHeight: image.height ? `${image.height}px` : 'auto',
              }}
            />
            {image.alt && (
              <p className="text-sm text-gray-500 mt-2 italic">{image.alt}</p>
            )}
          </div>
        ))}
      </motion.div>

      {/* Word Tooltip */}
      {showTooltip && hoveredWord && (
        <WordTooltipComponent
          tooltip={hoveredWord}
          position={tooltipPosition}
          onClose={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
};

export default DocumentViewer;

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ParsedDocument, Translation, ViewMode, DocumentSegment } from '../types';

interface BilingualViewProps {
  document: ParsedDocument;
  translation: Translation | null;
  viewMode: ViewMode;
}

const BilingualView: React.FC<BilingualViewProps> = ({ document, translation, viewMode }) => {
  const [synchronizedScroll, setSynchronizedScroll] = useState(true);
  const [highlightedSegment, setHighlightedSegment] = useState<string | null>(null);
  const [splitPosition, setSplitPosition] = useState(50); // 50% split
  const [isDragging, setIsDragging] = useState(false);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock translation data - in real implementation, this would come from the translation service
  const mockTranslation: Translation = {
    id: 'mock-translation',
    originalText: document.content.text,
    translatedText: document.content.text + ' (translated)',
    targetLanguage: 'es',
    sourceLanguage: 'en',
    confidence: 0.95,
    wordAlignments: [],
    createdAt: new Date(),
  };

  const currentTranslation = translation || mockTranslation;

  // Mock segment data - in real implementation, this would come from the alignment service
  const mockSegments: DocumentSegment[] = document.content.structure.paragraphs.map((para, index) => ({
    id: `segment-${index}`,
    text: para.text,
    type: 'paragraph',
    position: para.position,
    wordTokens: para.text.split(' ').map((word, wordIndex) => ({
      id: `word-${index}-${wordIndex}`,
      text: word,
      position: wordIndex,
    })),
  }));

  const handleScroll = (source: 'left' | 'right') => {
    if (!synchronizedScroll) return;

    const sourceRef = source === 'left' ? leftPaneRef : rightPaneRef;
    const targetRef = source === 'left' ? rightPaneRef : leftPaneRef;

    if (sourceRef.current && targetRef.current) {
      const scrollTop = sourceRef.current.scrollTop;
      const scrollHeight = sourceRef.current.scrollHeight;
      const clientHeight = sourceRef.current.clientHeight;
      
      const targetScrollHeight = targetRef.current.scrollHeight;
      const targetClientHeight = targetRef.current.clientHeight;
      
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);
      const targetScrollTop = scrollRatio * (targetScrollHeight - targetClientHeight);
      
      targetRef.current.scrollTop = targetScrollTop;
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    // Limit between 20% and 80%
    const clampedPercentage = Math.max(20, Math.min(80, percentage));
    setSplitPosition(clampedPercentage);
  }, [isDragging]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      const doc = window.document;
      doc.addEventListener('mousemove', handleMouseMove);
      doc.addEventListener('mouseup', handleMouseUp);
      return () => {
        doc.removeEventListener('mousemove', handleMouseMove);
        doc.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const renderSegment = (segment: DocumentSegment, isTranslation: boolean = false) => {
    const text = isTranslation ? segment.text + ' (translated)' : segment.text;
    
    return (
      <motion.div
        key={segment.id}
        className={`mb-4 p-3 rounded-lg transition-colors duration-200 ${
          highlightedSegment === segment.id
            ? 'bg-yellow-100 border border-yellow-300'
            : 'hover:bg-gray-50'
        }`}
        onMouseEnter={() => setHighlightedSegment(segment.id)}
        onMouseLeave={() => setHighlightedSegment(null)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: segment.position * 0.1 }}
      >
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
            {segment.position + 1}
          </div>
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed">
              {text}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className="h-full flex relative">
        {/* Left Pane - Original */}
        <div 
          ref={leftPaneRef}
          className="h-full overflow-auto p-6 bg-white"
          style={{ width: `${splitPosition}%` }}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 pb-4 mb-6 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Original Text</h3>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={synchronizedScroll}
                    onChange={(e) => setSynchronizedScroll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-600">Sync scroll</span>
                </label>
              </div>
            </div>
          </div>

          <div
            className="space-y-4"
            onScroll={() => handleScroll('left')}
          >
            {mockSegments.map((segment) => renderSegment(segment, false))}
          </div>
        </div>

        {/* Splitter */}
        <div
          className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize flex-shrink-0 relative z-10"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8" />
        </div>

        {/* Right Pane - Translation */}
        <div 
          ref={rightPaneRef}
          className="h-full overflow-auto p-6 bg-gray-50"
          style={{ width: `${100 - splitPosition}%` }}
        >
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 pb-4 mb-6 z-10">
            <h3 className="text-lg font-semibold text-gray-900">
              Translation ({currentTranslation.targetLanguage.toUpperCase()})
            </h3>
            <p className="text-sm text-gray-500">
              Confidence: {Math.round(currentTranslation.confidence * 100)}%
            </p>
          </div>

          <div
            className="space-y-4"
            onScroll={() => handleScroll('right')}
          >
            {mockSegments.map((segment) => renderSegment(segment, true))}
          </div>
        </div>
    </div>
  );
};

export default BilingualView;

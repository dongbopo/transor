import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X } from 'lucide-react';
import { WordTooltip as WordTooltipType } from '../types';

interface WordTooltipProps {
  tooltip: WordTooltipType;
  position: { x: number; y: number };
  onClose: () => void;
}

const WordTooltipComponent: React.FC<WordTooltipProps> = ({ tooltip, position, onClose }) => {
  const handlePlayAudio = () => {
    // In a real implementation, this would use TTS API
    console.log('Playing audio for:', tooltip.word);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className="tooltip"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">{tooltip.word}</span>
            <span className="text-xs text-gray-300">({tooltip.partOfSpeech})</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Translation */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-200">Translation:</span>
            <button
              onClick={handlePlayAudio}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Play pronunciation"
            >
              <Volume2 className="w-3 h-3" />
            </button>
          </div>
          <p className="text-white font-medium">{tooltip.translation}</p>
        </div>

        {/* Pronunciation */}
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-200">Pronunciation:</span>
          <p className="text-white text-sm font-mono">{tooltip.pronunciation}</p>
        </div>

        {/* Explanation */}
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-200">Context:</span>
          <p className="text-white text-sm">{tooltip.explanation}</p>
        </div>

        {/* Sample Usage */}
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-200">Example:</span>
          <p className="text-white text-sm italic">"{tooltip.context}"</p>
        </div>

        {/* Alternatives */}
        {tooltip.alternatives.length > 0 && (
          <div>
            <span className="text-sm font-medium text-blue-200">Alternatives:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {tooltip.alternatives.map((alt, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-white text-xs rounded"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WordTooltipComponent;

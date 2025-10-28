import React from 'react';
import { Eye, EyeOff, Volume2, VolumeX, Search, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { ViewMode } from '../types';

interface ToolbarProps {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onToggleSourceFixes: () => void;
  onToggleTooltips: () => void;
  onToggleTTS: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onToggleViewMode,
  onToggleSourceFixes,
  onToggleTooltips,
  onToggleTTS,
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <button
            onClick={onToggleViewMode}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode.type === 'original'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Original</span>
          </button>
          <button
            onClick={onToggleViewMode}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode.type === 'bilingual'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>Bilingual</span>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Display Options */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSourceFixes}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode.showSourceFixes
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-sm font-medium">
              {viewMode.showSourceFixes ? 'Hide' : 'Show'} Fixes
            </span>
          </button>

          <button
            onClick={onToggleTooltips}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode.showTooltips
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-sm font-medium">
              {viewMode.showTooltips ? 'Hide' : 'Show'} Tooltips
            </span>
          </button>

          <button
            onClick={onToggleTTS}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode.showTTS
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {viewMode.showTTS ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">TTS</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search document..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-12 text-center">
            {Math.round(viewMode.zoom * 100)}%
          </span>
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Export */}
        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

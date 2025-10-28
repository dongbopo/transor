import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Grid, 
  List, 
  Search, 
  Calendar, 
  Tag as TagIcon,
  Clock,
  BookOpen,
  MoreVertical,
  Trash2,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../contexts/DocumentContext';
import { DocumentTag } from '../types';
import { formatDistanceToNow } from 'date-fns';

type LibraryViewMode = 'grid' | 'list';
type SortBy = 'recent' | 'name' | 'size' | 'pages';

interface DocumentLibraryProps {
  onDocumentSelect?: (documentId: string) => void;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ onDocumentSelect }) => {
  const navigate = useNavigate();
  const { state } = useDocuments();
  const { documents } = state;
  const [viewMode, setViewMode] = useState<LibraryViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock tags (replace with actual tag system)
  const allTags: DocumentTag[] = [
    { id: '1', name: 'Research', color: 'blue', documentCount: 5, createdAt: new Date() },
    { id: '2', name: 'Work', color: 'green', documentCount: 3, createdAt: new Date() },
    { id: '3', name: 'Academic', color: 'purple', documentCount: 7, createdAt: new Date() },
    { id: '4', name: 'Personal', color: 'orange', documentCount: 2, createdAt: new Date() },
  ];

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag; // Implement tag filtering when metadata is added
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        default:
          return 0;
      }
    });

  const handleDocumentClick = (documentId: string) => {
    if (onDocumentSelect) {
      onDocumentSelect(documentId);
    } else {
      navigate(`/reader/${documentId}`);
    }
  };

  const tagColors: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Library</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredDocuments.length} documents
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-2 rounded transition-colors
                ${viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-2 rounded transition-colors
                ${viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="input text-sm pr-8"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="pages">Pages</option>
          </select>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              btn-outline flex items-center space-x-2
              ${showFilters ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : ''}
            `}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        {/* Tag Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${!selectedTag
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${selectedTag === tag.id
                        ? `${tagColors[tag.color]} ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600`
                        : `${tagColors[tag.color]} opacity-70 hover:opacity-100`
                      }
                    `}
                  >
                    {tag.name} ({tag.documentCount})
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleDocumentClick(doc.id)}
              className="card cursor-pointer hover:shadow-lg transition-shadow group"
            >
              {/* Cover/Thumbnail */}
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              </div>

              {/* Document Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {doc.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}</span>
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${tagColors.blue}`}>
                    Research
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>Status: {doc.status}</span>
                  <MoreVertical className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card divide-y divide-gray-200 dark:divide-gray-700">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleDocumentClick(doc.id)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {doc.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TagIcon className="w-3 h-3" />
                      <span>Research</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${doc.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : doc.status === 'processing'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }
                `}>
                  {doc.status}
                </span>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedTag
              ? 'Try adjusting your filters'
              : 'Upload your first document to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;


import React from 'react';
import { DocumentDomain } from '../types';

interface DomainSelectorProps {
  value: DocumentDomain['type'];
  onChange: (value: DocumentDomain['type']) => void;
}

const domains = [
  { 
    type: 'general' as const, 
    name: 'General', 
    description: 'Everyday documents and general content',
    icon: '📄'
  },
  { 
    type: 'legal' as const, 
    name: 'Legal', 
    description: 'Legal documents, contracts, and legal text',
    icon: '⚖️'
  },
  { 
    type: 'medical' as const, 
    name: 'Medical', 
    description: 'Medical reports, research papers, and healthcare content',
    icon: '🏥'
  },
  { 
    type: 'technical' as const, 
    name: 'Technical', 
    description: 'Technical documentation, manuals, and engineering content',
    icon: '⚙️'
  },
  { 
    type: 'marketing' as const, 
    name: 'Marketing', 
    description: 'Marketing materials, advertisements, and promotional content',
    icon: '📢'
  },
  { 
    type: 'academic' as const, 
    name: 'Academic', 
    description: 'Research papers, academic articles, and scholarly content',
    icon: '🎓'
  },
];

const DomainSelector: React.FC<DomainSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {domains.map((domain) => (
          <button
            key={domain.type}
            onClick={() => onChange(domain.type)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              value === domain.type
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{domain.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{domain.name}</p>
                <p className="text-sm text-gray-500">{domain.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Choose the document domain to optimize translation terminology and style
      </p>
    </div>
  );
};

export default DomainSelector;

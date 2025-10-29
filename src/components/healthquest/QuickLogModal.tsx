import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { HealthDataType } from '../../types/healthquest';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (dataType: HealthDataType, value: number, notes?: string) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose, onLog }) => {
  const [dataType, setDataType] = useState<HealthDataType>('steps');
  const [value, setValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const quickActions = {
    steps: [
      { label: '1000', value: 1000 },
      { label: '5000', value: 5000 },
      { label: '10000', value: 10000 },
    ],
    water: [
      { label: '250ml', value: 250 },
      { label: '500ml', value: 500 },
      { label: '1000ml', value: 1000 },
    ],
    sleep_duration: [
      { label: '6h', value: 6 },
      { label: '7h', value: 7 },
      { label: '8h', value: 8 },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      alert('Please enter a valid number');
      return;
    }

    onLog(dataType, numValue, notes);
    setValue('');
    setNotes('');
    onClose();
  };

  const handleQuickAction = (quickValue: number) => {
    setValue(quickValue.toString());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quick Log</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as HealthDataType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="steps">Steps</option>
                <option value="water">Water (ml)</option>
                <option value="weight">Weight (kg)</option>
                <option value="sleep_duration">Sleep (hours)</option>
                <option value="mood">Mood (1-10)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                step="0.1"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            {quickActions[dataType as keyof typeof quickActions] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Actions
                </label>
                <div className="flex gap-2">
                  {quickActions[dataType as keyof typeof quickActions].map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => handleQuickAction(action.value)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Log Entry
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


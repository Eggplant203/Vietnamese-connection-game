import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PuzzleViewModalProps {
  puzzle: any;
  onClose: () => void;
}

export const PuzzleViewModal: React.FC<PuzzleViewModalProps> = ({ puzzle, onClose }) => {
  if (!puzzle) return null;

  const groups = puzzle.groups || puzzle.data || [];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{puzzle.gameName || 'Puzzle'}</h2>
              <p className="text-sm opacity-90 mt-1">
                Độ khó: {puzzle.overallDifficulty} • {new Date(puzzle.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-4">
              {groups.map((group: any, index: number) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${getColorClass(group.color)}`}></div>
                    <div>
                      <h3 className="font-bold text-gray-800">{group.theme}</h3>
                      <p className="text-xs text-gray-500">Độ khó: {group.difficulty}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.words.map((word: any, idx: number) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 text-center"
                      >
                        {word.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

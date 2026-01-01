import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordCard } from './WordCard';
import { useGameStore } from '../store/gameStore';
import type { Word } from '@shared/Types';

export const GameBoard: React.FC = () => {
  const { currentPuzzle, foundGroups } = useGameStore();
  const [wordPositions, setWordPositions] = React.useState<Word[]>([]);

  // Randomize word positions when puzzle loads
  React.useEffect(() => {
    if (currentPuzzle) {
      const allWords: Word[] = currentPuzzle.groups.flatMap((g) => g.words);
      const shuffled = [...allWords].sort(() => Math.random() - 0.5);
      setWordPositions(shuffled);
    }
  }, [currentPuzzle?.id]);

  if (!currentPuzzle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Đang tải câu đố...</p>
      </div>
    );
  }

  // Filter out found words
  const remainingWords = wordPositions.filter(
    (word) =>
      !foundGroups.some((group) =>
        group.words.some((w) => w.text === word.text)
      )
  );

  const shuffleWords = () => {
    setWordPositions([...remainingWords].sort(() => Math.random() - 0.5));
  };

  // Expose shuffle function to parent
  React.useEffect(() => {
    (window as any).__shuffleWords = shuffleWords;
    return () => {
      delete (window as any).__shuffleWords;
    };
  }, [remainingWords]);

  return (
    <div className="space-y-4">
      {/* Found groups with merge animation */}
      <AnimatePresence>
        {foundGroups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className={`p-4 rounded-xl text-white font-semibold ${
              group.color === 'green'
                ? 'bg-green-500'
                : group.color === 'yellow'
                ? 'bg-yellow-500'
                : group.color === 'purple'
                ? 'bg-purple-500'
                : 'bg-red-500'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-1 uppercase tracking-wide">
                {group.theme || 'CHÍNH XÁC!'}
              </h3>
              <p className="text-sm opacity-90">
                {group.words.map((w) => w.text).join(' • ')}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Remaining words grid */}
      {remainingWords.length > 0 && (
        <motion.div
          className="grid grid-cols-4 gap-3"
          layout
        >
          <AnimatePresence mode="popLayout">
            {remainingWords.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                isFound={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

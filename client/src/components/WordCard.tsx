import React from 'react';
import { motion } from 'framer-motion';
import type { Word } from '@shared/Types';
import { useGameStore } from '../store/gameStore';
import clsx from 'clsx';

interface WordCardProps {
  word: Word;
  isFound: boolean;
}

export const WordCard = React.forwardRef<HTMLDivElement, WordCardProps>(
  ({ word, isFound }, ref) => {
    const { selectedWords, toggleWord, isComplete, isFailed } = useGameStore();
    const isSelected = selectedWords.includes(word.text);

    const handleClick = () => {
      if (isFound || isComplete || isFailed) return;
      toggleWord(word.text);
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: isComplete || isFailed ? 1 : 1.05 }}
        whileTap={{ scale: isComplete || isFailed ? 1 : 0.95 }}
        onClick={handleClick}
        className={clsx('word-card', isSelected && 'selected')}
      >
        {word.text}
      </motion.div>
    );
  }
);

WordCard.displayName = 'WordCard';

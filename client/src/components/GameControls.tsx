import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { puzzleAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Shuffle } from 'lucide-react';

export const GameControls: React.FC = () => {
  const {
    currentPuzzle,
    selectedWords,
    attempts,
    maxAttempts,
    clearSelection,
    addFoundGroup,
    incrementAttempts,
    isComplete,
    isFailed,
    isLoading,
  } = useGameStore();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isShaking, setIsShaking] = React.useState(false);

  const handleSubmit = async () => {
    if (!currentPuzzle || selectedWords.length !== 4 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await puzzleAPI.submitGuess(currentPuzzle.id, selectedWords);

      if (result.success && result.group) {
        // Correct answer!
        addFoundGroup(result.group);
      } else {
        // Wrong answer
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        incrementAttempts();
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShuffle = () => {
    if (typeof (window as any).__shuffleWords === 'function') {
      (window as any).__shuffleWords();
      toast.success('Đã xáo trộn!');
    }
  };

  const remainingAttempts = maxAttempts - attempts;

  return (
    <div className="space-y-4">
      {/* Attempts indicator */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: maxAttempts }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`w-4 h-4 rounded-full ${
              i < attempts
                ? 'bg-red-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Còn lại <span className="font-bold text-red-500">{remainingAttempts}</span> lần thử
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShuffle}
          disabled={isComplete || isFailed || isLoading}
          className="btn-secondary flex items-center gap-2"
        >
          <Shuffle size={20} />
          Xáo trộn
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearSelection}
          disabled={selectedWords.length === 0 || isComplete || isFailed || isLoading}
          className="btn-secondary"
        >
          Xóa chọn
        </motion.button>

        <motion.button
          whileHover={{ scale: selectedWords.length === 4 ? 1.05 : 1 }}
          whileTap={{ scale: selectedWords.length === 4 ? 0.95 : 1 }}
          onClick={handleSubmit}
          disabled={selectedWords.length !== 4 || isSubmitting || isComplete || isFailed || isLoading}
          className={`btn-primary ${isShaking ? 'animate-shake' : ''}`}
        >
          {isSubmitting ? 'Đang kiểm tra...' : 'Gửi đáp án'}
        </motion.button>
      </div>
    </div>
  );
};

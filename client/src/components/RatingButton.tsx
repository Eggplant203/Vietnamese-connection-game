import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { puzzleAPI } from '../services/api';
import toast from 'react-hot-toast';

interface RatingButtonProps {
  puzzleId: string;
}

export const RatingButton: React.FC<RatingButtonProps> = ({ puzzleId }) => {
  const [showPopup, setShowPopup] = React.useState(false);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isVoting, setIsVoting] = React.useState(false);

  // Check if user has already voted (using localStorage)
  React.useEffect(() => {
    const votedPuzzles = JSON.parse(localStorage.getItem('votedPuzzles') || '[]');
    setHasVoted(votedPuzzles.includes(puzzleId));
  }, [puzzleId]);

  const handleVote = async (isPositive: boolean) => {
    if (hasVoted || isVoting) return;

    setIsVoting(true);
    try {
      await puzzleAPI.ratePuzzle(puzzleId, isPositive ? 1 : -1);
      
      // Mark as voted in localStorage
      const votedPuzzles = JSON.parse(localStorage.getItem('votedPuzzles') || '[]');
      votedPuzzles.push(puzzleId);
      localStorage.setItem('votedPuzzles', JSON.stringify(votedPuzzles));
      
      setHasVoted(true);
      setShowPopup(false);
      
      // Show thank you message
      toast.success('Cảm ơn bạn đã đánh giá! 💙', {
        duration: 1500,
        position: 'bottom-right',
        style: {
          fontSize: '14px',
        },
      });
    } catch (error) {
      toast.error('Không thể gửi đánh giá');
    } finally {
      setIsVoting(false);
    }
  };

  if (hasVoted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPopup(!showPopup)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Đánh giá câu đố"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-4 min-w-[200px] z-[60]"
            style={{
              transformOrigin: 'bottom right',
            }}
          >
            {/* Arrow pointing down */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45"></div>

            <div className="relative z-10">
              <p className="text-sm font-semibold text-gray-800 mb-3 text-center">
                Bạn thích câu đố này?
              </p>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote(true)}
                  disabled={isVoting}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg py-2 px-3 transition-colors disabled:opacity-50"
                >
                  <ThumbsUp size={18} />
                  <span className="text-sm font-medium">Thích</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote(false)}
                  disabled={isVoting}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg py-2 px-3 transition-colors disabled:opacity-50"
                >
                  <ThumbsDown size={18} />
                  <span className="text-sm font-medium">Không</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

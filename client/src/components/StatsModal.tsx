import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, TrendingUp, Clock, Calendar, RotateCcw } from 'lucide-react';
import { getStats, resetStats } from '../utils/localStorage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const stats = getStats();
  
  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ thống kê? Hành động này không thể hoàn tác!')) {
      resetStats();
      forceUpdate();
    }
  };
  
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
    
  const formatTime = (seconds: number) => {
    if (seconds === 0) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📊 Thống kê</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="stat-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600">Số trận</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.gamesPlayed}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="stat-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="text-yellow-500" size={20} />
                  <span className="text-sm text-gray-600">Tỷ lệ thắng</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{winRate}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="stat-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-500" size={20} />
                  <span className="text-sm text-gray-600">Chuỗi hiện tại</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.currentStreak}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="stat-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-500" size={20} />
                  <span className="text-sm text-gray-600">Kỷ lục</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatTime(stats.bestTime)}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Điểm cao nhất</span>
                <span className="font-bold text-xl text-orange-600">{stats.bestScore || 0}</span>
              </div>
            </motion.div>

            {/* Reset Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Xóa toàn bộ thống kê
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

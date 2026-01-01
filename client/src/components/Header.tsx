import React from 'react';
import { motion } from 'framer-motion';
import { Archive, Sparkles, BarChart2, Info } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { OverallDifficulty } from '../../../shared/Types';

interface HeaderProps {
  onOpenStats: () => void;
  onOpenHowToPlay: () => void;
  overallDifficulty?: OverallDifficulty;
}

const difficultyLabels: Record<OverallDifficulty, string> = {
  'easy': 'Dễ',
  'medium': 'Trung bình',
  'hard': 'Khó',
  'brain-teaser': 'Căng não'
};

const difficultyColors: Record<OverallDifficulty, string> = {
  'easy': 'bg-green-500',
  'medium': 'bg-yellow-500',
  'hard': 'bg-orange-500',
  'brain-teaser': 'bg-red-500'
};

export const Header: React.FC<HeaderProps> = ({ onOpenStats, onOpenHowToPlay, overallDifficulty }) => {
  const { gameMode, setGameMode } = useGameStore();

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top bar - horizontal layout */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connections
            </h1>
          </motion.div>

          {/* Center: Mode selector */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setGameMode('archive')}
              className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all flex items-center gap-2 ${
                gameMode === 'archive'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Archive size={16} />
              Kho lưu trữ
            </button>
            <button
              onClick={() => setGameMode('random')}
              className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all flex items-center gap-2 ${
                gameMode === 'random'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Sparkles size={16} />
              Tạo ngẫu nhiên
            </button>
          </div>

          {/* Right: Action buttons + Difficulty */}
          <div className="flex items-center gap-3">
            {overallDifficulty && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${difficultyColors[overallDifficulty]}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {difficultyLabels[overallDifficulty]}
                </span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenStats}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Thống kê"
            >
              <BarChart2 size={20} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenHowToPlay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Cách chơi"
            >
              <Info size={20} className="text-gray-700" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

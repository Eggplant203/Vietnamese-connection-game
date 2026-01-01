import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Target, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { updateStats } from '../utils/localStorage';
import Confetti from 'react-confetti';

interface FlipCardProps {
  group: {
    id: string;
    theme: string;
    color: string;
    words: { text: string }[];
  };
  delay: number;
}

const FlipCard: React.FC<FlipCardProps> = ({ group, delay }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const bgColor = 
    group.color === 'green' ? 'bg-green-500' :
    group.color === 'yellow' ? 'bg-yellow-500' :
    group.color === 'purple' ? 'bg-purple-500' :
    'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-20 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front - Theme */}
        <div
          className={`absolute inset-0 ${bgColor} text-white rounded-lg p-4 flex items-center justify-center shadow-lg`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <p className="font-bold text-xl uppercase text-center">{group.theme}</p>
        </div>

        {/* Back - Words */}
        <div
          className={`absolute inset-0 ${bgColor} text-white rounded-lg p-4 flex items-center justify-center shadow-lg`}
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-base font-medium text-center">
            {group.words.map((w) => w.text).join(' • ')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const GameOverModal: React.FC = () => {
  const {
    isComplete,
    isFailed,
    foundGroups,
    attempts,
    completionTime,
    currentPuzzle,
    showConfetti,
  } = useGameStore();

  const [currentTab, setCurrentTab] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  // Update localStorage stats when game ends
  React.useEffect(() => {
    if (isComplete && completionTime) {
      const finalScore = Math.max(100, 1000 - (attempts - 1) * 200 - completionTime);
      updateStats(true, completionTime, finalScore);
    } else if (isFailed) {
      updateStats(false, 0);
    }
  }, [isComplete, isFailed, completionTime, attempts]);

  if (!isComplete && !isFailed) return null;

  const score = isComplete && completionTime
    ? Math.max(100, 1000 - (attempts - 1) * 200 - completionTime)
    : 0;

  return (
    <>
      {showConfetti && isComplete && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHidden ? 0 : 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setIsMouseDown(true);
            setIsHidden(true);
          }
        }}
        onMouseUp={() => {
          if (isMouseDown) {
            setIsMouseDown(false);
            setIsHidden(false);
          }
        }}
        onMouseLeave={() => {
          if (isMouseDown) {
            setIsMouseDown(false);
            setIsHidden(false);
          }
        }}
      >
        <AnimatePresence mode="wait">
          {!isHidden && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="text-center mb-4">
                {isComplete ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="inline-block mb-2"
                    >
                      <Trophy className="w-16 h-16 text-yellow-500" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      🎉 Chúc mừng!
                    </h2>
                    <p className="text-sm text-gray-600">Bạn đã hoàn thành câu đố!</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="inline-block mb-2 text-5xl"
                    >
                      😢
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      Hết lượt rồi!
                    </h2>
                    <p className="text-sm text-gray-600">Đừng bỏ cuộc, thử lại nhé!</p>
                  </>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTab(0)}
                  disabled={currentTab === 0}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </motion.button>

                <div className="flex items-center gap-2">
                  {[0, 1].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setCurrentTab(tab)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentTab === tab ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTab(1)}
                  disabled={currentTab === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {currentTab === 0 ? (
                    <motion.div
                      key="tab0"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isComplete ? (
                        /* Tab 0 khi THẮNG: Chỉ hiện điểm số */
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="stat-card text-center bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400"
                        >
                          <Trophy className="text-yellow-600 mx-auto mb-1" size={28} />
                          <span className="text-xs text-gray-700 block mb-1">Điểm số</span>
                          <p className="text-3xl font-bold text-yellow-700">{score}</p>
                          <p className="text-xs text-gray-600 mt-1">Xuất sắc!</p>
                        </motion.div>
                      ) : (
                        /* Tab 0 khi THUA: Hiện Stats */
                        <div className="grid grid-cols-3 gap-3">
                          <div className="stat-card text-center">
                            <Clock className="text-blue-500 mx-auto mb-1" size={20} />
                            <span className="text-xs text-gray-600 block mb-1">Thời gian</span>
                            <p className="text-xl font-bold text-gray-800">
                              {completionTime ? `${Math.floor(completionTime / 60)}:${(completionTime % 60).toString().padStart(2, '0')}` : '--'}
                            </p>
                          </div>

                          <div className="stat-card text-center">
                            <Target className="text-red-500 mx-auto mb-1" size={20} />
                            <span className="text-xs text-gray-600 block mb-1">Số lần thử</span>
                            <p className="text-xl font-bold text-gray-800">{attempts}</p>
                          </div>

                          <div className="stat-card text-center">
                            <TrendingUp className="text-green-500 mx-auto mb-1" size={20} />
                            <span className="text-xs text-gray-600 block mb-1">Đã tìm</span>
                            <p className="text-xl font-bold text-gray-800">
                              {foundGroups.length}/4
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tab1"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isComplete ? (
                        /* Tab 1 khi THẮNG: Stats */
                        <div className="grid grid-cols-3 gap-3">
                          <div className="stat-card text-center">
                            <Clock className="text-blue-500 mx-auto mb-1" size={20} />
                            <span className="text-xs text-gray-600 block mb-1">Thời gian</span>
                            <p className="text-xl font-bold text-gray-800">
                              {completionTime ? `${Math.floor(completionTime / 60)}:${(completionTime % 60).toString().padStart(2, '0')}` : '--'}
                            </p>
                          </div>

                          <div className="stat-card text-center">
                            <Target className="text-red-500 mx-auto mb-1" size={20} />
                            <span className="text-xs text-gray-600 block mb-1">Số lần thử</span>
                            <p className="text-xl font-bold text-gray-800">{attempts}</p>
                          </div>

                          <div className="stat-card text-center">
                            <TrendingUp className="text-green-500 mx-auto mb-1" size={20} />
                            <span className="text-xs text-gray-600 block mb-1">Đã tìm</span>
                            <p className="text-xl font-bold text-gray-800">
                              {foundGroups.length}/4
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Tab 1 khi THUA: Đáp án */
                        currentPuzzle && (
                          <div>
                            <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">Đáp án đúng</h3>
                            <div className="space-y-3">
                              {currentPuzzle.groups.map((group, index) => (
                                <FlipCard key={group.id} group={group} delay={index * 0.1} />
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="btn-primary flex-1"
                >
                  Chơi tiếp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const text = isComplete
                      ? `🎉 Tôi đã hoàn thành Vietnamese Connections với ${attempts} lần thử và ${score} điểm!`
                      : `Tôi đã thử Vietnamese Connections! Bạn có làm được không?`;
                    
                    if (navigator.share) {
                      navigator.share({ text });
                    } else {
                      navigator.clipboard.writeText(text);
                      alert('Đã copy vào clipboard!');
                    }
                  }}
                  className="btn-secondary"
                >
                  Chia sẻ
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

import React from 'react';
import { GameBoard } from '../components/GameBoard';
import { GameControls } from '../components/GameControls';
import { GameOverModal } from '../components/GameOverModal';
import { StatsModal } from '../components/StatsModal';
import { HowToPlayModal } from '../components/HowToPlayModal';
import { Header } from '../components/Header';
import { InlineLoader } from '../components/InlineLoader';
import { RatingButton } from '../components/RatingButton';
import { useGameStore } from '../store/gameStore';
import { puzzleAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const GamePage: React.FC = () => {
  const {
    currentPuzzle,
    setPuzzle,
    setLoading,
    isLoading,
    gameMode,
    selectedWords,
  } = useGameStore();

  const [showStats, setShowStats] = React.useState(false);
  const [showHowToPlay, setShowHowToPlay] = React.useState(false);

  // Load puzzle when mode changes
  React.useEffect(() => {
    let cancelled = false;

    const loadPuzzle = async () => {
      setLoading(true);
      
      try {
        const puzzle =
          gameMode === 'archive'
            ? await puzzleAPI.getArchivePuzzle()
            : await puzzleAPI.getRandomPuzzle();
        
        if (cancelled) return; // Don't update if component unmounted
        
        if (!puzzle) {
          const errorMsg = gameMode === 'archive' 
            ? 'Không có dữ liệu trong database. Vui lòng thêm puzzle từ trang Admin!'
            : 'Không thể tạo puzzle từ AI. Vui lòng kiểm tra API key!';
          toast.error(errorMsg);
          return;
        }
        
        setPuzzle(puzzle);
      } catch (error: any) {
        if (cancelled) return; // Don't update if component unmounted
        
        const errorMsg = error?.response?.data?.error 
          || (gameMode === 'archive' 
              ? 'Lỗi kết nối database. Vui lòng kiểm tra kết nối!' 
              : 'Lỗi khi tạo puzzle từ AI. Vui lòng kiểm tra GEMINI_API_KEY!');
        toast.error(errorMsg);
        console.error('Failed to load puzzle:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPuzzle();

    return () => {
      cancelled = true; // Cleanup: prevent state updates if component unmounts
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode]); // setPuzzle and setLoading are stable Zustand functions

  const loadingMessage = gameMode === 'archive' 
    ? 'Đang tải câu đố từ kho lưu trữ...' 
    : 'AI đang tạo câu đố mới...';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onOpenStats={() => setShowStats(true)} 
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          overallDifficulty={currentPuzzle?.overallDifficulty}
        />

        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            {/* Title */}
            {currentPuzzle?.gameName && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentPuzzle.gameName}
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedWords.length > 0 
                    ? `Đã chọn ${selectedWords.length}/4 từ`
                    : 'Tìm 4 nhóm từ có liên quan. Bạn có 4 lần thử!'}
                </p>
              </motion.div>
            )}

            {/* Loading or Game board */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <InlineLoader key="loader" message={loadingMessage} />
              ) : (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GameBoard />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-6">
              <GameControls />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Game over modal */}
      <GameOverModal />

      {/* Stats modal */}
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />

      {/* How to play modal */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      {/* Rating button */}
      {currentPuzzle && !isLoading && (
        <RatingButton puzzleId={currentPuzzle.id} />
      )}
    </>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
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
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Info className="text-blue-500" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">Cách chơi</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Goal */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">🎯 Mục tiêu</h3>
                <p className="text-gray-600">
                  Tìm các nhóm gồm 4 từ có chung một chủ đề hoặc thuộc tính.
                </p>
              </div>

              {/* How to Play */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">🎮 Cách chơi</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Click vào 4 từ bạn nghĩ có chung chủ đề</li>
                  <li>Nhấn nút "Gửi đáp án" để kiểm tra</li>
                  <li>Nếu đúng, nhóm sẽ được hiển thị với màu tương ứng</li>
                  <li>Nếu sai, bạn mất 1 lượt thử (tối đa 4 lần sai)</li>
                  <li>Tiếp tục cho đến khi tìm được tất cả 4 nhóm</li>
                </ol>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">📊 Độ khó</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Dễ</p>
                      <p className="text-sm text-gray-600">Chủ đề rõ ràng, dễ nhận biết</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Trung bình</p>
                      <p className="text-sm text-gray-600">Cần suy nghĩ một chút</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Khó</p>
                      <p className="text-sm text-gray-600">Yêu cầu hiểu biết rộng</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Rất khó</p>
                      <p className="text-sm text-gray-600">Liên tưởng tinh tế</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">💡 Mẹo</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Bắt đầu với nhóm dễ nhất (màu xanh)</li>
                  <li>Tìm các từ có liên quan rõ ràng trước</li>
                  <li>Sử dụng nút "Xáo trộn" để xem từ theo cách khác</li>
                  <li>Chú ý đến các từ có thể thuộc nhiều nhóm</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full btn-primary"
              >
                Bắt đầu chơi!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

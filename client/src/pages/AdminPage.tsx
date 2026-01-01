import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, List, ArrowLeft, Eye, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { AdminPuzzleUpload, OverallDifficulty } from '../../../shared/Types';
import { PuzzleViewModal } from '../components/PuzzleViewModal';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const AdminPage: React.FC = () => {
  const [puzzles, setPuzzles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = React.useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Check authentication on mount
  React.useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    setIsAuthenticated(true);
  }, []);

  const [formData, setFormData] = React.useState<AdminPuzzleUpload>({
    gameName: '',
    overallDifficulty: 'medium',
    groups: [
      { theme: '', words: '', difficulty: 'easy' },
      { theme: '', words: '', difficulty: 'medium' },
      { theme: '', words: '', difficulty: 'hard' },
      { theme: '', words: '', difficulty: 'expert' },
    ]
  });

  const loadPuzzles = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/puzzles`);
      if (response.data.success) {
        setPuzzles(response.data.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách puzzle');
    }
  };

  React.useEffect(() => {
    loadPuzzles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.gameName.trim()) {
      toast.error('Vui lòng nhập tên game');
      return;
    }

    for (let i = 0; i < formData.groups.length; i++) {
      const group = formData.groups[i];
      if (!group.theme.trim()) {
        toast.error(`Vui lòng nhập chủ đề cho nhóm ${i + 1}`);
        return;
      }
      const words = group.words.split(',').map(w => w.trim()).filter(w => w);
      if (words.length !== 4) {
        toast.error(`Nhóm ${i + 1} phải có đúng 4 từ (phân cách bằng dấu phẩy)`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/upload`, formData);
      if (response.data.success) {
        toast.success('Upload puzzle thành công!');
        // Reset form
        setFormData({
          gameName: '',
          overallDifficulty: 'medium',
          groups: [
            { theme: '', words: '', difficulty: 'easy' },
            { theme: '', words: '', difficulty: 'medium' },
            { theme: '', words: '', difficulty: 'hard' },
            { theme: '', words: '', difficulty: 'expert' },
          ]
        });
        loadPuzzles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa puzzle này?')) return;

    try {
      const response = await axios.delete(`${API_URL}/admin/puzzles/${id}`);
      if (response.data.success) {
        toast.success('Đã xóa puzzle');
        loadPuzzles();
      }
    } catch (error) {
      toast.error('Xóa thất bại');
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const response = await axios.post(`${API_URL}/admin/verify/${id}`);
      if (response.data.success) {
        toast.success('Đã duyệt puzzle');
        loadPuzzles();
      }
    } catch (error) {
      toast.error('Duyệt thất bại');
    }
  };

  if (!isAuthenticated) {
    return null; // hoặc loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {selectedPuzzle && (
        <PuzzleViewModal
          puzzle={selectedPuzzle}
          onClose={() => setSelectedPuzzle(null)}
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Quản lý Puzzles</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                Đăng xuất
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Về trang chủ
              </motion.button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={24} />
              Upload Puzzle Mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Game
                </label>
                <input
                  type="text"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Ẩm thực Việt Nam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó tổng thể
                </label>
                <select
                  value={formData.overallDifficulty}
                  onChange={(e) => setFormData({ ...formData, overallDifficulty: e.target.value as OverallDifficulty })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                  <option value="brain-teaser">Căng não</option>
                </select>
              </div>

              {formData.groups.map((group, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Nhóm {index + 1} ({group.difficulty})
                  </h3>
                  <input
                    type="text"
                    value={group.theme}
                    onChange={(e) => {
                      const newGroups = [...formData.groups];
                      newGroups[index].theme = e.target.value;
                      setFormData({ ...formData, groups: newGroups });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                    placeholder="Chủ đề nhóm"
                  />
                  <input
                    type="text"
                    value={group.words}
                    onChange={(e) => {
                      const newGroups = [...formData.groups];
                      newGroups[index].words = e.target.value;
                      setFormData({ ...formData, groups: newGroups });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="4 từ, phân cách bằng dấu phẩy (VD: phở, bún, bánh mì, cơm)"
                  />
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary"
              >
                {loading ? 'Đang upload...' : 'Upload Puzzle'}
              </motion.button>
            </form>
          </div>

          {/* Puzzle List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <List size={24} />
              Danh sách Puzzles ({puzzles.length})
            </h2>

            <div className="space-y-3 overflow-y-auto">
              {puzzles.map((puzzle) => (
                <div
                  key={puzzle.id}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    puzzle.verified 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{puzzle.gameName || puzzle.id}</h3>
                        {puzzle.verified && (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                            ✓ Đã duyệt
                          </span>
                        )}
                        {!puzzle.verified && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                            Chờ duyệt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Độ khó: <span className="font-medium">{puzzle.overallDifficulty || 'N/A'}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(puzzle.createdAt).toLocaleDateString('vi-VN')}
                        {puzzle.createdBy && ` • Tạo bởi: ${puzzle.createdBy}`}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedPuzzle(puzzle)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </motion.button>
                      
                      {!puzzle.verified && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerify(puzzle.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded"
                          title="Duyệt puzzle"
                        >
                          <Check size={18} />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(puzzle.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        title="Xóa puzzle"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
              {puzzles.length === 0 && (
                <p className="text-center text-gray-500 py-8">Chưa có puzzle nào</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

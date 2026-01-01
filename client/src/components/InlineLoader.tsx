import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface InlineLoaderProps {
  message?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({ message = 'Đang tải...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </motion.div>
  );
};

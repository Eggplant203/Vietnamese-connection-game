import React from 'react';
import { motion } from 'framer-motion';
import type { Group } from '@shared/Types';
import clsx from 'clsx';

interface GroupCardProps {
  group: Group;
  index: number;
}

const colorClasses = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
};

export const GroupCard: React.FC<GroupCardProps> = ({ group, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={clsx('group-card', colorClasses[group.color])}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">
          {group.theme}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {group.words.map((word) => (
            <span
              key={word.id}
              className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium"
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

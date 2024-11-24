import { motion } from 'framer-motion';
import { Minus, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Player } from '../types/player';

interface PlayerCardProps {
  player: Player;
  incrementValue: number;
  onUpdate: (score: number) => void;
  onRemove: () => void;
}

export function PlayerCard({ player, incrementValue, onUpdate, onRemove }: PlayerCardProps) {
  const [customScore, setCustomScore] = useState('');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${player.color} p-6 rounded-xl shadow-lg text-white`}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h2 
          className="text-2xl font-bold"
          layoutId={`name-${player.id}`}
        >
          {player.name}
        </motion.h2>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <motion.div
        layout
        className="text-4xl font-bold text-center my-6"
        animate={{ scale: [1, 1.1, 1] }}
        key={player.score}
      >
        {player.score}
      </motion.div>

      <div className="flex gap-2 mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdate(-incrementValue)}
          className="flex-1 flex items-center justify-center gap-2 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors"
        >
          <Minus size={20} /> {incrementValue}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdate(incrementValue)}
          className="flex-1 flex items-center justify-center gap-2 bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors"
        >
          <Plus size={20} /> {incrementValue}
        </motion.button>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={customScore}
          onChange={(e) => setCustomScore(e.target.value)}
          placeholder="Custom score"
          className="flex-1 bg-white/20 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (customScore) {
              onUpdate(parseInt(customScore));
              setCustomScore('');
            }
          }}
          className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors"
        >
          Add
        </motion.button>
      </div>

      {player.history.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <RotateCcw size={14} />
            History
          </div>
          <div className="mt-2 text-sm space-x-2">
            {player.history.slice(-3).map((score, index) => (
              <span key={index} className="bg-white/20 px-2 py-1 rounded">
                {score}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
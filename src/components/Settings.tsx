import { motion } from 'framer-motion';
import { RotateCcw, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { GameSettings } from '../types/player';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  onAddPlayer: (name: string) => void;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Settings({
  settings,
  onSettingsChange,
  onAddPlayer,
  onNewGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="fixed bottom-24 right-4 z-20">
      <div className="absolute bottom-full right-0 mb-4 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onUndo}
          disabled={!canUndo}
          className={`bg-gray-800 text-white p-3 rounded-full shadow-lg ${
            !canUndo ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw size={20} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRedo}
          disabled={!canRedo}
          className={`bg-gray-800 text-white p-3 rounded-full shadow-lg ${
            !canRedo ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw size={20} className="transform scale-x-[-1]" />
        </motion.button>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-4 rounded-full shadow-lg"
      >
        <Settings2 size={24} />
      </motion.button>

      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className={`absolute bottom-full right-0 mb-20 bg-white p-6 rounded-xl shadow-xl w-80 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <h3 className="text-lg font-bold mb-4">Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Increment Value
            </label>
            <input
              type="number"
              value={settings.incrementValue}
              onChange={(e) =>
                onSettingsChange({ incrementValue: Math.max(1, parseInt(e.target.value) || 1) })
              }
              className="w-full border rounded-lg p-2"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Score
            </label>
            <input
              type="number"
              value={settings.maxScore || ''}
              onChange={(e) =>
                onSettingsChange({
                  maxScore: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="No limit"
              className="w-full border rounded-lg p-2"
              min="1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="reverseScore"
              checked={settings.isReversed}
              onChange={(e) => onSettingsChange({ isReversed: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="reverseScore" className="text-sm font-medium text-gray-700">
              Reverse Score (Lower Wins)
            </label>
          </div>

          <div className='border rounded-md bg-slate-50 p-3'>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Player
            </label>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name"
                className="flex-1 border rounded-lg p-2"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (playerName.trim()) {
                    onAddPlayer(playerName.trim());
                    setPlayerName('');
                  }
                }}
                className="bg-blue-500 text-white text-sm px-4 py-1 rounded-lg"
              >
                Add player
              </motion.button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNewGame}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            New Game
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
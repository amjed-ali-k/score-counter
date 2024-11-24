import { motion } from 'framer-motion';
import { Download, Upload } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function GameControls() {
  const { gameHistory, exportHistory, importHistory, resumeGame } = useGameStore();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importHistory(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const data = exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dominos-scores-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleImport}
        className="bg-gray-800 text-sm invisible xl:visible text-white px-2 rounded-lg shadow-lg flex items-center gap-2"
      >
        <Upload size={20} />
        Import
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleExport}
        className="bg-gray-800 text-white p-3 rounded-lg shadow-lg invisible xl:visible flex items-center gap-2"
      >
        <Download size={20} />
        Export
      </motion.button>

      {gameHistory.length > 0 && (
        <div className="absolute top-full mt-2 bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Games</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {gameHistory.map((game) => (
              <motion.button
                key={game.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => resumeGame(game.id)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded-lg text-sm"
              >
                {new Date(game.timestamp).toLocaleDateString()} -{' '}
                {game.players.length} players
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
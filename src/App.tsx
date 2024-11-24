import { AnimatePresence, motion } from "framer-motion";
import { Dices } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import { Footer } from "./components/Footer";
import { GameControls } from "./components/GameControls";
import { PlayerCard } from "./components/PlayerCard";
import { Settings } from "./components/Settings";
import { useGameStore } from "./store/useGameStore";
import { BackgroundLines } from "./components/background";

function App() {
  const {
    currentGame,
    addPlayer,
    removePlayer,
    updateScore,
    updateSettings,
    startNewGame,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useGameStore();

  const { players, settings, winner } = currentGame;
  const hasShownConfetti = useRef(false);

  useEffect(() => {
    if (winner && !hasShownConfetti.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      hasShownConfetti.current = true;
    } else if (!winner) {
      hasShownConfetti.current = false;
    }
  }, [winner]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 pb-32">
      <GameControls />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <Dices className="w-8 h-8 text-gray-800" />
          <h1 className="text-3xl font-bold text-gray-800">
            Game Score Counter
          </h1>
        </div>

        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl text-white text-center shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2">🎉 We have a winner! 🎉</h2>
            <p className="text-xl">
              Congratulations to {winner.name} with a score of {winner.score}!
            </p>
          </motion.div>
        )}

        {players.length === 0 ? (
          <BackgroundLines>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-12"
            >
              {/* <WelcomeAnimation /> */}
              <p className="text-xl mt-8">
                Welcome! Add players in settings to start the game.
              </p>
            </motion.div>
          </BackgroundLines>
        ) : (
          <motion.div
            layout
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  incrementValue={settings.incrementValue}
                  onUpdate={(score) => updateScore(player.id, score)}
                  onRemove={() => removePlayer(player.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      <Settings
        settings={settings}
        onSettingsChange={updateSettings}
        onAddPlayer={addPlayer}
        onNewGame={startNewGame}
        onUndo={undo}
        onRedo={redo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      <Footer />
    </div>
  );
}

export default App;

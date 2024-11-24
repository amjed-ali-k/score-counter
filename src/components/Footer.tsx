import { Github, Instagram, Star, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 text-center z-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600">
          Created with ❤️ by Amjed Ali K
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/amjed-ali-k"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://twitter.com/amjedalik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://instagram.com/amjed.ali.k"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://github.com/amjed-ali-k/game-score-counter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Star size={20} />
            <span className="text-sm">Star on GitHub</span>
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
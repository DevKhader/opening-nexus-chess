
import { useState } from 'react';
import { Chess } from 'chess.js';
import { Link } from 'react-router-dom';
import { Undo } from 'lucide-react';
import ChessBoard from './ChessBoard';

const HomePage = () => {
  const [game] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const handleMove = (move: string) => {
    setMoveHistory(prev => [...prev, move]);
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      game.undo();
      setMoveHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Chess Openings Hub
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Master your chess openings with our comprehensive database
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Practice Board</h2>
            <p className="text-slate-300 mb-6">
              Practice your moves on our interactive chess board. Make moves by clicking and dragging pieces.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <ChessBoard game={game} isInteractive={true} onMove={handleMove} />
              <button
                onClick={handleUndo}
                disabled={moveHistory.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Undo size={20} />
                <span>Undo Move</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Explore Openings</h3>
            <p className="text-emerald-100 mb-6">
              Discover hundreds of chess openings with detailed analysis, variations, and move-by-move explanations.
            </p>
            <Link
              to="/openings"
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors duration-200"
            >
              Browse Openings
            </Link>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Features</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Interactive chess board for practice</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Comprehensive opening database</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Move-by-move analysis</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Variations and sub-lines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

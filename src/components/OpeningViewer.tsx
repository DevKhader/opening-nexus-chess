
import { useState } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, ArrowRight, RotateCcw, ArrowLeft as BackIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ChessBoard from './ChessBoard';

const OpeningViewer = () => {
  const { id } = useParams();
  const [game] = useState(new Chess());
  const [currentMove, setCurrentMove] = useState(0);
  
  // Mock data - in real app this would come from database
  const mockMoves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6'];
  const mockVariations = {
    1: [{ name: 'French Defense', moves: ['e6', 'd4', 'Nf6'] }], // Variation at move 1 (after e4)
    3: [{ name: 'Petrov Defense', moves: ['Nf6', 'Nxe5', 'd6'] }] // Variation at move 3 (after Nf3)
  };

  const handleNext = () => {
    if (currentMove < mockMoves.length) {
      try {
        game.move(mockMoves[currentMove]);
        setCurrentMove(currentMove + 1);
      } catch (error) {
        console.error('Invalid move:', error);
      }
    }
  };

  const handlePrev = () => {
    if (currentMove > 0) {
      game.undo();
      setCurrentMove(currentMove - 1);
    }
  };

  const handleReset = () => {
    game.reset();
    setCurrentMove(0);
  };

  const handleVariation = (variation: any) => {
    // Implementation for playing variations would go here
    console.log('Playing variation:', variation);
  };

  const formatMoveNumber = (index: number) => {
    return Math.floor(index / 2) + 1;
  };

  const isWhiteMove = (index: number) => {
    return index % 2 === 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link
          to="/openings"
          className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
        >
          <BackIcon size={20} />
          <span>Back to Openings</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-8">Sicilian Defense</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <ChessBoard game={game} isInteractive={false} />
            
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentMove === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>Prev</span>
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentMove >= mockMoves.length}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Move List</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockMoves.map((move, index) => {
              const moveNumber = formatMoveNumber(index);
              const isWhite = isWhiteMove(index);
              const isCurrentMove = index === currentMove - 1;
              const hasVariation = mockVariations[index + 1];

              return (
                <div key={index} className="space-y-1">
                  <div className={`flex items-center space-x-2 p-2 rounded ${
                    isCurrentMove ? 'bg-emerald-600' : 'hover:bg-slate-700'
                  } transition-colors duration-200`}>
                    {isWhite && (
                      <span className="text-slate-400 font-medium w-8">
                        {moveNumber}.
                      </span>
                    )}
                    <span className="text-white font-mono">{move}</span>
                    {index < currentMove && (
                      <span className="text-emerald-400 text-xs">✓</span>
                    )}
                  </div>
                  
                  {hasVariation && index < currentMove && (
                    <div className="ml-6 space-y-1">
                      {hasVariation.map((variation: any, vIndex: number) => (
                        <button
                          key={vIndex}
                          onClick={() => handleVariation(variation)}
                          className="block w-full text-left px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                        >
                          {variation.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningViewer;

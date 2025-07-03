import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, ArrowRight, RotateCcw, ArrowLeft as BackIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ChessBoard from './ChessBoard';

interface Opening {
  id: string;
  name: string;
  moves: string[];
  variations: Array<{
    name: string;
    startMove: number;
    moves: string[];
  }>;
  description: string;
}

const OpeningViewer = () => {
  const { id } = useParams();
  const [game] = useState(new Chess());
  const [currentMove, setCurrentMove] = useState(0);
  const [opening, setOpening] = useState<Opening | null>(null);
  const [currentVariation, setCurrentVariation] = useState<string[] | null>(null);
  const [variationStartMove, setVariationStartMove] = useState(0);
  const [mainLinePosition, setMainLinePosition] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(`https://chess-opening.onrender.com/api/openings/${id}`)
        .then((res) => res.json())
        .then((data) => setOpening(data))
        .catch(() => setOpening(null));
    }
  }, [id]);

  if (!opening) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl text-white">Opening not found</h1>
          <Link
            to="/openings"
            className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200 mt-4"
          >
            <BackIcon size={20} />
            <span>Back to Openings</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentMoves = currentVariation || opening.moves;

  const handleNext = () => {
    if (currentMove < currentMoves.length) {
      try {
        game.move(currentMoves[currentMove]);
        setCurrentMove(currentMove + 1);
        if (!currentVariation) setMainLinePosition(currentMove + 1);
      } catch (error) {
        console.error('Invalid move:', error);
      }
    }
  };

  const handlePrev = () => {
    if (currentMove > 0) {
      game.undo();
      setCurrentMove(currentMove - 1);
      if (!currentVariation) setMainLinePosition(currentMove - 1);
    }
  };

  const handleReset = () => {
    game.reset();
    setCurrentMove(0);
    setCurrentVariation(null);
    setVariationStartMove(0);
    setMainLinePosition(0);
  };

  const handleVariation = (variation: any) => {
    if (!currentVariation) setMainLinePosition(currentMove);
    game.reset();
    for (let i = 0; i < variation.startMove; i++) {
      if (i < opening.moves.length) {
        try {
          game.move(opening.moves[i]);
        } catch (error) {
          console.error('Error playing main line move:', error);
        }
      }
    }
    setCurrentVariation(variation.moves);
    setVariationStartMove(variation.startMove);
    setCurrentMove(0);
  };

  const handleBackToMainLine = () => {
    setCurrentVariation(null);
    setVariationStartMove(0);
    game.reset();
    for (let i = 0; i < mainLinePosition; i++) {
      if (i < opening.moves.length) {
        try {
          game.move(opening.moves[i]);
        } catch (error) {
          console.error('Error replaying main line move:', error);
        }
      }
    }
    setCurrentMove(mainLinePosition);
  };

  const formatMoveNumber = (index: number) => Math.floor(index / 2) + 1;
  const isWhiteMove = (index: number) => index % 2 === 0;
  const getVariationsAtMove = (moveIndex: number) =>
    opening.variations.filter((variation) => variation.startMove === moveIndex + 1);

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

      <h1 className="text-3xl font-bold text-white mb-8">
        {opening.name}
        {currentVariation && (
          <span className="text-emerald-400 text-xl ml-4">
            - {opening.variations.find((v) => v.moves === currentVariation)?.name}
          </span>
        )}
      </h1>

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
                disabled={currentMove >= currentMoves.length}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">
            {currentVariation ? 'Variation Moves' : 'Main Line'}
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentMoves.map((move, index) => {
              const moveNumber = formatMoveNumber(variationStartMove + index);
              const isWhite = isWhiteMove(variationStartMove + index);
              const isCurrentMove = index === currentMove - 1;
              const hasVariation = !currentVariation && getVariationsAtMove(variationStartMove + index).length > 0;

              return (
                <div key={index} className="space-y-1">
                  <div
                    className={`flex items-center space-x-2 p-2 rounded ${
                      isCurrentMove ? 'bg-emerald-600' : 'hover:bg-slate-700'
                    } transition-colors duration-200`}
                  >
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
                      {getVariationsAtMove(variationStartMove + index).map((variation, vIndex) => (
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

          {currentVariation && (
            <button
              onClick={handleBackToMainLine}
              className="mt-4 w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors duration-200"
            >
              Back to Main Line
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpeningViewer;

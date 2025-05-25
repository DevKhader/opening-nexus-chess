
import { useState, useCallback } from 'react';
import { Chess, Square } from 'chess.js';

interface ChessBoardProps {
  game: Chess;
  isInteractive?: boolean;
  onMove?: (move: string) => void;
}

const ChessBoard = ({ game, isInteractive = false, onMove }: ChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  const board = game.board();

  const handleSquareClick = useCallback((square: Square) => {
    if (!isInteractive) return;

    if (selectedSquare === null) {
      // Select a piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: false }));
      }
    } else {
      // Try to make a move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // Always promote to queen for simplicity
        });
        
        if (move) {
          onMove?.(move.san);
        }
      } catch (error) {
        // Invalid move
      }
      
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  }, [game, selectedSquare, isInteractive, onMove]);

  const getPieceSymbol = (piece: any) => {
    if (!piece) return '';
    
    const symbols: { [key: string]: string } = {
      'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
      'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
    };
    
    return symbols[piece.color + piece.type] || '';
  };

  const getSquareName = (row: number, col: number): Square => {
    const files = 'abcdefgh';
    const ranks = '87654321';
    return (files[col] + ranks[row]) as Square;
  };

  const isSquareHighlighted = (square: Square) => {
    return selectedSquare === square;
  };

  const isPossibleMove = (square: Square) => {
    return possibleMoves.some(move => move.includes(square));
  };

  return (
    <div className="inline-block">
      <div className="grid grid-cols-8 gap-0 border-4 border-slate-600 rounded-lg overflow-hidden bg-slate-600">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square = getSquareName(rowIndex, colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isHighlighted = isSquareHighlighted(square);
            const canMove = isPossibleMove(square);
            
            return (
              <div
                key={square}
                className={`
                  w-16 h-16 flex items-center justify-center text-4xl font-bold cursor-pointer relative
                  ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                  ${isHighlighted ? 'ring-4 ring-emerald-500' : ''}
                  ${canMove ? 'ring-2 ring-emerald-300' : ''}
                  ${isInteractive ? 'hover:brightness-110' : ''}
                  transition-all duration-150
                `}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <span 
                    className={`
                      select-none 
                      ${piece.color === 'w' ? 'text-white' : 'text-black'}
                      drop-shadow-lg
                    `}
                    style={{ 
                      textShadow: piece.color === 'w' 
                        ? '1px 1px 2px rgba(0,0,0,0.8)' 
                        : '1px 1px 2px rgba(255,255,255,0.8)' 
                    }}
                  >
                    {getPieceSymbol(piece)}
                  </span>
                )}
                {canMove && !piece && (
                  <div className="w-4 h-4 bg-emerald-500 rounded-full opacity-70"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;

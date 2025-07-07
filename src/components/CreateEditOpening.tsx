import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Save, Undo, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ChessBoard from './ChessBoard';

const CreateEditOpening = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [game] = useState(new Chess());
  const [openingName, setOpeningName] = useState('');
  const [openingDescription, setOpeningDescription] = useState('');
  const [category, setCategory] = useState('');
  const [moves, setMoves] = useState<string[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [isAddingVariation, setIsAddingVariation] = useState(false);
  const [variationMoves, setVariationMoves] = useState<string[]>([]);
  const [variationDescription, setVariationDescription] = useState('');
  const [variationStartMove, setVariationStartMove] = useState(0);

  useEffect(() => {
    if (isEdit && id) {
      const fetchOpening = async () => {
        const res = await fetch(`https://chess-opening.onrender.com/api/openings/${id}`);
        const data = await res.json();
        setOpeningName(data.name);
        setOpeningDescription(data.description);
        setCategory(data.category || '');
        setMoves(data.moves);
        setVariations(data.variations);
        game.reset();
        data.moves.forEach((move: string) => game.move(move));
      };
      fetchOpening();
    }
  }, [isEdit, id]);

  const handleMove = (move: string) => {
    if (isAddingVariation) {
      setVariationMoves([...variationMoves, move]);
    } else {
      setMoves([...moves, move]);
    }
  };

  const handleUndo = () => {
    game.undo();
    if (isAddingVariation) {
      setVariationMoves((prev) => prev.slice(0, -1));
    } else {
      setMoves((prev) => prev.slice(0, -1));
    }
  };

  const handleAddVariation = () => {
    setIsAddingVariation(true);
    setVariationStartMove(moves.length);
    setVariationMoves([]);
  };

  const handleSaveVariation = () => {
    if (variationMoves.length === 0) {
      setIsAddingVariation(false);
      return;
    }

    const variationName = prompt('Enter variation name:');
    if (variationName) {
      setVariations((prev) => [
        ...prev,
        {
          name: variationName,
          startMove: variationStartMove,
          moves: variationMoves,
          description: variationDescription.trim() || ''
        }
      ]);
      game.reset();
      moves.forEach((move) => game.move(move));
      setVariationMoves([]);
      setVariationDescription('');
      setIsAddingVariation(false);
    }
  };

  const handleSaveOpening = async () => {
    if (!openingName.trim() || moves.length === 0) {
      alert('Please provide a name and some moves');
      return;
    }

    const payload = {
      name: openingName,
      description: openingDescription || 'No description provided',
      moves,
      variations,
      category: category || 'Uncategorized'
    };

    const url = isEdit && id
      ? `https://chess-opening.onrender.com/api/openings/${id}`
      : `https://chess-opening.onrender.com/api/openings`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || res.statusText}`);
        return;
      }

      alert(`Opening ${isEdit ? 'updated' : 'saved'} successfully!`);
      navigate('/openings');
    } catch (error) {
      console.error(error);
      alert('Failed to connect to backend.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        {isEdit ? 'Edit Opening' : 'Create New Opening'}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Opening Name</label>
            <input
              type="text"
              value={openingName}
              onChange={(e) => setOpeningName(e.target.value)}
              placeholder="Enter opening name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={openingDescription}
              onChange={(e) => setOpeningDescription(e.target.value)}
              placeholder="Enter opening description..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category (e.g., Vienna Gambit Group)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <ChessBoard game={game} isInteractive={true} onMove={handleMove} />

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleUndo}
                disabled={(isAddingVariation ? variationMoves.length : moves.length) === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Undo size={20} />
                <span>Undo</span>
              </button>

              {!isAddingVariation ? (
                <button
                  onClick={handleAddVariation}
                  disabled={moves.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus size={20} />
                  <span>Add Variation</span>
                </button>
              ) : (
                <>
                  <div className="mt-4">
                    <label className="block text-white text-sm font-medium mb-2">
                      Variation Tip / Description
                    </label>
                    <textarea
                      value={variationDescription}
                      onChange={(e) => setVariationDescription(e.target.value)}
                      placeholder="e.g., This variation aims for rapid kingside pressure..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleSaveVariation}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    <Save size={20} />
                    <span>Save Variation</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveOpening}
              disabled={!openingName.trim() || moves.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Save size={20} />
              <span>{isEdit ? 'Update Opening' : 'Save Opening'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {isAddingVariation ? 'Variation Moves' : 'Main Line'}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(isAddingVariation ? variationMoves : moves).map((move, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-slate-700 rounded">
                  <span className="text-slate-400 font-medium w-8">
                    {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'}
                  </span>
                  <span className="text-white font-mono">{move}</span>
                </div>
              ))}
            </div>
          </div>

          {variations.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Variations</h3>
              <div className="space-y-3">
                {variations.map((variation, index) => (
                  <div key={index} className="p-3 bg-slate-700 rounded-lg">
                    <h4 className="text-emerald-400 font-semibold mb-2">{variation.name}</h4>
                    <div className="text-sm text-slate-300">
                      From move {variation.startMove + 1}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {variation.moves.length} moves
                    </div>
                    {variation.description && (
                      <div className="text-sm text-emerald-300 mt-2 italic">
                        Tip: {variation.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEditOpening;

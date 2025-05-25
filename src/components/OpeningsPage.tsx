
import { useState } from 'react';
import { Search, BookOpen, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OpeningsPageProps {
  isAdmin: boolean;
}

// Mock data for demonstration
const mockOpenings = [
  {
    id: '1',
    name: 'Sicilian Defense',
    mainLineMoves: 8,
    variations: 5,
    description: 'The most popular chess opening'
  },
  {
    id: '2',
    name: 'Queen\'s Gambit',
    mainLineMoves: 6,
    variations: 3,
    description: 'Classical opening for white'
  },
  {
    id: '3',
    name: 'King\'s Indian Defense',
    mainLineMoves: 7,
    variations: 4,
    description: 'Dynamic counterattacking setup'
  }
];

const OpeningsPage = ({ isAdmin }: OpeningsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openings] = useState(mockOpenings);

  const filteredOpenings = openings.filter(opening =>
    opening.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Chess Openings</h1>
        <p className="text-slate-300">Explore and study your favorite chess openings</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search openings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {isAdmin && (
        <div className="mb-6 flex space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <BookOpen size={20} />
            <span>Manage Openings</span>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpenings.map((opening) => (
          <div
            key={opening.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-500 transition-all duration-200 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-white mb-2">{opening.name}</h3>
            <p className="text-slate-300 mb-4">{opening.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Main line moves:</span>
                <span className="text-emerald-400 font-semibold">{opening.mainLineMoves}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Variations:</span>
                <span className="text-emerald-400 font-semibold">{opening.variations}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              {isAdmin ? (
                <>
                  <Link
                    to={`/edit-opening/${opening.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Link>
                  <button className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <Link
                  to={`/opening/${opening.id}`}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <Eye size={16} />
                  <span>Explore</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOpenings.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-slate-600 mb-4" size={64} />
          <p className="text-slate-400 text-lg">No openings found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default OpeningsPage;

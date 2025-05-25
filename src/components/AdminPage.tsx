
import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openingsStore } from '../store/openingsStore';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openings, setOpenings] = useState(openingsStore.getAllOpenings());

  useEffect(() => {
    setOpenings(openingsStore.getAllOpenings());
  }, []);

  const filteredOpenings = openings.filter(opening =>
    opening.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this opening?')) {
      const success = openingsStore.deleteOpening(id);
      if (success) {
        setOpenings(openingsStore.getAllOpenings());
        console.log('Deleted opening:', id);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-300">Manage your chess openings database</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
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

        <Link
          to="/create-opening"
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Plus size={20} />
          <span>Add Opening</span>
        </Link>
      </div>

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
                <span className="text-emerald-400 font-semibold">{opening.moves.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Variations:</span>
                <span className="text-emerald-400 font-semibold">{opening.variations.length}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                to={`/opening/${opening.id}`}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <Eye size={16} />
                <span>Explore</span>
              </Link>
              <Link
                to={`/edit-opening/${opening.id}`}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit size={16} />
                <span>Edit</span>
              </Link>
              <button 
                onClick={() => handleDelete(opening.id)}
                className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;

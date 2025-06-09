
import { Home, BookOpen, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar = ({ isAdmin, onLogin, onLogout }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>
          
          <Link
            to="/openings"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/openings') 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Openings</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAdmin ? (
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
            >
              <LogIn size={20} />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

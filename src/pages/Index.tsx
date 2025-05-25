
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from '../components/HomePage';
import OpeningsPage from '../components/OpeningsPage';
import AdminPage from '../components/AdminPage';
import OpeningViewer from '../components/OpeningViewer';
import CreateEditOpening from '../components/CreateEditOpening';
import LoginModal from '../components/LoginModal';

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Simple admin check (in real app, this would be secure authentication)
    if (username === 'admin' && password === 'chess123') {
      setIsAdmin(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <BrowserRouter>
        <Navbar 
          isAdmin={isAdmin}
          onLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/openings" element={<OpeningsPage isAdmin={isAdmin} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/opening/:id" element={<OpeningViewer />} />
          <Route path="/create-opening" element={<CreateEditOpening />} />
          <Route path="/edit-opening/:id" element={<CreateEditOpening isEdit />} />
        </Routes>
      </BrowserRouter>
      
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Index;

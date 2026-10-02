import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          AI Skin Classification
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-5 h-5" />
            <span className="font-medium">{user.name || 'User'}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

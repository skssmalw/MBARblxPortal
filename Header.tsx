import { useAuth } from '@getmocha/users-service/react';
import { Shield, Crown, LogOut } from 'lucide-react';
import { Link } from 'react-router';
import { ExtendedMochaUser } from '@/shared/types';

export default function Header() {
  const { user, logout, redirectToLogin } = useAuth();
  const extendedUser = user as ExtendedMochaUser | null;

  return (
    <header className="w-full bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-xl border-b-4 border-yellow-400">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-yellow-400 p-2 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <Crown className="h-8 w-8 text-red-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">British Army Corps</h1>
              <p className="text-yellow-200 text-sm">Roblox Regiment Portal</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-200 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/apply" 
              className="text-white hover:text-yellow-200 transition-colors font-medium"
            >
              Apply
            </Link>
            
            {extendedUser?.isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-100 transition-colors font-medium"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            
            {extendedUser ? (
              <div className="flex items-center space-x-4 bg-red-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-700/50">
                <span className="text-yellow-200 font-medium">
                  Welcome, {extendedUser.google_user_data?.given_name || extendedUser.email}
                </span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  className="flex items-center space-x-1 bg-red-700/80 hover:bg-red-600/90 text-white px-3 py-2 rounded-md transition-all cursor-pointer shadow-lg backdrop-blur-sm border border-red-600/50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </a>
              </div>
            ) : (
              <button
                onClick={redirectToLogin}
                className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-4 py-2 rounded-md font-semibold transition-colors shadow-lg"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

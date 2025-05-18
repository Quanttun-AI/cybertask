
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getInitials, getContrastColor } from '@/lib/utils';
import { Eye, Globe, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const handleLanguageChange = () => {
    setLanguage(language === 'pt' ? 'ja' : 'pt');
    toast.success(language === 'pt' ? 'Language changed to Japanese' : 'Idioma alterado para Português');
  };

  const handleLogout = () => {
    logout();
    toast.success(t('logout'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b border-border flex justify-between items-center z-10 relative">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-neon-purple font-bold animate-text-glow sm:text-2xl text-xl">
              CyberTask
            </span>
            <div className="w-4 h-4 bg-neon-pink rounded-full ml-2 animate-float"></div>
          </Link>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleLanguageChange}
            className="flex items-center px-3 py-2 mr-2 rounded-md hover:bg-secondary transition-colors neon-border"
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5 text-neon-purple" />
            <span className="ml-2 hidden sm:inline-block">{language === 'pt' ? 'PT' : '日本語'}</span>
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile" className={`flex items-center px-3 py-2 rounded-md hover:bg-secondary transition-colors neon-border ${location.pathname === '/profile' ? 'bg-secondary' : ''}`}>
                {currentUser?.profileImage ? (
                  <img 
                    src={currentUser.profileImage} 
                    alt={currentUser.username} 
                    className="w-6 h-6 rounded-full object-cover" 
                  />
                ) : (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getContrastColor(currentUser?.colorHue || 0) }}
                  >
                    <span className="text-xs font-bold text-gray-800">{getInitials(currentUser?.username || '')}</span>
                  </div>
                )}
                <span className="ml-2 hidden sm:inline-block">{currentUser?.username}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-secondary transition-colors neon-border"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 text-neon-pink" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className={`px-3 py-2 rounded-md hover:bg-secondary transition-colors neon-border ${location.pathname === '/login' ? 'bg-secondary' : ''}`}
              >
                {t('login')}
              </Link>
              <Link 
                to="/register" 
                className={`px-3 py-2 rounded-md hover:bg-secondary transition-colors neon-border ${location.pathname === '/register' ? 'bg-secondary' : ''}`}
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 animate-fade-in">
        {children}
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
        <p className="text-gradient">CyberTask &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;

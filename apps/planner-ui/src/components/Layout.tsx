import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">מערכת מערכי שיעור</h1>
            </div>

            <nav className="hidden md:flex gap-8 items-center">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                השיעורים שלי
              </Link>
              
              {/* REMOVED: The duplicate "Create New" link.
                 We will rely on the main button in the Dashboard instead.
              */}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3 relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.fullName || 'משתמש'}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'KINDERGARTEN' ? 'גננת' : user?.role === 'ADMIN' ? 'מנהלת' : 'בעלים'}
                </p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-200 transition-colors"
                >
                  {user?.fullName?.charAt(0) || 'U'}
                </button>

                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      התנתק
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      {/* --- Header --- */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            {/* Logo and Main Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-600 p-2 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="hidden text-xl font-bold text-gray-900 sm:block">
                  מערכת מערכי שיעור
                </h1>
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                <Link to="/" className={`text-sm font-medium transition-colors ${isActive("/") ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}>
                  ספריית המערכים
                </Link>
                <Link to="/create" className={`text-sm font-medium transition-colors ${isActive("/create") ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}>
                  צור מערך שיעור
                </Link>
                {user.role === "OWNER" && (
                  <Link to="/users" className={`text-sm font-medium transition-colors ${isActive("/users") ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}`}>
                    ניהול משתמשים
                  </Link>
                )}
              </nav>
            </div>

            {/* User Profile and Role Indicator */}
            <div className="relative flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {user.role === "OWNER" ? "בעלים" : user.role === "ADMIN" ? "מנהל" : "גננת"}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 font-bold text-indigo-700 transition-colors hover:bg-indigo-200"
                >
                  {(user.avatarUrl != null) ? (
                    <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full rounded-full border border-indigo-200" />
                  ) : (
                    user.fullName.charAt(0) || 'U'
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute left-0 z-50 mt-2 w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="block w-full px-4 py-2 text-right text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      התנתק מהמערכת
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

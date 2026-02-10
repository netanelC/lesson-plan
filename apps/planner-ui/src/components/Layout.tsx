import { Link } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link to="/" className="flex flex-shrink-0 items-center gap-2">
                <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                  P
                </div>
                <span className="font-bold text-xl text-gray-900">Planner</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
               {/* User Avatar Placeholder */}
               <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

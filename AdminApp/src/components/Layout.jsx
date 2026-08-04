import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl font-bold text-gray-900">Lessons Admin</h1>
            </div>
            <nav className="flex gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg transition ${
                  isActive('/') || isActive('/lessons')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Lessons
              </Link>
              <a
                href="http://127.0.0.1:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                API Docs
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Vedanth's Coding Classes Admin Portal
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          <Link
            to="/"
            className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors duration-300"
          >
            Code with Vedanth
          </Link>
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            <li>
              <Link
                to="/"
                className="text-gray-300 font-medium hover:text-purple-400 transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/syllabus"
                className="text-gray-300 font-medium hover:text-purple-400 transition-colors duration-300"
              >
                Syllabus
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-300 font-medium hover:text-purple-400 transition-colors duration-300"
              >
                About
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to="/account"
                    className="text-gray-300 font-medium hover:text-purple-400 transition-colors duration-300"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400 text-sm">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 font-medium hover:text-purple-400 transition-colors duration-300"
                >
                  Login
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/book-trial"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2 rounded-full font-medium hover:from-purple-500 hover:to-purple-600 hover:-translate-y-0.5 transition-all duration-300"
              >
                Free Trial
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

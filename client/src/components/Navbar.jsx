import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard,
  FileText
} from 'lucide-react';

// Reusable NavLinks component
const NavLinks = ({ user, token, className }) => (
  <>
    <NavLink to="/" className={className}>Home</NavLink>
    <NavLink to="/jobs" className={className}>Find Jobs</NavLink>
    {token && user?.role === 'employer' && (
      <NavLink to="/dashboard" className={className}>
        <span className="flex items-center gap-1.5"><LayoutDashboard size={16}/> Dashboard</span>
      </NavLink>
    )}
    {token && user?.role === 'jobseeker' && (
      <NavLink to="/applications" className={className}>
        <span className="flex items-center gap-1.5"><FileText size={16}/> My Applications</span>
      </NavLink>
    )}
  </>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shadow/blur on scroll (rAF debounced)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const rafScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', rafScroll);
    return () => window.removeEventListener('scroll', rafScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Memoized logout
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  // Desktop link class (supports active state function signature)
  const desktopNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800'
    }`;

  // Mobile link class (simple string)
  const mobileNavLinkClass =
    'block py-2 text-base font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-slate-900/90 dark:border-slate-700'
          : 'bg-white border-b border-transparent dark:bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Briefcase className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              InternHill
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinks user={user} token={token} className={desktopNavLinkClass} />
          </nav>

          {/* Auth buttons / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown menu */}
                <div
                  role="menu"
                  className={`absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 transition-all duration-200 ${
                    isProfileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 mb-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
                      Signed in as
                    </p>
                    <p
                      className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate"
                      title={user?.email}
                    >
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:text-indigo-400"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 absolute w-full shadow-xl">
          <div className="px-6 py-4 space-y-3">
            <NavLinks user={user} token={token} className={mobileNavLinkClass} />

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 mt-2">
              {token ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-200">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-red-50 text-red-600 font-semibold rounded-lg flex items-center justify-center gap-2 dark:bg-red-900/30"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    to="/login"
                    className="w-full py-3 text-center border border-gray-200 rounded-lg font-semibold text-slate-700 dark:text-slate-300 dark:border-slate-700"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-3 text-center bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/upcoming', label: 'Upcoming', icon: CalendarDaysIcon },
    { path: '/past', label: 'Past', icon: ClockIcon },
    { path: '/system-design', label: 'System Design', icon: BookOpenIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`border-b ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    } sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`flex items-center justify-center w-8 h-8 rounded-md ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <img 
                src="/contest_tracker_homepage_logo.svg" 
                alt="CodeAlarm" 
                className="h-5 w-5"
              />
            </div>
            <span className={`text-lg font-semibold ${
              isDark ? 'text-gray-50' : 'text-gray-900'
            }`}>
              CodeAlarm
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? isDark
                        ? 'bg-gray-800 text-gray-50'
                        : 'bg-gray-100 text-gray-900'
                      : isDark
                        ? 'text-gray-400 hover:text-gray-50 hover:bg-gray-800/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
              }`}>
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {user?.firstName || user?.username}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-gray-50 hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
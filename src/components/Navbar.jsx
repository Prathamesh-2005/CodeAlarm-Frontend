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
  TrophyIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/upcoming', label: 'Upcoming', icon: CalendarDaysIcon },
    { path: '/past', label: 'Past Contests', icon: ClockIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-b sticky top-0 z-50 transition-colors duration-300 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/contest_tracker_homepage_logo.svg" 
                alt="CodeAlarm Logo" 
                className="h-8 w-8 text-white"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              CodeAlarm
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-500 dark:text-purple-400 border border-purple-500/30'
                      : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className={`font-medium text-base hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.firstName || user?.username}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 group"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
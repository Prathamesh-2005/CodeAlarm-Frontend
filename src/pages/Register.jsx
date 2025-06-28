import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { AlarmClock, UserPlus, Trophy, CalendarClock, Bell, Sparkles, ArrowRight, Heart, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    upcoming: 125,
    past: 342,
    reminders: 568
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login: authLogin, isAuthenticated } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      authLogin(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setErrors({
        submit: err.response?.data?.error || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`w-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img 
                src="/contest_tracker_homepage_logo.svg" 
                alt="CodeAlarm" 
                className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity" 
              />
            </Link>
            <Link to="/" className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} hover:opacity-80 transition-opacity`}>
              CodeAlarm
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className={`px-4 py-2 rounded-lg font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className={`px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all shadow-md`}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side - Registration Form */}
          <div className={`w-full lg:w-1/2 p-8 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 mb-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Join CodeAlarm to never miss a coding contest</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {errors.submit && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className={`ml-3 text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{errors.submit}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="First name"
                  />
                  {errors.firstName && <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.firstName}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Username"
                />
                {errors.username && <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Email"
                />
                {errors.email && <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${errors.password ? 'border-red-500' : ''} pr-10`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'} ${errors.confirmPassword ? 'border-red-500' : ''} pr-10`}
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className={`mt-1 text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className={`font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'} transition-colors duration-200`}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Platform Insights */}
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Never Miss a Coding Contest Again
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                CodeAlarm helps you track upcoming coding contests across all major platforms and sends you reminders so you never miss an opportunity to compete.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <CalendarClock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.upcoming}+</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Past</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.past}+</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Reminders</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.reminders}+</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Why Choose CodeAlarm?
                    </h3>
                    <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-4 w-4 text-purple-500" />
                        <span>All your coding contests in one place</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-4 w-4 text-purple-500" />
                        <span>Email alerts so you never miss a contest</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-4 w-4 text-purple-500" />
                        <span>Organize and filter your contest list</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ArrowRight className="h-4 w-4 text-purple-500" />
                        <span>Modern, responsive interface for easy use</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`w-full py-8 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/contest_tracker_homepage_logo.svg" 
                  alt="CodeAlarm" 
                  className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity" 
                />
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} hover:opacity-80 transition-opacity`}>
                  CodeAlarm
                </span>
              </Link>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 CodeAlarm. All rights reserved.
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Made with
              </span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                by
              </span>
              <a 
                href="https://github.com/Prathamesh-2005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors duration-300"
              >
                Prathamesh Jadhav
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { AlarmClock, Trophy, CalendarClock, Bell, ArrowRight, Heart, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats] = useState({ upcoming: 125, past: 342, reminders: 568 });
  const [showPassword, setShowPassword] = useState(false);

  const { login: authLogin, isAuthenticated } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(formData);
      authLogin(response.data.token, response.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
    isDark
      ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  }`;

  const labelBase = `block text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  const features = [
    { text: 'Track contests from Codeforces, CodeChef & LeetCode in one place' },
    { text: 'Never miss a round with customizable reminder notifications' },
    { text: 'Real-time updates from all major competitive programming platforms' },
    { text: 'Beautiful, intuitive interface that makes tracking effortless' },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <AlarmClock className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>CodeAlarm</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex">
        {/* Left — Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-sm">
            {/* Title */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 p-3">
                <AlarmClock className="h-6 w-6 text-white" />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome back
              </h2>
              <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Sign in to continue to CodeAlarm
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className={`rounded-md p-3 border text-xs ${
                  isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className={labelBase}>Username</label>
                <input
                  id="username" name="username" type="text" required autoFocus
                  value={formData.username} onChange={handleChange}
                  className={inputBase}
                  placeholder="Enter your username"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-purple-500 hover:text-purple-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password" name="password" type={showPassword ? 'text' : 'password'} required
                    value={formData.password} onChange={handleChange}
                    className={`${inputBase} pr-9`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-1 shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Sign in <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </form>

            <p className={`mt-5 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-500 hover:text-purple-400 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right — Promo */}
        <div className={`hidden lg:flex lg:w-[46%] border-l flex-col justify-center px-10 py-8 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: CalendarClock, color: isDark ? 'text-purple-400' : 'text-purple-600', value: `${stats.upcoming}+`, label: 'Upcoming Contests' },
              { icon: Trophy, color: isDark ? 'text-blue-400' : 'text-blue-600', value: `${stats.past}+`, label: 'Past Contests' },
              { icon: Bell, color: isDark ? 'text-emerald-400' : 'text-emerald-600', value: `${stats.reminders}+`, label: 'Active Reminders' },
            ].map(({ icon: Icon, color, value, label }) => (
              <div key={label} className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <Icon className={`h-5 w-5 mb-2 ${color}`} />
                <div className={`text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className={`border-t mb-6 ${isDark ? 'border-gray-800' : 'border-gray-100'}`} />

          {/* Features */}
          <div>
            <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why choose CodeAlarm?
            </h3>
            <div className="space-y-3">
              {features.map(({ text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <p className={`text-sm leading-snug ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom badge */}
          <div className={`mt-8 rounded-lg border p-4 ${
            isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-100'
          }`}>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className={`font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Free forever.</span>{' '}
              All features are completely free for the competitive programming community — no credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <AlarmClock className={`h-4 w-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>CodeAlarm</span>
            </Link>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2024 CodeAlarm. All rights reserved.
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Made with <Heart className="inline h-3 w-3 text-red-500" /> by{' '}
              <a href="https://github.com/Prathamesh-2005" target="_blank" rel="noopener noreferrer"
                className="font-medium text-purple-500 hover:text-purple-400 transition-colors">
                Prathamesh Jadhav
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
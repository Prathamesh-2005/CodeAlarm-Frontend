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
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  const [stats] = useState({ upcoming: 125, past: 342, reminders: 568 });
  const [showPassword, setShowPassword] = useState(false);

  const { login: authLogin, isAuthenticated } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let timer;
    if (loading) {
      // Show warning after 3 seconds of loading
      timer = setTimeout(() => {
        setShowSlowWarning(true);
      }, 3000);
    } else {
      setShowSlowWarning(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

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

  // Design tokens
  const bg = isDark ? '#0a0a0a' : '#f5f5f5';
  const surface = isDark ? '#111111' : '#ffffff';
  const border = isDark ? '#1e1e1e' : '#e5e7eb';
  const hoverBorder = isDark ? '#2e2e2e' : '#d1d5db';
  const textPri = isDark ? '#f0f0f0' : '#111111';
  const textSec = isDark ? '#666666' : '#9ca3af';
  const inputBg = isDark ? '#161616' : '#f9fafb';

  const features = [
    { text: 'Track contests from Codeforces, CodeChef & LeetCode in one place' },
    { text: 'Never miss a round with customizable reminder notifications' },
    { text: 'Real-time updates from all major competitive programming platforms' },
    { text: 'Beautiful, intuitive interface that makes tracking effortless' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: `1.5px solid ${border}`,
        background: surface,
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <AlarmClock style={{ width: 20, height: 20, color: isDark ? '#a78bfa' : '#7c3aed' }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: textPri, letterSpacing: '-0.3px' }}>CodeAlarm</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/register" style={{
              padding: '9px 16px',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 10,
              color: textSec,
              textDecoration: 'none',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = textPri; e.currentTarget.style.background = inputBg; }}
            onMouseLeave={e => { e.currentTarget.style.color = textSec; e.currentTarget.style.background = 'transparent'; }}>
              Sign Up
            </Link>
            <Link to="/login" style={{
              padding: '9px 16px',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Left — Form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 28px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Title */}
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                marginBottom: 16,
                padding: 12,
              }}>
                <AlarmClock style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: textPri, letterSpacing: '-0.5px' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 15, color: textSec, margin: 0 }}>
                Sign in to continue to CodeAlarm
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Free Tier Info Banner */}
              <div style={{
                borderRadius: 10,
                padding: 12,
                border: `1.5px solid ${isDark ? '#1e3a8a' : '#bfdbfe'}`,
                fontSize: 13,
                background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                color: isDark ? '#93c5fd' : '#1e40af',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <svg style={{ width: 16, height: 16, marginTop: 1, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span style={{ lineHeight: 1.5 }}>
                  <strong>Note:</strong> Backend is hosted on free tier and may take 30-60 seconds to wake up on first login.
                </span>
              </div>

              {error && (
                <div style={{
                  borderRadius: 10,
                  padding: 12,
                  border: `1.5px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
                  fontSize: 13,
                  background: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
                  color: isDark ? '#f87171' : '#dc2626',
                }}>
                  {error}
                </div>
              )}

              {showSlowWarning && loading && (
                <div style={{
                  borderRadius: 10,
                  padding: 12,
                  border: `1.5px solid ${isDark ? '#78350f' : '#fde68a'}`,
                  fontSize: 13,
                  background: isDark ? 'rgba(234, 179, 8, 0.1)' : '#fefce8',
                  color: isDark ? '#fde047' : '#a16207',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}>
                  <svg style={{ animation: 'spin 0.7s linear infinite', width: 16, height: 16, marginTop: 1, flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span style={{ lineHeight: 1.5 }}>
                    Server is waking up... This may take up to a minute. Please wait.
                  </span>
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: textSec }}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: 14,
                    border: `1.5px solid ${border}`,
                    borderRadius: 10,
                    background: inputBg,
                    color: textPri,
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = border}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: textSec }}>
                    Password
                  </label>
                  <Link to="/forgot-password" style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#7c3aed',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7c3aed'}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 14px',
                      fontSize: 14,
                      border: `1.5px solid ${border}`,
                      borderRadius: 10,
                      background: inputBg,
                      color: textPri,
                      outline: 'none',
                      transition: 'border-color 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = border}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      paddingRight: 12,
                      display: 'flex',
                      alignItems: 'center',
                      color: textSec,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = textPri}
                    onMouseLeave={e => e.currentTarget.style.color = textSec}
                  >
                    {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  marginTop: 4,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg style={{ animation: 'spin 0.7s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    Sign in <ArrowRight style={{ width: 16, height: 16 }} />
                  </span>
                )}
              </button>
            </form>

            <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: textSec }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                fontWeight: 700,
                color: '#7c3aed',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
              onMouseLeave={e => e.currentTarget.style.color = '#7c3aed'}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right — Promo */}
        <div style={{
          display: 'none',
          width: '46%',
          borderLeft: `1.5px solid ${border}`,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 40px',
          background: surface,
        }}
        className="lg-flex">
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
            {[
              { icon: CalendarClock, color: isDark ? '#a78bfa' : '#7c3aed', value: `${stats.upcoming}+`, label: 'Upcoming Contests' },
              { icon: Trophy, color: isDark ? '#60a5fa' : '#3b82f6', value: `${stats.past}+`, label: 'Past Contests' },
              { icon: Bell, color: isDark ? '#4ade80' : '#16a34a', value: `${stats.reminders}+`, label: 'Active Reminders' },
            ].map(({ icon: Icon, color, value, label }) => (
              <div key={label} style={{
                padding: 18,
                borderRadius: 12,
                border: `1.5px solid ${border}`,
                background: inputBg,
              }}>
                <Icon style={{ width: 20, height: 20, marginBottom: 8, color }} />
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, color: textPri }}>{value}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: textSec }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1.5px solid ${border}`, marginBottom: 24 }} />

          {/* Features */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: textPri }}>
              Why choose CodeAlarm?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {features.map(({ text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0, color: isDark ? '#a78bfa' : '#7c3aed' }} />
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: isDark ? '#d1d5db' : '#6b7280', margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom badge */}
          <div style={{
            marginTop: 32,
            borderRadius: 12,
            border: `1.5px solid ${isDark ? 'rgba(124, 58, 237, 0.2)' : '#e9d5ff'}`,
            padding: 16,
            background: isDark ? 'rgba(124, 58, 237, 0.05)' : '#faf5ff',
          }}>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: textSec, margin: 0 }}>
              <span style={{ fontWeight: 700, color: isDark ? '#c4b5fd' : '#7c3aed' }}>Free forever.</span>{' '}
              All features are completely free for the competitive programming community — no credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1.5px solid ${border}`,
        background: surface,
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            className="md-flex-row">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <AlarmClock style={{ width: 16, height: 16, color: isDark ? '#a78bfa' : '#7c3aed' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: textPri }}>CodeAlarm</span>
            </Link>
            <div style={{ fontSize: 12, color: textSec }}>
              © 2024 CodeAlarm. All rights reserved.
            </div>
            <div style={{ fontSize: 12, color: textSec }}>
              Made with <Heart style={{ display: 'inline', width: 12, height: 12, color: '#ef4444' }} /> by{' '}
              <a href="https://github.com/Prathamesh-2005" target="_blank" rel="noopener noreferrer"
                style={{ fontWeight: 600, color: '#7c3aed', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                onMouseLeave={e => e.currentTarget.style.color = '#7c3aed'}>
                Prathamesh Jadhav
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 1024px) {
          .lg-flex { display: flex !important; }
        }
        @media (min-width: 768px) {
          .md-flex-row { flex-direction: row !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;

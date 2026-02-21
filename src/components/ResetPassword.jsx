import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { AlarmClock, Key, Trophy, CalendarClock, Bell, Sparkles, ArrowRight, Heart, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats] = useState({ upcoming: 125, past: 342, reminders: 568 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ token, newPassword: password });
      setMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Design tokens
  const bg = isDark ? '#0a0a0a' : '#f5f5f5';
  const surface = isDark ? '#111111' : '#ffffff';
  const border = isDark ? '#1e1e1e' : '#e5e7eb';
  const textPri = isDark ? '#f0f0f0' : '#111111';
  const textSec = isDark ? '#666666' : '#9ca3af';
  const inputBg = isDark ? '#161616' : '#f9fafb';

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header style={{
        width: '100%',
        background: surface,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderBottom: `1.5px solid ${border}`,
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <AlarmClock style={{ width: 20, height: 20, color: isDark ? '#a78bfa' : '#7c3aed' }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: textPri, letterSpacing: '-0.3px' }}>CodeAlarm</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/login" style={{
              padding: '9px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: textSec,
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = textPri; e.currentTarget.style.background = inputBg; }}
            onMouseLeave={e => { e.currentTarget.style.color = textSec; e.currentTarget.style.background = 'transparent'; }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              padding: '9px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: textSec,
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = textPri; e.currentTarget.style.background = inputBg; }}
            onMouseLeave={e => { e.currentTarget.style.color = textSec; e.currentTarget.style.background = 'transparent'; }}>
              Register
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'center' }} className="lg-flex-row">
          {/* Left Side - Reset Password Form */}
          <div style={{
            width: '100%',
            maxWidth: 500,
            padding: 32,
            borderRadius: 16,
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            background: surface,
            border: `1.5px solid ${border}`,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                marginBottom: 16,
              }}>
                <Key style={{ width: 32, height: 32, color: '#fff' }} />
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: textPri, marginBottom: 8, letterSpacing: '-0.5px' }}>
                Reset Password
              </h1>
              <p style={{ margin: 0, fontSize: 15, color: textSec }}>
                Set a new password for your account
              </p>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  padding: 16,
                  borderRadius: 10,
                  border: `1.5px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
                  background: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: 20, height: 20, color: '#ef4444' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p style={{ marginLeft: 12, fontSize: 14, color: isDark ? '#f87171' : '#dc2626' }}>{error}</p>
                  </div>
                </div>
              )}

              {message && (
                <div style={{
                  padding: 16,
                  borderRadius: 10,
                  border: `1.5px solid ${isDark ? '#065f46' : '#86efac'}`,
                  background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg style={{ width: 20, height: 20, color: '#10b981' }} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p style={{ marginLeft: 12, fontSize: 14, color: isDark ? '#4ade80' : '#16a34a' }}>{message}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: textSec,
                  marginBottom: 6,
                }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    paddingLeft: 12,
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}>
                    <Key style={{ width: 18, height: 18, color: textSec }} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{
                      display: 'block',
                      width: '100%',
                      paddingLeft: 44,
                      paddingRight: 44,
                      paddingTop: 12,
                      paddingBottom: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${border}`,
                      background: inputBg,
                      color: textPri,
                      fontSize: 14,
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
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: textSec,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = textPri}
                    onMouseLeave={e => e.currentTarget.style.color = textSec}
                  >
                    {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: textSec,
                  marginBottom: 6,
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    paddingLeft: 12,
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}>
                    <Key style={{ width: 18, height: 18, color: textSec }} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      display: 'block',
                      width: '100%',
                      paddingLeft: 44,
                      paddingRight: 44,
                      paddingTop: 12,
                      paddingBottom: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${border}`,
                      background: inputBg,
                      color: textPri,
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = border}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      paddingRight: 12,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: textSec,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = textPri}
                    onMouseLeave={e => e.currentTarget.style.color = textSec}
                  >
                    {showConfirmPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              <div style={{ paddingTop: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 18px',
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 10,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.15s',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
                >
                  {loading ? (
                    <>
                      <svg style={{ animation: 'spin 0.7s linear infinite', marginRight: 8, width: 16, height: 16, color: '#fff' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Key style={{ width: 18, height: 18, marginRight: 8 }} />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: textSec }}>
                Remember your password?{' '}
                <Link to="/login" style={{
                  fontWeight: 700,
                  color: '#7c3aed',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                onMouseLeave={e => e.currentTarget.style.color = '#7c3aed'}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Platform Insights */}
          <div style={{ width: '100%', maxWidth: 600 }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: textPri, letterSpacing: '-0.5px' }}>
                Never Miss a Coding Contest Again
              </h2>
              <p style={{ fontSize: 16, color: isDark ? '#d1d5db' : '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
                CodeAlarm helps you track upcoming coding contests across all major platforms and sends you reminders so you never miss an opportunity to compete.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
                {[
                  { icon: CalendarClock, color: isDark ? '#4ade80' : '#16a34a', value: `${stats.upcoming}+`, label: 'Upcoming' },
                  { icon: Trophy, color: isDark ? '#60a5fa' : '#3b82f6', value: `${stats.past}+`, label: 'Past' },
                  { icon: Bell, color: isDark ? '#a78bfa' : '#7c3aed', value: `${stats.reminders}+`, label: 'Reminders' },
                ].map(({ icon: Icon, color, value, label }) => (
                  <div key={label} style={{
                    padding: 18,
                    borderRadius: 12,
                    background: inputBg,
                    border: `1.5px solid ${border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        padding: 8,
                        background: `linear-gradient(135deg, ${color} 0%, ${color} 100%)`,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon style={{ width: 20, height: 20, color: '#fff' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, color: textSec, margin: 0 }}>{label}</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color: textPri, margin: 0 }}>{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                padding: 24,
                borderRadius: 16,
                background: inputBg,
                border: `1.5px solid ${border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    padding: 12,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Sparkles style={{ width: 24, height: 24, color: '#fff' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: textPri }}>
                      Why Choose CodeAlarm?
                    </h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                      {[
                        'All your coding contests in one place',
                        'Email alerts so you never miss a contest',
                        'Organize and filter your contest list',
                        'Modern, responsive interface for easy use',
                      ].map(text => (
                        <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <ArrowRight style={{ width: 16, height: 16, color: '#7c3aed', flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: isDark ? '#d1d5db' : '#6b7280' }}>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        width: '100%',
        padding: '32px 0',
        borderTop: `1.5px solid ${border}`,
        background: surface,
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 28px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
          className="md-flex-row">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <AlarmClock style={{ width: 16, height: 16, color: isDark ? '#a78bfa' : '#7c3aed' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: textPri }}>CodeAlarm</span>
            </Link>
            <div style={{ fontSize: 12, color: textSec }}>
              © 2025 CodeAlarm. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: textSec }}>
              Made with <Heart style={{ width: 12, height: 12, color: '#ef4444', fill: '#ef4444' }} /> by
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
          .lg-flex-row { flex-direction: row !important; }
        }
        @media (min-width: 768px) {
          .md-flex-row { flex-direction: row !important; }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;

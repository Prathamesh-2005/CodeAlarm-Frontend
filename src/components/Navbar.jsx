// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ── SVG Icons ─────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const XIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Nav items ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/',              label: 'Home',          Icon: HomeIcon },
  { path: '/upcoming',     label: 'Upcoming',      Icon: CalendarIcon },
  { path: '/past',         label: 'Past',          Icon: ClockIcon },
  { path: '/system-design',label: 'System Design', Icon: BookIcon },
  { path: '/profile',      label: 'Profile',       Icon: UserIcon },
];

// ── Component ─────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // ── Tokens ───────────────────────────────────────────────────────
  const surface   = isDark ? '#111111' : '#ffffff';
  const border    = isDark ? '#1e1e1e' : '#e5e7eb';
  const textPri   = isDark ? '#f0f0f0' : '#111111';
  const textSec   = isDark ? '#666666' : '#9ca3af';
  const hoverBg   = isDark ? '#1a1a1a' : '#f3f4f6';
  const activeBg  = isDark ? '#1e1e1e' : '#f0f0f0';
  const inputBg   = isDark ? '#161616' : '#f9fafb';

  const navLinkBase = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 13px', borderRadius: 9,
    fontSize: 14, fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
    textDecoration: 'none', transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
  };

  const activeStyle  = { background: activeBg, color: textPri };
  const defaultStyle = { background: 'transparent', color: textSec };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: surface,
        borderBottom: `1.5px solid ${border}`,
        fontFamily: '"DM Sans", sans-serif',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>

            {/* ── Logo ── */}
            <Link
              to="/"
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                border: `1.5px solid ${border}`,
                background: inputBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <img src="/contest_tracker_homepage_logo.svg" alt="CodeAlarm" style={{ width: 20, height: 20 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: textPri, letterSpacing: '-0.3px' }}>
                CodeAlarm
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1, justifyContent: 'center' }}
              className="hide-mobile">
              {NAV_ITEMS.map(({ path, label, Icon }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    style={{ ...navLinkBase, ...(active ? activeStyle : defaultStyle) }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}}
                  >
                    <Icon />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* ── Right: user + logout ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {/* User chip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '6px 11px 6px 6px',
                border: `1.5px solid ${border}`,
                borderRadius: 10, background: inputBg,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: activeBg,
                  border: `1.5px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: textPri,
                  flexShrink: 0,
                }}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: textPri, display: 'none' }}
                  className="show-sm">
                  {user?.firstName || user?.username}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                title="Logout"
                style={{
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${border}`,
                  borderRadius: 10, background: 'transparent',
                  color: textSec, cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#2a0e0e' : '#fef2f2'; e.currentTarget.style.color = isDark ? '#f87171' : '#dc2626'; e.currentTarget.style.borderColor = isDark ? '#7f1d1d' : '#fecaca'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; e.currentTarget.style.borderColor = border; }}
              >
                <LogoutIcon />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                style={{
                  width: 36, height: 36,
                  display: 'none',
                  alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${border}`,
                  borderRadius: 10, background: 'transparent',
                  color: textSec, cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                className="show-mobile-flex"
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}
              >
                {mobileOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div style={{
            borderTop: `1.5px solid ${border}`,
            background: surface,
            padding: '12px 24px 18px',
          }}>
            {NAV_ITEMS.map(({ path, label, Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    ...navLinkBase,
                    display: 'flex', width: '100%',
                    padding: '11px 13px',
                    marginBottom: 4,
                    ...(active ? activeStyle : defaultStyle),
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = active ? activeBg : 'transparent'; e.currentTarget.style.color = active ? textPri : textSec; }}}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}

            {/* Divider */}
            <div style={{ height: 1, background: border, margin: '12px 0' }} />

            {/* User row in mobile */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: activeBg, border: `1.5px solid ${border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: textPri,
                }}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: textPri }}>
                  {user?.firstName || user?.username}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '8px 13px', borderRadius: 9,
                  border: `1.5px solid ${border}`, background: 'transparent',
                  color: textSec, fontSize: 13.5, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                <LogoutIcon /> Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
        @media (min-width: 640px) {
          .show-sm { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
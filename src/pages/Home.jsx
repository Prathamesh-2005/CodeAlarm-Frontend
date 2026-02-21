import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

// ── SVG Icons ─────────────────────────────────────────────────────
const CalendarIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const TrophyIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M6 2h12v7a6 6 0 0 1-12 0V2z"/><path d="M6 18h12"/><path d="M9 22h6"/><path d="M12 15v7"/>
  </svg>
);
const BellIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const BookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const ClockIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ArrowRightIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Platform config ───────────────────────────────────────────────
const platformDots = {
  Codeforces: '#3b82f6',
  CodeChef:   '#f97316',
  LeetCode:   '#f59e0b',
};

// ── Stat Card ─────────────────────────────────────────────────────
const StatCard = ({ to, icon: Icon, label, value, sub, isDark }) => {
  const border  = isDark ? '#1e1e1e' : '#e5e7eb';
  const surface = isDark ? '#111111' : '#ffffff';
  const textPri = isDark ? '#f0f0f0' : '#111111';
  const textSec = isDark ? '#666666' : '#9ca3af';

  return (
    <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: surface,
          border: `1.5px solid ${border}`,
          borderRadius: 16,
          padding: '24px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          transition: 'border-color 0.15s',
          cursor: 'pointer',
          fontFamily: '"DM Sans", sans-serif',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? '#2e2e2e' : '#d1d5db'}
        onMouseLeave={e => e.currentTarget.style.borderColor = border}
      >
        <div>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: textSec, margin: '0 0 10px', letterSpacing: '0.03em' }}>
            {label}
          </p>
          <p style={{ fontSize: 32, fontWeight: 800, color: textPri, margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {value}
          </p>
          <p style={{ fontSize: 12, color: textSec, margin: 0 }}>{sub}</p>
        </div>
        <div style={{
          width: 48, height: 48,
          borderRadius: 12,
          border: `1.5px solid ${border}`,
          background: isDark ? '#161616' : '#f9fafb',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: textSec, flexShrink: 0,
        }}>
          <Icon size={20} />
        </div>
      </div>
    </Link>
  );
};

// ── Main ──────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ upcoming: 0, past: 0, reminders: 0 });
  const [recentContests, setRecentContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const filterUniqueReminders = (reminders) => {
    if (!Array.isArray(reminders)) return [];
    return reminders.filter((r, i, self) =>
      i === self.findIndex(x => {
        if (x.id === r.id) return true;
        const xId = x.contest?.id || x.contest_id;
        const rId = r.contest?.id || r.contest_id;
        return xId && rId && xId === rId;
      })
    );
  };

  const isReminderActive = (reminder) => {
    const d = reminder.contest?.contestStartDate || reminder.contestStartDate;
    if (!d) return false;
    const start = new Date(d);
    return !isNaN(start.getTime()) && start.getTime() > Date.now();
  };

  const fetchDashboardData = async () => {
    try {
      const [contestsRes, remindersRes] = await Promise.all([
        api.get('/contests/all'),
        api.get('/reminders/my-reminders'),
      ]);
      const now = new Date();
      const upcoming = contestsRes.data.filter(c => new Date(c.contestStartDate) > now);
      const past     = contestsRes.data.filter(c => new Date(c.contestStartDate) <= now);
      const active   = filterUniqueReminders(remindersRes.data).filter(isReminderActive);
      setStats({ upcoming: upcoming.length, past: past.length, reminders: active.length });
      setRecentContests(
        upcoming.sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate)).slice(0, 3)
      );
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (ds) =>
    new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getTimeUntil = (ds) => {
    const diff = new Date(ds) - new Date();
    if (diff < 0) return 'Started';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `in ${d}d ${h}h`;
    if (h > 0) return `in ${h}h ${m}m`;
    return `in ${m}m`;
  };

  // ── Tokens ──────────────────────────────────────────────────────
  const bg      = isDark ? '#0a0a0a' : '#f5f5f5';
  const surface  = isDark ? '#111111' : '#ffffff';
  const border   = isDark ? '#1e1e1e' : '#e5e7eb';
  const textPri  = isDark ? '#f0f0f0' : '#111111';
  const textSec  = isDark ? '#666666' : '#9ca3af';
  const inputBg  = isDark ? '#161616' : '#f9fafb';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <div style={{ width: 22, height: 22, border: `2px solid ${border}`, borderTopColor: textSec, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: surface,
        borderBottom: `1.5px solid ${border}`,
        padding: '40px 0',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: textPri, margin: 0, letterSpacing: '-0.4px' }}>
              Welcome back, {user?.firstName || user?.username} 👋
            </h1>
            <p style={{ fontSize: 14, color: textSec, margin: '8px 0 0' }}>
              Track your contests and manage reminders
            </p>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 16px',
            border: `1.5px solid ${border}`,
            borderRadius: 10,
            background: inputBg,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#4ade80',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: textSec }}>All systems active</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '44px 28px' }}>

        {/* ── Stats grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
          <StatCard to="/upcoming"      icon={CalendarIcon} label="Upcoming Contests" value={stats.upcoming} sub="Ready to compete"    isDark={isDark} />
          <StatCard to="/past"          icon={TrophyIcon}   label="Past Contests"     value={stats.past}     sub="Completed rounds"   isDark={isDark} />
          <StatCard to="/profile"       icon={BellIcon}     label="Active Reminders"  value={stats.reminders} sub="Notifications set" isDark={isDark} />
          <StatCard to="/system-design" icon={BookIcon}     label="System Design"     value="Learn"          sub="Master concepts"    isDark={isDark} />
        </div>

        {/* ── Upcoming contests section ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: textPri, margin: 0, letterSpacing: '-0.3px' }}>
              Upcoming Contests
            </h2>
            <p style={{ fontSize: 13, color: textSec, margin: '5px 0 0' }}>Next contests starting soon</p>
          </div>

          <Link
            to="/upcoming"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 16px',
              border: `1.5px solid ${border}`,
              borderRadius: 10,
              background: 'transparent',
              color: textSec,
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#1a1a1a' : '#f3f4f6'; e.currentTarget.style.color = textPri; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}
          >
            View all <ArrowRightIcon />
          </Link>
        </div>

        {/* Contest cards / empty state */}
        {recentContests.length === 0 ? (
          <div style={{
            background: surface, border: `1.5px solid ${border}`,
            borderRadius: 16, padding: '70px 28px', textAlign: 'center',
          }}>
            <div style={{ color: isDark ? '#2a2a2a' : '#d1d5db', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <CalendarIcon size={40} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: textPri, margin: '0 0 7px' }}>No upcoming contests</p>
            <p style={{ fontSize: 14, color: textSec, margin: 0 }}>Check back later for new contests</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {recentContests.map(contest => {
              const dot = platformDots[contest.platform] || '#888';
              const timeLabel = getTimeUntil(contest.contestStartDate);
              const isImminant = !timeLabel.includes('d') && timeLabel !== 'Started';

              return (
                <div
                  key={contest.id}
                  style={{
                    background: surface,
                    border: `1.5px solid ${border}`,
                    borderRadius: 16,
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? '#2e2e2e' : '#d1d5db'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = border}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: textSec, letterSpacing: '0.03em' }}>
                        {contest.platform}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700,
                      color: textSec,
                      background: inputBg,
                      border: `1.5px solid ${border}`,
                      padding: '3px 10px', borderRadius: 7,
                      letterSpacing: '0.03em',
                    }}>
                      {Math.floor(contest.contestDuration / 60)}m
                    </span>
                  </div>

                  {/* Name */}
                  <p style={{
                    fontSize: 15, fontWeight: 700, color: textPri,
                    margin: '0 0 16px', lineHeight: 1.45, letterSpacing: '-0.2px',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    minHeight: 44,
                  }}>
                    {contest.contestName}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: border, margin: '0 0 14px' }} />

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: textSec, fontSize: 13 }}>
                      <ClockIcon size={12} />
                      <span>{formatDate(contest.contestStartDate)}</span>
                    </div>
                    <span style={{
                      fontSize: 12.5, fontWeight: 700,
                      color: isImminant ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#60a5fa' : '#3b82f6'),
                      letterSpacing: '0.01em',
                    }}>
                      {timeLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Home;
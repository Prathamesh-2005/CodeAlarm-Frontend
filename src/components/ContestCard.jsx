import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ReminderModal from './ReminderModel';

// ── SVG Icons ─────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const BellIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Platform tokens ───────────────────────────────────────────────
const platformTokens = {
  CodeChef:   { dot: '#f97316', dimDot: '#7c3010', label: 'CodeChef' },
  Codeforces: { dot: '#3b82f6', dimDot: '#1e3a5f', label: 'Codeforces' },
  LeetCode:   { dot: '#f59e0b', dimDot: '#78350f', label: 'LeetCode' },
};

// ── Helpers ───────────────────────────────────────────────────────
const formatDate = (ds) =>
  new Date(ds).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const getTimeUntilStart = (ds) => {
  const diff = new Date(ds) - new Date();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const getStatus = (start, end) => {
  const now = new Date();
  const s = new Date(start), e = new Date(end);
  if (now < s) return 'upcoming';
  if (now <= e) return 'live';
  return 'ended';
};

// ── Component ─────────────────────────────────────────────────────
const ContestCard = ({
  contest,
  isPast = false,
  formatDuration,
  userReminders = [],
  onReminderSet,
  onReminderDelete,
}) => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const hasReminder = userReminders.some(r => r.contest?.contestId === contest.contestId);
  const status = getStatus(contest.contestStartDate, contest.contestEndDate);
  const timeUntil = getTimeUntilStart(contest.contestStartDate);
  const pt = platformTokens[contest.platform] || { dot: '#888', dimDot: '#333', label: contest.platform };

  const handleReminderClick = () => {
    if (hasReminder) {
      const r = userReminders.find(r => r.contest?.contestId === contest.contestId);
      if (r && onReminderDelete) onReminderDelete(r.id);
    } else {
      setShowModal(true);
    }
  };

  const durationLabel = formatDuration
    ? formatDuration(contest.contestDuration)
    : `${Math.floor(contest.contestDuration / 60)}m`;

  // ── Tokens ───────────────────────────────────────────────────
  const surface = isDark ? '#111111' : '#ffffff';
  const border  = isDark ? '#1e1e1e' : '#e5e7eb';
  const hoverBorder = isDark ? '#2e2e2e' : '#d1d5db';
  const textPri = isDark ? '#f0f0f0' : '#111111';
  const textSec = isDark ? '#666666' : '#9ca3af';
  const inputBg = isDark ? '#161616' : '#f9fafb';

  // Status badge
  const statusBadge = {
    upcoming: { label: 'Upcoming', bg: isDark ? '#0c1a3a' : '#eff6ff', color: isDark ? '#60a5fa' : '#3b82f6' },
    live:     { label: 'Live',     bg: isDark ? '#052e16' : '#f0fdf4', color: isDark ? '#4ade80' : '#16a34a' },
    ended:    { label: 'Ended',    bg: isDark ? '#1a1a1a' : '#f9fafb', color: isDark ? '#555'    : '#9ca3af' },
  }[status];

  return (
    <>
      <div
        style={{
          background: surface,
          border: `1.5px solid ${border}`,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '"DM Sans", sans-serif',
          transition: 'border-color 0.15s',
          cursor: 'default',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = hoverBorder}
        onMouseLeave={e => e.currentTarget.style.borderColor = border}
      >
        {/* Live bar */}
        {status === 'live' && (
          <div style={{
            background: isDark ? '#052e16' : '#f0fdf4',
            borderBottom: `1px solid ${isDark ? '#14532d' : '#bbf7d0'}`,
            padding: '8px 20px',
            fontSize: 12.5,
            fontWeight: 700,
            color: isDark ? '#4ade80' : '#16a34a',
            letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: isDark ? '#4ade80' : '#16a34a',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            LIVE NOW
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '22px 22px 16px', flex: 1 }}>

          {/* Platform + status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: status === 'ended' ? pt.dimDot : pt.dot,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: textSec, letterSpacing: '0.03em' }}>
                {pt.label}
              </span>
            </div>

            <span style={{
              fontSize: 11.5, fontWeight: 700, letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: statusBadge.bg,
              color: statusBadge.color,
              padding: '4px 10px', borderRadius: 7,
            }}>
              {statusBadge.label}
            </span>
          </div>

          {/* Name */}
          <p style={{
            fontSize: 15, fontWeight: 700,
            color: textPri,
            margin: '0 0 16px',
            lineHeight: 1.45,
            letterSpacing: '-0.2px',
            minHeight: 44,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {contest.contestName}
          </p>

          {/* Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: textSec, fontSize: 13 }}>
              <CalendarIcon />
              <span>{formatDate(contest.contestStartDate)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: textSec, fontSize: 13 }}>
              <ClockIcon />
              <span>Duration: {durationLabel}</span>
              {timeUntil && status === 'upcoming' && (
                <>
                  <span style={{ color: isDark ? '#2a2a2a' : '#e5e7eb' }}>·</span>
                  <span style={{ color: isDark ? '#4a8af4' : '#3b82f6', fontWeight: 600 }}>
                    in {timeUntil}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: border, margin: '0 22px' }} />

        {/* Actions */}
        <div style={{ padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href={contest.contestUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 14px',
              borderRadius: 9,
              background: isDark ? '#f0f0f0' : '#111111',
              color: isDark ? '#111' : '#fff',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <LinkIcon />
            View Contest
          </a>

          {!isPast && (
            <button
              onClick={handleReminderClick}
              title={hasReminder ? 'Remove reminder' : 'Set reminder'}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '10px 14px',
                borderRadius: 9,
                border: `1.5px solid ${hasReminder
                  ? (isDark ? '#14532d' : '#bbf7d0')
                  : border}`,
                background: hasReminder
                  ? (isDark ? '#052e16' : '#f0fdf4')
                  : 'transparent',
                color: hasReminder
                  ? (isDark ? '#4ade80' : '#16a34a')
                  : textSec,
                fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!hasReminder) { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = textPri; }}}
              onMouseLeave={e => { if (!hasReminder) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}}
            >
              {hasReminder ? <CheckIcon /> : <BellIcon />}
              {hasReminder ? 'Reminder Set' : 'Remind me'}
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <ReminderModal
          contest={contest}
          onClose={() => setShowModal(false)}
          onReminderSet={onReminderSet}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
};

export default ContestCard;
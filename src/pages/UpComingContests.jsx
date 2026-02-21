import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ContestCard from '../components/ContestCard';
import ReminderModal from '../components/ReminderModel';
import { useTheme } from '../context/ThemeContext';

// ── SVG Icons (no heroicons) ──────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const RefreshIcon = ({ spin }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spin ? 'spin 0.7s linear infinite' : 'none' }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const EmptyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="8" y1="15" x2="16" y2="15"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Platform dot colors ───────────────────────────────────────────
const platformDot = {
  codeforces: '#3b82f6',
  codechef:   '#f97316',
  leetcode:   '#f59e0b',
};

const PLATFORMS = ['all', 'codeforces', 'codechef', 'leetcode'];

// ── Main Component ────────────────────────────────────────────────
const UpcomingContests = () => {
  const { isDark } = useTheme();
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContest, setSelectedContest] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [fetchingContests, setFetchingContests] = useState(false);

  useEffect(() => { fetchContests(); }, []);
  useEffect(() => { filterContests(); }, [contests, selectedPlatform, searchQuery]);

  const fetchContests = async () => {
    try {
      setError(null);
      const response = await api.get('/contests/all');
      const now = new Date();
      const upcoming = response.data
        .filter(c => new Date(c.contestStartDate) > now)
        .sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));
      setContests(upcoming);
    } catch (err) {
      setError(`Failed to fetch contests: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterContests = () => {
    let f = contests;
    if (selectedPlatform !== 'all')
      f = f.filter(c => c.platform.toLowerCase() === selectedPlatform);
    if (searchQuery)
      f = f.filter(c => c.contestName.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredContests(f);
  };

  const handleSetReminder = (contest) => {
    setSelectedContest(contest);
    setShowReminderModal(true);
  };

  const handleFetchAllContests = async () => {
    setFetchingContests(true);
    try {
      await Promise.all([
        api.get('/codeforces/fetch').catch(() => {}),
        api.get('/codechef/fetch').catch(() => {}),
        api.get('/leetcode/fetch').catch(() => {}),
      ]);
      setTimeout(fetchContests, 2000);
    } finally {
      setFetchingContests(false);
    }
  };

  // ── Design tokens ──────────────────────────────────────────────
  const bg      = isDark ? '#0a0a0a' : '#f5f5f5';
  const surface  = isDark ? '#111111' : '#ffffff';
  const border   = isDark ? '#1e1e1e' : '#e5e7eb';
  const textPri  = isDark ? '#f0f0f0' : '#111111';
  const textSec  = isDark ? '#777777' : '#6b7280';
  const inputBg  = isDark ? '#161616' : '#fafafa';
  const hoverBg  = isDark ? '#1a1a1a' : '#f3f4f6';

  const btn = {
    padding: '10px 16px',
    borderRadius: 10,
    border: `1.5px solid ${border}`,
    background: 'transparent',
    color: textSec,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: '"DM Sans", sans-serif',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.15s, color 0.15s',
    whiteSpace: 'nowrap',
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <div style={{
        width: 22, height: 22, border: `2px solid ${border}`,
        borderTopColor: textSec, borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
        <div style={{ color: isDark ? '#f87171' : '#dc2626', marginBottom: 16 }}><WarnIcon /></div>
        <p style={{ fontSize: 17, fontWeight: 700, color: textPri, marginBottom: 9 }}>Something went wrong</p>
        <p style={{ fontSize: 14, color: textSec, marginBottom: 24, lineHeight: 1.6 }}>{error}</p>
        <button
          onClick={fetchContests}
          style={{ ...btn, background: isDark ? '#f0f0f0' : '#111', color: isDark ? '#111' : '#fff', border: 'none', padding: '12px 24px' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // ── Page ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: ${textSec}; }
        input:focus { outline: none; }
        select:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 4px; }
      `}</style>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '44px 28px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: textPri, margin: 0, letterSpacing: '-0.4px' }}>
              Upcoming Contests
            </h1>
            <p style={{ fontSize: 14, color: textSec, margin: '6px 0 0' }}>
              {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>

          <button
            onClick={handleFetchAllContests}
            disabled={fetchingContests}
            style={{ ...btn, opacity: fetchingContests ? 0.5 : 1 }}
            onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}
          >
            <RefreshIcon spin={fetchingContests} />
            {fetchingContests ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* ── Filters ── */}
        <div style={{
          background: surface,
          border: `1.5px solid ${border}`,
          borderRadius: 16,
          padding: '18px 20px',
          marginBottom: 28,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 14, color: textSec, display: 'flex', pointerEvents: 'none' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search contests…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 38px',
                border: `1.5px solid ${border}`,
                borderRadius: 10,
                background: inputBg,
                color: textPri,
                fontSize: 14,
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = isDark ? '#444' : '#aaa'}
              onBlur={e => e.target.style.borderColor = border}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 12,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: textSec, fontSize: 18, padding: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Platform tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => {
              const active = selectedPlatform === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  style={{
                    padding: '9px 15px',
                    borderRadius: 10,
                    border: `1.5px solid ${active ? (isDark ? '#e5e5e5' : '#111') : border}`,
                    background: active ? (isDark ? '#f0f0f0' : '#111') : 'transparent',
                    color: active ? (isDark ? '#111' : '#fff') : textSec,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}}
                >
                  {p !== 'all' && (
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: active ? (isDark ? '#666' : '#aaa') : platformDot[p],
                      flexShrink: 0,
                    }} />
                  )}
                  {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Contest count strip ── */}
        {filteredContests.length > 0 && (
          <p style={{ fontSize: 12.5, color: textSec, marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
            Showing {filteredContests.length} result{filteredContests.length !== 1 ? 's' : ''}
            {selectedPlatform !== 'all' ? ` · ${selectedPlatform}` : ''}
            {searchQuery ? ` · "${searchQuery}"` : ''}
          </p>
        )}

        {/* ── Empty State ── */}
        {filteredContests.length === 0 ? (
          <div style={{
            background: surface,
            border: `1.5px solid ${border}`,
            borderRadius: 16,
            padding: '70px 28px',
            textAlign: 'center',
          }}>
            <div style={{ color: textSec, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <EmptyIcon />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: textPri, margin: '0 0 7px' }}>
              No contests found
            </p>
            <p style={{ fontSize: 14, color: textSec, margin: '0 0 24px', lineHeight: 1.6 }}>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : selectedPlatform !== 'all'
                  ? `No upcoming contests on ${selectedPlatform}`
                  : 'No upcoming contests at the moment'}
            </p>
            {(searchQuery || selectedPlatform !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedPlatform('all'); }}
                style={{ ...btn, padding: '11px 20px' }}
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}>
            {filteredContests.map(contest => (
              <ContestCard
                key={`${contest.platform}-${contest.contestId || contest.contestName}`}
                contest={contest}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {showReminderModal && selectedContest && (
        <ReminderModal
          contest={selectedContest}
          onClose={() => { setShowReminderModal(false); setSelectedContest(null); }}
          onReminderSet={() => { setShowReminderModal(false); setSelectedContest(null); }}
        />
      )}
    </div>
  );
};

export default UpcomingContests;
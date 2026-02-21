import React, { useState, useEffect } from 'react';
import ContestCard from '../components/ContestCard';
import { useTheme } from '../context/ThemeContext';

// ── SVG Icons ─────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const TrophyIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M6 2h12v7a6 6 0 0 1-12 0V2z"/><path d="M6 18h12"/><path d="M9 22h6"/><path d="M12 15v7"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const PLATFORMS = ['all', 'codeforces', 'codechef', 'leetcode'];
const platformDots = { codeforces: '#3b82f6', codechef: '#f97316', leetcode: '#f59e0b' };
const CONTESTS_PER_PAGE = 12;

const PastContests = () => {
  const { isDark } = useTheme();
  const [contests, setContests]               = useState([]);
  const [filteredContests, setFiltered]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [searchTerm, setSearchTerm]           = useState('');
  const [selectedPlatform, setPlatform]       = useState('all');
  const [dateRange, setDateRange]             = useState({ startDate: '', endDate: '' });
  const [currentPage, setCurrentPage]         = useState(1);

  useEffect(() => { fetchContests(); }, []);
  useEffect(() => { filterContests(); }, [contests, searchTerm, selectedPlatform, dateRange]);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedPlatform, dateRange]);

  const fetchContests = async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch('https://code-alarm-2.onrender.com/api/contests/all');
      if (!res.ok) throw new Error(await res.text() || 'Failed to fetch');
      const ct = res.headers.get('content-type');
      if (!ct?.includes('application/json')) throw new Error('Response is not JSON');
      const data = await res.json();
      const now = new Date();
      const past = data
        .filter(c => new Date(c.contestEndDate) < now)
        .sort((a, b) => new Date(b.contestEndDate) - new Date(a.contestEndDate));
      setContests(past);
    } catch (err) {
      setError(`Failed to fetch contests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterContests = () => {
    let f = [...contests];
    if (selectedPlatform !== 'all')
      f = f.filter(c => c.platform.toLowerCase() === selectedPlatform);
    if (searchTerm)
      f = f.filter(c => c.contestName.toLowerCase().includes(searchTerm.toLowerCase()));
    if (dateRange.startDate && dateRange.endDate) {
      const s = new Date(dateRange.startDate), e = new Date(dateRange.endDate);
      f = f.filter(c => { const d = new Date(c.contestStartDate); return d >= s && d <= e; });
    }
    setFiltered(f);
  };

  const clearFilters = () => {
    setSearchTerm(''); setPlatform('all');
    setDateRange({ startDate: '', endDate: '' }); setCurrentPage(1);
  };

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const totalPages = Math.ceil(filteredContests.length / CONTESTS_PER_PAGE);
  const start      = (currentPage - 1) * CONTESTS_PER_PAGE;
  const paginated  = filteredContests.slice(start, start + CONTESTS_PER_PAGE);
  const hasFilters = searchTerm || selectedPlatform !== 'all' || dateRange.startDate || dateRange.endDate;

  const handlePage = (n) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ── Tokens ───────────────────────────────────────────────────────
  const bg      = isDark ? '#0a0a0a' : '#f5f5f5';
  const surface  = isDark ? '#111111' : '#ffffff';
  const border   = isDark ? '#1e1e1e' : '#e5e7eb';
  const hoverBorder = isDark ? '#2e2e2e' : '#d1d5db';
  const textPri  = isDark ? '#f0f0f0' : '#111111';
  const textSec  = isDark ? '#666666' : '#9ca3af';
  const inputBg  = isDark ? '#161616' : '#f9fafb';
  const hoverBg  = isDark ? '#1a1a1a' : '#f3f4f6';

  const ghostBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 13px',
    borderRadius: 9, border: `1.5px solid ${border}`,
    background: 'transparent', color: textSec,
    fontSize: 12.5, fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
    cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
  };

  // ── Pagination ───────────────────────────────────────────────────
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const maxV = 5;
    let s = Math.max(1, currentPage - Math.floor(maxV / 2));
    let e = Math.min(totalPages, s + maxV - 1);
    if (e - s < maxV - 1) s = Math.max(1, e - maxV + 1);

    const pages = [];

    const pageBtn = (key, label, page, active = false, icon = null) => (
      <button
        key={key}
        onClick={() => handlePage(page)}
        style={{
          ...ghostBtn,
          padding: '7px 11px',
          background: active ? (isDark ? '#f0f0f0' : '#111') : 'transparent',
          border: `1.5px solid ${active ? (isDark ? '#f0f0f0' : '#111') : border}`,
          color: active ? (isDark ? '#111' : '#fff') : textSec,
          minWidth: 36, justifyContent: 'center',
        }}
        onMouseEnter={ev => { if (!active) { ev.currentTarget.style.background = hoverBg; ev.currentTarget.style.color = textPri; }}}
        onMouseLeave={ev => { if (!active) { ev.currentTarget.style.background = 'transparent'; ev.currentTarget.style.color = textSec; }}}
      >
        {icon || label}
      </button>
    );

    if (currentPage > 1) pages.push(pageBtn('prev', '←', currentPage - 1, false, <ChevronLeftIcon />));
    if (s > 1) {
      pages.push(pageBtn(1, '1', 1));
      if (s > 2) pages.push(<span key="e1" style={{ color: textSec, fontSize: 12, padding: '0 4px' }}>…</span>);
    }
    for (let i = s; i <= e; i++) pages.push(pageBtn(i, i, i, currentPage === i));
    if (e < totalPages) {
      if (e < totalPages - 1) pages.push(<span key="e2" style={{ color: textSec, fontSize: 12, padding: '0 4px' }}>…</span>);
      pages.push(pageBtn(totalPages, totalPages, totalPages));
    }
    if (currentPage < totalPages) pages.push(pageBtn('next', '→', currentPage + 1, false, <ChevronRightIcon />));

    return pages;
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <div style={{ width: 22, height: 22, border: `2px solid ${border}`, borderTopColor: textSec, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
        <div style={{ color: isDark ? '#f87171' : '#dc2626', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><WarnIcon /></div>
        <p style={{ fontSize: 16, fontWeight: 700, color: textPri, margin: '0 0 8px' }}>Failed to load past contests</p>
        <p style={{ fontSize: 13, color: textSec, margin: '0 0 20px', lineHeight: 1.6 }}>{error}</p>
        <button
          onClick={fetchContests}
          style={{ ...ghostBtn, background: isDark ? '#f0f0f0' : '#111', color: isDark ? '#111' : '#fff', border: 'none', padding: '10px 20px' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // ── Page ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: ${isDark ? 'invert(1)' : 'none'}; opacity: 0.5; cursor: pointer; }
        input::placeholder { color: ${textSec}; }
        input:focus, select:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: textPri, margin: '0 0 5px', letterSpacing: '-0.4px' }}>
            Past Contests
          </h1>
          <p style={{ fontSize: 13, color: textSec, margin: 0 }}>
            Browse through completed programming contests
          </p>
        </div>

        {/* ── Filters ── */}
        <div style={{
          background: surface, border: `1.5px solid ${border}`,
          borderRadius: 14, padding: '16px', marginBottom: 20,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>

          {/* Row 1: search + platform tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: 180, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 12, color: textSec, display: 'flex', pointerEvents: 'none' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search contests…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '9px 34px 9px 34px',
                  border: `1.5px solid ${border}`, borderRadius: 9,
                  background: inputBg, color: textPri,
                  fontSize: 13, fontFamily: 'inherit', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = isDark ? '#444' : '#aaa'}
                onBlur={e => e.target.style.borderColor = border}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: textSec, fontSize: 16, padding: 0, display: 'flex', alignItems: 'center' }}>×</button>
              )}
            </div>

            {/* Platform tabs */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {PLATFORMS.map(p => {
                const active = selectedPlatform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    style={{
                      padding: '7px 13px', borderRadius: 8,
                      border: `1.5px solid ${active ? (isDark ? '#e5e5e5' : '#111') : border}`,
                      background: active ? (isDark ? '#f0f0f0' : '#111') : 'transparent',
                      color: active ? (isDark ? '#111' : '#fff') : textSec,
                      fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}}
                  >
                    {p !== 'all' && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? (isDark ? '#666' : '#aaa') : platformDots[p], flexShrink: 0 }} />
                    )}
                    {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: date range */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: textSec, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>
              Date range
            </p>
            {['startDate', 'endDate'].map(key => (
              <div key={key} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: 10, color: textSec, display: 'flex', pointerEvents: 'none' }}><CalendarIcon /></span>
                <input
                  type="date"
                  value={dateRange[key]}
                  onChange={e => setDateRange(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{
                    padding: '8px 12px 8px 30px',
                    border: `1.5px solid ${border}`, borderRadius: 9,
                    background: inputBg, color: textPri,
                    fontSize: 12.5, fontFamily: 'inherit',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = isDark ? '#444' : '#aaa'}
                  onBlur={e => e.target.style.borderColor = border}
                />
              </div>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{ ...ghostBtn }}
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Count strip ── */}
        {filteredContests.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 11.5, color: textSec, margin: 0, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''}
              {selectedPlatform !== 'all' ? ` · ${selectedPlatform}` : ''}
              {searchTerm ? ` · "${searchTerm}"` : ''}
            </p>
            <p style={{ fontSize: 11.5, color: textSec, margin: 0 }}>
              Showing {start + 1}–{Math.min(start + CONTESTS_PER_PAGE, filteredContests.length)} of {filteredContests.length}
            </p>
          </div>
        )}

        {/* ── Empty state ── */}
        {filteredContests.length === 0 ? (
          <div style={{
            background: surface, border: `1.5px solid ${border}`,
            borderRadius: 14, padding: '60px 24px', textAlign: 'center',
          }}>
            <div style={{ color: isDark ? '#2a2a2a' : '#d1d5db', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <TrophyIcon size={36} />
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: textPri, margin: '0 0 6px' }}>No past contests found</p>
            <p style={{ fontSize: 13, color: textSec, margin: '0 0 20px', lineHeight: 1.6 }}>
              {searchTerm
                ? `No contests match "${searchTerm}"`
                : selectedPlatform !== 'all'
                  ? `No past contests on ${selectedPlatform}`
                  : contests.length === 0
                    ? 'No past contests available yet'
                    : 'Try adjusting your filters'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{ ...ghostBtn }}
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPri; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {paginated.map(contest => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isPast={true}
                  formatDuration={formatDuration}
                />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
                  {renderPagination()}
                </div>
                <p style={{ fontSize: 11.5, color: textSec, margin: 0 }}>
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PastContests;
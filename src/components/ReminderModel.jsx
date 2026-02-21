import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

// ── Toast Component ──────────────────────────────────────────────
const Toast = ({ message, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), 2800);
    const done = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(hide); clearTimeout(done); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 24}px)`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#0f0f0f', border: '1px solid #2a2a2a',
      borderRadius: 12, padding: '12px 20px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 14, color: '#e5e5e5',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {message}
    </div>
  );
};

// ── Platform chips ───────────────────────────────────────────────
const platformStyle = {
  CodeChef:   { bg: '#431407', color: '#fb923c', dot: '#f97316' },
  Codeforces: { bg: '#0c1a3a', color: '#60a5fa', dot: '#3b82f6' },
  LeetCode:   { bg: '#3b2600', color: '#fbbf24', dot: '#f59e0b' },
};

// ── Reminder options (no emojis) ─────────────────────────────────
const REMINDER_OPTIONS = [
  { value: 'BEFORE_1_MINUTE',  label: '1 min',    sub: 'before' },
  { value: 'BEFORE_5_MINUTES', label: '5 min',    sub: 'before' },
  { value: 'BEFORE_10_MINUTES',label: '10 min',   sub: 'before' },
  { value: 'BEFORE_15_MINUTES',label: '15 min',   sub: 'before' },
  { value: 'BEFORE_30_MINUTES',label: '30 min',   sub: 'before' },
  { value: 'BEFORE_1_HOUR',    label: '1 hr',     sub: 'before' },
  { value: 'BEFORE_2_HOURS',   label: '2 hrs',    sub: 'before' },
  { value: 'BEFORE_1_DAY',     label: '1 day',    sub: 'before' },
];

// ── Tiny SVG icons ───────────────────────────────────────────────
const BellIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const MailIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/>
  </svg>
);
const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Main Component ───────────────────────────────────────────────
const ReminderModal = ({ contest, onClose, onReminderSet }) => {
  const { isDark } = useTheme();
  const [selectedTime, setSelectedTime] = useState('BEFORE_10_MINUTES');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to set reminders');

      const response = await fetch(`https://code-alarm-2.onrender.com/api/reminders/set/${contest.contestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ reminderTime: selectedTime, customMessage: customMessage.trim() || null }),
      });

      if (!response.ok) {
        let msg = 'Failed to set reminder';
        try { const d = await response.json(); msg = d.error || d.message || msg; } catch {}
        throw new Error(msg);
      }

      const ct = response.headers.get('content-type');
      let reminderData = null;
      if (ct?.includes('application/json')) {
        const txt = await response.text();
        if (txt.trim()) { try { reminderData = JSON.parse(txt); } catch {} }
      }

      const label = REMINDER_OPTIONS.find(o => o.value === selectedTime)?.label ?? '';
      setToast(`Reminder set — ${label} before the contest`);
      if (onReminderSet && reminderData) onReminderSet(reminderData);
      setTimeout(() => onClose(), 3300);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Shared tokens ────────────────────────────────────────────
  const surface  = isDark ? '#111111' : '#ffffff';
  const border   = isDark ? '#222222' : '#e5e7eb';
  const textPri  = isDark ? '#f0f0f0' : '#111111';
  const textSec  = isDark ? '#888888' : '#6b7280';
  const inputBg  = isDark ? '#181818' : '#f9fafb';
  const hoverBg  = isDark ? '#1a1a1a' : '#f3f4f6';

  const pStyle = platformStyle[contest.platform] || { bg: '#1a1a1a', color: '#999', dot: '#666' };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          width: '100%', maxWidth: 480,
          maxHeight: '90vh', overflowY: 'auto',
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 18,
          fontFamily: '"DM Sans", sans-serif',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 20px 60px rgba(0,0,0,0.12)',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: isDark ? '#1c1c1c' : '#f3f4f6',
                border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: textPri,
              }}>
                <BellIcon size={15} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: textPri, letterSpacing: '-0.2px' }}>
                Set Reminder
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent', border: `1px solid ${border}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: textSec, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <XIcon size={14} />
            </button>
          </div>

          {/* Contest Info */}
          <div style={{
            padding: '16px 24px',
            borderBottom: `1px solid ${border}`,
            background: isDark ? '#0d0d0d' : '#fafafa',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {/* Platform badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: pStyle.bg, color: pStyle.color,
                padding: '3px 9px', borderRadius: 6,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: pStyle.dot }} />
                {contest.platform}
              </span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: textPri, margin: '0 0 6px', lineHeight: 1.4 }}>
              {contest.contestName}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: textSec, fontSize: 12 }}>
              <ClockIcon size={12} />
              <span>{formatDate(contest.contestStartDate)}</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 24px' }}>

            {/* When */}
            <p style={{ fontSize: 12, fontWeight: 600, color: textSec, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Notify me
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 22,
            }}>
              {REMINDER_OPTIONS.map(opt => {
                const active = selectedTime === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedTime(opt.value)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 10,
                      border: active
                        ? `1.5px solid ${isDark ? '#e5e5e5' : '#111'}`
                        : `1.5px solid ${border}`,
                      background: active
                        ? (isDark ? '#f0f0f0' : '#111')
                        : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontSize: 14, fontWeight: 700,
                      color: active ? (isDark ? '#111' : '#fff') : textPri,
                      letterSpacing: '-0.3px',
                    }}>
                      {opt.label}
                    </div>
                    <div style={{
                      fontSize: 10, marginTop: 1,
                      color: active ? (isDark ? '#555' : '#aaa') : textSec,
                    }}>
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom message */}
            <p style={{ fontSize: 12, fontWeight: 600, color: textSec, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Note  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— optional</span>
            </p>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="e.g. Prep DP problems beforehand"
                maxLength={200}
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px',
                  border: `1.5px solid ${border}`,
                  borderRadius: 10,
                  background: inputBg,
                  color: textPri,
                  fontSize: 13.5, fontFamily: 'inherit',
                  resize: 'none', outline: 'none',
                  transition: 'border-color 0.15s',
                  lineHeight: 1.5,
                }}
                onFocus={e => e.target.style.borderColor = isDark ? '#444' : '#aaa'}
                onBlur={e => e.target.style.borderColor = border}
              />
              <span style={{
                position: 'absolute', bottom: 9, right: 12,
                fontSize: 11, color: textSec,
                pointerEvents: 'none',
              }}>
                {customMessage.length}/200
              </span>
            </div>

            {/* Email note */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '11px 14px',
              borderRadius: 10,
              border: `1.5px solid ${border}`,
              background: isDark ? '#0d0d0d' : '#f9fafb',
              marginBottom: 20,
            }}>
              <MailIcon size={13} style={{ flexShrink: 0, marginTop: 1, color: textSec }} />
              <p style={{ margin: 0, fontSize: 12, color: textSec, lineHeight: 1.6 }}>
                Reminder sends to your registered email. Check profile settings if you're not receiving emails.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                border: '1.5px solid #7f1d1d',
                background: isDark ? '#1c0a0a' : '#fef2f2',
                fontSize: 13, color: isDark ? '#f87171' : '#b91c1c',
              }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1, padding: '11px',
                  borderRadius: 10, border: `1.5px solid ${border}`,
                  background: 'transparent', cursor: 'pointer',
                  fontSize: 13.5, fontWeight: 600, color: textSec,
                  fontFamily: 'inherit', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 2, padding: '11px',
                  borderRadius: 10,
                  border: 'none',
                  background: isDark ? '#f0f0f0' : '#111111',
                  color: isDark ? '#111' : '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 13.5, fontWeight: 700,
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {loading ? (
                  <>
                    <svg style={{ animation: 'spin 0.8s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Setting…
                  </>
                ) : (
                  <>
                    <BellIcon size={14} color="currentColor" />
                    Set Reminder
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default ReminderModal;
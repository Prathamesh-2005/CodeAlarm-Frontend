import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updatePreferences, getUserProfile, getUserReminders, deleteReminder } from '../services/api';
import { Trophy, Sparkles, User, Settings, Bell, Trash2, RefreshCw, ExternalLink, X, Check, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isManualClose, setIsManualClose] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsVisible(true), 50);
    
    if (toast.type !== 'confirm' && !isManualClose) {
      const duration = toast.type === 'success' ? 5000 : (toast.duration || 4000);
      const timer = setTimeout(() => handleClose(), duration);
      return () => {
        clearTimeout(timer);
        clearTimeout(mountTimer);
      };
    }
    
    return () => clearTimeout(mountTimer);
  }, [toast, onClose, isManualClose]);

  const handleClose = () => {
    setIsManualClose(true);
    setIsVisible(false);
    setTimeout(() => onClose(), 1000);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success': return { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderColor: '#34d399' };
      case 'error': return { background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)', borderColor: '#fca5a5' };
      case 'confirm': return { background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', borderColor: '#c4b5fd' };
      case 'info': return { background: 'linear-gradient(135deg, #334155 0%, #475569 100%)', borderColor: '#64748b' };
      default: return { background: 'linear-gradient(135deg, #334155 0%, #475569 100%)', borderColor: '#64748b' };
    }
  };

  const getIcon = () => {
    const iconStyle = { width: 20, height: 20, color: '#fff' };
    switch (toast.type) {
      case 'success': return <Check style={iconStyle} />;
      case 'error': return <X style={iconStyle} />;
      case 'confirm': return <AlertTriangle style={iconStyle} />;
      case 'info': return <Info style={iconStyle} />;
      default: return <Info style={iconStyle} />;
    }
  };

  const showProgressBar = toast.type !== 'confirm';
  const progressDuration = toast.type === 'success' ? 5000 : (toast.duration || 4000);
  const toastStyle = getToastStyles();

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 50,
      transition: 'all 0.5s ease-out',
      transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
      opacity: isVisible ? 1 : 0,
    }}>
      <div style={{
        minWidth: 320, maxWidth: 448, width: '100%',
        ...toastStyle,
        backdropFilter: 'blur(12px)',
        borderRadius: 12,
        border: `2px solid ${toastStyle.borderColor}`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: '"DM Sans", sans-serif',
      }}>
        {showProgressBar && (
          <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
            <div style={{
              height: '100%',
              background: 'rgba(255,255,255,0.6)',
              position: 'absolute',
              top: 0,
              left: 0,
              animation: `shrink ${progressDuration}ms linear forwards`,
            }} />
          </div>
        )}
        
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{getIcon()}</div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, color: '#fff', margin: 0 }}>
                {toast.message}
              </p>
              
              {toast.type === 'confirm' && (
                <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => { toast.onConfirm?.(); handleClose(); }}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleClose}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ flexShrink: 0 }}>
              <button
                onClick={handleClose}
                style={{
                  display: 'inline-flex',
                  color: 'rgba(255,255,255,0.8)',
                  transition: 'all 0.2s',
                  borderRadius: '50%',
                  padding: 4,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [preferences, setPreferences] = useState({
    defaultReminderTime: 'BEFORE_10_MINUTES',
    emailNotificationsEnabled: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [remindersError, setRemindersError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (type, message, duration = 3000, onConfirm = null) => {
    setToast({ type, message, duration, onConfirm });
  };

  const hideToast = () => setToast(null);

  useEffect(() => {
    if (user) {
      setPreferences({
        defaultReminderTime: user.defaultReminderTime || 'BEFORE_10_MINUTES',
        emailNotificationsEnabled: user.emailNotificationsEnabled !== undefined ? user.emailNotificationsEnabled : true
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'reminders') fetchReminders();
  }, [activeTab]);

  const fetchReminders = async () => {
    setRemindersLoading(true);
    setRemindersError('');
    try {
      const response = await getUserReminders();
      if (!response.data || !Array.isArray(response.data)) {
        setReminders([]);
        return;
      }

      const uniqueReminders = response.data.filter(
        (reminder, index, self) =>
          index === self.findIndex(r => {
            if (r.id === reminder.id) return true;
            const rContestId = r.contest?.id || r.contest_id;
            const reminderContestId = reminder.contest?.id || reminder.contest_id;
            return rContestId && reminderContestId && rContestId === reminderContestId;
          })
      );

      setReminders(uniqueReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setRemindersError('Failed to load reminders. Please try again.');
    } finally {
      setRemindersLoading(false);
    }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await updatePreferences(preferences);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
      showToast('success', 'Preferences updated successfully!');
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      let errorMessage = 'Failed to update preferences. Please try again.';
      
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId, contestName) => {
    showToast('confirm', `Are you sure you want to delete the reminder for "${contestName}"?`, 0, async () => {
      try {
        await deleteReminder(reminderId);
        showToast('success', 'Reminder deleted successfully');
        fetchReminders();
      } catch (error) {
        console.error('Error deleting reminder:', error);
        showToast('error', 'Failed to delete reminder. Please try again.');
      }
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = typeof timestamp === 'number' 
        ? new Date(timestamp)
        : new Date(timestamp);
      
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, timestamp);
      return 'Invalid Date';
    }
  };

  const formatReminderTime = (reminderTime) => {
    const timeMap = {
      'BEFORE_1_MINUTE': '1 minute before',
      'BEFORE_5_MINUTES': '5 minutes before',
      'BEFORE_10_MINUTES': '10 minutes before',
      'BEFORE_15_MINUTES': '15 minutes before',
      'BEFORE_30_MINUTES': '30 minutes before',
      'BEFORE_1_HOUR': '1 hour before',
      'BEFORE_2_HOURS': '2 hours before',
      'BEFORE_1_DAY': '1 day before'
    };
    return timeMap[reminderTime] || reminderTime || 'N/A';
  };

  const getReminderStatus = (reminder) => {
    const contestStartDate = reminder.contest?.contestStartDate || reminder.contestStartDate;
    
    if (!contestStartDate) return { status: 'unknown', color: 'gray' };
    
    const now = new Date();
    const startDate = new Date(typeof contestStartDate === 'number' ? contestStartDate : contestStartDate);
    
    if (isNaN(startDate.getTime())) return { status: 'unknown', color: 'gray' };
    
    const timeDiff = startDate.getTime() - now.getTime();
    
    if (timeDiff < 0) return { status: 'past', color: 'red' };
    else if (timeDiff < 86400000) return { status: 'upcoming', color: 'yellow' };
    else return { status: 'scheduled', color: 'green' };
  };

  const getContestName = (reminder) => {
    if (reminder.contest?.contestName) return reminder.contest.contestName;
    
    const possibleNamePaths = [
      reminder.contest?.name,
      reminder.contestName,
      reminder.name,
      reminder.contest?.title,
      reminder.title
    ];

    const contestName = possibleNamePaths.find(name => name && name.trim() !== '');
    
    if (!contestName) {
      return reminder.contest?.contestId 
        ? `Contest ${reminder.contest.contestId}`
        : reminder.contest_id 
          ? `Contest ${reminder.contest_id}`
          : 'Unnamed Contest';
    }

    return contestName;
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'codeforces': return { bg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', text: isDark ? '#60a5fa' : '#1e40af' };
      case 'codechef': return { bg: isDark ? 'rgba(249, 115, 22, 0.2)' : '#fed7aa', text: isDark ? '#fb923c' : '#c2410c' };
      case 'leetcode': return { bg: isDark ? 'rgba(234, 179, 8, 0.2)' : '#fef3c7', text: isDark ? '#facc15' : '#a16207' };
      default: return { bg: isDark ? 'rgba(168, 85, 247, 0.2)' : '#e9d5ff', text: isDark ? '#c084fc' : '#7c3aed' };
    }
  };

  // ── Design tokens ────────────────────────────────────────────────
  const bg = isDark ? '#0a0a0a' : '#f5f5f5';
  const surface = isDark ? '#111111' : '#ffffff';
  const border = isDark ? '#1e1e1e' : '#e5e7eb';
  const hoverBorder = isDark ? '#2e2e2e' : '#d1d5db';
  const textPri = isDark ? '#f0f0f0' : '#111111';
  const textSec = isDark ? '#666666' : '#9ca3af';
  const inputBg = isDark ? '#161616' : '#f9fafb';
  const activeBg = isDark ? '#1e1e1e' : '#f0f0f0';

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
        <div style={{
          textAlign: 'center',
          padding: 32,
          borderRadius: 16,
          border: `1.5px solid ${border}`,
          background: surface,
        }}>
          <div style={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: inputBg,
          }}>
            <User style={{ width: 32, height: 32, color: textSec }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: textPri }}>
            Authentication Required
          </h2>
          <p style={{ color: textSec, margin: 0 }}>Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {toast && <Toast toast={toast} onClose={hideToast} />}

      {/* Header */}
      <div style={{
        width: '100%',
        padding: '32px 24px',
        borderBottom: `1.5px solid ${border}`,
        background: surface,
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: textPri, letterSpacing: '-0.4px' }}>
                Profile
              </h1>
              <p style={{ fontSize: 14, color: textSec, margin: 0 }}>
                Manage your account settings and preferences
              </p>
            </div>
            <div style={{ display: 'none' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: inputBg,
              }}>
                <User style={{ width: 24, height: 24, color: textSec }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '44px 28px' }}>
        <div style={{
          borderRadius: 16,
          border: `1.5px solid ${border}`,
          background: surface,
        }}>
          
          {/* Message */}
          {message.text && (
            <div style={{
              margin: '24px 24px 0',
              padding: 12,
              borderRadius: 10,
              border: `1.5px solid ${message.type === 'success' 
                ? (isDark ? '#065f46' : '#bbf7d0')
                : (isDark ? '#7f1d1d' : '#fecaca')}`,
              background: message.type === 'success'
                ? (isDark ? 'rgba(5, 150, 105, 0.1)' : '#f0fdf4')
                : (isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2'),
              color: message.type === 'success'
                ? (isDark ? '#4ade80' : '#16a34a')
                : (isDark ? '#f87171' : '#dc2626'),
              fontSize: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  {message.type === 'success' ? (
                    <svg style={{ height: 16, width: 16 }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg style={{ height: 16, width: 16 }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div style={{ marginLeft: 12 }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{message.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ borderBottom: `1.5px solid ${border}` }}>
            <nav style={{ display: 'flex', gap: 0, padding: '0 24px', marginBottom: -2 }}>
              {[
                { key: 'profile', label: 'Profile', icon: User },
                { key: 'preferences', label: 'Preferences', icon: Settings },
                { key: 'reminders', label: 'Reminders', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '14px 18px',
                    fontWeight: 600,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.15s',
                    color: activeTab === tab.key ? textPri : textSec,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? `2px solid ${textPri}` : '2px solid transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = textPri; }}
                  onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = textSec; }}
                >
                  <tab.icon style={{ width: 16, height: 16 }} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div style={{ padding: '32px 28px' }}>
            {activeTab === 'profile' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Username', value: user.username, icon: User },
                    { label: 'Email', value: user.email, iconPath: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'First Name', value: user.firstName, icon: User },
                    { label: 'Last Name', value: user.lastName, icon: User },
                    { label: 'Member Since', value: formatDate(user.createdAt), iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                    { label: 'Last Login', value: formatDate(user.lastLogin), iconPath: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' }
                  ].map((field, index) => (
                    <div key={index} style={{
                      borderRadius: 12,
                      padding: 18,
                      border: `1.5px solid ${border}`,
                      background: inputBg,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: surface,
                          border: `1.5px solid ${border}`,
                        }}>
                          {field.iconPath ? (
                            <svg style={{ width: 20, height: 20, color: textSec }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.iconPath} />
                            </svg>
                          ) : (
                            <field.icon style={{ width: 20, height: 20, color: textSec }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: textSec }}>
                            {field.label}
                          </label>
                          <div style={{ fontSize: 14, fontWeight: 600, color: textPri, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {field.value || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handlePreferencesUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{
                  borderRadius: 16,
                  padding: 24,
                  border: `1.5px solid ${border}`,
                  background: inputBg,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: surface,
                      border: `1.5px solid ${border}`,
                    }}>
                      <svg style={{ width: 20, height: 20, color: textSec }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: textPri, margin: 0 }}>
                      Default Reminder Time
                    </h3>
                  </div>
                  <select
                    value={preferences.defaultReminderTime}
                    onChange={(e) => setPreferences({...preferences, defaultReminderTime: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: `1.5px solid ${border}`,
                      borderRadius: 10,
                      fontSize: 14,
                      fontFamily: 'inherit',
                      fontWeight: 500,
                      background: surface,
                      color: textPri,
                      outline: 'none',
                    }}
                  >
                    <option value="BEFORE_1_MINUTE">1 minute before</option>
                    <option value="BEFORE_5_MINUTES">5 minutes before</option>
                    <option value="BEFORE_10_MINUTES">10 minutes before</option>
                    <option value="BEFORE_15_MINUTES">15 minutes before</option>
                    <option value="BEFORE_30_MINUTES">30 minutes before</option>
                    <option value="BEFORE_1_HOUR">1 hour before</option>
                    <option value="BEFORE_2_HOURS">2 hours before</option>
                    <option value="BEFORE_1_DAY">1 day before</option>
                  </select>
                </div>

                <div style={{
                  borderRadius: 16,
                  padding: 24,
                  border: `1.5px solid ${border}`,
                  background: inputBg,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: surface,
                        border: `1.5px solid ${border}`,
                      }}>
                        <svg style={{ width: 20, height: 20, color: textSec }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: textPri, margin: '0 0 4px' }}>
                          Email Notifications
                        </h3>
                        <p style={{ fontSize: 13, color: textSec, margin: 0 }}>
                          Receive email notifications for your reminders
                        </p>
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotificationsEnabled}
                        onChange={(e) => setPreferences({...preferences, emailNotificationsEnabled: e.target.checked})}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                      />
                      <div style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        background: preferences.emailNotificationsEnabled ? textPri : (isDark ? '#374151' : '#d1d5db'),
                        position: 'relative',
                        transition: 'background 0.15s',
                      }}>
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#fff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          position: 'absolute',
                          top: 2,
                          left: preferences.emailNotificationsEnabled ? 22 : 2,
                          transition: 'left 0.15s',
                        }} />
                      </div>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '10px 18px',
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      borderRadius: 10,
                      border: 'none',
                      background: textPri,
                      color: isDark ? '#111' : '#fff',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.5 : 1,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}
                  >
                    {loading ? (
                      <>
                        <svg style={{ animation: 'spin 0.7s linear infinite', marginRight: 8, height: 16, width: 16 }} fill="none" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Settings style={{ width: 16, height: 16, marginRight: 8 }} />
                        Update Preferences
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'reminders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <h3 style={{
                    fontSize: 19,
                    fontWeight: 700,
                    color: textPri,
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <Bell style={{ width: 20, height: 20, color: textSec }} />
                    Your Reminders
                  </h3>
                  <button
                    onClick={fetchReminders}
                    disabled={remindersLoading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '9px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      borderRadius: 10,
                      border: `1.5px solid ${border}`,
                      background: 'transparent',
                      color: textSec,
                      cursor: remindersLoading ? 'not-allowed' : 'pointer',
                      opacity: remindersLoading ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!remindersLoading) { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = textPri; }}}
                    onMouseLeave={e => { if (!remindersLoading) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSec; }}}
                  >
                    <RefreshCw style={{ width: 16, height: 16, marginRight: 8, animation: remindersLoading ? 'spin 0.7s linear infinite' : 'none' }} />
                    Refresh
                  </button>
                </div>

                {remindersLoading && (
                  <div style={{
                    borderRadius: 16,
                    padding: 32,
                    border: `1.5px solid ${border}`,
                    background: inputBg,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{
                        animation: 'spin 0.7s linear infinite',
                        borderRadius: '50%',
                        height: 24,
                        width: 24,
                        border: `2px solid ${border}`,
                        borderTopColor: textSec,
                      }} />
                      <span style={{ marginLeft: 12, fontWeight: 600, fontSize: 14, color: textPri }}>
                        Loading reminders...
                      </span>
                    </div>
                  </div>
                )}

                {remindersError && (
                  <div style={{
                    borderRadius: 16,
                    padding: 16,
                    border: `1.5px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
                    background: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
                    color: isDark ? '#f87171' : '#dc2626',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <svg style={{ height: 20, width: 20, marginRight: 12 }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{remindersError}</span>
                    </div>
                  </div>
                )}

                {!remindersLoading && !remindersError && (
                  <>
                    {reminders.length === 0 ? (
                      <div style={{
                        borderRadius: 16,
                        padding: 48,
                        border: `1.5px solid ${border}`,
                        background: inputBg,
                        textAlign: 'center',
                      }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          margin: '0 auto 16px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: surface,
                          border: `1.5px solid ${border}`,
                        }}>
                          <Bell style={{ width: 24, height: 24, color: textSec }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: textPri }}>
                          No Reminders Yet
                        </h3>
                        <p style={{ fontSize: 14, marginBottom: 16, color: textSec }}>
                          You haven't set up any contest reminders yet.
                        </p>
                        <a
                          href="/upcoming"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 16px',
                            fontSize: 14,
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            borderRadius: 10,
                            background: textPri,
                            color: isDark ? '#111' : '#fff',
                            textDecoration: 'none',
                            transition: 'opacity 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <ExternalLink style={{ width: 16, height: 16, marginRight: 8 }} />
                          Browse Contests
                        </a>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: 16 }}>
                        {reminders.map((reminder) => {
                          const status = getReminderStatus(reminder);
                          const contestName = getContestName(reminder);
                          const platform = reminder.contest?.platform || 'Unknown';
                          const platformColor = getPlatformColor(platform);
                          
                          const statusColors = {
                            green: { bg: isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7', text: isDark ? '#4ade80' : '#16a34a', emoji: '📅' },
                            yellow: { bg: isDark ? 'rgba(234, 179, 8, 0.2)' : '#fef3c7', text: isDark ? '#facc15' : '#a16207', emoji: '⏰' },
                            red: { bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', text: isDark ? '#f87171' : '#dc2626', emoji: '✅' },
                            gray: { bg: isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6', text: textSec, emoji: '❓' },
                          };
                          const statusColor = statusColors[status.color] || statusColors.gray;
                          
                          return (
                            <div
                              key={reminder.id}
                              style={{
                                borderRadius: 16,
                                padding: 24,
                                border: `1.5px solid ${border}`,
                                background: inputBg,
                                transition: 'border-color 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = hoverBorder}
                              onMouseLeave={e => e.currentTarget.style.borderColor = border}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {/* Badges */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                    <div style={{
                                      padding: '4px 10px',
                                      borderRadius: 7,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      background: platformColor.bg,
                                      color: platformColor.text,
                                    }}>
                                      {platform}
                                    </div>
                                    <div style={{
                                      padding: '4px 10px',
                                      borderRadius: 7,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      background: statusColor.bg,
                                      color: statusColor.text,
                                    }}>
                                      {statusColor.emoji} {status.status === 'upcoming' ? 'Soon' :
                                       status.status === 'past' ? 'Past' :
                                       status.status === 'scheduled' ? 'Scheduled' : 'Unknown'}
                                    </div>
                                  </div>
                                  
                                  <h4 style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    marginBottom: 16,
                                    color: textPri,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {contestName}
                                  </h4>
                                  
                                  {/* Details Grid */}
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: 16,
                                    fontSize: 14,
                                  }}>
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', color: textSec, marginBottom: 4 }}>
                                        <svg style={{ width: 16, height: 16, marginRight: 8 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span style={{ fontWeight: 600 }}>Start Time:</span>
                                      </div>
                                      <div style={{ fontWeight: 600, marginLeft: 24, color: textPri }}>
                                        {formatDate(reminder.contest?.contestStartDate || reminder.contestStartDate)}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', color: textSec, marginBottom: 4 }}>
                                        <Bell style={{ width: 16, height: 16, marginRight: 8 }} />
                                        <span style={{ fontWeight: 600 }}>Reminder:</span>
                                      </div>
                                      <div style={{ fontWeight: 600, marginLeft: 24, color: textPri }}>
                                        {formatReminderTime(reminder.reminderTime)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Contest URL */}
                                  {(reminder.contest?.contestUrl || reminder.contestUrl) && (
                                    <div style={{ marginTop: 16 }}>
                                      <a
                                        href={reminder.contest?.contestUrl || reminder.contestUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          fontSize: 13,
                                          fontWeight: 600,
                                          color: textSec,
                                          textDecoration: 'none',
                                          transition: 'color 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = textPri}
                                        onMouseLeave={e => e.currentTarget.style.color = textSec}
                                      >
                                        <ExternalLink style={{ width: 16, height: 16, marginRight: 6 }} />
                                        View Contest
                                      </a>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Delete Button */}
                                <div style={{ flexShrink: 0, marginLeft: 16 }}>
                                  <button
                                    onClick={() => handleDeleteReminder(reminder.id, contestName)}
                                    title="Delete Reminder"
                                    style={{
                                      padding: 8,
                                      borderRadius: 10,
                                      border: 'none',
                                      background: 'transparent',
                                      color: isDark ? '#f87171' : '#dc2626',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.background = isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2';
                                      e.currentTarget.style.color = isDark ? '#fca5a5' : '#b91c1c';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = isDark ? '#f87171' : '#dc2626';
                                    }}
                                  >
                                    <Trash2 style={{ width: 20, height: 20 }} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;

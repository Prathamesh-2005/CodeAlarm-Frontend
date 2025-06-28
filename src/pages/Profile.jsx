import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updatePreferences, getUserProfile, getUserReminders, deleteReminder } from '../services/api';
import { Trophy, Sparkles, User, Settings, Bell, Trash2, RefreshCw, ExternalLink, X, Check, AlertTriangle } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isManualClose, setIsManualClose] = useState(false);

  useEffect(() => {
    // Small delay to ensure proper mounting, then trigger animation
    const mountTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    if (toast.type !== 'confirm' && !isManualClose) {
      // Fixed: Reasonable duration for all message types
      const duration = toast.type === 'success' ? 5000 : (toast.duration || 4000);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
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
    setTimeout(() => {
      onClose();
    }, 1000); // Wait for exit animation
  };

  // ... rest of the component remains the same ...


  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-600/90 to-green-600/90 border-emerald-500/50';
      case 'error':
        return 'bg-gradient-to-r from-red-600/90 to-rose-600/90 border-red-500/50';
      case 'confirm':
        return 'bg-gradient-to-r from-purple-600/90 to-violet-600/90 border-purple-500/50';
      case 'info':
        return 'bg-gradient-to-r from-slate-700/90 to-slate-800/90 border-slate-600/50';
      default:
        return 'bg-gradient-to-r from-slate-700/90 to-slate-800/90 border-slate-600/50';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-white" />;
      case 'error':
        return <X className="w-5 h-5 text-white" />;
      case 'confirm':
        return <AlertTriangle className="w-5 h-5 text-white" />;
      case 'info':
        return <Info className="w-5 h-5 text-white" />;
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  // Fixed: Progress bar duration matches toast duration
  const showProgressBar = toast.type !== 'confirm';
  const progressDuration = toast.type === 'success' ? 5000 : (toast.duration || 4000);

  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ease-out transform ${
      isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`
        min-w-80 max-w-md w-full 
        backdrop-blur-md rounded-xl border-2 
        shadow-2xl shadow-black/20
        text-white
        overflow-hidden
        ${getToastStyles()}
      `}>
        {/* Progress bar */}
        {showProgressBar && (
          <div className="h-1 bg-white/20 relative">
            <div 
              className="h-full bg-white/60 absolute top-0 left-0"
              style={{
                animation: `shrink ${progressDuration}ms linear forwards`
              }}
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-relaxed text-white">
                {toast.message}
              </p>
              
              {/* Confirm buttons */}
              {toast.type === 'confirm' && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      toast.onConfirm?.();
                      handleClose();
                    }}
                    className="
                      bg-white/20 hover:bg-white/30 
                      text-white px-4 py-2 rounded-lg 
                      text-sm font-medium 
                      transition-all duration-200 
                      backdrop-blur-sm
                      border border-white/30
                      hover:scale-105
                    "
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleClose}
                    className="
                      bg-white/10 hover:bg-white/20 
                      text-white px-4 py-2 rounded-lg 
                      text-sm font-medium 
                      transition-all duration-200 
                      backdrop-blur-sm
                      border border-white/20
                      hover:scale-105
                    "
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            {/* Close button */}
            <div className="flex-shrink-0">
              <button
                className="
                  inline-flex text-white/80 hover:text-white 
                  focus:outline-none focus:ring-2 focus:ring-white/50 
                  transition-all duration-200 rounded-full p-1
                  hover:bg-white/20
                "
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for progress bar animation */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
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

  // Toast functions
  const showToast = (type, message, duration = 3000, onConfirm = null) => {
    setToast({ type, message, duration, onConfirm });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (user) {
      setPreferences({
        defaultReminderTime: user.defaultReminderTime || 'BEFORE_10_MINUTES',
        emailNotificationsEnabled: user.emailNotificationsEnabled !== undefined ? user.emailNotificationsEnabled : true
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'reminders') {
      fetchReminders();
    }
  }, [activeTab]);

  const fetchReminders = async () => {
    setRemindersLoading(true);
    setRemindersError('');
    try {
      const response = await getUserReminders();
      console.log('Complete API response:', response);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid reminders data format:', response.data);
        setReminders([]);
        return;
      }

      // Log each reminder's structure
      response.data.forEach(reminder => {
        console.log('Reminder:', {
          id: reminder.id,
          contestId: reminder.contest_id,
          contest: reminder.contest,
          name: reminder.contest?.name || reminder.contestName,
          platform: reminder.contest?.platform
        });
      });

      // Fixed duplicate filtering logic
      const uniqueReminders = response.data.filter(
        (reminder, index, self) =>
          index === self.findIndex(r => {
            // Check for same reminder ID first
            if (r.id === reminder.id) return true;
            
            // Then check for same contest
            const rContestId = r.contest?.id || r.contest_id;
            const reminderContestId = reminder.contest?.id || reminder.contest_id;
            
            return rContestId && reminderContestId && rContestId === reminderContestId;
          })
      );

      console.log('Filtered reminders:', uniqueReminders);
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
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
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
      hideToast();
      
      try {
        await deleteReminder(reminderId);
        setReminders(reminders.filter(r => r.id !== reminderId));
        setMessage({ type: 'success', text: 'Reminder deleted successfully!' });
        showToast('success', 'Reminder deleted successfully!');
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } catch (error) {
        console.error('Error deleting reminder:', error);
        let errorMessage = 'Failed to delete reminder. Please try again.';
        
        if (error.response?.status === 403) {
          errorMessage = 'Access denied. Cannot delete reminder.';
        }
        
        setMessage({ type: 'error', text: errorMessage });
        showToast('error', errorMessage);
      }
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle both string timestamps and numbers
      const date = new Date(typeof timestamp === 'string' 
        ? timestamp.length > 10 ? timestamp : parseInt(timestamp) * 1000
        : timestamp * 1000);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp:', timestamp);
        return 'Invalid Date';
      }
      
      // Format with timezone consideration
      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
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
    // Handle both nested contest object and direct properties
    const contestStartDate = reminder.contest?.contestStartDate || reminder.contestStartDate;
    
    if (!contestStartDate) {
      return { status: 'no-date', color: 'gray' };
    }
    
    const now = new Date();
    const startDate = new Date(
      typeof contestStartDate === 'number' ? contestStartDate : contestStartDate
    );
    
    if (isNaN(startDate.getTime())) {
      return { status: 'invalid-date', color: 'gray' };
    }
    
    const timeDiff = startDate.getTime() - now.getTime();
    
    if (timeDiff < 0) {
      return { status: 'past', color: 'red' };
    } else if (timeDiff < 24 * 60 * 60 * 1000) { // Less than 1 day
      return { status: 'upcoming', color: 'yellow' };
    } else {
      return { status: 'scheduled', color: 'green' };
    }
  };

  const getContestName = (reminder) => {
    // First check contest.contestName
    if (reminder.contest?.contestName) {
      return reminder.contest.contestName;
    }
    // Then check other possible locations
    const possibleNamePaths = [
      reminder.contest?.name,
      reminder.contestName,
      reminder.name,
      reminder.contest?.title,
      reminder.title
    ];

    // Return the first truthy value found
    const contestName = possibleNamePaths.find(name => name && name.trim() !== '');
    
    // Fallback to contest ID if no name found
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
      case 'codeforces': return 'from-blue-500 to-blue-600';
      case 'codechef': return 'from-orange-500 to-orange-600';
      case 'leetcode': return 'from-yellow-500 to-yellow-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
          <p className="text-gray-300">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800">
      {/* Toast Component */}
      {toast && <Toast toast={toast} onClose={hideToast} />}

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800 px-6 py-10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-16 h-16 bg-purple-400 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-blue-400 rounded-full blur-lg"></div>
          <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-indigo-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-sm">
                Your Profile 👤
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl drop-shadow-sm">
                Manage your account settings, preferences, and reminders ✨
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-700/60 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-600/50">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-200 text-sm font-medium">Welcome back, {user.firstName || user.username}!</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-purple-400/30">
                <User className="h-12 w-12 text-purple-400 drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-white/20">
          
          {/* Message */}
          {message.text && (
            <div className={`mx-6 mt-6 p-3 rounded-lg border-l-4 backdrop-blur-sm ${
              message.type === 'success' 
                ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400' 
                : 'bg-red-500/20 text-red-100 border-red-400'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-white/20 bg-black/20">
            <nav className="-mb-px flex space-x-0 px-6">
              {[
                { key: 'profile', label: 'Profile', icon: User },
                { key: 'preferences', label: 'Preferences', icon: Settings },
                { key: 'reminders', label: 'Reminders', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-6 border-b-3 font-medium text-sm flex items-center space-x-2 transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-purple-400 text-purple-300 bg-white/10'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: 'Username', value: user.username, icon: User },
                    { label: 'Email', value: user.email, icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'First Name', value: user.firstName, icon: User },
                    { label: 'Last Name', value: user.lastName, icon: User },
                    { label: 'Member Since', value: formatDate(user.createdAt), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                    { label: 'Last Login', value: formatDate(user.lastLogin), icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' }
                  ].map((field, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg transition-colors duration-300 hover:bg-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-lg flex items-center justify-center shadow-md">
                          {typeof field.icon === 'string' ? (
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                            </svg>
                          ) : (
                            <field.icon className="w-5 h-5 text-purple-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{field.label}</label>
                          <div className="text-sm text-white font-medium truncate">
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
              <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Default Reminder Time</h3>
                  </div>
                  <select
                    value={preferences.defaultReminderTime}
                    onChange={(e) => setPreferences({...preferences, defaultReminderTime: e.target.value})}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white bg-white/10 backdrop-blur-sm text-sm appearance-none cursor-pointer hover:bg-white/15 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="BEFORE_1_MINUTE" className="bg-gray-800 text-white">1 minute before</option>
                    <option value="BEFORE_5_MINUTES" className="bg-gray-800 text-white">5 minutes before</option>
                    <option value="BEFORE_10_MINUTES" className="bg-gray-800 text-white">10 minutes before</option>
                    <option value="BEFORE_15_MINUTES" className="bg-gray-800 text-white">15 minutes before</option>
                    <option value="BEFORE_30_MINUTES" className="bg-gray-800 text-white">30 minutes before</option>
                    <option value="BEFORE_1_HOUR" className="bg-gray-800 text-white">1 hour before</option>
                    <option value="BEFORE_2_HOURS" className="bg-gray-800 text-white">2 hours before</option>
                    <option value="BEFORE_1_DAY" className="bg-gray-800 text-white">1 day before</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Email Notifications</h3>
                        <p className="text-gray-300 text-sm mt-1">Receive email notifications for your reminders</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotificationsEnabled}
                        onChange={(e) => setPreferences({...preferences, emailNotificationsEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 shadow-md"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8-8h8a8 8 0 018 8v.01M12 12l4 4m0 0l-4 4m4-4H8"></path>
                           </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        Update Preferences
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'reminders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Bell className="w-6 h-6 mr-2 text-purple-400" />
                    Your Reminders
                  </h3>
                  <button
                    onClick={fetchReminders}
                    disabled={remindersLoading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${remindersLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {remindersLoading && (
                  <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-lg">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                      <span className="ml-3 text-white font-medium">Loading reminders...</span>
                    </div>
                  </div>
                )}

                {remindersError && (
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/40 shadow-lg">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-100 font-medium">{remindersError}</span>
                    </div>
                  </div>
                )}

                {!remindersLoading && !remindersError && (
                  <>
                    {reminders.length === 0 ? (
                      <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-lg text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center">
                          <Bell className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No Reminders Yet</h3>
                        <p className="text-gray-300 mb-4">You haven't set up any contest reminders yet.</p>
                        <a 
                          href="/upcoming" 
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Browse Contests
                        </a>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {reminders.map((reminder) => {
                          const status = getReminderStatus(reminder);
                          const contestName = getContestName(reminder);
                          const platform = reminder.contest?.platform || 'Unknown';
                          
                          return (
                            <div 
                              key={reminder.id}
                              className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  {/* Contest Name and Platform */}
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getPlatformColor(platform)} shadow-md`}>
                                      {platform}
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      status.color === 'green' ? 'bg-green-500/20 text-green-300 border border-green-500/40' :
                                      status.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
                                      status.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                                      'bg-gray-500/20 text-gray-300 border border-gray-500/40'
                                    }`}>
                                      {status.status === 'upcoming' ? '⏰ Soon' :
                                       status.status === 'past' ? '✅ Past' :
                                       status.status === 'scheduled' ? '📅 Scheduled' : '❓ Unknown'}
                                    </div>
                                  </div>
                                  
                                  <h4 className="text-lg font-bold text-white mb-2 truncate">
                                    {contestName}
                                  </h4>
                                  
                                  {/* Contest Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                      <div className="flex items-center text-gray-300">
                                        <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">Start Time:</span>
                                      </div>
                                      <div className="text-white font-medium ml-6">
                                        {formatDate(reminder.contest?.contestStartDate || reminder.contestStartDate)}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center text-gray-300">
                                        <Bell className="w-4 h-4 mr-2 text-purple-400" />
                                        <span className="font-medium">Reminder:</span>
                                      </div>
                                      <div className="text-white font-medium ml-6">
                                        {formatReminderTime(reminder.reminderTime)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Contest URL */}
                                  {(reminder.contest?.contestUrl || reminder.contestUrl) && (
                                    <div className="mt-4">
                                      <a
                                        href={reminder.contest?.contestUrl || reminder.contestUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors duration-200"
                                      >
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        View Contest
                                      </a>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Delete Button */}
                                <div className="flex-shrink-0 ml-4">
                                  <button
                                    onClick={() => handleDeleteReminder(reminder.id, contestName)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                    title="Delete Reminder"
                                  >
                                    <Trash2 className="w-5 h-5" />
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
    </div>
  );
};

export default Profile;
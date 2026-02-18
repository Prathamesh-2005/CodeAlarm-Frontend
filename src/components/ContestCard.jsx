import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, Bell, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ReminderModal from './ReminderModel';

const ContestCard = ({ 
  contest, 
  isPast = false, 
  formatDuration,
  userReminders = [],
  onReminderSet,
  onReminderDelete 
}) => {
  const { isDark } = useTheme();
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  // Check if user has reminders for this contest
  const hasReminder = userReminders.some(reminder => 
    reminder.contest?.contestId === contest.contestId
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeStatus = () => {
    const now = new Date();
    const start = new Date(contest.contestStartDate);
    const end = new Date(contest.contestEndDate);

    if (now < start) {
      return { 
        status: 'upcoming', 
        text: 'Upcoming', 
        color: isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
      };
    } else if (now >= start && now <= end) {
      return { 
        status: 'live', 
        text: 'Live Now', 
        color: isDark ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'
      };
    } else {
      return { 
        status: 'ended', 
        text: 'Ended', 
        color: isDark ? 'bg-gray-700 text-gray-400 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200'
      };
    }
  };

  const getPlatformColor = (platform) => {
    if (isDark) {
      const colors = {
        'CodeChef': 'bg-orange-500/80',
        'Codeforces': 'bg-blue-500/80',
        'LeetCode': 'bg-yellow-500/80'
      };
      return colors[platform] || 'bg-gray-500';
    } else {
      const colors = {
        'CodeChef': 'bg-orange-500',
        'Codeforces': 'bg-blue-500',
        'LeetCode': 'bg-yellow-500'
      };
      return colors[platform] || 'bg-gray-500';
    }
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const start = new Date(contest.contestStartDate);
    const diff = start - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const timeStatus = getTimeStatus();
  const timeUntilStart = getTimeUntilStart();

  const handleReminderClick = () => {
    if (hasReminder) {
      // Find and delete the reminder
      const reminder = userReminders.find(r => 
        r.contest?.contestId === contest.contestId
      );
      if (reminder && onReminderDelete) {
        onReminderDelete(reminder.id);
      }
    } else {
      // Show modal to set reminder
      setShowReminderModal(true);
    }
  };

  // Determine what to show in the bottom status bar
  const getBottomStatusBar = () => {
    if (timeStatus.status === 'live') {
      return {
        show: true,
        className: isDark 
          ? 'bg-green-500/20 text-green-400 border-t border-green-500/30' 
          : 'bg-green-50 text-green-700 border-t border-green-200',
        content: '🔴 Contest is Live Now!'
      };
    } else if (timeStatus.status === 'upcoming' && timeUntilStart) {
      return {
        show: true,
        className: isDark 
          ? 'bg-blue-500/20 text-blue-400 border-t border-blue-500/30' 
          : 'bg-blue-50 text-blue-700 border-t border-blue-200',
        content: `⏰ Starting in ${timeUntilStart}`
      };
    }
    return { show: false };
  };

  const bottomStatusBar = getBottomStatusBar();

  return (
    <>
      <div className={`rounded-lg border transition-all duration-300 overflow-hidden flex flex-col h-full ${
        isDark 
          ? 'bg-gray-900 border-gray-800 hover:border-gray-700' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}>
        {/* Header */}
        <div className="p-5 pb-4 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${getPlatformColor(contest.platform)}`}></div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{contest.platform}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${timeStatus.color}`}>
              {timeStatus.text}
            </div>
          </div>

          <h3 className={`text-lg font-semibold mb-3 min-h-[3rem] flex items-start ${
            isDark 
              ? 'text-white hover:text-purple-400' 
              : 'text-gray-900 hover:text-purple-600'
          } transition-colors`}>
            {contest.contestName}
          </h3>

          {/* Time Information */}
          <div className="space-y-2">
            <div className={`flex items-center text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(contest.contestStartDate)}</span>
            </div>
            
            <div className={`flex items-center text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Clock className="h-4 w-4 mr-2" />
              <span>Duration: {formatDuration ? formatDuration(contest.contestDuration) : `${Math.floor(contest.contestDuration / 60)}m`}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-4 flex items-center justify-between mt-auto">
          <a
            href={contest.contestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Contest
          </a>

          {!isPast && (
            <button
              onClick={handleReminderClick}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                hasReminder
                  ? (isDark 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                    : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200')
                  : (isDark 
                    ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200')
              }`}
              title={hasReminder ? 'Remove reminder' : 'Set reminder'}
            >
              {hasReminder ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reminder Set
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </>
              )}
            </button>
          )}
        </div>

        {/* Contest Status Bar - Always at the bottom when applicable */}
        {bottomStatusBar.show && (
          <div className={`${bottomStatusBar.className} text-center py-2.5 text-sm font-medium`}>
            {bottomStatusBar.content}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <ReminderModal
          contest={contest}
          onClose={() => setShowReminderModal(false)}
          onReminderSet={onReminderSet}
        />
      )}
    </>
  );
};

export default ContestCard;
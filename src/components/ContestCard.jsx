import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, Bell, CheckCircle, XCircle } from 'lucide-react';
import ReminderModal from './ReminderModel';

const ContestCard = ({ 
  contest, 
  isPast = false, 
  formatDuration,
  userReminders = [],
  onReminderSet,
  onReminderDelete 
}) => {
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
      return { status: 'upcoming', text: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now >= start && now <= end) {
      return { status: 'live', text: 'Live Now', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'ended', text: 'Ended', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'CodeChef': 'bg-orange-500',
      'Codeforces': 'bg-blue-500',
      'LeetCode': 'bg-yellow-500'
    };
    return colors[platform] || 'bg-gray-500';
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
        className: 'bg-green-500 text-white',
        content: '🔴 Contest is Live Now!'
      };
    } else if (timeStatus.status === 'upcoming' && timeUntilStart) {
      return {
        show: true,
        className: 'bg-blue-500 text-white',
        content: `⏰ Starting in ${timeUntilStart}`
      };
    }
    return { show: false };
  };

  const bottomStatusBar = getBottomStatusBar();

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 pb-4 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getPlatformColor(contest.platform)}`}></div>
              <span className="text-sm font-medium text-gray-600">{contest.platform}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${timeStatus.color}`}>
              {timeStatus.text}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors min-h-[3.5rem] flex items-start">
            {contest.contestName}
          </h3>

          {/* Time Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(contest.contestStartDate)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Duration: {formatDuration ? formatDuration(contest.contestDuration) : `${Math.floor(contest.contestDuration / 60)}m`}</span>
            </div>

            {/* Removed the inline "Starts in" section since it will be in the bottom bar */}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-4 flex items-center justify-between mt-auto">
          <a
            href={contest.contestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Contest
          </a>

          {!isPast && (
            <button
              onClick={handleReminderClick}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                hasReminder
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <div className={`${bottomStatusBar.className} text-center py-3 text-sm font-medium`}>
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
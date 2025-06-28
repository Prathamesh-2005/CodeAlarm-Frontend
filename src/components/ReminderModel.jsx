import React, { useState } from 'react';
import { X, Bell, Clock, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const ReminderModal = ({ contest, onClose, onReminderSet }) => {
  const [selectedTime, setSelectedTime] = useState('BEFORE_10_MINUTES');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reminderOptions = [
    { value: 'BEFORE_1_MINUTE', label: '1 minute before', icon: '⚡' },
    { value: 'BEFORE_5_MINUTES', label: '5 minutes before', icon: '🔔' },
    { value: 'BEFORE_10_MINUTES', label: '10 minutes before', icon: '⏰' },
    { value: 'BEFORE_15_MINUTES', label: '15 minutes before', icon: '⏱️' },
    { value: 'BEFORE_30_MINUTES', label: '30 minutes before', icon: '📅' },
    { value: 'BEFORE_1_HOUR', label: '1 hour before', icon: '⏳' },
    { value: 'BEFORE_2_HOURS', label: '2 hours before', icon: '📢' },
    { value: 'BEFORE_1_DAY', label: '1 day before', icon: '📆' }
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to set reminders');
      }

      console.log('Sending request with:', {
        reminderTime: selectedTime,
        customMessage: customMessage.trim() || null
      });

      const response = await fetch(`https://code-alarm-2.onrender.com/api/reminders/set/${contest.contestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reminderTime: selectedTime,
          customMessage: customMessage.trim() || null
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Failed to set reminder';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            errorMessage = response.statusText || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      let reminderData = null;
      
      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();
        if (responseText.trim()) {
          try {
            reminderData = JSON.parse(responseText);
            console.log('Parsed response data:', reminderData);
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response text:', responseText);
            throw new Error('Invalid response format from server');
          }
        }
      }

      setSuccess(true);
      
      if (onReminderSet && reminderData) {
        onReminderSet(reminderData);
      }

      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message);
      console.error('Error setting reminder:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'CodeChef': 'text-orange-400 bg-orange-500/20',
      'Codeforces': 'text-blue-400 bg-blue-500/20',
      'LeetCode': 'text-yellow-400 bg-yellow-500/20'
    };
    return colors[platform] || 'text-gray-400 bg-gray-500/20';
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6 text-center shadow-2xl">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Reminder Set Successfully!</h3>
          <p className="text-gray-300 mb-2">
            You'll receive an email reminder {reminderOptions.find(opt => opt.value === selectedTime)?.label} the contest starts.
          </p>
          {customMessage.trim() && (
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/50 rounded-lg">
              <p className="text-sm text-blue-300 font-medium">Your custom message:</p>
              <p className="text-sm text-blue-200 mt-1">"{customMessage.trim()}"</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-bold text-white">Set Reminder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Contest Info */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-start space-x-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(contest.platform)}`}>
              {contest.platform}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mt-2 mb-1">
            {contest.contestName}
          </h3>
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(contest.contestStartDate)}</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Reminder Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">
              When would you like to be reminded?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {reminderOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTime === option.value
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reminderTime"
                    value={option.value}
                    checked={selectedTime === option.value}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-lg mr-2">{option.icon}</span>
                  <span className="text-sm font-medium text-white">
                    {option.label}
                  </span>
                  {selectedTime === option.value && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label htmlFor="customMessage" className="block text-sm font-medium text-white mb-2">
              Custom Message (Optional)
            </label>
            <div className="relative">
              <textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal note to your reminder... e.g., 'Don't forget to prepare DP problems!' or 'Contest with cash prizes!'"
                rows={4}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors"
                maxLength={200}
              />
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                {customMessage.length}/200
              </div>
            </div>
            {customMessage.trim() && (
              <div className="mt-2 p-2 bg-green-600/20 border border-green-500/50 rounded-md">
                <p className="text-xs text-green-400">
                  ✨ Your custom message will be included in the email reminder
                </p>
              </div>
            )}
          </div>

          {/* Email Info */}
          <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-blue-300 mb-1">
                  Email Notification
                </div>
                <div className="text-sm text-blue-200">
                  The reminder will be sent to your registered email address. Make sure your email notifications are enabled in your profile settings.
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500/50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-300">{error}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ContestCard from '../components/ContestCard';
import ReminderModal from '../components/ReminderModel';
import { useTheme } from '../context/ThemeContext';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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

  const platforms = ['all', 'codeforces', 'codechef', 'leetcode'];

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    filterContests();
  }, [contests, selectedPlatform, searchQuery]);

  const fetchContests = async () => {
    try {
      setError(null);
      
      const response = await api.get('/contests/all');
      
      const now = new Date();
      const upcoming = response.data
        .filter(contest => {
          const contestDate = new Date(contest.contestStartDate);
          return contestDate > now;
        })
        .sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));
      
      setContests(upcoming);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      setError(`Failed to fetch contests: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterContests = () => {
    let filtered = contests;

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(contest => 
        contest.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(contest =>
        contest.contestName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContests(filtered);
  };

  const handleSetReminder = (contest) => {
    setSelectedContest(contest);
    setShowReminderModal(true);
  };

  const handleReminderSet = () => {
    setShowReminderModal(false);
    setSelectedContest(null);
  };

  const handleFetchAllContests = async () => {
    setFetchingContests(true);
    try {
      const platforms = [
        { name: 'Codeforces', endpoint: '/codeforces/fetch' },
        { name: 'CodeChef', endpoint: '/codechef/fetch' },
        { name: 'LeetCode', endpoint: '/leetcode/fetch' }
      ];

      const fetchPromises = platforms.map(async (platform) => {
        try {
          const response = await api.get(platform.endpoint);
          return { platform: platform.name, status: 'success', message: response.data };
        } catch (error) {
          return { platform: platform.name, status: 'error', message: error.message };
        }
      });

      await Promise.all(fetchPromises);

      setTimeout(() => {
        fetchContests();
      }, 2000);

    } catch (error) {
      console.error('Error during manual fetch:', error);
    } finally {
      setFetchingContests(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-gray-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>
            Error Loading Contests
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={fetchContests}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isDark
                ? 'bg-gray-50 text-gray-900 hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-semibold ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>
              Upcoming Contests
            </h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <button
            onClick={handleFetchAllContests}
            disabled={fetchingContests}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
              isDark
                ? 'border-gray-800 text-gray-300 hover:bg-gray-900 disabled:opacity-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            }`}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${fetchingContests ? 'animate-spin' : ''}`} />
            {fetchingContests ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Filters */}
        <div className={`rounded-lg border p-4 mb-6 ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search contests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 px-3 py-2 border rounded-md text-sm transition-colors ${
                  isDark
                    ? 'bg-gray-950 border-gray-800 text-gray-50 placeholder-gray-500 focus:border-gray-700'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                } focus:outline-none focus:ring-0`}
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <FunnelIcon className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                    isDark
                      ? 'bg-gray-950 border-gray-800 text-gray-50'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-0 cursor-pointer`}
                >
                  {platforms.map(platform => (
                    <option 
                      key={platform} 
                      value={platform}
                    >
                      {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Grid */}
        {filteredContests.length === 0 ? (
          <div className={`rounded-lg border p-12 text-center ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200'
          }`}>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery 
                ? `No contests match "${searchQuery}"` 
                : selectedPlatform !== 'all' 
                  ? `No upcoming contests on ${selectedPlatform}`
                  : 'No upcoming contests available'
              }
            </p>
            {(searchQuery || selectedPlatform !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('all');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-gray-50 text-gray-900 hover:bg-gray-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContests.map((contest) => (
              <ContestCard 
                key={`${contest.platform}-${contest.contestId || contest.contestName}`}
                contest={contest}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        )}

        {/* Reminder Modal */}
        {showReminderModal && selectedContest && (
          <ReminderModal
            contest={selectedContest}
            onClose={() => setShowReminderModal(false)}
            onReminderSet={handleReminderSet}
          />
        )}
      </div>
    </div>
  );
};

export default UpcomingContests;
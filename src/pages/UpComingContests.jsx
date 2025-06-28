import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ContestCard from '../components/ContestCard';
import ReminderModal from '../components/ReminderModel';
import { 
  CalendarDaysIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const UpcomingContests = () => {
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
      console.log('🔄 Fetching contests...');
      
      const response = await api.get('/contests/all');
      console.log('📥 Raw API response:', response.data);
      
      const now = new Date();
      const upcoming = response.data
        .filter(contest => {
          const contestDate = new Date(contest.contestStartDate);
          console.log(`📅 Contest: ${contest.contestName}, Start: ${contestDate}, Now: ${now}, Upcoming: ${contestDate > now}`);
          return contestDate > now;
        })
        .sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));
      
      console.log(`✅ Found ${upcoming.length} upcoming contests out of ${response.data.length} total`);
      setContests(upcoming);
    } catch (error) {
      console.error('❌ Failed to fetch contests:', error);
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

    console.log(`🔍 Filtered to ${filtered.length} contests`);
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

  // Manual fetch from all platforms
  const handleFetchAllContests = async () => {
    setFetchingContests(true);
    try {
      console.log('🚀 Triggering manual fetch from all platforms...');
      
      const platforms = [
        { name: 'Codeforces', endpoint: '/codeforces/fetch' },
        { name: 'CodeChef', endpoint: '/codechef/fetch' },
        { name: 'LeetCode', endpoint: '/leetcode/fetch' }
      ];

      const fetchPromises = platforms.map(async (platform) => {
        try {
          const response = await api.get(platform.endpoint);
          console.log(`✅ ${platform.name}: ${response.data}`);
          return { platform: platform.name, status: 'success', message: response.data };
        } catch (error) {
          console.error(`❌ ${platform.name} fetch failed:`, error);
          return { platform: platform.name, status: 'error', message: error.message };
        }
      });

      const results = await Promise.all(fetchPromises);
      console.log('📊 Fetch results:', results);

      // Wait a bit for data to be saved, then refresh
      setTimeout(() => {
        fetchContests();
      }, 2000);

    } catch (error) {
      console.error('❌ Error during manual fetch:', error);
    } finally {
      setFetchingContests(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="p-4 bg-red-500/20 rounded-full mb-4 inline-block">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Contests</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchContests}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <CalendarDaysIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Upcoming Contests</h1>
                <p className="text-gray-300">Don't miss any coding competitions</p>
              </div>
            </div>
            
            {/* Manual Fetch Button */}
            <button
              onClick={handleFetchAllContests}
              disabled={fetchingContests}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       disabled:bg-blue-800 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowPathIcon className={`h-5 w-5 ${fetchingContests ? 'animate-spin' : ''}`} />
              <span>{fetchingContests ? 'Fetching...' : 'Refresh Contests'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl 
                         bg-white/10 backdrop-blur-md text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white 
                           rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500
                           appearance-none cursor-pointer min-w-40"
                >
                  {platforms.map(platform => (
                    <option 
                      key={platform} 
                      value={platform}
                      className="bg-gray-800 text-white"
                    >
                      {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Count */}
        <div className="mb-6">
          <p className="text-gray-300 text-lg">
            {filteredContests.length === 0 
              ? 'No contests found' 
              : `Found ${filteredContests.length} upcoming contest${filteredContests.length === 1 ? '' : 's'}`
            }
            {selectedPlatform !== 'all' && (
              <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-sm">
                on {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
              </span>
            )}
          </p>
        </div>

        {/* Contest Grid */}
        {filteredContests.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-500/20 rounded-full mb-4 inline-block">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Contests Found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery 
                ? `No contests match your search "${searchQuery}"` 
                : selectedPlatform !== 'all' 
                  ? `No upcoming contests on ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`
                  : 'No upcoming contests available'
              }
            </p>
            {(searchQuery || selectedPlatform !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('all');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest) => (
              <ContestCard 
                key={`${contest.platform}-${contest.contestId || contest.contestName}`}
                contest={contest}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredContests.length > 0 && contests.length > filteredContests.length && (
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">
              Showing {filteredContests.length} of {contests.length} contests
            </p>
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
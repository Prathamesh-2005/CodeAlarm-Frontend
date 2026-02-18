import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  BellIcon,
  ArrowRightIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    upcoming: 0,
    past: 0,
    reminders: 0
  });
  const [recentContests, setRecentContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to filter unique reminders (same as Profile component)
  const filterUniqueReminders = (reminders) => {
    if (!Array.isArray(reminders)) {
      return [];
    }

    return reminders.filter(
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
  };

  // Helper function to check if reminder is active (same logic as Profile component)
  const isReminderActive = (reminder) => {
    const contestStartDate = reminder.contest?.contestStartDate || reminder.contestStartDate;
    
    if (!contestStartDate) {
      return false; // No date means we can't determine if it's active
    }
    
    const now = new Date();
    const startDate = new Date(
      typeof contestStartDate === 'number' ? contestStartDate : contestStartDate
    );
    
    if (isNaN(startDate.getTime())) {
      return false; // Invalid date
    }
    
    // Only count reminders for future contests as active
    return startDate.getTime() > now.getTime();
  };

  const fetchDashboardData = async () => {
    try {
      const [contestsRes, remindersRes] = await Promise.all([
        api.get('/contests/all'),
        api.get('/reminders/my-reminders')
      ]);

      const contests = contestsRes.data;
      const now = new Date();
      
      const upcoming = contests.filter(c => new Date(c.contestStartDate) > now);
      const past = contests.filter(c => new Date(c.contestStartDate) <= now);
      
      // Filter reminders using the same logic as Profile component
      const allReminders = remindersRes.data;
      const uniqueReminders = filterUniqueReminders(allReminders);
      const activeReminders = uniqueReminders.filter(isReminderActive);
      
      setStats({
        upcoming: upcoming.length,
        past: past.length,
        reminders: activeReminders.length // Only count active reminders
      });

      // Get next 3 upcoming contests
      const sortedUpcoming = upcoming
        .sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate))
        .slice(0, 3);
      
      setRecentContests(sortedUpcoming);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'codeforces': return 'from-blue-500 to-blue-600';
      case 'codechef': return 'from-orange-500 to-orange-600';
      case 'leetcode': return 'from-yellow-500 to-yellow-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilContest = (dateString) => {
    const contest = new Date(dateString);
    const now = new Date();
    const diff = contest - now;
    
    if (diff < 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `in ${days}d ${hours}h`;
    return `in ${hours}h`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-gray-50"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header Section with gradient */}
      <div className={`relative border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Welcome back, {user?.firstName || user?.username}
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your contests and manage reminders
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <SparklesIcon className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                All systems active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/upcoming" className="group">
            <div className={`relative rounded-xl border p-6 transition-all duration-300 overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800 hover:border-purple-500/50' : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg'}`}>
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming Contests</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.upcoming}</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Ready to compete</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform">
                  <CalendarDaysIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </Link>

          <Link to="/past" className="group">
            <div className={`relative rounded-xl border p-6 transition-all duration-300 overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'}`}>
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Past Contests</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.past}</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Completed rounds</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform">
                  <TrophyIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </Link>

          <Link to="/profile" className="group">
            <div className={`relative rounded-xl border p-6 transition-all duration-300 overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800 hover:border-green-500/50' : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-lg'}`}>
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Reminders</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.reminders}</p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Notifications set</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform">
                  <BellIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Upcoming Contests Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Upcoming Contests
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Next contests starting soon
            </p>
          </div>
          <Link 
            to="/upcoming" 
            className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-purple-400 hover:bg-gray-800 border border-gray-800' : 'text-purple-600 hover:bg-purple-50 border border-purple-200'}`}
          >
            View all
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {recentContests.length === 0 ? (
          <div className={`rounded-xl border p-16 text-center ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <CalendarDaysIcon className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <p className={`text-base font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              No upcoming contests
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Check back later for new contests
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentContests.map((contest) => {
              const getPlatformBadge = (platform) => {
                const badges = {
                  'Codeforces': { 
                    bg: isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200', 
                    text: isDark ? 'text-blue-400' : 'text-blue-700' 
                  },
                  'CodeChef': { 
                    bg: isDark ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-50 border-orange-200', 
                    text: isDark ? 'text-orange-400' : 'text-orange-700' 
                  },
                  'LeetCode': { 
                    bg: isDark ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200', 
                    text: isDark ? 'text-yellow-400' : 'text-yellow-700' 
                  },
                };
                return badges[platform] || { 
                  bg: isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200', 
                  text: isDark ? 'text-gray-300' : 'text-gray-700' 
                };
              };
              const platformBadge = getPlatformBadge(contest.platform);
              return (
                <div 
                  key={contest.id} 
                  className={`group rounded-xl border p-5 transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold ${platformBadge.bg} ${platformBadge.text}`}>
                      {contest.platform}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      {Math.floor(contest.contestDuration / 60)}m
                    </span>
                  </div>
                  
                  <h3 className={`text-base font-semibold mb-3 line-clamp-2 ${isDark ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'} transition-colors`}>
                    {contest.contestName}
                  </h3>
                  
                  <div className={`flex items-center justify-between text-sm border-t pt-3 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {formatDate(contest.contestStartDate)}
                      </span>
                    </div>
                    <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      {getTimeUntilContest(contest.contestStartDate)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
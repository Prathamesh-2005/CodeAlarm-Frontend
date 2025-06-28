// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Trophy, Sparkles } from "lucide-react";
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  TrophyIcon, 
  BellIcon,
  ArrowRightIcon,
  FireIcon,
  SparklesIcon,
  HeartIcon
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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
     <div className="w-full bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800 px-6 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-400 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-sm animate-pulse">
              Welcome back, {user?.firstName || user?.username}! 👋
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl font-medium drop-shadow-sm">
              Ready to tackle some coding challenges today? Let's make it amazing! ✨
            </p>
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-600/50">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="text-gray-200 font-medium">Keep coding!</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-600/70 to-gray-700/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-gray-500/60 animate-bounce">
              <Trophy className="h-16 w-16 text-purple-400 drop-shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Stats Section */}
      <div className={`w-full px-6 py-12 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/upcoming" className="group">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                  <CalendarDaysIcon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stats.upcoming}</h3>
                <p className="text-emerald-100 text-base font-medium">Upcoming Contests</p>
                <ArrowRightIcon className="h-4 w-4 mx-auto mt-3 transform transition-transform group-hover:translate-x-2" />
              </div>
            </Link>

            <Link to="/past" className="group">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stats.past}</h3>
                <p className="text-blue-100 text-base font-medium">Past Contests</p>
                <ArrowRightIcon className="h-4 w-4 mx-auto mt-3 transform transition-transform group-hover:translate-x-2" />
              </div>
            </Link>

            <Link to="/profile" className="group">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                  <BellIcon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stats.reminders}</h3>
                <p className="text-violet-100 text-base font-medium">Active Reminders</p>
                <ArrowRightIcon className="h-4 w-4 mx-auto mt-3 transform transition-transform group-hover:translate-x-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Next Contests Section */}
      <div className={`w-full px-6 py-12 ${isDark ? 'bg-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <FireIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Next Contests
              </h2>
            </div>
            <Link 
              to="/upcoming" 
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium text-sm"
            >
              <span>View all</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {recentContests.length === 0 ? (
            <div className="text-center py-16">
              <SparklesIcon className={`h-20 w-20 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No upcoming contests
              </h3>
              <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Check back later for new contests!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentContests.map((contest) => (
                <div 
                  key={contest.id} 
                  className={`group relative p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 hover:border-purple-500' 
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 bg-gradient-to-r ${getPlatformColor(contest.platform)} rounded-lg shadow-md`}>
                      <TrophyIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-purple-600 dark:text-purple-400 font-bold text-base">
                        {getTimeUntilContest(contest.contestStartDate)}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.floor(contest.contestDuration / 60)} minutes
                      </p>
                    </div>
                  </div>
                  
                  <h3 className={`text-lg font-bold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {contest.contestName}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {contest.platform}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(contest.contestStartDate)}
                    </p>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent rounded-xl transition-all duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`w-full py-8 border-t ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 CodeAlarm. All rights reserved.
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Made with
              </span>
              <HeartIcon className="h-4 w-4 text-red-500 fill-current" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                by
              </span>
              <a 
                href="https://github.com/Prathamesh-2005" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors duration-300"
              >
                Prathamesh Jadhav
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
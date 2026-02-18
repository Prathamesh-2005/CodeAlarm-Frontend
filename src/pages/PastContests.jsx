import React, { useState, useEffect } from 'react';
import ContestCard from '../components/ContestCard';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  CalendarDaysIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const PastContests = () => {
  const { isDark } = useTheme();
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [contestsPerPage] = useState(12);

  const platforms = ['all', 'codeforces', 'codechef', 'leetcode'];

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    filterContests();
  }, [contests, searchTerm, selectedPlatform, dateRange]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPlatform, dateRange]);

 const fetchContests = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('https://code-alarm-2.onrender.com/api/contests/all');
    
    // First check if the response is OK (status 200-299)
    if (!response.ok) {
      // Try to get error message from response
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch contests');
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data = await response.json();
    
    // Filter past contests (contests that have ended)
    const now = new Date();
    const pastContests = data.filter(contest => 
      new Date(contest.contestEndDate) < now
    );
    
    // Sort by end date (most recent first)
    pastContests.sort((a, b) => 
      new Date(b.contestEndDate) - new Date(a.contestEndDate)
    );
    
    setContests(pastContests);
    setError(null);
  } catch (err) {
    setError(`Failed to fetch contests: ${err.message}`);
    console.error('Error fetching contests:', err);
  } finally {
    setLoading(false);
  }
};

  const filterContests = () => {
    let filtered = [...contests];

    // Platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(contest =>
        contest.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contest =>
        contest.contestName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      filtered = filtered.filter(contest => {
        const contestDate = new Date(contest.contestStartDate);
        return contestDate >= startDate && contestDate <= endDate;
      });
    }

    setFilteredContests(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('all');
    setDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = filteredContests.slice(indexOfFirstContest, indexOfLastContest);
  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-3 py-2 mx-1 border rounded-md text-sm transition-colors ${
            isDark
              ? 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-2 mx-1 border rounded-md text-sm transition-colors ${
            isDark
              ? 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className={`px-3 py-2 mx-1 text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 border rounded-md text-sm transition-colors ${
            currentPage === i
              ? isDark
                ? 'bg-white text-gray-900 border-white'
                : 'bg-gray-900 text-white border-gray-900'
              : isDark
                ? 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className={`px-3 py-2 mx-1 text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-2 mx-1 border rounded-md text-sm transition-colors ${
            isDark
              ? 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-3 py-2 mx-1 border rounded-md text-sm transition-colors ${
            isDark
              ? 'bg-gray-900 border-gray-800 text-white hover:bg-gray-800'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      );
    }

    return pageNumbers;
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-gray-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center max-w-md">
          <div className={`p-4 rounded-full mb-4 inline-block ${
            isDark ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <ExclamationTriangleIcon className={`h-10 w-10 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Error Loading Past Contests</h3>
          <p className={`text-sm mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{error}</p>
          <button
            onClick={fetchContests}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isDark
                ? 'bg-white text-gray-900 hover:bg-gray-100'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className={`mb-6 pb-6 border-b ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <TrophyIcon className={`h-6 w-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h1 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Past Contests</h1>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Browse through completed programming contests</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg p-4 border mb-6 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-4 w-4 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <FunnelIcon className={`h-4 w-4 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer min-w-40 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
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

          {/* Date Range Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Start Date */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className={`h-4 w-4 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="date"
                  placeholder="Start Date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer min-w-40 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className={`h-4 w-4 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="date"
                  placeholder="End Date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer min-w-40 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedPlatform !== 'all' || dateRange.startDate || dateRange.endDate) && (
              <button
                onClick={clearFilters}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isDark
                    ? 'bg-gray-800 text-white border border-gray-700 hover:bg-gray-700'
                    : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Contest Count and Pagination Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-sm mb-2 sm:mb-0 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {filteredContests.length === 0 
              ? 'No past contests found' 
              : `Found ${filteredContests.length} past contest${filteredContests.length === 1 ? '' : 's'}`
            }
            {selectedPlatform !== 'all' && (
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
                on {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
              </span>
            )}
          </p>
          {filteredContests.length > 0 && (
            <p className={`text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Showing {indexOfFirstContest + 1}-{Math.min(indexOfLastContest, filteredContests.length)} of {filteredContests.length} contests
            </p>
          )}
        </div>

        {/* Contest Grid */}
        {filteredContests.length === 0 ? (
          <div className="text-center py-12">
            <div className={`p-4 rounded-full mb-4 inline-block ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <TrophyIcon className={`h-10 w-10 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>
            <h3 className={`text-base font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>No Past Contests Found</h3>
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchTerm 
                ? `No contests match your search "${searchTerm}"` 
                : selectedPlatform !== 'all' 
                  ? `No past contests on ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`
                  : contests.length === 0 
                    ? 'No past contests available yet'
                    : 'Try adjusting your filters to see more results'
              }
            </p>
            {(searchTerm || selectedPlatform !== 'all' || dateRange.startDate || dateRange.endDate) && (
              <button
                onClick={clearFilters}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isDark
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isPast={true}
                  formatDuration={formatDuration}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-center">
                  {renderPagination()}
                </div>
                <div className="text-center mt-4">
                  <p className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Load More Button (if needed) - Removed since we have pagination */}
      </div>
    </div>
  );
};

export default PastContests;
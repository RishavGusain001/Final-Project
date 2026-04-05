import React, { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leaderboard/");
      setLeaders(res.data);
      
      // Find current user's rank (assuming you have user info)
      const token = localStorage.getItem("token");
      if (token) {
        const userRes = await API.get("/users/me");
        const currentUser = userRes.data;
        const userRankData = res.data.find(u => u.username === currentUser.name);
        if (userRankData) {
          setUserRank(userRankData.rank);
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>🏆</span> Leaderboard
            </h1>
            <p className="text-gray-600">
              Top performers on the platform
            </p>
          </div>

          {/* User Rank Card */}
          {userRank && !loading && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-5 mb-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Your Current Rank</p>
                  <p className="text-3xl font-bold">#{userRank}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Keep Going!</p>
                  <p className="text-sm">
                    {userRank <= 10 
                      ? "You're in top 10! 🎉" 
                      : "Aim for top 10 by practicing more"}
                  </p>
                </div>
                <button 
                  onClick={() => window.location.href = "/practice"}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  Improve Your Rank →
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading leaderboard...</p>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          {!loading && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {leaders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📊</div>
                  <p className="text-gray-500">No data available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to take a test!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Student
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Avg. Score
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Tests Taken
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Badge
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leaders.map((user, index) => (
                        <tr 
                          key={user.rank} 
                          className={`hover:bg-gray-50 transition ${
                            user.isCurrentUser ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankColor(user.rank)}`}>
                                {getRankBadge(user.rank)}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {user.username?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <span className="font-medium text-gray-800">
                                {user.username || "Anonymous"}
                              </span>
                              {user.isCurrentUser && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold text-lg ${getScoreColor(user.average_score)}`}>
                              {user.average_score || 0}%
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            <span className="text-gray-700">
                              {user.tests_taken || 0}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4 text-center">
                            {user.average_score >= 80 && (
                              <span className="text-2xl" title="Master">🏅</span>
                            )}
                            {user.average_score >= 60 && user.average_score < 80 && (
                              <span className="text-2xl" title="Pro">⭐</span>
                            )}
                            {user.average_score < 60 && user.tests_taken > 0 && (
                              <span className="text-2xl" title="Rising">🌱</span>
                            )}
                            {user.tests_taken === 0 && (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Stats Footer */}
          {!loading && leaders.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
              Showing top {leaders.length} performers
              {userRank && userRank > leaders.length && (
                <span className="ml-2">• Your rank: #{userRank}</span>
              )}
            </div>
          )}

          {/* Call to Action */}
          {!loading && leaders.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 text-center border border-yellow-200">
              <h3 className="font-semibold text-gray-800 mb-2">Want to top the leaderboard?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Take more practice tests and improve your scores!
              </p>
              <button
                onClick={() => window.location.href = "/practice"}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                📝 Take a Practice Test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default LeaderboardPage;
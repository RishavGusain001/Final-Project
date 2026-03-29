import React, { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";

const LeaderboardPage = () => {

  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/leaderboard/");
      setLeaders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          🏆 Leaderboard
        </h1>

        <div className="bg-white shadow rounded-xl p-4">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b">
                <th className="p-3">Rank</th>
                <th className="p-3">Username</th>
                <th className="p-3">Average Score</th>
                <th className="p-3">Tests Taken</th>
              </tr>
            </thead>

            <tbody>

              {leaders.map((user) => (
                <tr key={user.rank} className="border-b hover:bg-gray-50">

                  <td className="p-3 font-semibold">
                    {user.rank}
                  </td>

                  <td className="p-3">
                    {user.username}
                  </td>

                  <td className="p-3">
                    {user.average_score}
                  </td>

                  <td className="p-3">
                    {user.tests_taken}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default LeaderboardPage;
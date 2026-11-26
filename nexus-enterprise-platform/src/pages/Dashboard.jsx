import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService";
import { Users, UserCheck, UserX, ArrowRight, Clock, AlertCircle } from "lucide-react";

export default function Dashboard() {
  // 1. STATE: Store stats and loading status
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect: Fetch dashboard data when page loads
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the backend API. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-extrabold">Welcome to User Management</h1>
        <p className="mt-2 text-indigo-100 max-w-2xl text-sm sm:text-base">
          Monitor your platform's users, review activity, and manage member statuses from one unified workspace.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? "..." : stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{loading ? "..." : stats.active}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Users</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{loading ? "..." : stats.inactive}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <UserX size={24} />
          </div>
        </div>
      </div>

      {/* Recent Users List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <h3 className="text-base font-semibold text-gray-900">Recently Registered Users</h3>
          </div>
          <Link
            to="/users"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading recent activity...</div>
        ) : stats.recent?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No recent users found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recent.map((user) => (
              <div key={user._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.status}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

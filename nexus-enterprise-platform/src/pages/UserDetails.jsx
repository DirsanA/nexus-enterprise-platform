import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { ArrowLeft, Edit2, Trash2, Mail, Shield, Activity, Calendar } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(id);
      setUser(data);
    } catch (err) {
      setError("User not found or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    try {
      await userService.deleteUser(id);
      navigate("/users");
    } catch (err) {
      alert("Error deleting user");
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading user profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error || "User not found"}</p>
        <Link to="/users" className="text-indigo-600 hover:underline">
          Return to user list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white text-indigo-700 font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-indigo-100 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/users/edit/${user._id}`)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              title="Edit Profile"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white/20 hover:bg-red-500 rounded-lg text-white transition-colors"
              title="Delete Profile"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Mail size={16} /> Email
            </div>
            <span className="text-sm font-medium text-gray-900">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield size={16} /> System Role
            </div>
            <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
              {user.role}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Activity size={16} /> Account Status
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                user.status === "Active"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {user.status}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar size={16} /> Member Since
            </div>
            <span className="text-sm text-gray-500">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

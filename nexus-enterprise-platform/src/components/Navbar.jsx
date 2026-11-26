import { NavLink } from "react-router-dom";
import { Users, LayoutDashboard, UserPlus } from "lucide-react";

export default function Navbar() {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              UM
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">NexusAdmin</span>
              <span className="block text-xs text-gray-400">User Management</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={navLinkStyle}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/users" end className={navLinkStyle}>
              <Users size={18} />
              <span>Users</span>
            </NavLink>

            <NavLink to="/users/new" className={navLinkStyle}>
              <UserPlus size={18} />
              <span>Add User</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

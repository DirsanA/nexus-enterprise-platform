import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { userService } from "../services/userService";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // If present in URL, we are in EDIT mode!
  const isEditing = Boolean(id);

  // 1. STATE: Controlled Form Inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });

  // Errors state for client-side validation
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // 2. useEffect: If in Edit mode, load user data into the form inputs
  useEffect(() => {
    if (isEditing) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getUserById(id);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } catch (err) {
      setServerError("Failed to fetch user details for editing.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Controlled Input Handler: Updates formData as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user fixes input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 4. Client-side Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Submit Handler (Sends POST or PUT to Backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setServerError(null);

      if (isEditing) {
        // UPDATE: PUT /api/users/:id
        await userService.updateUser(id, formData);
      } else {
        // CREATE: POST /api/users
        await userService.createUser(formData);
      }

      // Redirect back to Users table upon success
      navigate("/users");
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/users"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
          {isEditing ? "Edit User Account" : "Create New User"}
        </h2>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Role and Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              to="/users"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm disabled:opacity-50 transition-colors"
            >
              <Save size={16} />
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

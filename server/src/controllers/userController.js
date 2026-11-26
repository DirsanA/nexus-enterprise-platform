import { User } from "../models/userModel.js";

// In-memory fallback in case local MongoDB is not yet started by the user
let fallbackUsers = [
  { _id: "1", name: "Sarah Jenkins", email: "sarah@example.com", role: "Admin", status: "Active", createdAt: new Date() },
  { _id: "2", name: "David Miller", email: "david@example.com", role: "Manager", status: "Active", createdAt: new Date() },
  { _id: "3", name: "Emma Watson", email: "emma@example.com", role: "User", status: "Inactive", createdAt: new Date() },
];

const isDbConnected = () => {
  return User.db.readyState === 1;
};

// ---------------------------------------------------------------------------
// 1. GET /api/users - Fetch all users with search, status filter & pagination
// ---------------------------------------------------------------------------
export const getUsers = async (req, res) => {
  try {
    const { search = "", status = "", page = 1, limit = 10 } = req.query;

    if (!isDbConnected()) {
      // Memory fallback mode
      let filtered = [...fallbackUsers];
      if (search) {
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (status) {
        filtered = filtered.filter(u => u.status === status);
      }
      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + Number(limit));
      return res.status(200).json({
        users: paginated,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit) || 1,
      });
    }

    // MongoDB query builder
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.status(200).json({
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// 2. GET /api/users/stats - Summary for Dashboard
// ---------------------------------------------------------------------------
export const getUserStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const total = fallbackUsers.length;
      const active = fallbackUsers.filter(u => u.status === "Active").length;
      const inactive = total - active;
      const recent = fallbackUsers.slice(0, 5);
      return res.status(200).json({ total, active, inactive, recent });
    }

    const total = await User.countDocuments();
    const active = await User.countDocuments({ status: "Active" });
    const inactive = await User.countDocuments({ status: "Inactive" });
    const recent = await User.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({ total, active, inactive, recent });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// 3. GET /api/users/:id - Fetch single user
// ---------------------------------------------------------------------------
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      const user = fallbackUsers.find(u => u._id === id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// 4. POST /api/users - Create new user
// ---------------------------------------------------------------------------
export const createUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (!isDbConnected()) {
      const exists = fallbackUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ message: "A user with this email already exists" });
      }
      const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        role: role || "User",
        status: status || "Active",
        createdAt: new Date(),
      };
      fallbackUsers.unshift(newUser);
      return res.status(201).json(newUser);
    }

    // Check duplicate in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const newUser = await User.create({ name, email, role, status });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// 5. PUT /api/users/:id - Update user
// ---------------------------------------------------------------------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    if (!isDbConnected()) {
      const index = fallbackUsers.findIndex(u => u._id === id);
      if (index === -1) return res.status(404).json({ message: "User not found" });

      fallbackUsers[index] = {
        ...fallbackUsers[index],
        name: name || fallbackUsers[index].name,
        email: email || fallbackUsers[index].email,
        role: role || fallbackUsers[index].role,
        status: status || fallbackUsers[index].status,
      };
      return res.status(200).json(fallbackUsers[index]);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, status },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// 6. DELETE /api/users/:id - Delete user
// ---------------------------------------------------------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      const initialLen = fallbackUsers.length;
      fallbackUsers = fallbackUsers.filter(u => u._id !== id);
      if (fallbackUsers.length === initialLen) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

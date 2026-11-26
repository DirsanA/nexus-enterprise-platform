import axios from "axios";

// Pointing to Express Backend API
const API_URL = "http://localhost:5000/api/users";

export const userService = {
  // GET: Fetch users with optional search, status, and pagination
  getUsers: async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  // GET: Fetch stats for the dashboard summary
  getStats: async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  },

  // GET: Fetch a single user by ID
  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // POST: Create a new user
  createUser: async (userData) => {
    const response = await axios.post(API_URL, userData);
    return response.data;
  },

  // PUT: Update an existing user by ID
  updateUser: async (id, userData) => {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  },

  // DELETE: Delete a user by ID
  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

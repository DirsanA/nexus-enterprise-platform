import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UsersList";
import UserForm from "./pages/UserForm";
import UserDetails from "./pages/UserDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Dashboard Route */}
          <Route path="/" element={<Dashboard />} />

          {/* User Management Routes */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Simulate login by checking localStorage "user"
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!storedUser || storedUser.email !== form.email || storedUser.password !== form.password) {
      setError("Invalid email or password.");
      return;
    }
    // Save login state (e.g., "isLoggedIn" flag or token)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", storedUser.name);
    // Redirect to homepage (or dashboard)
    navigate("/");
    window.location.reload(); // reload to update Navbar instantly
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-700 underline">Register</a>
      </div>
    </div>
  );
}

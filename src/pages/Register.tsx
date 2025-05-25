import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser, User } from "../api";

interface RegisterForm extends User {
  password: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simple frontend validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    // Save user info to localStorage as "registered"
    saveUser(form);
    // Optionally show a success message
    alert("Registration successful! Please log in.");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
        />
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
          Register
        </button>
      </form>
      <div className="mt-4 text-center">
        Already have an account? <a href="/login" className="text-blue-700 underline">Login</a>
      </div>
    </div>
  );
}

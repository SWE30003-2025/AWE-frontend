import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { register } from "../../api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(form);

      toast.success("Registration successful! Please login.");

      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">
            Username
          </label>

          <input
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            First Name
          </label>

          <input
            type="text"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Last Name
          </label>

          <input
            type="text"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

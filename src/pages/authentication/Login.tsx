import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../../api";

interface LoginForm {
  username: string;
  password: string;
};

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { user } = await login(form.username, form.password);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", user.username);
      localStorage.setItem("userRole", user.role ?? "customer");
      localStorage.setItem("userId", user.id); 

      toast.success("Logged in successfully!");

      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login
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
          Login
        </button>
      </form>
    </div>
  );
};

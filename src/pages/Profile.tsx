import { useState, useEffect, FormEvent } from "react";
import { getCurrentUser, User } from "../api";
import toast from 'react-hot-toast';

interface ProfileForm {
  name: string;
  email: string;
}

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setForm({
          name: user.name,
          email: user.email,
        });
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    toast.error("Profile updates are not supported in this version");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
            disabled
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

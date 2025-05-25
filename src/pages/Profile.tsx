import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getUser, saveUser, User } from "../api";
import toast from 'react-hot-toast';

interface ProfileForm {
  name: string;
  email: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ name: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = getUser();
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (storedUser && loggedInUser === storedUser.name) {
      setUser(storedUser);
      setForm({ name: storedUser.name, email: storedUser.email });
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setMessage("Name and email are required.");
      return;
    }
    if (!user) return;
    
    // Update localStorage "user" and "loggedInUser"
    const updatedUser = { ...user, ...form };
    saveUser(updatedUser);
    localStorage.setItem("loggedInUser", form.name);
    setUser(updatedUser);
    setEditing(false);
    setMessage("");
    toast.success("Profile updated!");
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-600">
        You must be logged in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Profile</h2>
      {message && <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{message}</div>}
      {!editing ? (
        <div>
          <div className="mb-4">
            <span className="font-semibold">Name: </span>{user.name}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Email: </span>{user.email}
          </div>
          <button
            className="bg-blue-700 text-white py-2 px-6 rounded hover:bg-blue-800 transition"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
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
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
            Save
          </button>
          <button
            type="button"
            className="w-full bg-gray-300 text-gray-800 py-2 rounded mt-2"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

import { useState, useEffect, FormEvent } from "react";
import { getCurrentUser, updateUser, User } from "../api";
import toast from "react-hot-toast";

interface ProfileForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  newPassword?: string;
}

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setForm({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          newPassword: "",
        });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      toast.error("User not loaded yet.");
      return;
    }
    try {
      const updatePayload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
      };
      if (form.newPassword && form.newPassword.length > 0) {
        updatePayload.password = form.newPassword;
      }
      await updateUser(form.id, updatePayload);
      toast.success("Profile updated!");
      setForm(f => ({ ...f, newPassword: "" }));
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            disabled // don't allow change here
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={e => setForm({ ...form, newPassword: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Leave blank to keep current"
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

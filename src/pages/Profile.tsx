import { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";

import { getCurrentUser, updateUser } from "../api";

import type { UserModel } from "../models/UserModel";

interface ProfileForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  newPassword?: string;
};

interface WalletForm {
  topUpAmount: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    newPassword: "",
  });
  const [walletForm, setWalletForm] = useState<WalletForm>({
    topUpAmount: "",
  });
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setUser(user);

        setForm({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
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
        phone: form.phone,
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

  const handleWalletTopUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !form.id) {
      toast.error("User not loaded yet.");

      return;
    }

    const topUpAmount = parseFloat(walletForm.topUpAmount);

    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");

      return;
    }

    setWalletLoading(true);
    try {
      const currentWallet = parseFloat(user.wallet?.toString() || "0");
      const newWalletBalance = currentWallet + topUpAmount;
      
      const updatedUser = await updateUser(form.id, { wallet: newWalletBalance });

      setUser(updatedUser);
      setWalletForm({ topUpAmount: "" });

      toast.success(`Successfully added $${topUpAmount.toFixed(2)} to your wallet!`);
    } catch (error) {
      toast.error("Failed to update wallet balance");
    } finally {
      setWalletLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const isCustomer = user?.role === "customer" || !user?.role;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Profile
      </h2>
      
      {isCustomer && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-green-800">
            Wallet
          </h3>
          
          <div className="mb-4">
            <p className="text-lg">
              <span className="font-medium">Current Balance: </span>

              <span className="text-2xl font-bold text-green-600">
                ${parseFloat(user?.wallet?.toString() || "0").toFixed(2)}
              </span>
            </p>
          </div>
          
          <form onSubmit={handleWalletTopUp} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Top Up Amount
              </label>

              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={walletForm.topUpAmount}
                  onChange={e => setWalletForm({ ...walletForm, topUpAmount: e.target.value })}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter amount to add"
                  required
                />

                <button
                  type="submit"
                  disabled={walletLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {walletLoading ? "Adding..." : "Top Up"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            Email
          </label>

          <input
            type="email"
            value={form.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Username
          </label>

          <input
            type="text"
            value={user?.username || ""}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Role
          </label>

          <input
            type="text"
            value={user?.role || "customer"}
            disabled
            className="w-full p-2 border rounded bg-gray-100 capitalize"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            New Password
          </label>

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
};

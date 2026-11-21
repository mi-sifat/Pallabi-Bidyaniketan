"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। দয়া করে পুনরায় চেষ্টা করুন।");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("লগইন প্রক্রিয়ায় সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0d1e33] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#1e3a5f]/10 mx-auto flex items-center justify-center text-[#1e3a5f] font-extrabold text-2xl border border-gray-100">
            পব
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            প্রশাসনিক প্যানেল
          </h1>
          <p className="text-xs text-gray-500">
            পল্লবী বিদ্যানিকেতন (EIIN: ১০৮৩২৫)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="form-label font-semibold">অ্যাডমিন ইমেইল (Email)</label>
            <div className="relative">
              <input
                type="email"
                required
                className="form-input pl-9"
                placeholder="admin@pallabibidyaniketan.edu.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="form-label font-semibold">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <input
                type="password"
                required
                className="form-input pl-9"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center !py-2.5 disabled:opacity-50"
          >
            {loading ? "লগইন হচ্ছে..." : "প্রবেশ করুন (Sign In)"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center border-t border-gray-100 pt-4 text-[11px] text-gray-400">
          সুরক্ষিত স্কুল কন্টেন্ট ম্যানেজমেন্ট সিস্টেম | শুধুমাত্র অনুমোদিত কর্মকর্তা
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। দয়া করে পুনরায় সঠিক তথ্য দিন।");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("লগইন প্রক্রিয়ায় সংযোগ ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top subtle bar */}
      <header className="w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <Link
          href="/bn"
          className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs">
            <Image
              src="/uploads/branding/logo.jpg"
              alt="পল্লবী বিদ্যানিকেতন লোগো"
              fill
              className="object-contain p-0.5"
              sizes="32px"
              priority
            />
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">পল্লবী বিদ্যানিকেতন</span>
            <span className="text-[10px] text-slate-500 block">Pallabi Bidyaniketan</span>
          </div>
        </Link>

        <Link
          href="/bn"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 transition-colors bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-full"
        >
          <span>মূল ওয়েবসাইটে যান</span>
          <ExternalLink size={13} />
        </Link>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[440px]">
          {/* Card Wrapper */}
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/90 overflow-hidden">
            {/* Top Brand Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-[#1e3a5f]" />

            <div className="p-7 sm:p-9 space-y-6">
              {/* Brand Logo & Heading */}
              <div className="text-center space-y-3">
                <div className="inline-block relative">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200/80 shadow-md p-1.5 mx-auto flex items-center justify-center relative overflow-hidden group">
                    <Image
                      src="/uploads/branding/logo.jpg"
                      alt="পল্লবী বিদ্যানিকেতন লোগো"
                      width={68}
                      height={68}
                      className="object-contain transition-transform group-hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                    <ShieldCheck size={14} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    পল্লবী বিদ্যানিকেতন
                  </h1>
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-widest">
                    Pallabi Bidyaniketan
                  </p>
                  <div className="inline-flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      EIIN: ১০৮৩২৫
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      স্থাপিত: ১৯৯০
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                    <Lock size={12} className="text-emerald-700" />
                    প্রশাসনিক ম্যানেজমেন্ট পোর্টাল
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle size={17} className="shrink-0 text-rose-600 mt-0.5" />
                  <span className="font-medium leading-relaxed">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    অ্যাডমিন ইমেইল (Email Address)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      className="w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/15 pl-10 pr-3.5 py-2.5 transition-all outline-none font-medium"
                      placeholder="admin@pallabibidyaniketan.edu.bd"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      পাসওয়ার্ড (Password)
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/15 pl-10 pr-10 py-2.5 transition-all outline-none font-medium"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                      aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>প্রবেশ করুন (Sign In)</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Safe Info Note */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-400 leading-normal flex items-center justify-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-700 shrink-0" />
                  <span>সুরক্ষিত প্রশাসনিক সিস্টেম • অননুমোদিত প্রবেশ নিষিদ্ধ</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick back link */}
          <div className="text-center mt-5">
            <Link
              href="/bn"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
            >
              <span>← পল্লবী বিদ্যানিকেতন মূল হোমপেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-slate-200/60 bg-white/50 text-[11px] text-slate-500">
        <p>© ২০২৬ পল্লবী বিদ্যানিকেতন (Pallabi Bidyaniketan) • সর্বস্বত্ব সংরক্ষিত</p>
      </footer>
    </div>
  );
}
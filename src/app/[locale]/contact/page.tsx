"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          যোগাযোগ করুন | Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          পল্লবী বিদ্যানিকেতন অফিসিয়াল যোগাযোগ ও অনুসন্ধান ফর্ম
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            প্রাতিষ্ঠানিক ঠিকানা
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="text-[#c9a84c] shrink-0 mt-1" size={20} />
              <div>
                <strong className="block text-gray-900">বিদ্যালয়ের অবস্থান:</strong>
                মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬, বাংলাদেশ।
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-[#c9a84c] shrink-0 mt-1" size={20} />
              <div>
                <strong className="block text-gray-900">ফোন নম্বর:</strong>
                +8801309108325
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-[#c9a84c] shrink-0 mt-1" size={20} />
              <div>
                <strong className="block text-gray-900">ইমেইল:</strong>
                info@pbn.edu.bd
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs mb-2">গুগল ম্যাপে অনুসন্ধান:</h4>
            <a
              href="https://maps.google.com/?q=Pallabi+Bidyaniketan+Mirpur-7+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-[#1e3a5f] bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            অনলাইন বার্তা পাঠান
          </h2>

          {status === "success" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              আপনার বার্তা সফলভাবে জমা হয়েছে। বিদ্যালয় কর্তৃপক্ষ শীঘ্রই যোগাযোগ করবে।
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="form-label">আপনার পূর্ণ নাম *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="নাম লিখুন"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="example@mail.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">ফোন নম্বর *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="01XXXXXXXXX"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="form-label">বিষয়</label>
              <input
                type="text"
                className="form-input"
                placeholder="যেমন: ভর্তি সম্পর্কিত তথ্য"
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">বার্তা লিখুন *</label>
              <textarea
                required
                rows={4}
                className="form-input"
                placeholder="আপনার বিস্তারিত বার্তা এখানে লিখুন..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center !py-2.5 disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

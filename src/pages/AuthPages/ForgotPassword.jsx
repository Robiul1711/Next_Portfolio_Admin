import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import {
  FiMail,
  FiArrowLeft,
  FiArrowRight,
  FiKey,
  FiCheckCircle,
} from "react-icons/fi";
import logo from "../../assets/images/logo3.svg";

// Schema
const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosPublic.post("/api/auth/forgot-password", data);
      toast.success("Password reset link has been sent to your email!");
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to send reset link. Please check your email.";
      toast.error(errorMsg);
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#080B11] text-slate-100 px-4 py-12 overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Card Container */}
      <div className="relative w-full max-w-md z-10">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-slate-700/80 via-slate-800/40 to-slate-800/20 shadow-2xl shadow-black/80">
          <div className="w-full bg-[#0D121F]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-800/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-indigo-500/20 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                  <img src={logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FiKey className="text-cyan-400 text-xs" />
                <span>Account Recovery</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Forgot Password?
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Enter your admin email to receive password recovery instructions.
              </p>
            </div>

            {submitted ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiCheckCircle size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Reset Link Sent!</h3>
                  <p className="text-xs text-slate-400">
                    Check your email inbox or spam folder for password reset instructions.
                  </p>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition-colors"
                >
                  <FiArrowLeft size={16} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <FiMail className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                        errors.email
                          ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                      }`}
                      placeholder="admin@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-rose-400 text-xs mt-1 flex items-center gap-1 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back link */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                <FiArrowLeft className="text-xs" />
                <span>Remember your password? Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

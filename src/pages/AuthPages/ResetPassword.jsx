import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiShield,
} from "react-icons/fi";
import logo from "../../assets/images/logo3.svg";

// Validation Schema
const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      token,
      password: data.password,
    };

    try {
      await axiosPublic.post("/api/auth/reset-password", payload);
      toast.success("Password reset successful! You can now log in.");
      setLoading(false);
      navigate("/");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Password reset failed or token expired.";
      toast.error(errorMsg);
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#080B11] text-slate-100 px-4 py-12 overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Ambient Glows */}
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
            <div className="flex flex-col items-center text-center mb-8">
              {/* Logo Badge Container */}
              <div className="flex items-center justify-center mb-3.5">
                <div className="px-6 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl shadow-cyan-500/5 flex items-center justify-center hover:border-slate-700 transition-colors">
                  <img src={logo} alt="Ashiq Logo" className="h-7 sm:h-8 w-auto object-contain drop-shadow" />
                </div>
              </div>

              {/* Security Update Tag */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
                <FiShield className="text-cyan-400 text-xs" />
                <span>Security Update</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Reset Password
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
                Create a strong new password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.password
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                    }`}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                    }`}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    {errors.confirmPassword.message}
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
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                <FiArrowLeft className="text-xs" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

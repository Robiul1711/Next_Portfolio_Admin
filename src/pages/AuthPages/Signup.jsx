import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import logo from "../../assets/images/logo3.svg";

// Zod Validation Schema
const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Signup() {
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
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axiosPublic.post("/api/auth/signup", payload);
      toast.success("Admin Account Created Successfully!");
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Account creation failed. Please try again.";
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
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-indigo-500/20 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                  <img src={logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FiShield className="text-cyan-400 text-xs" />
                <span>Admin Registration</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Create Account
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Register as an administrator to manage the portfolio
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                  <input
                    type="text"
                    {...register("name")}
                    className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.name
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                    }`}
                    placeholder="Ashiq"
                  />
                </div>
                {errors.name && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.email
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.password
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                    }`}
                    placeholder="••••••••"
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
                  <p className="text-rose-400 text-xs mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`w-full bg-slate-950/70 border rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        : "border-slate-800 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 hover:border-slate-700"
                    }`}
                    placeholder="••••••••"
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
                  <p className="text-rose-400 text-xs mt-1 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import logo from "../../assets/images/logo3.svg";

// Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post("/api/auth/login", data);
      toast.success("Welcome back! Login successful.");
      localStorage.setItem("token", response.data.token);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Invalid email or password. Please try again.";
      toast.error(errorMsg);
      console.error("Login Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#080B11] text-slate-100 px-4 py-12 overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Card Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Glow Accent Border Container */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-slate-700/80 via-slate-800/40 to-slate-800/20 shadow-2xl shadow-black/80">
          <div className="w-full bg-[#0D121F]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-800/50">
            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center mb-8">
              {/* Logo Badge Container */}
              <div className="flex items-center justify-center mb-3.5">
                <div className="px-6 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl shadow-cyan-500/5 flex items-center justify-center hover:border-slate-700 transition-colors">
                  <img src={logo} alt="Ashiq Logo" className="h-7 sm:h-8 w-auto object-contain drop-shadow" />
                </div>
              </div>

              {/* Admin Workspace Tag */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider mb-3">
                <FiShield className="text-cyan-400 text-xs" />
                <span>Admin Workspace</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
                Sign in to manage your portfolio, projects & CMS
              </p>
            </div>

            {/* Login Form */}
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
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-400 text-xs mt-1 flex items-center gap-1 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper / Portfolio link */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <a
                href="https://robiul-islam-ashiq.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <FiCheckCircle className="text-cyan-400 text-xs" />
                <span>Visit Live Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

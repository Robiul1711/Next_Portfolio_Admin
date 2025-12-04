import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const axiosPublic=useAxiosPublic();
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
      console.log("Login response:", response.data);
      toast.success("Login successful!");
   
      localStorage.setItem("token", response.data.token);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed!");
      console.error("Login Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password
            </Link>
          </div>
          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?
          <a href="/" className="text-blue-600 hover:underline ml-1">
            Sign up
          </a>
        </p> */}
      </div>
    </div>
  );
}

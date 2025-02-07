import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaMapMarkerAlt, FaPhoneAlt, FaCalendarAlt, FaVenusMars } from "react-icons/fa";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    address: "",
    phoneNo: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? "http://localhost:4000/api/auth/login"
        : "http://localhost:4000/api/auth/signup";
      const response = await axios.post(endpoint, formData);
      toast.success(response.data.message);

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        toast.success("Signup successful! Redirecting to login...");
        setTimeout(() => setIsLogin(true), 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white" style={{ backgroundImage: 'url("https://example.com/background.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Left Section */}
      <div className="md:w-4/5 flex flex-col justify-center p-8 text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-500">Travel Expense Tracker</h1>
        <p className="text-lg text-gray-300 mb-6">
          Manage your travel expenses easily and efficiently. Track your trips, control your budget, and generate reports on the go. Simplify your travel management process and gain financial clarity.
        </p>
        <div className="mt-4 text-left">
          <h2 className="text-3xl font-semibold mb-4 text-blue-400">How It Works</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>
              <strong>Sign Up or Login:</strong> Create an account or log in to your existing account to start managing your travel expenses.
            </li>
            <li>
              <strong>Add Expenses:</strong> Easily add your travel expenses by filling out a simple form with details like departure date, arrival date, mode of travel, and costs.
            </li>
            <li>
              <strong>Track Expenses:</strong> View and manage all your travel expenses in one place. Filter expenses by date, view detailed reports, and keep track of your spending.
            </li>
            <li>
              <strong>Generate Reports:</strong> Generate detailed reports of your travel expenses. Download reports in PDF or Excel format for easy sharing and record-keeping.
            </li>
            <li>
              <strong>Budget Control:</strong> Set budgets for your trips and track your spending against these budgets. Get alerts when you are nearing your budget limits.
            </li>
            <li>
              <strong>Secure and Private:</strong> Your data is securely stored and accessible only to you. We ensure the privacy and security of your information.
            </li>
          </ul>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 p-8 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">
            {isLogin ? "Login" : "Signup"}
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                    className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 pl-10 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>
          <div className="text-center mt-4 flex justify-center">
            {isLogin ? (
              <>
                <p className="text-gray-400">Don't have an account? </p>
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400">Already have an account?</p>
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-500 hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

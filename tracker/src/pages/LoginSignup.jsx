import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black bg ">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Left Section */}
      <div className=" md:w-4/5 flex flex-col justify-center p-8   text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Travel Expense Tracker</h1>
        <p className="text-lg">
          Manage your travel expenses easily and efficiently. Track your trips, control your budget, and generate reports on the go. Simplify your travel management process and gain financial clarity.
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Signup"}
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
                  onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
            >
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>
          <div className="text-center mt-4 flex justify-center">
  {isLogin ? (
    <>
      <p className="text-gray-600">Don't have an account? </p>
      <button
        onClick={() => setIsLogin(false)}
        className="text-blue-500 hover:underline"
      >
        <p> Sign up </p> 
      </button>
    </>
  ) : (
    <>
      <p className="text-gray-600">Already have an account ?</p>
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

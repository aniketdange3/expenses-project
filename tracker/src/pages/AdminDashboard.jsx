import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ExpenseList from "../components/ExpenseList";
import UserList from "../components/UserList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("expenses");
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.info("Logged out successfully!");
    setTimeout(() => navigate("/"), 1500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expenseResponse, userResponse] = await Promise.all([
        axios.get("http://localhost:4000/api/expenses"),
        axios.get("http://localhost:4000/api/auth/users"),
      ]);
      setExpenses(expenseResponse.data);
      setUsers(userResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data.");
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesName =
      !searchName ||
      (expense.name &&
        expense.name.toLowerCase().includes(searchName.toLowerCase()));
    const matchesCity =
      !searchCity ||
      (expense.departurePlace &&
        expense.departurePlace
          .toLowerCase()
          .includes(searchCity.toLowerCase())) ||
      (expense.arrivalPlace &&
        expense.arrivalPlace.toLowerCase().includes(searchCity.toLowerCase()));
    return matchesName && matchesCity;
  });

  const filteredUsers = users.filter((user) => {
    const matchesName =
      !searchName ||
      (user.name && user.name.toLowerCase().includes(searchName.toLowerCase()));
    return matchesName;
  });

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed top-6 right-10">
        <button
          onClick={handleLogout}
          className="text-xl rounded-full bg-gray-700 text-white p-3 flex items-center hover:bg-black hover:text-white"
          title="Logout"
        >
          <IoIosLogOut />
        </button>
      </div>
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Tabs and Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 font-medium rounded-md ${
              activeTab === "expenses"
                ? "bg-black hover:bg-black text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            Expense List
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium rounded-md ${
              activeTab === "users"
                ? "bg-black hover:bg-black text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            User List
          </button>
        </div>
        <div className="flex space-x-4">
          {activeTab === "expenses" && (
            <input
              type="text"
              placeholder="Search by City"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="px-2 py-2 border border-gray-600 rounded-md bg-gray-800 text-white  "
            />
          )}
          {activeTab === "users" && (
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
            />
          )}
        </div>
      </div>

      {/* Render Content Based on Active Tab */}
      {activeTab === "expenses" ? (
        <ExpenseList
          expenses={filteredExpenses}
          setExpenses={setExpenses}
          fetchData={fetchData}
        />
      ) : (
        <UserList
          users={filteredUsers}
          setUsers={setUsers}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import UserList from '../components/UserList'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosLogOut } from 'react-icons/io';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize navigate
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast.info('Logged out successfully!');
    setTimeout(() => navigate('/'), 1500); // Navigate to index page after 1.5 seconds
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expenseResponse, userResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/expenses'),
        axios.get('http://localhost:5000/api/auth/users'),
      ]);
      setExpenses(expenseResponse.data);
      setUsers(userResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data.');
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed top-6 right-10">
        <button
          onClick={handleLogout}
          className="text-xl rounded-full border-4 bg-gray-200 text-black p-2 flex items-center hover:bg-black hover:text-white"
          title="Logout"
        >
          <IoIosLogOut />
        </button>
      </div>
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 font-medium rounded-md ${activeTab === 'expenses' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
        >
          Expense List
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2   rounded-md ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
        >
          User List
        </button>
      </div>

      {/* Render Content Based on Active Tab */}
      {activeTab === 'expenses' ? (
        <ExpenseList expenses={expenses} setExpenses={setExpenses} fetchData={fetchData} />
      ) : (
        <UserList users={users} setUsers={setUsers} fetchData={fetchData} />
      )}
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileExcel, FaFilePdf, FaSignOutAlt, FaPlus } from 'react-icons/fa'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import AddExpenseModal from '../components/AddExpenseModal';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState({});
  const [filter, setFilter] = useState('all'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    departureDate: '',
    departurePlace: '',
    arrivalDate: '',
    arrivalPlace: '',
    modeOfTravel: '',
    distance: '',
    amount: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    const fetchExpenses = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching expenses:', error.response?.data || error.message);
      }
    };
    fetchExpenses();
  }, []);

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('User and Expenses Report', 20, 20);

    const userTable = [
      ['Name', 'Email', 'Date of Birth', 'Phone', 'Address'],
      [user.name, user.email, new Date(user.dob).toLocaleDateString(), user.phoneNo || 'N/A', user.address || 'N/A']
    ];

    doc.autoTable({
      startY: 30,
      head: userTable.slice(0, 1),
      body: userTable.slice(1),
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5, halign: 'center' }
    });

    const expensesTable = [
      ['Departure Date', 'Departure Place', 'Arrival Date', 'Arrival Place', 'Mode of Travel', 'Distance (km)', 'Amount (INR)'],
      ...expenses.map(expense => [
        new Date(expense.departureDate).toLocaleDateString(),
        expense.departurePlace,
        new Date(expense.arrivalDate).toLocaleDateString(),
        expense.arrivalPlace,
        expense.modeOfTravel,
        expense.distance,
        expense.amount
      ])
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: expensesTable.slice(0, 1),
      body: expensesTable.slice(1),
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5, halign: 'center' }
    });

    doc.save('user_and_expenses.pdf');
  };

  const handleExcelDownload = () => {
    const userData = [
      {
        'Name': user.name || 'N/A',
        'Email': user.email || 'N/A',
        'Phone': user.phoneNo || 'N/A',
        'Address': user.address || 'N/A'
      }
    ];

    const expensesData = expenses.map(expense => ({
      'Departure Date': expense.departureDate ? new Date(expense.departureDate).toLocaleDateString() : 'N/A',
      'Departure Place': expense.departurePlace || 'N/A',
      'Arrival Date': expense.arrivalDate ? new Date(expense.arrivalDate).toLocaleDateString() : 'N/A',
      'Arrival Place': expense.arrivalPlace || 'N/A',
      'Mode of Travel': expense.modeOfTravel || 'N/A',
      'Distance (km)': expense.distance || 'N/A',
      'Amount (₹)': expense.amount || 'N/A'
    }));

    const wb = utils.book_new();

    const userSheet = utils.json_to_sheet(userData);
    utils.book_append_sheet(wb, userSheet, 'User Data');

    const expensesSheet = utils.json_to_sheet(expensesData);
    utils.book_append_sheet(wb, expensesSheet, 'Expenses');

    writeFile(wb, 'user_and_expenses.xlsx');
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredExpenses = () => {
    const now = new Date();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.departureDate);
      switch (filter) {
        case 'day':
          return expenseDate.toDateString() === now.toDateString();
        case 'week':
          const startOfWeek = now.getDate() - now.getDay();
          const endOfWeek = startOfWeek + 6;
          const startOfWeekDate = new Date(now.setDate(startOfWeek));
          const endOfWeekDate = new Date(now.setDate(endOfWeek));
          return expenseDate >= startOfWeekDate && expenseDate <= endOfWeekDate;
        case 'month':
          return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        case 'year':
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const handleAddExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('http://localhost:5000/api/expenses', newExpense);
      handleExpenseAdded(data);
      setIsModalOpen(false);  // Close modal
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl ">Welcome, <span className="  font-bold text-blue-600 text-3xl">{user.name}!</span></h1>

    

      {/* Filter and Button Section with Right Alignment */}
      <div className="flex justify-end space-x-4 ">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-200 rounded-full p-3  hover:bg-black hover:text-white"
          >
          <FaPlus /> 
        </button>

        <button
          onClick={handlePDFDownload}
          className="bg-gray-200 rounded-full p-3  hover:bg-black hover:text-white"
          >
          <FaFilePdf /> 
        </button>

        <button
          onClick={handleExcelDownload}
          className="bg-gray-200 rounded-full p-3  hover:bg-black hover:text-white"
          >
          <FaFileExcel /> 
        </button>

        <button
          onClick={handleLogout}
          className="bg-gray-200 rounded-full p-3  hover:bg-black hover:text-white"

          >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Filter Expenses */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">Filter</label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="p-1 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Expenses Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-black -100 text-white">
            <th className="border px-4 py-2 font-normal">Departure Date</th>
            <th className="border px-4 py-2 font-normal">Departure Place</th>
            <th className="border px-4 py-2 font-normal">Arrival Date</th>
            <th className="border px-4 py-2 font-normal">Arrival Place</th>
            <th className="border px-4 py-2 font-normal">Mode of Travel</th>
            <th className="border px-4 py-2 font-normal">Distance (Km)</th>
            <th className="border px-4 py-2 font-normal">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses().length > 0 ? (
            filteredExpenses().map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">{new Date(expense.departureDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2 text-center">{expense.departurePlace}</td>
                <td className="border px-4 py-2 text-center">{new Date(expense.arrivalDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2 text-center">{expense.arrivalPlace}</td>
                <td className="border px-4 py-2 text-center">{expense.modeOfTravel}</td>
                <td className="border px-4 py-2 text-center">{expense.distance} km</td>
                <td className="border px-4 py-2 text-center">{expense.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No expenses found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <AddExpenseModal
      isModalOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      newExpense={newExpense}
      onChange={handleAddExpenseChange}
      onSubmit={handleAddExpenseSubmit}
    />
    </div>
  );
};

export default Dashboard;

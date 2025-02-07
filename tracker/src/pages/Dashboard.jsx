import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit3 } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import AddExpenseModal from '../components/AddExpenseModal';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState({});
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    departureDate: '',
    departurePlace: '',
    arrivalDate: '',
    arrivalPlace: '',
    modeOfTravel: '',
    ticketCost: '',
    accommodationCost: '',
    mealAllowances: '',
    miscellaneousCost: '',
    amount: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData.userId) {
      userData.userId = generateUserId();
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);

    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/expenses?userId=${userData.userId}`);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error.response?.data || error.message);
        toast.error('Error fetching expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const generateUserId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

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
      ['Departure Date', 'Departure Place', 'Arrival Date', 'Arrival Place', 'Mode of Travel', 'Ticket Cost', 'Accommodation Cost', 'Meal Allowances', 'Miscellaneous Cost', 'Total Cost (INR)', 'Status'],
      ...expenses.map(expense => [
        new Date(expense.departureDate).toLocaleDateString(),
        expense.departurePlace,
        new Date(expense.arrivalDate).toLocaleDateString(),
        expense.arrivalPlace,
        expense.modeOfTravel,
        expense.ticketCost,
        expense.accommodationCost,
        expense.mealAllowances,
        expense.miscellaneousCost,
        expense.amount,
        expense.status
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
      'Ticket Cost (₹)': expense.ticketCost || 'N/A',
      'Accommodation Cost': expense.accommodationCost || 'N/A',
      'Meal Allowances': expense.mealAllowances || 'N/A',
      'Miscellaneous Cost': expense.miscellaneousCost || 'N/A',
      'Total Cost (₹)': expense.amount || 'N/A',
      'Status': expense.status || 'N/A'
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
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.departureDate);
      switch (filter) {
        case 'day':
          return expenseDate.toDateString() === now.toDateString();
        case 'week':
          return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
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

    const ticketCost = parseFloat(newExpense.ticketCost) || 0;
    const accommodationCost = parseFloat(newExpense.accommodationCost) || 0;
    const mealAllowances = parseFloat(newExpense.mealAllowances) || 0;
    const miscellaneousCost = parseFloat(newExpense.miscellaneousCost) || 0;
    const totalCost = ticketCost + accommodationCost + mealAllowances + miscellaneousCost;

    const expenseToAdd = {
      ...newExpense,
      amount: totalCost.toFixed(2),
      userId: user.userId
    };

    try {
      const response = await axios.post('http://localhost:4000/api/expenses', expenseToAdd);
      handleExpenseAdded(response.data);
      setIsModalOpen(false);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error.response?.data || error.message);
      toast.error('Error adding expense');
    }
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/expenses/${updatedExpense._id}`, updatedExpense);
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === updatedExpense._id ? response.data : expense
        )
      );
      setIsEditModalOpen(false);
      toast.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error updating expense');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl">Welcome, <span className="font-bold text-gray-300 text-3xl">{user.name}!</span></h1>

      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-700 rounded-full p-3 hover:bg-gray-600"
          title='Add expense'
        >
          <FaPlus />
        </button>

        <button
          onClick={handlePDFDownload}
          className="bg-gray-700 rounded-full p-3 hover:bg-gray-600"
          title='Download PDF'
        >
          <FaFilePdf />
        </button>

        <button
          onClick={handleExcelDownload}
          title='Download Excel'
          className="bg-gray-700 rounded-full p-3 hover:bg-gray-600"
        >
          <FaFileExcel />
        </button>

        <button
          onClick={handleLogout}
          title='Logout'
          className="bg-gray-700 rounded-full p-3 hover:bg-gray-600"
        >
          <FaSignOutAlt />
        </button>
      </div>

      <div className="mb-4 mt-4">
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
        >
          <option value="all">All</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <table className="min-w-full bg-gray-800 rounded-xl shadow-md border-b border-gray-700">
        <thead>
          <tr>
            <th className="font-medium px-2 py-3 border border-gray-700">Departure Date</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Departure Place</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Arrival Date</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Arrival Place</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Mode of Travel</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Ticket Cost</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Accommodation Cost</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Meal Allowances</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Miscellaneous Cost</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Total Cost</th>
            <th className="font-medium px-2 py-3 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses().length > 0 ? (
            filteredExpenses().map((expense) => (
              <tr key={expense._id} className="bg-gray-700">
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{new Date(expense.departureDate).toLocaleDateString()}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.departurePlace}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{new Date(expense.arrivalDate).toLocaleDateString()}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.arrivalPlace}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.modeOfTravel}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.ticketCost}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.accommodationCost}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.mealAllowances}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.miscellaneousCost}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">{expense.amount}</td>
                <td className="border border-gray-600 text-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className="p-2 rounded bg-gray-600 hover:bg-gray-500"
                  >
                    <FiEdit3 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center p-5">No expenses data found.</td>
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
        mode="add"
      />

      {selectedExpense && (
        <AddExpenseModal
          isModalOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          newExpense={selectedExpense}
          onChange={(e) => {
            const { name, value } = e.target;
            setSelectedExpense((prev) => ({
              ...prev,
              [name]: value
            }));
          }}
          onSubmit={() => handleUpdateExpense(selectedExpense)}
          mode="edit"
        />
      )}
    </div>
  );
};

export default Dashboard;

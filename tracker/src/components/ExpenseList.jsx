import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AddExpenseModal from './AddExpenseModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

const ExpenseList = ({ expenses, setExpenses, fetchData }) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      toast.error('Error deleting expense!');
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = async (newExpense) => {
    try {
      console.log("Saving expense:", newExpense); // Debugging statement
      const response = await axios.post('http://localhost:4000/api/expenses', newExpense);

      if (response.status !== 200) {
        throw new Error('Error saving expense');
      }

      const data = response.data;
      setExpenses([...expenses, data]);
      setIsExpenseModalOpen(false);
      setEditingExpense(null);
      toast.success('Expense saved successfully!');
      console.log("Expense saved successfully:", data);
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error('Error saving expense!');
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      console.log("Updating expense:", updatedExpense); // Debugging statement
      const response = await axios.put(`http://localhost:4000/api/expenses/${updatedExpense._id}`, updatedExpense);

      if (response.status !== 200) {
        throw new Error('Error updating expense');
      }

      const data = response.data;
      setExpenses(expenses.map((expense) => (expense._id === data._id ? data : expense)));
      setIsExpenseModalOpen(false);
      setEditingExpense(null);
      toast.success('Expense updated successfully!');
      console.log("Expense updated successfully:", data);
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error('Error updating expense!');
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingExpense) {
      handleUpdateExpense(formData);
    } else {
      handleSaveExpense(formData);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-white">Expenses List</h1>
      
      </div>

      <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
        <table className="min-w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="font-medium px-2 py-3 border border-gray-600">Departure Date</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Departure Place</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Arrival Date</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Arrival Place</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Mode of Travel</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Ticket Cost (INR)</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Accommodation Cost (INR)</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Meal Allowances (INR)</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Miscellaneous Cost (INR)</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Total Cost</th>
              <th className="font-medium px-2 py-3 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(expenses) && expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense._id} className="text-center">
                  <td className="border px-4 py-2 border-gray-600">{new Date(expense.departureDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.departurePlace}</td>
                  <td className="border px-4 py-2 border-gray-600">{new Date(expense.arrivalDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.arrivalPlace}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.modeOfTravel}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.ticketCost}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.accommodationCost}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.mealAllowances}</td>
                  <td className="border px-4 py-2 border-gray-600">{expense.miscellaneousCost}</td>
                  <td className="border px-4 py-2 border-gray-600">₹{expense.amount}</td>
                  <td className="border px-4 py-2 border-gray-600 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="bg-gray-700 p-3 rounded-full hover:bg-black hover:text-white"
                      title="Edit"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="bg-gray-700 rounded-full p-3 hover:bg-black hover:text-white"
                      title="Delete"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddExpenseModal
        isModalOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        newExpense={{
          departureDate: "",
          departurePlace: "",
          arrivalDate: "",
          arrivalPlace: "",
          modeOfTravel: "",
          ticketCost: 0,
          accommodationCost: 0,
          mealAllowances: 0,
          miscellaneousCost: 0,
          amount: 0
        }}
        onChange={(e) => {
          const { name, value } = e.target;
          setEditingExpense((prevData) => ({
            ...prevData,
            [name]: value
          }));
        }}
        onSubmit={handleFormSubmit}
        editingExpense={editingExpense}
      />
    </div>
  );
};

export default ExpenseList;

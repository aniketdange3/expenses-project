import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';
import ExpenseModal from './ExpenseModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const ExpenseList = ({ expenses, setExpenses, fetchData }) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      toast.error("Error deleting expense!");
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };


  return (
    <div className=" min-h-screen p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss />

     

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-black">Expenses List</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-black">
          <thead className="bg-black text-white">
            <tr>
              <th className="border px-4 py-2  font-normal">Departure Date</th>
              <th className="border px-4 py-2  font-normal">Departure Place</th>
              <th className="border px-4 py-2  font-normal">Arrival Date</th>
              <th className="border px-4 py-2  font-normal">Arrival Place</th>
              <th className="border px-4 py-2  font-normal">Mode of Travel</th>
              <th className="border px-4 py-2  font-normal">Distance (km)</th>
              <th className="border px-4 py-2  font-normal">Amount (₹)</th>
              <th className="border px-4 py-2  font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(expenses) && expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense._id} className=" text-center">
                  <td className="border px-4 py-2">{new Date(expense.departureDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{expense.departurePlace}</td>
                  <td className="border px-4 py-2">{new Date(expense.arrivalDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{expense.arrivalPlace}</td>
                  <td className="border px-4 py-2">{expense.modeOfTravel}</td>
                  <td className="border px-4 py-2">{expense.distance}</td>
                  <td className="border px-4 py-2">₹{expense.amount}</td>
                  <td className="border px-4 py-2 flex space-x-2 justify-center">
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="bg-gray-200 p-3 rounded-full   hover:bg-black hover:text-white"
                      title="Edit"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="bg-gray-200 rounded-full p-3  hover:bg-black hover:text-white"
                      title="Delete"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-700">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={() => {
          fetchData();
          setIsExpenseModalOpen(false);
          toast.success(editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
        }}
        expenseToEdit={editingExpense}
      />
    </div>
  );
};

export default ExpenseList;

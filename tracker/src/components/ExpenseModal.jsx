import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseModal = ({ isOpen, onClose, onSave, expenseToEdit }) => {
  const [formData, setFormData] = useState({
    departureDate: '',
    departurePlace: '',
    arrivalDate: '',
    arrivalPlace: '',
    modeOfTravel: '',
    distance: '',
    amount: '',
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        departureDate: new Date(expenseToEdit.departureDate).toISOString().substr(0, 10),
        departurePlace: expenseToEdit.departurePlace,
        arrivalDate: new Date(expenseToEdit.arrivalDate).toISOString().substr(0, 10),
        arrivalPlace: expenseToEdit.arrivalPlace,
        modeOfTravel: expenseToEdit.modeOfTravel,
        distance: expenseToEdit.distance,
        amount: expenseToEdit.amount,
      });
    } else {
      setFormData({
        departureDate: '',
        departurePlace: '',
        arrivalDate: '',
        arrivalPlace: '',
        modeOfTravel: '',
        distance: '',
        amount: '',
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expenseToEdit) {
        await axios.put(`http://localhost:5000/api/expenses/${expenseToEdit._id}`, formData);
        toast.success('Expense updated successfully!');
      } else {
        await axios.post(`http://localhost:5000/api/expenses`, formData);
        toast.success('Expense added successfully!');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error saving expense. Please try again.');
      console.error('Error saving expense:', error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/5">
          <h2 className="text-xl font-semibold mb-6">
            {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              placeholder="Departure Date"
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="departurePlace"
              value={formData.departurePlace}
              onChange={handleChange}
              placeholder="Departure Place"
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              placeholder="Arrival Date"
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              name="arrivalPlace"
              value={formData.arrivalPlace}
              onChange={handleChange}
              placeholder="Arrival Place"
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <select
              name="modeOfTravel"
              value={formData.modeOfTravel}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="" disabled>
                Select Mode of Travel
              </option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Flight">Flight</option>
              <option value="Bike">Bike</option>
            </select>
            <input
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              placeholder="Distance (km)"
              min="0"
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount (₹)"
              min="0"
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <div className="col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {expenseToEdit ? 'Update' : 'Add'} Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ExpenseModal;

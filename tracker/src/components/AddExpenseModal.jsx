import React from 'react';

const AddExpenseModal = ({
  isModalOpen,
  onClose,
  newExpense,
  onChange,
  onSubmit
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-1/2 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl mb-4 font-semibold">Add New Expense</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="departureDate" className="block font-medium">
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={newExpense.departureDate}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="departurePlace" className="block font-medium">
              Departure Place
            </label>
            <input
              type="text"
              id="departurePlace"
              name="departurePlace"
              value={newExpense.departurePlace}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="arrivalDate" className="block font-medium">
              Arrival Date
            </label>
            <input
              type="date"
              id="arrivalDate"
              name="arrivalDate"
              value={newExpense.arrivalDate}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="arrivalPlace" className="block font-medium">
              Arrival Place
            </label>
            <input
              type="text"
              id="arrivalPlace"
              name="arrivalPlace"
              value={newExpense.arrivalPlace}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="modeOfTravel" className="block font-medium">
              Mode of Travel
            </label>
            <select
              id="modeOfTravel"
              name="modeOfTravel"
              value={newExpense.modeOfTravel}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Mode</option>
              <option value="Car">Car</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Flight">Flight</option>
            </select>
          </div>
          <div>
            <label htmlFor="distance" className="block font-medium">
              Distance (km)
            </label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={newExpense.distance}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block font-medium">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newExpense.amount}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </form>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;

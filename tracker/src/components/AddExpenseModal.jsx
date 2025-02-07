import { useEffect, useState } from "react";

const AddExpenseModal = ({
  isModalOpen,
  onClose,
  newExpense = {
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
  },
  onChange,
  onSubmit,
  editingExpense = null
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [formData, setFormData] = useState(newExpense);

  useEffect(() => {
    if (editingExpense) {
      setFormData(editingExpense);
    } else {
      setFormData(newExpense);
    }
  }, [editingExpense, newExpense]);

  useEffect(() => {
    const calculateTotalCost = () => {
      const ticketCost = parseFloat(formData?.ticketCost) || 0;
      const accommodationCost = parseFloat(formData?.accommodationCost) || 0;
      const mealAllowances = parseFloat(formData?.mealAllowances) || 0;
      const miscellaneousCost = parseFloat(formData?.miscellaneousCost) || 0;

      const total = ticketCost + accommodationCost + mealAllowances + miscellaneousCost;
      setTotalCost(total);
    };

    calculateTotalCost();
  }, [formData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      amount: totalCost.toFixed(2)
    };
    onSubmit(updatedFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-gray-800 w-full max-w-3xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="p-6">
          <h2 className="text-2xl mb-4 font-semibold text-white">
            {editingExpense ? "Update Expense" : "Add New Expense"}
          </h2>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Date */}
            <div>
              <label htmlFor="departureDate" className="block font-medium text-gray-300">
                Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Departure Place */}
            <div>
              <label htmlFor="departurePlace" className="block font-medium text-gray-300">
                Departure Place
              </label>
              <input
                type="text"
                id="departurePlace"
                name="departurePlace"
                value={formData.departurePlace}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Arrival Date */}
            <div>
              <label htmlFor="arrivalDate" className="block font-medium text-gray-300">
                Arrival Date
              </label>
              <input
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Arrival Place */}
            <div>
              <label htmlFor="arrivalPlace" className="block font-medium text-gray-300">
                Arrival Place
              </label>
              <input
                type="text"
                id="arrivalPlace"
                name="arrivalPlace"
                value={formData.arrivalPlace}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Mode of Travel */}
            <div>
              <label htmlFor="modeOfTravel" className="block font-medium text-gray-300">
                Mode of Travel
              </label>
              <select
                id="modeOfTravel"
                name="modeOfTravel"
                value={formData.modeOfTravel}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              >
                <option value="">Select Mode</option>
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Flight">Flight</option>
              </select>
            </div>

            {/* Ticket Cost */}
            <div>
              <label htmlFor="ticketCost" className="block font-medium text-gray-300">
                Ticket Cost (₹)
              </label>
              <input
                type="number"
                id="ticketCost"
                name="ticketCost"
                value={formData.ticketCost}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Accommodation Cost */}
            <div>
              <label htmlFor="accommodationCost" className="block font-medium text-gray-300">
                Accommodation Cost (₹)
              </label>
              <input
                type="number"
                id="accommodationCost"
                name="accommodationCost"
                value={formData.accommodationCost}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Meal Allowances */}
            <div>
              <label htmlFor="mealAllowances" className="block font-medium text-gray-300">
                Meal Allowances (₹)
              </label>
              <input
                type="number"
                id="mealAllowances"
                name="mealAllowances"
                value={formData.mealAllowances}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Miscellaneous Cost */}
            <div>
              <label htmlFor="miscellaneousCost" className="block font-medium text-gray-300">
                Miscellaneous Cost (₹)
              </label>
              <input
                type="number"
                id="miscellaneousCost"
                name="miscellaneousCost"
                value={formData.miscellaneousCost}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                required
              />
            </div>

            {/* Total Cost (Auto-Calculated) */}
            <div>
              <label htmlFor="amount" className="block font-medium text-gray-300">
                Total Cost (₹)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={totalCost.toFixed(2)}
                readOnly
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
            </div>
          </form>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="expense-form"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {editingExpense ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;

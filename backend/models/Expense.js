const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departurePlace: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  arrivalPlace: { type: String, required: true },
  modeOfTravel: { type: String, required: true },
  ticketCost: { type: Number, required: true },
  accommodationCost: { type: Number, required: true },
  mealAllowances: { type: Number, required: true },
  miscellaneousCost: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  departureDate: { type: Date, required: true },
  departurePlace: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  arrivalPlace: { type: String, required: true },
  modeOfTravel: { type: String, required: true },
  distance: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses for a specific user or all users
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    let expenses;
    if (userId) {
      expenses = await Expense.find({ userId });
    } else {
      expenses = await Expense.find();
    }
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new expense
router.post('/', async (req, res) => {
  const {
    userId,
    departureDate,
    departurePlace,
    arrivalDate,
    arrivalPlace,
    modeOfTravel,
    ticketCost,
    accommodationCost,
    mealAllowances,
    miscellaneousCost,
    amount
  } = req.body;

  // Check if any required fields are missing
  if (!userId || !departureDate || !departurePlace || !arrivalDate || !arrivalPlace || !modeOfTravel ||
      ticketCost == null || accommodationCost == null || mealAllowances == null || miscellaneousCost == null || amount == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newExpense = new Expense({
    userId,
    departureDate,
    departurePlace,
    arrivalDate,
    arrivalPlace,
    modeOfTravel,
    ticketCost,
    accommodationCost,
    mealAllowances,
    miscellaneousCost,
    amount,
  });

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an expense by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an expense by ID
router.delete('/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

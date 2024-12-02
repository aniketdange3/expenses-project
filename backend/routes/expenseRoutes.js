const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new expense
router.post('/', async (req, res) => {
    const { departureDate, departurePlace, arrivalDate, arrivalPlace, modeOfTravel, distance, amount } = req.body;
  
    // Check if any required fields are missing
    if (!departureDate || !departurePlace || !arrivalDate || !arrivalPlace || !modeOfTravel || !distance || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const newExpense = new Expense({
      departureDate,
      departurePlace,
      arrivalDate,
      arrivalPlace,
      modeOfTravel,
      distance,
      amount
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

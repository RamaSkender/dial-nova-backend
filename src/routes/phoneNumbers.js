const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// Get all phone numbers
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('phone_numbers')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new phone number
router.post('/', async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'phone_number is required' });
    }

    const { data, error } = await supabase
      .from('phone_numbers')
      .insert([{ phone_number: phone_number }])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a phone number
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('phone_numbers')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
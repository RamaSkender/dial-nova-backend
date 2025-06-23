const express = require('express');
const router = express.Router();
const { makeOutboundCall } = require('../twilio');
const authMiddleware = require('../middleware/auth');
const supabase = require('../supabase');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

router.get('/logs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/initiate', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: '"to" phone number is required' });
    }

    const call = await makeOutboundCall(to);

    res.json({ message: 'Call initiated successfully', call_sid: call.sid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate call', details: error.message });
  }
});

module.exports = router; 
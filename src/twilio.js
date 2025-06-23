require('dotenv').config();
const twilio = require('twilio');
const supabase = require('./supabase');
const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber, appUrl } = require('../config/appConfig');

const client = twilio(twilioAccountSid, twilioAuthToken);

const makeCall = async (to, from, webhookUrl) => {
  try {
    const call = await client.calls.create({
      to: to,
      from: from,
      url: webhookUrl,
    });

    await logCall({
      call_sid: call.sid,
      from_number: call.from,
      to_number: call.to,
      status: call.status,
      direction: 'outbound',
    });

    return call;
  } catch (error) {
    console.error('Error making outbound call:', error);
    throw error;
  }
};

const handleIncomingCall = (res) => {
  // ... existing code ...
  res.send(twiml.toString());
};

module.exports = {
  client,
  makeCall,
  handleIncomingCall,
}; 
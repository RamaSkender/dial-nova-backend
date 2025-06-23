require('dotenv').config();
const twilio = require('twilio');
const supabase = require('./supabase');
const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber, appUrl } = require('../config/appConfig');

const client = twilio(twilioAccountSid, twilioAuthToken);

async function makeOutboundCall(to) {
  try {
    const call = await client.calls.create({
      to: to,
      from: twilioPhoneNumber,
      url: `${appUrl}/twilio-webhook`,
      statusCallback: `${appUrl}/twilio-status-callback`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    // Log the call to Supabase
    const { data, error } = await supabase
      .from('call_logs')
      .insert([
        { 
          call_sid: call.sid,
          from_number: call.from,
          to_number: call.to,
          status: call.status
        }
      ])
      .select();

    if (error) {
      console.error('Error logging call to Supabase:', error);
      // Don't block call initiation if logging fails, but log the error
    }

    return call;
  } catch (error) {
    console.error('Error making outbound call:', error);
    throw error;
  }
}

module.exports = {
  client,
  makeOutboundCall
}; 
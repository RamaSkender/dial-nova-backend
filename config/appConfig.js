const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const appConfig = {
  jwtSecret: process.env.JWT_SECRET,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  appUrl: process.env.APP_URL,
  port: process.env.PORT || 3000,
};

module.exports = appConfig; 
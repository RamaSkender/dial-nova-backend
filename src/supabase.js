require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseAnonKey } = require('../config/appConfig');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are not set in the environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase; 
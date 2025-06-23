require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are not set in the environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const logCall = async (callData) => {
  const { data, error } = await supabase
    .from('call_logs')
    .insert([callData])
    .select();

  if (error) {
    console.error('Error logging call to Supabase:', error);
    // Depending on requirements, you might want to throw the error
    // or handle it gracefully without stopping the parent process.
  }
  return { data, error };
};

const getCallLogs = async (userId) => {
  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching call logs:', error);
  }
  return { data, error };
};

module.exports = {
  supabase,
  logCall,
  getCallLogs,
}; 
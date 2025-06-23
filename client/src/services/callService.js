import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/calls/';

const getCallLogs = () => {
  return axios.get(API_URL + 'logs', { headers: authHeader() });
};

const initiateCall = (to) => {
  return axios.post(API_URL + 'initiate', { to }, { headers: authHeader() });
};

const callService = {
  getCallLogs,
  initiateCall,
};

export default callService; 
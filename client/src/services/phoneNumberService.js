import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://dial-nova-backend.onrender.com/api/phone-numbers/';

const getPhoneNumbers = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const addPhoneNumber = (phoneNumber) => {
  return axios.post(API_URL, { phone_number: phoneNumber }, { headers: authHeader() });
};

const deletePhoneNumber = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const phoneNumberService = {
  getPhoneNumbers,
  addPhoneNumber,
  deletePhoneNumber,
};

export default phoneNumberService; 
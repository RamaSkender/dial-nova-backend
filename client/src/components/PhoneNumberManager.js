import React, { useState, useEffect } from 'react';
import phoneNumberService from '../services/phoneNumberService';

const PhoneNumberManager = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newNumber, setNewNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchPhoneNumbers = () => {
    setLoading(true);
    phoneNumberService.getPhoneNumbers().then(
      (response) => {
        setPhoneNumbers(response.data);
        setLoading(false);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setIsError(true);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const handleAddNumber = (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    phoneNumberService.addPhoneNumber(newNumber).then(
      () => {
        fetchPhoneNumbers();
        setNewNumber('');
        setMessage('Phone number added successfully.');
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setIsError(true);
      }
    );
  };

  const handleDeleteNumber = (id) => {
    setMessage('');
    setIsError(false);
    phoneNumberService.deletePhoneNumber(id).then(
      () => {
        fetchPhoneNumbers();
        setMessage('Phone number deleted successfully.');
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setIsError(true);
      }
    );
  };

  return (
    <div>
      <h3>Manage Phone Numbers</h3>
      <form onSubmit={handleAddNumber}>
        <input
          type="text"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="Enter new phone number"
          required
        />
        <button type="submit">Add Number</button>
      </form>
      {loading ? (
        <p>Loading numbers...</p>
      ) : (
        <ul>
          {phoneNumbers.map((number) => (
            <li key={number.id}>
              {number.phone_number}
              <button onClick={() => handleDeleteNumber(number.id)} className="delete-button">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
       {message && (
        <p className={`alert-message ${isError ? 'alert-error' : 'alert-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberManager; 
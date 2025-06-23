import React, { useState } from 'react';
import callService from '../services/callService';

const CallInitiator = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInitiateCall = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    callService.initiateCall(phoneNumber).then(
      (response) => {
        setLoading(false);
        setMessage(`Call initiated successfully. SID: ${response.data.call_sid}`);
        setPhoneNumber('');
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          'Failed to initiate call';
        setLoading(false);
        setMessage(resMessage);
        setIsError(true);
      }
    );
  };

  return (
    <div>
      <h3>Initiate a Call</h3>
      <form onSubmit={handleInitiateCall}>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number to call"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Calling...' : 'Call'}
        </button>
      </form>
      {message && (
        <p className={`alert-message ${isError ? 'alert-error' : 'alert-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CallInitiator; 
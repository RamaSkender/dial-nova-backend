import React, { useState, useEffect } from 'react';
import callService from '../services/callService';
import PhoneNumberManager from '../components/PhoneNumberManager';
import CallInitiator from '../components/CallInitiator';
import './DashboardPage.css';

const DashboardPage = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    callService.getCallLogs().then(
      (response) => {
        setCallLogs(response.data);
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
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      {message && <p role="alert">{message}</p>}

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <CallInitiator />
        </div>
        <div className="dashboard-section">
          <PhoneNumberManager />
        </div>
      </div>

      <div className="dashboard-section full-width-section">
        <h2>Call Logs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Direction</th>
                <th>Created At</th>
                <th>Transcript</th>
              </tr>
            </thead>
            <tbody>
              {callLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.from_number}</td>
                  <td>{log.to_number}</td>
                  <td>{log.status}</td>
                  <td>{log.direction}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.transcript}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 
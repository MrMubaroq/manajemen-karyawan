import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPayroll = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [payDate, setPayDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3000/auth/add_payroll', {
        employeeName,
        position,
        salary,
        payDate,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/payroll');
        } else {
          alert(result.data.Error || 'Failed to add payroll');
        }
      })
      .catch((err) => console.log('Error:', err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <div className="p-3 rounded w-50 border">
        <h2>Add Payroll</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="employeeName">
              <strong>Employee Name:</strong>
            </label>
            <input
              type="text"
              name="employeeName"
              placeholder="Enter Employee Name"
              onChange={(e) => setEmployeeName(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="position">
              <strong>Position:</strong>
            </label>
            <input
              type="text"
              name="position"
              placeholder="Enter Position"
              onChange={(e) => setPosition(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="salary">
              <strong>Salary:</strong>
            </label>
            <input
              type="number"
              name="salary"
              placeholder="Enter Salary"
              onChange={(e) => setSalary(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="payDate">
              <strong>Pay Date:</strong>
            </label>
            <input
              type="date"
              name="payDate"
              onChange={(e) => setPayDate(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">Add Payroll</button>
        </form>
      </div>
    </div>
  );
};

export default AddPayroll;

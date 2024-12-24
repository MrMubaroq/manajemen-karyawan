import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await axios.get('http://localhost:3000/payroll/payroll');
        if (response.data.Status) {
          setPayrolls(response.data.Result);
        }
      } catch (err) {
        console.error("Error fetching payrolls:", err);
      }
    };

    fetchPayrolls();
  }, []);

  return (
    <div className="payroll-list-container">
      <h2>Payroll List</h2>
      <Link to="/dashboard/add_payroll">
        <button className="add-payroll-button">Add Payroll</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Pay Date</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.length === 0 ? (
            <tr><td colSpan="4">No payroll records found</td></tr>
          ) : (
            payrolls.map((payroll) => (
              <tr key={payroll.id}>
                <td>{payroll.employeeName}</td>
                <td>{payroll.position}</td>
                <td>{payroll.salary}</td>
                <td>{payroll.payDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollList;


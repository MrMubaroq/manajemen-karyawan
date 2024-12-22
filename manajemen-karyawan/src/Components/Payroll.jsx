import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './style.css';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [form, setForm] = useState({
    employeeName: "",
    position: "",
    salary: "",
    payDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayrollData();
  }, []);

  // Fetch payroll data
  const fetchPayrollData = () => {
    axios
      .get("http://localhost:3000/auth/payroll")
      .then((response) => {
        if (response.data.Status) {
          setPayrollData(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error("Error fetching payroll data:", error));
  };

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/payroll", form)
      .then((response) => {
        if (response.data.Status) {
          alert("Payroll added successfully!");
          fetchPayrollData(); // Refresh data
          setForm({ employeeName: "", position: "", salary: "", payDate: "" });
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error("Error adding payroll:", error));
  };

  // Handle delete payroll
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/auth/delete_payroll/${id}`)
      .then((response) => {
        if (response.data.Status) {
          alert("Payroll deleted successfully!");
          fetchPayrollData(); // Refresh data
        } else {
          alert(response.data.Error);
        }
      })
      .catch((error) => console.error("Error deleting payroll:", error));
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Payroll Management</h3>
      </div>

      {/* Form to Add Payroll */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-3">
          <label>Employee Name</label>
          <input
            type="text"
            className="form-control"
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Position</label>
          <input
            type="text"
            className="form-control"
            name="position"
            value={form.position}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Salary</label>
          <input
            type="number"
            className="form-control"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Pay Date</label>
          <input
            type="date"
            className="form-control"
            name="payDate"
            value={form.payDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
           Payroll
        </button>
      </form>

      <Link to="/dashboard/add_payroll" className="btn btn-success mb-3">
        Add Payroll 
      </Link>

      {/* Payroll Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Pay Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.length > 0 ? (
              payrollData.map((payroll, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{payroll.employeeName}</td>
                  <td>{payroll.position}</td>
                  <td>${payroll.salary}</td>
                  <td>{new Date(payroll.payDate).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_payroll/${payroll.id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(payroll.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No payroll data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPayroll = () => {
  const [form, setForm] = useState({
    employeeName: "",
    position: "",
    salary: "",
    payDate: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/auth/add_payroll", form)
      .then(response => {
        if (response.data.Status) {
          alert("Payroll added successfully!");
          navigate("/dashboard/payroll"); // Redirect to payroll list page
        } else {
          alert(response.data.Error);
        }
      })
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <h3>Add Payroll</h3>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Save</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard/payroll")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayroll;

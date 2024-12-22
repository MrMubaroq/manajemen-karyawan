import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [form, setForm] = useState({
    employeeName: "",
    date: "",
    status: "Present", // Default status
  });

  // Fetch attendance data on component load
  useEffect(() => {
    fetchAttendance();
  }, []);

  // Fetch attendance data from backend
  const fetchAttendance = () => {
    axios
      .get("http://localhost:3000/attendance/attendance") // Perbaiki URL ini
      .then((response) => {
        setAttendanceData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission to add new attendance
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/attendance/add_attendance", form) // Perbaiki URL ini
      .then((response) => {
        if (response.data.success) {
          alert("Attendance recorded successfully!");
          fetchAttendance(); // Refresh attendance data
          setForm({ employeeName: "", date: "", status: "Present" });
        } else {
          alert("Failed to add attendance.");
        }
      })
      .catch((error) => {
        console.error("Error adding attendance:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Attendance Management</h2>

      {/* Form to Add Attendance */}
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
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Status</label>
          <select
            className="form-control"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Attendance
        </button>
      </form>

      {/* Attendance Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Employee Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td>{record.employeeName}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;


import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get all payrolls
router.get("/payroll", (req, res) => {
  const sql = "SELECT * FROM payrolls";
  con.query(sql, (err, result) => {
    if (err) return res.status(500).json({ Status: false, Error: err.message });
    if (result.length === 0) {
      return res.json({ Status: true, Message: "No payroll records found", Data: [] });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Add new payroll
router.post("/add_payroll", (req, res) => {
  const { employeeName, position, salary, payDate } = req.body;

  if (!employeeName || !position || isNaN(salary) || !payDate) {
    return res.status(400).json({ Status: false, Error: "Invalid input data" });
  }

  const sql = "INSERT INTO payrolls (employeeName, position, salary, payDate) VALUES (?, ?, ?, ?)";
  con.query(sql, [employeeName, position, salary, payDate], (err, result) => {
    if (err) return res.status(500).json({ Status: false, Error: err.message });
    return res.json({ Status: true, Message: "Payroll added successfully" });
  });
});

// Update payroll
router.put("/edit_payroll/:id", (req, res) => {
  const { id } = req.params;
  const { employeeName, position, salary, payDate } = req.body;

  if (!employeeName || !position || isNaN(salary) || !payDate) {
    return res.status(400).json({ Status: false, Error: "Invalid input data" });
  }

  const sql =
    "UPDATE payrolls SET employeeName = ?, position = ?, salary = ?, payDate = ? WHERE id = ?";
  con.query(sql, [employeeName, position, salary, payDate, id], (err, result) => {
    if (err) return res.status(500).json({ Status: false, Error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Message: "Payroll ID not found" });
    }
    return res.json({ Status: true, Message: "Payroll updated successfully" });
  });
});

// Delete payroll
router.delete("/delete_payroll/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM payrolls WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Status: false, Error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Message: "Payroll ID not found" });
    }
    return res.json({ Status: true, Message: "Payroll deleted successfully" });
  });
});

export default router;

import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get all payrolls
router.get("/payroll", (req, res) => {
  const sql = "SELECT * FROM payrolls";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
  });
});

// Add new payroll
router.post("/add_payroll", (req, res) => {
  const { employeeName, position, salary, payDate } = req.body;
  const sql = "INSERT INTO payrolls (employeeName, position, salary, payDate) VALUES (?, ?, ?, ?)";
  con.query(sql, [employeeName, position, salary, payDate], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Message: "Payroll added successfully" });
  });
});

// Delete payroll
router.delete("/delete_payroll/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM payrolls WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Message: "Payroll deleted successfully" });
  });
});

export { router as PayrollRouter };
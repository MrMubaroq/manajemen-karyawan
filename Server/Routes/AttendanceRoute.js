import express from "express";
import con from "../utils/db.js"; // Pastikan Anda sudah mengatur koneksi DB di sini

const router = express.Router();

// Endpoint untuk menambahkan attendance baru
router.post("/add_attendance", (req, res) => {
  const { employeeName, date, status } = req.body;

  // Validasi data
  if (!employeeName || !date || !status) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Query untuk menambah data attendance ke database
  const sql = "INSERT INTO attendance (employeeName, date, status) VALUES (?, ?, ?)";
  con.query(sql, [employeeName, date, status], (err, result) => {
    if (err) {
      console.error("Error inserting attendance:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Attendance added successfully" });
  });
});

// Endpoint untuk mendapatkan semua data attendance
router.get("/attendance", (req, res) => {
  const sql = "SELECT * FROM attendance";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching attendance data:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(result);
  });
});

export default router;

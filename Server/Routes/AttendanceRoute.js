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

// Endpoint untuk menambahkan data attendance
router.post('/attendance/add_attendance', (req, res) => {
  const { employeeName, date, status } = req.body;

  const query = "INSERT INTO attendance (employeeName, date, status) VALUES (?, ?, ?)";
  db.query(query, [employeeName, date, status], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: "Failed to add attendance" });
      } else {
          res.status(200).json({ success: true, message: "Attendance added successfully" });
      }
  });
});

// Endpoint untuk mengecek absensi
router.get('/attendance/check_attendance', (req, res) => {
  const { employeeName, date } = req.query;

  const query = "SELECT * FROM attendance WHERE employeeName = ? AND date = ?";
  db.query(query, [employeeName, date], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ attended: false, message: "Error checking attendance" });
      } else if (result.length > 0) {
          res.status(200).json({ attended: true }); // Karyawan sudah absen
      } else {
          res.status(200).json({ attended: false }); // Karyawan belum absen
      }
  });
});


export default router;

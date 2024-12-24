import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import  attendanceRouter  from "./Routes/AttendanceRoute.js";  // Default import
import  PayrollRouter  from "./Routes/PayrollRoute.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, // Allow credentials (cookies)
  })
);

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/auth", adminRouter);
app.use("/employee", EmployeeRouter);
app.use("/attendance", attendanceRouter);
app.use("/payroll",PayrollRouter);
app.use(express.static("Public")); // Serve static files from 'Public' folder

// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ Status: false, Error: "Not authenticated" });
  }

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ Status: false, Error: "Invalid or expired token" });
    }

    // Attach user data to the request object
    req.id = decoded.id;
    req.role = decoded.role;
    next();
  });
};

// Verify route
app.get('/verify', verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

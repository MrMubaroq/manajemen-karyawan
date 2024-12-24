import express  from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { verifyUser } from "./verifyUser.js";

const router = express.Router()

router.post('/adminlogin',(req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?"
  con.query(sql,[req.body.email, req.body.password], (err, result) => {
    if(err) return res.json({loginStatus: false, Error: "Query error"})
        if(result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
             {role: "admin", email: email, id: result[0].id },
              "jwt_secret_key",
             {expiresIn: '1d'}
            );
        
        res.cookie('token', token)
     return res.json({loginStatus: true });
    } else {
        return res.json({loginStatus: false, Error: "wrong email or password"})
    }
  });
});

router.get('/category', (req, res) => {
     const  sql = "SELECT * FROM category";
     con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
     })
})

router.post('/add_category', (req, res) => {
   const sql = "INSERT INTO category (`name`) VALUES (?)"
   con.query(sql, [req.body.category], (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true})
   })
})

// image upload
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'Public/Images')
   },
   filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
   }
})
const upload = multer({
  storage:storage
})
//  end image upload

router.post('/add_employee',upload.single('image'), (req, res) => {
   const sql = `INSERT INTO employee (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
           req.body.name,
           req.body.email,
           hash,
           req.body.address,
           req.body.salary,
           req.file.filename,
           req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
             if(err) return res.json({Status: false, Error: err})
             return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
  const  sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
   if(err) return res.json({Status: false, Error: "Query Error"})
     return res.json({Status: true, Result: result})
  })
})

router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const  sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql,[id], (err, result) => {
   if(err) return res.json({Status: false, Error: "Query Error"})
     return res.json({Status: true, Result: result})
  })
})

router.put('/edit_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee
      set name= ?, email= ?, salary = ?, address = ?, category_id = ?
      Where id = ?`
      const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
     ]
      con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
          return res.json({Status: true, Result: result})
       })
})

router.delete('/delete_employee/:id', (req, res) => {
   const id = req.params.id;
   const sql = "delete from employee where id = ?"
   con.query(sql,[id], (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_count', (req, res) => {
  const sql = "select count(id) as admin from admin";
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/salary_count', (req, res) => {
  const sql = "select sum(salary) as salaryOFEmp from employee";
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})
router.get('/employee_count', (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_records', (req, res) => {
  const sql = "select * from admin"
  con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({Status: true})
})

router.get('/profile', verifyUser, (req, res) => {
  const sql = "SELECT * FROM admin WHERE id = ?";
  con.query(sql, [req.id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result[0] }); // Mengirim data profil admin
  });
});
// Endpoint untuk mengambil semua catatan kehadiran
router.get('/attendance', (req, res) => {
  const sql = "SELECT * FROM attendance";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});


// Get all payrolls
router.get("/payroll", (req, res) => {
  const sql = "SELECT * FROM payrolls";
  con.query(sql, (err, result) => {
     if (err) return res.status(500).json({ Status: false, Error: err.message });
     return res.json({ Status: true, Result: result });
  });
});

// Add new payroll
// Route untuk menambah payroll (di payrollRoute.js)
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



export default router;



export {router as adminRouter}
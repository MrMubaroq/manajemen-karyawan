import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Category from './Components/Category'
import Profile from './Components/Profile'
import AddCategory from './Components/AddCategory'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetail from './Components/EmployeeDetail'
import PrivateRoute from './Components/PrivateRoute'
// Perbaiki import untuk Payroll dan AddPayroll
import Payroll from './Components/Payroll' // Ubah ini sesuai jalur yang benar
import AddPayroll from './Components/AddPayroll' // Ubah ini sesuai jalur yang benar
import Attendance from './Components/Attendance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute utama */}
        <Route path='/' element={<Start />} />

        {/* Rute untuk login */}
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />} />
        <Route path='/employee_detail/:id' element={<EmployeeDetail />} />

        {/* Dashboard, dengan proteksi menggunakan PrivateRoute */}
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />} />
          <Route path='/dashboard/employee' element={<Employee />} />
          <Route path='/dashboard/category' element={<Category />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          
          {/* Rute untuk payroll */}
          <Route path='/dashboard/payroll' element={<Payroll />} />

          {/* Rute untuk attendance */}
          <Route path='/dashboard/attendance' element={<Attendance />} />

          {/* Rute untuk menambah kategori dan karyawan */}
          <Route path='/dashboard/add_category' element={<AddCategory />} />
          <Route path='/dashboard/add_employee' element={<AddEmployee />} />

          {/* Rute untuk menambah payroll */}
          <Route path='/dashboard/add_payroll' element={<AddPayroll />} />

          {/* Rute untuk mengedit employee */}
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

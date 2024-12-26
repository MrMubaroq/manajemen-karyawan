import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({})
    const [hasAttended, setHasAttended] = useState(false) // State untuk cek absensi
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch employee details
        axios.get('http://localhost:3000/employee/detail/' + id)
            .then(result => {
                setEmployee(result.data[0])

                // Cek apakah karyawan sudah absen hari ini
                const today = new Date().toISOString().split('T')[0]
                axios.get(`http://localhost:3000/attendance/check_attendance?employeeName=${result.data[0].name}&date=${today}`)
                    .then(response => {
                        if (response.data.attended) {
                            setHasAttended(true) // Jika sudah absen, sembunyikan tombol
                        }
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:3000/employee/logout')
            .then(result => {
                if (result.data.Status) {
                    localStorage.removeItem("valid")
                    navigate('/')
                }
            }).catch(err => console.log(err))
    }

    const handleAttendance = () => {
        const attendanceData = {
            employeeName: employee.name,
            date: new Date().toISOString().split('T')[0], // Tanggal saat ini
            status: "Present" // Status kehadiran default
        }

        axios.post('http://localhost:3000/attendance/add_attendance', attendanceData)
            .then(response => {
                if (response.data.success) {
                    alert("Attendance recorded successfully!")
                    setHasAttended(true) // Sembunyikan tombol setelah absensi
                } else {
                    alert("Failed to record attendance.")
                }
            })
            .catch(error => {
                console.error("Error recording attendance:", error)
            })
    }

    return (
        <div>
            <div className='p-2 d-flex justify-content-center shadow'>
                <h4>Employee Management System</h4>
            </div>
            <div className='d-flex justify-content-center flex-column align-items-center mt-9'>
                <img src={`http://localhost:3000/Images/` + employee.image} className='emp_det_image' alt="Employee" />
                <div className='d-flex align-items-center flex-column mt-5'>
                    <h3>Name: {employee.name}</h3>
                    <h3>Email: {employee.email}</h3>
                    <h3>Salary: ${employee.salary}</h3>
                </div>
                <div className="button-container">
  <button className='btn btn-primary me-2'>Edit</button>
  <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
</div>

{/* Tombol Attendance hanya tampil jika kondisi terpenuhi */}
{!hasAttended && (
  <div className="attendance-container">
    <button className='btn btn-secondary' onClick={handleAttendance}>Attendance</button>
  </div>
)}


            </div>
        </div>
    )
}

export default EmployeeDetail

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({})
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:3000/employee/detail/' + id)
            .then(result => {
                setEmployee(result.data[0])
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
                } else {
                    alert("Failed to record attendance.")
                }
            })
            .catch(error => {
                console.error("Error recording attendance:", error)
            })
    }

    const fetchAttendance = () => {
        axios
          .get("http://localhost:3000/attendance/attendance")
          .then((response) => {
            setAttendanceData(response.data);
            checkAttendance();
          })
          .catch((error) => {
            console.error("Error fetching attendance data:", error);
          });
      };
    
      const checkAttendance = () => {
        const tanggal = new Date().toISOString().split('T')[0];
        const existingData = attendanceData.find(data => data.date === tanggal && data.name === 'Nama Karyawan' && data.status === 'Present');
    
        if (existingData) {
          setIsPresent(true);
        } else {
          setIsPresent(false);
        }
      };

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
                <div>
                    <button className='btn btn-primary me-2'>Edit</button>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
                <div className="spaced-div">
                    <button className='btn btn-secondary me-2' onClick={handleAttendance}>Attendance</button>
                    
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetail

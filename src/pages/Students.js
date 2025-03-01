import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Collapse,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/Header';
import SideBar from '../components/SideBar';

// Styled components
const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: 20,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '15px',
  background: '#FFFFFF',
  border: '1px solid #BDCEDB',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#08215C',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#E4A13A',
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#BDCEDB',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#FFFFFF',
  },
  '& td': {
    color: '#13507F',
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: '#13507F',
  '&:hover': {
    backgroundColor: '#08215c',
  },
}));

const Students = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newStudentData, setNewStudentData] = useState({
    sap_id: '',
    admission_year: '',
    graduation_year: '',
    registration_date: '',
    degree: '',
    department: '',
    user: '',
    registered_by: '',
    parent: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchStudents = async () => {
      if (!authTokens) return;

      try {
        const studentsResponse = await axios.get('http://127.0.0.1:8000/api/auth/students/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error('Failed to fetch student data: ', error);
      }
    };

    if (user.user_type === 'admin' || user.user_type === 'faculty') {
      fetchStudents();
    }
  }, [user, authTokens]);

  const handleExpandClick = (studentId) => {
    setExpanded((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewStudentData({
      sap_id: '',
      admission_year: '',
      graduation_year: '',
      registration_date: '',
      degree: '',
      department: '',
      user: '',
      registered_by: '',
      parent: '',
      status: 'active'
    });
  };

  const handleUpdateDialogOpen = (student) => {
    setCurrentStudent(student);
    setNewStudentData({
      sap_id: student.sap_id,
      admission_year: student.admission_year,
      graduation_year: student.graduation_year,
      registration_date: student.registration_date,
      degree: student.degree.degree_name,
      department: student.department.department_name,
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/auth/students/${currentStudent.id}/`,
        newStudentData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      const updatedStudent = response.data;
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error('Failed to update student:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/student/',
        newStudentData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      const addedStudent = response.data;
      const studentsResponse = await axios.get('http://127.0.0.1:8000/api/auth/students/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setStudents(studentsResponse.data);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/auth/students/${studentId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
    } catch (error) {
      console.error('Failed to delete student: ', error);
    }
  };

  if (!user || (user.user_type !== 'admin' && user.user_type !== 'faculty')) {
    return <Typography>You do not have access to this page.</Typography>;
  }

  return (
    <>
      <Header />
      <RootContainer>
        <SideBar
          items={[
            { name: 'Dashboard', link: '/' },
            { name: 'Users', link: '/users' },
            { name: 'Students', link: '/students' },
            { name: 'Departments & Degrees', link: '/departments' },
          ]}
        />
        <Typography variant="h4">Students</Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Degree</StyledTableCell>
                <StyledTableCell>Admission Year</StyledTableCell>
                <StyledTableCell>Graduation Year</StyledTableCell>
                <StyledTableCell>Registration Date</StyledTableCell>
                <StyledTableCell>SAP ID</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                <StyledTableRow key={student.id}>
                  <TableCell>{`${student.user.first_name} ${student.user.last_name}`}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.department.department_name}</TableCell>
                  <TableCell>{student.degree.degree_name}</TableCell>
                  <TableCell>{student.admission_year}</TableCell>
                  <TableCell>{student.graduation_year}</TableCell>
                  <TableCell>{student.registration_date}</TableCell>
                  <TableCell>{student.sap_id}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleExpandClick(student.id)}>
                      {expanded[student.id] ? 'Hide Details' : 'Show Details'}
                    </Button>
                    <Collapse in={expanded[student.id]} timeout="auto" unmountOnExit>
                      <Typography variant="body2">Phone: {student.user.phone_number}</Typography>
                      <Typography variant="body2">
                        Address: {student.user.current_address}
                      </Typography>
                    </Collapse>
                    <Button
                      size="small"
                      onClick={() => handleUpdateDialogOpen(student)}
                      style={{ marginLeft: '10px' }}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDeleteStudent(student.id)}
                      style={{ marginLeft: '10px', color: 'red' }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </RootContainer>

      {/* Add New Student Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            label="SAP ID"
            value={newStudentData.sap_id}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                sap_id: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Admission Year"
            value={newStudentData.admission_year}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                admission_year: Number(e.target.value),
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Graduation Year"
            value={newStudentData.graduation_year}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                graduation_year: Number(e.target.value),
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Registration Date"
            value={newStudentData.registration_date}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                registration_date: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Degree"
            value={newStudentData.degree}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                degree: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Department"
            value={newStudentData.department}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                department: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="User ID"
            value={newStudentData.user}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                user: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Parent ID"
            value={newStudentData.parent}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                parent: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Registered By"
            value={newStudentData.registered_by}
            onChange={(e) =>
              setNewStudentData({
                ...newStudentData,
                registered_by: e.target.value,
              })
            }
            fullWidth
            style={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddStudent} color="primary">
            Add Student
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
  <DialogTitle>Update Student</DialogTitle>
  <DialogContent>
    <TextField
      label="SAP ID"
      value={newStudentData.sap_id}
      onChange={(e) =>
        setNewStudentData({
          ...newStudentData,
          sap_id: e.target.value,
        })
      }
      fullWidth
      style={{ marginBottom: '10px' }}
    />
    <TextField
      label="Admission Year"
      value={newStudentData.admission_year}
      onChange={(e) =>
        setNewStudentData({
          ...newStudentData,
          admission_year: Number(e.target.value),
        })
      }
      fullWidth
      style={{ marginBottom: '10px' }}
    />
    <TextField
      label="Graduation Year"
      value={newStudentData.graduation_year}
      onChange={(e) =>
        setNewStudentData({
          ...newStudentData,
          graduation_year: Number(e.target.value),
        })
      }
      fullWidth
      style={{ marginBottom: '10px' }}
    />
    <TextField
      label="Registration Date"
      value={newStudentData.registration_date}
      onChange={(e) =>
        setNewStudentData({
          ...newStudentData,
          registration_date: e.target.value,
        })
      }
      fullWidth
      style={{ marginBottom: '10px' }}
    />
    <TextField
      label="Degree"
      value={newStudentData.degree}
      onChange={(e) =>
        setNewStudentData({
          ...newStudentData,
          degree: e.target.value,
        })
      }
      fullWidth
      style={{ marginBottom: '10px' }}
    />
    <TextField
      label="Department"
      value={newStudentData.department}
      onChange={(e) =>
        setNewStudentData({
          ...newStudentData,
          department: e.target.value,
        })
      }
      fullWidth
      style={{ marginBottom: '10px' }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleUpdateDialogClose} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleUpdateStudent} color="primary">
      Update
    </Button>
  </DialogActions>
</Dialog>

      {/* Floating Action Button */}
      <FloatingActionButton color="primary" onClick={handleAddDialogOpen}>
        <AddIcon />
      </FloatingActionButton>
    </>
  );
};

export default Students;

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
  IconButton,
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
  const [csvFile, setCsvFile] = useState(null);

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
    setCsvFile(null);
  };

  const handleCsvUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUploadCsv = async () => {
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/students/upload_csv/', formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setCsvFile(null);
      handleAddDialogClose();
      // Refetch students after upload
      const studentsResponse = await axios.get('http://127.0.0.1:8000/api/auth/students/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error('Failed to upload CSV: ', error);
    }
  };

  const handleUpdateStudent = (studentId) => {
    // Implement update logic here
    console.log('Updating student with ID: ', studentId);
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
                      onClick={() => handleUpdateStudent(student.id)}
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

      {/* Add Students Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <DialogTitle>Upload CSV to Add Students</DialogTitle>
        <DialogContent>
          <Typography>
            Please upload a CSV file with the following columns: First Name, Last Name, Email,
            Department, Degree
          </Typography>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleUploadCsv} disabled={!csvFile}>
            Upload CSV
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddDialogOpen}>
        <AddIcon style={{ color: '#E4A13A'}} />
      </FloatingActionButton>
    </>
  );
};

export default Students;

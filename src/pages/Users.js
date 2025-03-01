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
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
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

const FiltersContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const Users = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');

  const [updateUserDialogOpen, setUpdateUserDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    current_address: '',
    blood_group: '',
    college: '',
    date_of_birth: '',
    gender: '',
    religion: '',
    nationality: '',
    school: '',
    title: '',
  });

  const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        title: '',
        profile_picture: null,
        gender: '',
        nationality: '',
        religion: '',
        date_of_birth: '',
        blood_group: '',
        phone_number: '',
        secondary_phone_number: '',
        current_address: '',
        permanent_address: '',
        user_type: '',
        is_active: true,
        is_staff: false,
        matriculation_number: '',
        matriculation_board: '',
        school: '',
        intermediate_number: '',
        college: '',
        intermediate_board: '',
        previous_degree: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Post form data to the backend API
        // (Make sure to add the API endpoint to handle the user creation)
        fetch('http://127.0.0.1:8000/api/auth/user/', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authTokens.access}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(async data => {
          console.log("User created:", data);
          // Refetch users after update
          const usersResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/', {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          });
          setUsers(usersResponse.data);
          handleAddDialogClose();
        })
        .catch((error) => {
            console.error("Error creating user:", error);
        });
    };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authTokens) return;

      try {
        const usersResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Failed to fetch user data: ', error);
      }
    };

    if (user.user_type === 'admin') {
      fetchUsers();
    }
  }, [user, authTokens]);

  const handleExpandClick = (userId) => {
    setExpanded((prev) => ({
      ...prev,
      [userId]: !prev[userId],
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
      await axios.post('http://127.0.0.1:8000/api/auth/users/upload_csv/', formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setCsvFile(null);
      handleAddDialogClose();
      // Refetch users after upload
      const usersResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Failed to upload CSV: ', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!userToUpdate) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/auth/user/${userToUpdate.id}/`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      // Refetch users after update
      const usersResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/', {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setUsers(usersResponse.data);
      setUpdateUserDialogOpen(false);
      setUserToUpdate(null);
      setUpdatedUserData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        current_address: '',
        blood_group: '',
        college: '',
        date_of_birth: '',
        gender: '',
        religion: '',
        nationality: '',
        school: '',
        title: '',
      });
    } catch (error) {
      console.error('Failed to update user: ', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/auth/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user: ', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm =
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUserType = userTypeFilter ? user.user_type === userTypeFilter : true;
    const matchesIsActive = isActiveFilter !== '' ? user.is_active === (isActiveFilter === 'true') : true;

    return matchesSearchTerm && matchesUserType && matchesIsActive;
  });

  if (!user || user.user_type !== 'admin') {
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
        <Typography variant="h4" sx={{ marginBottom: 3 }}>Users</Typography>

        {/* Search and Filters */}
        <FiltersContainer container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search Users"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    🔍
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>User Type</InputLabel>
              <Select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                label="User Type"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Is Active</InputLabel>
              <Select
                value={isActiveFilter}
                onChange={(e) => setIsActiveFilter(e.target.value)}
                label="Is Active"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </FiltersContainer>

        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>User Type</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <StyledTableRow key={user.id}>
                  <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.user_type}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleExpandClick(user.id)}>
                      {expanded[user.id] ? 'Hide Details' : 'Show Details'}
                    </Button>
                    <Collapse in={expanded[user.id]} timeout="auto" unmountOnExit>
                      <Typography variant="body2">Phone: {user.phone_number}</Typography>
                      <Typography variant="body2">Address: {user.current_address}</Typography>
                      <Typography variant="body2">Blood Group: {user.blood_group}</Typography>
                      <Typography variant="body2">College: {user.college}</Typography>
                      <Typography variant="body2">Date of Birth: {user.date_of_birth}</Typography>
                      <Typography variant="body2">Gender: {user.gender}</Typography>
                      <Typography variant="body2">Religion: {user.religion}</Typography>
                      <Typography variant="body2">Nationality: {user.nationality}</Typography>
                      <Typography variant="body2">School: {user.school}</Typography>
                      <Typography variant="body2">Title: {user.title}</Typography>
                    </Collapse>
                    <Button size="small" onClick={() => { setUserToUpdate(user); setUpdatedUserData(user); setUpdateUserDialogOpen(true); }}>Edit</Button>
                    <Button size="small" onClick={() => handleDeleteUser(user.id)} color="error">Delete</Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Floating Action Button */}
        <FloatingActionButton onClick={handleAddDialogOpen}>
          <AddIcon />
        </FloatingActionButton>

        {/* Add User CSV Dialog */}
        <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
            <DialogTitle>Create New User</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Religion"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Blood Group"
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone Number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Secondary Phone Number"
                                name="secondary_phone_number"
                                value={formData.secondary_phone_number}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Current Address"
                                name="current_address"
                                value={formData.current_address}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Permanent Address"
                                name="permanent_address"
                                value={formData.permanent_address}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="User Type"
                                name="user_type"
                                value={formData.user_type}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Matriculation Number"
                                name="matriculation_number"
                                value={formData.matriculation_number}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Matriculation Board"
                                name="matriculation_board"
                                value={formData.matriculation_board}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="School"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Intermediate Number"
                                name="intermediate_number"
                                value={formData.intermediate_number}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="College"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Intermediate Board"
                                name="intermediate_board"
                                value={formData.intermediate_board}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Previous Degree"
                                name="previous_degree"
                                value={formData.previous_degree}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Create User
                </Button>
            </DialogActions>
        </Dialog>

        {/* Update User Dialog */}
        <Dialog open={updateUserDialogOpen} onClose={() => setUpdateUserDialogOpen(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              value={updatedUserData.first_name}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, first_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              value={updatedUserData.last_name}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, last_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={updatedUserData.email}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              value={updatedUserData.phone_number}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, phone_number: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Current Address"
              value={updatedUserData.current_address}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, current_address: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Blood Group"
              value={updatedUserData.blood_group}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, blood_group: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="College"
              value={updatedUserData.college}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, college: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={updatedUserData.date_of_birth}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, date_of_birth: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Gender"
              value={updatedUserData.gender}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, gender: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Religion"
              value={updatedUserData.religion}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, religion: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nationality"
              value={updatedUserData.nationality}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, nationality: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="School"
              value={updatedUserData.school}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, school: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Title"
              value={updatedUserData.title}
              onChange={(e) => setUpdatedUserData({ ...updatedUserData, title: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateUserDialogOpen(false)} color="primary">Cancel</Button>
            <Button onClick={handleUpdateUser} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      </RootContainer>
    </>
  );
};

export default Users;

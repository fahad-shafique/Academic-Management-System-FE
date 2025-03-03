import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
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

const EventList = () => {
  const { authTokens } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://localhost:8000/api/ems/events', {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
      },
    })
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, [authTokens]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Header />
      <RootContainer>
        <SideBar items={[{ name: 'Dashboard', link: '/' }, { name: 'Events', link: '/events' }]} />
        <Typography variant="h4">Events</Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => (
                <StyledTableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    <Button size="small">Edit</Button>
                    <Button size="small" color="secondary">Delete</Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </RootContainer>
      <FloatingActionButton color="primary">
        <AddIcon />
      </FloatingActionButton>
    </>
  );
};

export default EventList;

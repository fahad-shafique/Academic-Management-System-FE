// src/components/EventList.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
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
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // States for edit dialog (used in admin view)
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch events from appropriate endpoint:
  // Admin: fetch all events.
  // Non-admin: fetch only events where the user is a participant ("my-event" endpoint).
  useEffect(() => {
    const endpoint =
      user && user.user_type === 'admin'
        ? 'http://localhost:8000/api/ems/events'
        : 'http://localhost:8000/api/ems/my-event';
    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  }, [authTokens, user]);

  // Admin view functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigate to the event detail page
  const handleView = (id) => {
    navigate(`/events/${id}`);
  };

  const handleAdd = () => {
    navigate(`/create-event`);
  };

  const handleOpenEditDialog = (eventItem) => {
    setSelectedEvent(eventItem);
    setEditForm({ title: eventItem.title, description: eventItem.description });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedEvent(null);
    setEditForm({ title: '', description: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    axios
      .put(
        `http://localhost:8000/api/ems/my-events/${selectedEvent.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      )
      .then((response) => {
        setEvents(
          events.map((ev) =>
            ev.id === selectedEvent.id ? response.data : ev
          )
        );
        setSnackbar({
          open: true,
          message: 'Event updated successfully!',
          severity: 'success',
        });
        handleCloseEditDialog();
      })
      .catch((error) => {
        console.error('Error updating event:', error);
        setSnackbar({
          open: true,
          message: 'Failed to update event. Please try again.',
          severity: 'error',
        });
      });
  };

  const handleDeleteEvent = (eventItem) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      axios
        .delete(`http://localhost:8000/api/ems/my-events/${eventItem.id}`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        })
        .then(() => {
          setEvents(events.filter((ev) => ev.id !== eventItem.id));
          setSnackbar({
            open: true,
            message: 'Event deleted successfully!',
            severity: 'success',
          });
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
          setSnackbar({
            open: true,
            message: 'Failed to delete event. Please try again.',
            severity: 'error',
          });
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // If user is admin, render current table view with all functionalities.
  if (user && user.user_type === 'admin') {
    return (
      <>
        <Header />
        <RootContainer>
          <SideBar
            items={[
              { name: 'Dashboard', link: '/' },
              { name: 'Events', link: '/events' },
            ]}
          />
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
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <StyledTableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>
                        {event.start_time &&
                          new Date(event.start_time).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{event.location || 'N/A'}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleView(event.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleOpenEditDialog(event)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => handleDeleteEvent(event)}
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
            count={events.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </RootContainer>
        <FloatingActionButton color="primary">
          <AddIcon onClick={handleAdd} />
        </FloatingActionButton>

        {/* Edit Event Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              name="title"
              fullWidth
              value={editForm.title}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={editForm.description}
              onChange={handleEditChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button
              onClick={handleUpdateEvent}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  } else {
    // For non-admins, render a card-based view with upcoming and previous events.
    const now = new Date();
    const upcomingEvents = events.filter(
      (event) => new Date(event.start_time) >= now
    );
    const previousEvents = events.filter(
      (event) => new Date(event.start_time) < now
    );

    // Render a card for a single event.
    const renderEventCard = (event) => (
      <Grid item xs={12} sm={6} md={4} key={event.id}>
        <Card>
          {event.image && (
            <CardMedia
              component="img"
              height="140"
              image={event.image}
              alt={event.title}
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {new Date(event.start_time).toLocaleString()}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleView(event.id)}>
              View
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );

    return (
      <>
        <Header />
        <RootContainer>
          <SideBar
            items={[
              { name: 'Dashboard', link: '/' },
              { name: 'Events', link: '/events' },
            ]}
          />
          <Typography variant="h4">My Events</Typography>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Upcoming Events
          </Typography>
          <Grid container spacing={2}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(renderEventCard)
            ) : (
              <Typography variant="body1">
                No upcoming events.
              </Typography>
            )}
          </Grid>
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Previous Events
          </Typography>
          <Grid container spacing={2}>
            {previousEvents.length > 0 ? (
              previousEvents.map(renderEventCard)
            ) : (
              <Typography variant="body1">
                No previous events.
              </Typography>
            )}
          </Grid>
        </RootContainer>
      </>
    );
  }
};

export default EventList;

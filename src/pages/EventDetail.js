// src/components/EventDetail.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  styled,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import Header from '../components/Header';
import SideBar from '../components/SideBar';

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: 20,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  borderRadius: '15px',
  background: '#FFFFFF',
  border: '1px solid #BDCEDB',
}));

const EventDetail = () => {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [participantDetails, setParticipantDetails] = useState([]);
  const [participantEmail, setParticipantEmail] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch event details on component mount
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/ems/events/${id}`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then((response) => setEvent(response.data))
      .catch((error) =>
        console.error('Error fetching event details:', error)
      );
  }, [id, authTokens]);

  // Once event is loaded, fetch detailed info for each participater
  useEffect(() => {
    if (event && event.participaters && event.participaters.length > 0) {
      Promise.all(
        event.participaters.map((userId) =>
          axios
            .get(`http://localhost:8000/api/auth/user/${userId}`, {
              headers: { Authorization: `Bearer ${authTokens.access}` },
            })
            .then((res) => res.data)
        )
      )
        .then((results) => setParticipantDetails(results))
        .catch((error) =>
          console.error('Error fetching participant details:', error)
        );
    } else {
      setParticipantDetails([]);
    }
  }, [event, authTokens]);

  // Dialog handling for adding a participant
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setParticipantEmail('');
  };

  const handleAddParticipant = () => {
    axios
      .post(
        `http://localhost:8000/api/ems/events/${id}/participate`,
        { email: participantEmail },
        { headers: { Authorization: `Bearer ${authTokens.access}` } }
      )
      .then((response) => {
        // Assume the API returns an updated event object with the new participaters list
        setEvent((prevEvent) => ({
          ...prevEvent,
          participaters: response.data.participaters,
        }));
        setSnackbar({
          open: true,
          message: 'Participant added successfully!',
          severity: 'success',
        });
        handleCloseDialog();
      })
      .catch((error) => {
        console.error('Error adding participant:', error);
        setSnackbar({
          open: true,
          message: 'Failed to add participant. Please try again.',
          severity: 'error',
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!event)
    return (
      <Typography variant="body1" style={{ margin: 20 }}>
        Loading...
      </Typography>
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
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>
        <StyledPaper>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    border: '1px solid #BDCEDB',
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body1" gutterBottom>
                {event.description}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Created At:</strong> {new Date(event.created_at).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Updated At:</strong> {new Date(event.updated_at).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Club:</strong> {event.club}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Participation Status:</strong> {event.participate}
              </Typography>
            </Grid>
          </Grid>
        </StyledPaper>

        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Participants
          </Typography>
          {participantDetails.length > 0 ? (
            <List>
              {participantDetails.map((participant) => (
                <ListItem key={participant.id}>
                  <ListItemText
                    primary={`${participant.username || ''} (${participant.email || ''})`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No participants yet.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            style={{ marginTop: 10 }}
          >
            Add Participant
          </Button>
        </StyledPaper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Participant Email"
              type="email"
              fullWidth
              value={participantEmail}
              onChange={(e) => setParticipantEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddParticipant}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

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
      </RootContainer>
    </>
  );
};

export default EventDetail;

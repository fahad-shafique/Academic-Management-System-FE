import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  styled,
} from '@mui/material';
import Header from '../components/Header';
import SideBar from '../components/SideBar';

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: 20,
  display: 'flex',
}));

const ContentContainer = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: 20,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '15px',
  background: '#FFFFFF',
  border: '1px solid #BDCEDB',
}));

function CreateEvent({ clubId }) {
  const { user, authTokens } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/ems/my-clubs/2/events`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, [clubId, authTokens]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('start_time', startTime);
    formData.append('end_time', endTime);

    try {
      await axios.post(`http://localhost:8000/api/ems/my-clubs/2/events`, formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      navigate(`/clubs/2/events`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <>
      <Header />
      <RootContainer>
        <SideBar
          items={[
            { name: 'Dashboard', link: '/' },
            { name: 'Clubs', link: '/clubs' },
            { name: 'Events', link: `/clubs/2/events` },
          ]}
        />
        <ContentContainer>
          <Typography variant="h4" gutterBottom>
            Create New Event
          </Typography>
          <StyledPaper>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                    style={{ margin: '10px 0' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="End Time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create Event
                  </Button>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>
        </ContentContainer>
      </RootContainer>
    </>
  );
}

export default CreateEvent;

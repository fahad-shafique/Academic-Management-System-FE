// src/components/EventDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/events/${id}/`)
      .then(response => setEvent(response.data))
      .catch(error => console.error('Error fetching event details:', error));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      {/* Implement Update and Delete functionality here */}
    </div>
  );
}

export default EventDetail;

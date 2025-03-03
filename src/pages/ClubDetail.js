// src/components/ClubDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/ems/clubs/${id}`)
      .then(response => setClub(response.data))
      .catch(error => console.error('Error fetching club details:', error));
  }, [id]);

  if (!club) return <p>Loading...</p>;

  return (
    <div>
      <h1>{club.title}</h1>
      <p>{club.description}</p>
      {/* Implement Update and Delete functionality here */}
    </div>
  );
}

export default ClubDetail;

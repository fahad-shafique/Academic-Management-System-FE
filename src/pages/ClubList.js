// src/components/ClubList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ClubList() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/ems/clubs/?page=1')
      .then(response => setClubs(response.data))
      .catch(error => console.error('Error fetching clubs:', error));
  }, []);

  return (
    <div>
      <h1>Clubs</h1>
      <Link to="/create-club">Create New Club</Link>
      <ul>
        {clubs.map(club => (
          <li key={club.id}>
            <Link to={`/clubs/${club.id}`}>{club.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClubList;

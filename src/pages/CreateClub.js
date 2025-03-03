// src/components/CreateClub.js
import React, {useContext, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext";

function CreateClub() {
  const { user, authTokens } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    axios.post('http://localhost:8000/api/ems/my-clubs', formData, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        })
      .then(response => {
        navigate('/');
      })
      .catch(error => console.error('Error creating club:', error));
  };

  return (
    <div>
      <h1>Create New Club</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Create Club</button>
      </form>
    </div>
  );
}

export default CreateClub;

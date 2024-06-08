import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../App.css';
import Header from "../components/Header";
import director from '../public/director.png';
import student from '../public/student.png';
import faculty from '../public/faculty.png';

const CoursePage = () => {
  const { user } = useContext(AuthContext);

  let backgroundImage;
  switch (user.user_type) {
    case 'admin':
      backgroundImage = director;
      break;
    case 'student':
      backgroundImage = student;
      break;
    case 'faculty':
      backgroundImage = faculty;
      break;
    case 'parent':
    case 'alumni':
      backgroundImage = student; // Assuming alumni and parent have the same image requirement.
      break;
    default:
      backgroundImage = student; // Default case.
      break;
  }

  return (
    <>
      <Header />
      <div className="home-page-container" style={{
        overflow: 'hidden',
        height: '100vh'
      }}>
        <img src={backgroundImage} alt="Riphah International University" style={{
        overflow: 'hidden',
        widht: '100vh'
      }}/>
      </div>
    </>
  );
};

export default CoursePage;

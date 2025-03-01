import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Table,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Tile from '../components/tiles';

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: 0,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
}));

const DepartmentPage = () => { // Changed from Dashboard to DepartmentPage
  const { user, authTokens } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!authTokens) return;

      try {
        if (user.user_type === 'admin' || user.user_type === 'faculty') {
          const [departmentsResponse, studentsResponse, degreesResponse] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/auth/departments/', {
              headers: {
                Authorization: `Bearer ${authTokens.access}`,
              },
            }),
            axios.get('http://127.0.0.1:8000/api/auth/students/', {
              headers: {
                Authorization: `Bearer ${authTokens.access}`,
              },
            }),
            axios.get('http://127.0.0.1:8000/api/auth/degrees/', {
              headers: {
                Authorization: `Bearer ${authTokens.access}`,
              },
            }),
          ]);

          setDepartments(departmentsResponse.data);
          setStudents(studentsResponse.data);
          setDegrees(degreesResponse.data);
        } else if (user.user_type === 'student' || user.user_type === 'parent') {
          const studentsResponse = await axios.get('http://127.0.0.1:8000/api/auth/students/', {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          });
          setStudents(studentsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch data: ', error);
      }
    };

    fetchData();
  }, [user, authTokens]);

  if (!user) return <Typography>Loading...</Typography>;

  const handleExpandClick = (departmentId) => {
    setExpanded((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  const items = [
    { name: 'Dashboard', link: '/' },
    { name: 'Profile', link: '/profile' },
  ];

  if (user.user_type === 'admin' || user.user_type === 'faculty') {
    items.push({ name: 'Students', link: '/students' });
  }

  const shortName = ['RSCI', 'RIHIS'];

  return (
    <>
      <Header />
      <RootContainer>
        {user.user_type === 'admin' || user.user_type === 'faculty' ? (
          <>
            <SideBar
              items={[
                { name: 'Dashboard', link: '/' },
            { name: 'Users', link: '/users' },
                { name: 'Students', link: '/students' },
                { name: 'Departments & Degrees', link: '/departments' },
              ]}
            />
            <Typography variant="h4">Departments</Typography>
            <br />
            <br />
            <div>
              {departments.map((department) => (
                <Card key={department.dept_id} sx={{ marginBottom: 2 }} className="course-item">
                  <div key={department.dept_id}>
                    <div className="course-clr">{shortName[department.dept_id - 1]}</div>
                    <div className="course-dtl">
                      <CardContent>
                        <Typography variant="h5">{department.department_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Code: {department.dept_code}
                        </Typography>
                      </CardContent>
                      <CardActions className="center">
                        <Button size="small" onClick={() => handleExpandClick(department.dept_id)}>
                          {expanded[department.dept_id] ? 'Hide Degrees' : 'Show Degrees'}
                        </Button>
                      </CardActions>
                      <Collapse in={expanded[department.dept_id]} timeout="auto" unmountOnExit>
                        <CardContent>
                          <Tile
                            titles={degrees
                              .filter((degree) => degree.department === department.dept_id)
                              .map((degree) => degree.degree_name)}
                          />
                        </CardContent>
                      </Collapse>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <SideBar
              items={items}
            />
            <Typography variant="h4">Students</Typography>
            <div className="students-list">
              {students.map((student) => (
                <Card key={student.id} sx={{ marginBottom: 2 }} className="course-item">
                  <div key={student.id}>
                    <div className="course-clr">
                      {`${student.user.first_name.charAt(0)}${student.user.last_name.charAt(0)}`}
                    </div>
                    <div className="course-dtl">
                      <CardContent>
                        <Typography variant="h5">{`${student.user.first_name} ${student.user.last_name}`}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {student.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {student.user.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Department: {student.department.department_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Degree: {student.degree.degree_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          SAP ID: {student.sap_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Admission Year: {student.admission_year}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {student.status}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Graduation Year: {student.graduation_year}
                        </Typography>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </RootContainer>
    </>
  );
};

export default DepartmentPage; // Changed from Dashboard to DepartmentPage

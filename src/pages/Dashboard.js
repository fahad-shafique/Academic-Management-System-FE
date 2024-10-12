// Dashboard.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  PointElement, // Add PointElement here
  Legend,
} from 'chart.js';
import Header from '../components/Header';
import SideBar from '../components/SideBar';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend, PointElement);

const Dashboard = () => {
  // Mock Data
  const studentsData = [120, 150, 170, 210, 240];
  const departmentsData = [5, 7, 10, 8, 9]; // Example department counts
  const degreesData = [20, 25, 30, 35, 40]; // Example degree counts
  const graduationRateData = [80, 85, 90, 88, 92]; // Example graduation rates

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Total Students',
        data: studentsData,
        backgroundColor: '#13507F',
      },
    ],
  };

  const lineData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Graduation Rate (%)',
        data: graduationRateData,
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };

  const doughnutData = {
    labels: ['Departments', 'Degrees'],
    datasets: [
      {
        data: [departmentsData.reduce((a, b) => a + b, 0), degreesData.reduce((a, b) => a + b, 0)],
        backgroundColor: ['#FFCE56', '#36A2EB'],
      },
    ],
  };

  return (
    <>
      <Header />
      <SideBar
        items={[
          { name: 'Dashboard', link: '/' },
          { name: 'Students', link: '/students' },
          { name: 'Departments & Degrees', link: '/departments' },
        ]}
      />
      <div className="stats-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Total Degrees</Typography>
              <Typography variant="h4">{degreesData.reduce((a, b) => a + b, 0)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Average Graduation Rate</Typography>
              <Typography variant="h4">{(graduationRateData.reduce((a, b) => a + b, 0) / graduationRateData.length).toFixed(2)}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Total Students Over Time</Typography>
              <Bar data={barData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Graduation Rate (%) Over Years</Typography>
              <Line data={lineData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Department vs Degree Count</Typography>
              <Doughnut data={doughnutData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Total Departments</Typography>
              <Typography variant="h4">{departmentsData.reduce((a, b) => a + b, 0)}</Typography>
            </Paper>
          </Grid>
          {/* Add more metrics as needed */}
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;

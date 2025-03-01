import React, { useEffect, useState } from 'react';
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
  PointElement,
  Legend,
} from 'chart.js';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import axios from 'axios';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend, PointElement);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_departments: 0,
    total_degrees: 0,
    graduation_rate: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/dashboard-stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Map graduation rate data to labels and datasets for the chart
  const lineChartData = {
    labels: stats.graduation_rate.map((data) => data.year), // Years
    datasets: [
      {
        label: 'Graduation Rate (%)',
        data: stats.graduation_rate.map((data) => data.graduation_rate), // Rates
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        fill: true,
      },
    ],
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ['Departments', 'Degrees'],
    datasets: [
      {
        data: [stats.total_departments, stats.total_degrees],
        backgroundColor: ['#FFCE56', '#36A2EB'],
        hoverBackgroundColor: ['#FFCE56AA', '#36A2EBAA'],
      },
    ],
  };

  return (
    <>
      <Header />
      <SideBar
        items={[
          { name: 'Dashboard', link: '/' },
            { name: 'Users', link: '/users' },
          { name: 'Students', link: '/students' },
          { name: 'Departments & Degrees', link: '/departments' },
        ]}
      />
      <div className="stats-container" style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4">{stats.total_students}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Total Departments</Typography>
              <Typography variant="h4">{stats.total_departments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h6">Graduation Rate (%) Over Years</Typography>
              <Line data={lineChartData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} style={{ height: '407px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} style={{ padding: '16px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '16px' }}>Department vs Degree Count</Typography>
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Dashboard;

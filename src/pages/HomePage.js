import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Header from "../components/Header";
import axios from 'axios';
import SideBar from "../components/SideBar";
import { Container, Typography, Card, CardContent, CardActions, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, styled } from '@mui/material';
import './Profile.css';

const HomePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const { authTokens } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [updateUserData, setUpdateUserData] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setUserData(response.data);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [authTokens.access, setUser]);

    const handleUpdateClick = (key, value) => {
        setUpdateUserData({
            ...userData,
            [key]: value
        });
        setUpdateDialogOpen(true);
    };

    const handleUpdateChange = (e) => {
        setUpdateUserData({
            ...updateUserData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateSubmit = async () => {
        try {
            await axios.put('http://127.0.0.1:8000/api/auth/user/update', updateUserData, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`
                }
            });
            setUser(updateUserData);
            setUpdateDialogOpen(false);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!userData) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container className="container">
            <Header />
            <SideBar
                items={[
                    { name: 'Dashboard', link: '/' },
                    { name: 'Students', link: '/students' },
                    { name: 'Departments & Degrees', link: '/departments' },
                ]}
            />
            <div className="dashboard">
                <Card className="profile-header">
                    <CardContent>
                        <Typography variant="h4" gutterBottom>{`${userData.first_name} ${userData.last_name}`}</Typography>
                        <img src="profile-picture-url.jpg" alt="Profile" className="profile-picture"/>
                        <Typography variant="body1">{userData.email}</Typography>
                    </CardContent>
                </Card>
                <Card className="profile-details">
                    <CardContent style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <Typography variant="h6">Profile Details</Typography>
                            {Object.entries(userData).map(([key, value]) => (
                                <div className="detail" key={key}>
                                    <Typography variant="body2" className="detail-label">
                                        {key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}:
                                    </Typography>
                                    <Typography variant="body2" className="detail-value">
                                        {value}
                                    </Typography>
                                    <Button size="small" onClick={() => handleUpdateClick(key, value)}>Edit</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="recent-activity">
                    <CardContent>
                        <Typography variant="h6">Recent Activity</Typography>
                        <div className="activity">
                            <Typography variant="body2">Logged in</Typography>
                            <Typography variant="body2">May 19, 2024</Typography>
                        </div>
                        <div className="activity">
                            <Typography variant="body2">Updated profile</Typography>
                            <Typography variant="body2">May 18, 2024</Typography>
                        </div>
                        <div className="activity">
                            <Typography variant="body2">Changed password</Typography>
                            <Typography variant="body2">May 17, 2024</Typography>
                        </div>
                    </CardContent>
                </Card>
                <Card className="settings">
                    <CardContent>
                        <Typography variant="h6">Settings</Typography>
                        <div className="setting">
                            <Typography variant="body2">Change Password</Typography>
                            <Button size="small">Edit</Button>
                        </div>
                        <div className="setting">
                            <Typography variant="body2">Privacy Settings</Typography>
                            <Button size="small">Edit</Button>
                        </div>
                        <div className="setting">
                            <Typography variant="body2">Notification Preferences</Typography>
                            <Button size="small">Edit</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Update User Dialog */}
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Edit User Details</DialogTitle>
                <DialogContent>
                    {updateUserData && Object.entries(updateUserData).map(([key, value]) => (
                        <TextField
                            key={key}
                            label={key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                            name={key}
                            value={value}
                            onChange={handleUpdateChange}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleUpdateSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HomePage;

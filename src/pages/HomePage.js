import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Header from "../components/Header";
import axios from 'axios';

const HomePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const { authTokens } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                debugger
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
    }, [user.accessToken, setUser]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <div className="dashboard">
                <div className="profile-header">
                    <img src="profile-picture-url.jpg" alt="Profile" />
                    <div className="info">
                        <h1>{userData.username}</h1>
                        <p>{userData.email}</p>
                    </div>
                </div>
                <div className="profile-details">
                    <h2>Profile Details</h2>
                    {Object.entries(userData).map(([key, value]) => (
                        <div className="detail" key={key}>
                            <span>{key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity">
                        <span>Logged in</span>
                        <span>May 19, 2024</span>
                    </div>
                    <div className="activity">
                        <span>Updated profile</span>
                        <span>May 18, 2024</span>
                    </div>
                    <div className="activity">
                        <span>Changed password</span>
                        <span>May 17, 2024</span>
                    </div>
                </div>
                <div className="settings">
                    <h2>Settings</h2>
                    <div className="setting">
                        <span>Change Password</span>
                        <span>Edit</span>
                    </div>
                    <div className="setting">
                        <span>Privacy Settings</span>
                        <span>Edit</span>
                    </div>
                    <div className="setting">
                        <span>Notification Preferences</span>
                        <span>Edit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './header.css';
import logo from '../public/RIU-Post-01-800x239.png';
import { IconButton, Typography } from '@mui/material'; // Importing IconButton
import AccountCircle from '@mui/icons-material/AccountCircle'; // Importing AccountCircle icon

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);

    let menuItems = [];

    if (user.user_type === 'admin') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Information</div></Link>
                <Link to="/course"> <div className="menu-item">Alumni</div></Link>
                <Link to="/course"> <div className="menu-item">Courses</div></Link>
                <Link to="/course"> <div className="menu-item">Projects</div></Link>
                <Link to="/course"> <div className="menu-item">QS Ranking</div></Link>
                <Link to="/course"> <div className="menu-item">Events</div></Link>
            </>
        );
    } else if (user.user_type === 'student') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Profile</div></Link>
                <Link to="/course"> <div className="menu-item">Alumni</div></Link>
                <Link to="/course"> <div className="menu-item">Courses</div></Link>
                <Link to="/course"> <div className="menu-item">Projects</div></Link>
                <Link to="/course"> <div className="menu-item">QS Ranking</div></Link>
                <Link to="/course"> <div className="menu-item">Events</div></Link>
            </>
        );
    } else if (user.user_type === 'faculty') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Information</div></Link>
                <Link to="/course"> <div className="menu-item">Alumni</div></Link>
                <Link to="/course"> <div className="menu-item">Courses</div></Link>
                <Link to="/course"> <div className="menu-item">Projects</div></Link>
                <Link to="/course"> <div className="menu-item">QS Ranking</div></Link>
                <Link to="/course"> <div className="menu-item">Events</div></Link>
            </>
        );
    } else if (user.user_type === 'parent') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Information</div></Link>
                <Link to="/course"> <div className="menu-item">QS Ranking</div></Link>
                <Link to="/course"> <div className="menu-item">Events</div></Link>
            </>
        );
    } else if (user.user_type === 'alumni') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Information</div></Link>
                <Link to="/course"> <div className="menu-item">Alumni</div></Link>
                <Link to="/course"> <div className="menu-item">QS Ranking</div></Link>
                <Link to="/course"> <div className="menu-item">Events</div></Link>
            </>
        );
    }

    return (
        <div className="top-menu-bar">
            <div className="menu-logo" style={{ backgroundImage: `url(${logo})` }}></div>
            <div className="menu-items">
                {menuItems}
            </div>
            <div className="profile-icon">
                <IconButton 
                    color="inherit"
                    component={Link} // Makes the icon a link
                    to="/profile" // Redirects to the profile endpoint
                >
                    <Typography>My Profile</Typography>
                    <AccountCircle style={{ "padding-left": "5px", color: "#08215c"}} />
                </IconButton>
            </div>
        </div>
    );
};

export default Header;

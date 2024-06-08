import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './header.css';
import logo from '../public/RIU-Post-01-800x239.png';

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext);

    let menuItems = [];

    if (user.user_type === 'admin') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Profile</div></Link>
                <div className="menu-item">Manage Users</div>
                <div className="menu-item">Settings</div>
                <Link to="/course"> <div className="menu-item">Courses</div></Link>
                <Link to="/"><div className="menu-item" onClick={logoutUser}>Logout</div></Link>
            </>
        );
    } else if (user.user_type === 'student') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Profile</div></Link>
                <div className="menu-item">Enrollment</div>
                <div className="menu-item">Attendance</div>
                <div className="menu-item">Courses</div>
                <Link to="/"><div className="menu-item" onClick={logoutUser}>Logout</div></Link>
            </>
        );
    } else if (user.user_type === 'faculty') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Profile</div></Link>
                <div className="menu-item">Manage Courses</div>
                <div className="menu-item">Manage Students</div>
                <div className="menu-item">Manage Faculty</div>
                <Link to="/"><div className="menu-item" onClick={logoutUser}>Logout</div></Link>
            </>
        );
    } else if (user.user_type === 'parent') {
        menuItems = (
            <>
                <Link to="/"> <div className="menu-item">Profile</div></Link>
                <div className="menu-item">Child Enrollment</div>
                <div className="menu-item">Parent Meetings</div>
                <Link to="/"><div className="menu-item" onClick={logoutUser}>Logout</div></Link>
            </>
        );
    }

    return (
        <div className="top-menu-bar">
            <div className="menu-logo" style={{ backgroundImage: `url(${logo})` }}></div>
            <div className="menu-items">
                {menuItems}
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <span className="search-icon"></span>
            </div>
        </div>
    );
};

export default Header;


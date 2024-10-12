import React, {useContext} from 'react';
import './SideBar.css';
import {Link} from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function SideBar({ items }) {

    const { user, logoutUser } = useContext(AuthContext);

    const sideItems = (
        <>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="side-item">
                            <Link to={item.link}>{item.name}</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <>
            <div className="side-bar">
                <div className="side-items">
                    {sideItems}
                </div>
                <div className='logout-container'>
                    <hr className='separator' />
                    <div>
                        <Link to="/"><button className='logout-btn' onClick={logoutUser}>Logout</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
}

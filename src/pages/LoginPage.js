import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import logo from '../public/RIU-Post-01-800x239.png';

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext)

    const togglePasswordVisibility = () => {
        const passwordField = document.querySelector('#password');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
    };

    return (
        <div className="container">
            <div className="login-box">
                <div className="logo">
                    <img src={logo} alt="Riphah International University" />
                </div>
                <h1 className="login-title">Login</h1>
                <form onSubmit={loginUser}>
                    <label htmlFor="username" className="input-label">Email address</label>
                    <input type="text" id="username" name="username" className="input-field" placeholder="username" required />

                    <label htmlFor="password" className="input-label">Password</label>
                    <div className="password-container">
                        <input type="password" id="password" name="password" className="input-field" placeholder="password" required />
                        <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                            <span className="eye"></span>
                        </button>
                    </div>

                    <a href="#" className="forgot-password">Forgot password?</a>
                    <hr className="divider" />
                    <input type="submit" className="login-button" />
                </form>
            </div>
        </div>
    )
}

export default LoginPage

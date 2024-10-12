import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RouteGuard from './utils/RouteGuard';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursePage from "./pages/CoursePage";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import DepartmentPage from './pages/DepartmentPage';

function App() {


    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<RouteGuard element={<Dashboard />} />} exact />
                        <Route path="/profile" element={<RouteGuard element={<HomePage />} />} exact />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/course" element={<CoursePage />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/departments" element={<DepartmentPage />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;

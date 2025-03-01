import './App.css';
import "./assets/css/globals.css";
import "./assets/css/notion.css";
import "./assets/css/paginate.css";
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
import Users from "./pages/Users";
import Clubs from "./pages/clubs";
import ClubList from "./pages/ClubList";
import ClubDetail from "./pages/ClubDetail";
import EventList from "./pages/EventList";
import CreateClub from "./pages/CreateClub";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";

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
                        <Route path="/users" element={<Users />} />
                        <Route path="/departments" element={<DepartmentPage />} />
                        <Route path="/clubs" element={<ClubList />} />
                        <Route path="/clubs/:id" element={<ClubDetail />} />
                        <Route path="/clubs/:clubId/events" element={<EventList />} />
                        <Route path="/clubs/:clubId/events/:id" element={<EventDetail />} />
                        <Route path="/create-club" element={<CreateClub />} />
                        <Route path="/clubs/:clubId/create-event" element={<CreateEvent />} />
                        <Route path="/events" element={<EventList />} />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route path="/create-club" element={<CreateClub />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;

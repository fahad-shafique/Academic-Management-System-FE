import { Navigate, Route } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function RouteGuard({ element }) {
    const { user } = useContext(AuthContext);

    return user ? element : <Navigate to="/login" replace />;
}

export default RouteGuard;

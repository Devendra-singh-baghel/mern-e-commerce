import React from 'react'
import { useSelector } from 'react-redux'
import Loader from '../components/loader/Loader';
import { Navigate } from 'react-router';

function ProtectedRoute({ children, adminRoute = false }) {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);

    if (loading) return <Loader />;

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (adminRoute && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children
}

export default ProtectedRoute

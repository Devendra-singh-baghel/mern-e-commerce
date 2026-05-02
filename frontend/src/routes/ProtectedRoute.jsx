import React from 'react'
import { useSelector } from 'react-redux'
import Loader from '../components/loader/Loader';
import { Navigate } from 'react-router';

function ProtectedRoute({ children }) {
    const { loading, isAuthenticated } = useSelector((state) => state.user);

    if (loading) return <Loader />;

    if (!isAuthenticated) return <Navigate to="/login" />
    
    return children
}

export default ProtectedRoute

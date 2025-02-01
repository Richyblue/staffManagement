import React from 'react';
import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//     const token = localStorage.getItem('token'); // Check if the user is logged in
//     return token ? children : <Navigate to="/login" />;
// };

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.setItem('intendedPath', window.location.pathname); // Store attempted path
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;

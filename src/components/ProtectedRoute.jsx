import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
    // Check if the user has a token saved in their browser
    const token = authService.getCurrentToken();

    // If there is no token, kick them back to the login page immediately
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If they have a token, let them enter the requested page (the "children")
    return children;
};

export default ProtectedRoute;
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout(); // This deletes the token from local storage
        navigate('/login');   // Send them back to the login screen
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1>Welcome to DeskMind! 🚀</h1>
            <p style={{ fontSize: '18px', color: '#555' }}>
                You have successfully passed the security check and entered the protected dashboard.
            </p>
            
            <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', display: 'inline-block' }}>
                <h3>Dashboard Statistics (Placeholder)</h3>
                <p>Open Tickets: 5</p>
                <p>Resolved Tickets: 12</p>
            </div>

            <br />

            <button 
                onClick={handleLogout} 
                style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer', borderRadius: '5px' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
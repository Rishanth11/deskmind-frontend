import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        
        try {
            await authService.login(email, password);
            setMessage("✅ Login Successful! Redirecting...");
            
            // THE FIX: This instantly moves the user to the Dashboard after logging in
            navigate('/dashboard'); 
            
        } catch (error) {
            setMessage(`❌ Error: ${error}`);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h2>DeskMind Login</h2>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '10px', fontSize: '16px' }}
                />

                <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                    <span 
                        style={{ color: '#007bff', fontSize: '14px', cursor: 'pointer' }} 
                        onClick={() => navigate('/forgot-password')}
                    >
                        Forgot Password?
                    </span>
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
                    Sign In
                </button>
            </form>

            {/* Display the success or error message */}
            {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}

            <p style={{ marginTop: '20px' }}>
                Don't have an account? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register here</span>
            </p>
        </div>
    );
};

export default Login;
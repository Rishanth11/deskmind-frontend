import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate(); // This helps us redirect the user back to the login page

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(name, email, password);
            setMessage("✅ Registration Successful! Redirecting to login...");
            
            // Wait 2 seconds so the user can read the message, then send them to the login screen
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage(`❌ Error: ${error}`);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h2>Create DeskMind Account</h2>
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={{ padding: '10px', fontSize: '16px' }}
                />

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

                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
                    Register
                </button>
            </form>

            {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}

            <p style={{ marginTop: '20px' }}>
                Already have an account? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign In</span>
            </p>
        </div>
    );
};

export default Register;
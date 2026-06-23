import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPassword = () => {
    // State to track which step of the process we are on
    const [step, setStep] = useState(1); 
    
    // Form inputs
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // Feedback messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Triggered when they request the OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("Sending OTP...");
        setError('');
        
        try {
            await authService.forgotPassword(email);
            setMessage("✅ OTP sent! Check your email.");
            setStep(2); // Move to the next screen
        } catch (err) {
            setMessage('');
            setError(`❌ Error: ${err}`);
        }
    };

    // Triggered when they submit the new password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("Resetting password...");
        setError('');

        try {
            await authService.resetPassword(email, otp, newPassword);
            setMessage("✅ Password reset successfully! Redirecting to login...");
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setMessage('');
            setError(`❌ Error: ${err}`);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h2>Reset Password</h2>

            {/* STEP 1: Request OTP */}
            {step === 1 && (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ color: '#555', fontSize: '14px' }}>Enter your registered email to receive a 6-digit OTP.</p>
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '10px', fontSize: '16px' }}
                    />
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
                        Send OTP
                    </button>
                </form>
            )}

            {/* STEP 2: Verify OTP & New Password */}
            {step === 2 && (
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ color: '#555', fontSize: '14px' }}>Enter the OTP sent to <b>{email}</b></p>
                    <input 
                        type="text" 
                        placeholder="6-Digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                        style={{ padding: '10px', fontSize: '16px', letterSpacing: '2px', textAlign: 'center' }}
                    />
                    <input 
                        type="password" 
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} 
                        required 
                        style={{ padding: '10px', fontSize: '16px' }}
                    />
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
                        Confirm New Password
                    </button>
                </form>
            )}

            {/* Feedback Messages */}
            {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: 'green' }}>{message}</p>}
            {error && <p style={{ marginTop: '20px', fontWeight: 'bold', color: 'red' }}>{error}</p>}

            <p style={{ marginTop: '20px' }}>
                Remembered your password? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/login')}>Back to Login</span>
            </p>
        </div>
    );
};

export default ForgotPassword;
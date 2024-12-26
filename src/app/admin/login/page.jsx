'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email & Password, Step 2: Passkey
  const [error, setError] = useState('');
  const router = useRouter();
const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user?.role === 'admin') {
          setStep(2);
          setUser(data.user);
        } else {
          setError('You are not authorized for admin access.');
        }
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handlePasskeyVerify = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (passkey !== process.env.NEXT_PUBLIC_ADMIN_OTP) {
        setError('Invalid passkey.');
        return;
      }
      router.push('/admin'); 
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {step === 1 && (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Admin Login</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePasskeyVerify} className="passkey-form">
          <h2>Enter Passkey</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="password"
            placeholder="Admin Passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
}

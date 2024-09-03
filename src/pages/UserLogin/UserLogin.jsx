import React, { useState } from 'react';
import axios from 'axios';
import "./userLogin.css";
import { Link, useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const navigate=useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/auth/generateToken', { email, password });
      localStorage.setItem('token', response.data);
      navigate('/user-profile')
      alert('Login successful!');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed!');
    }
  };

  return (
    <div className="auth-form">
      
      User 
      <div style={{display:"flex"}}>
      <Link to='/user-login'>User</Link>
      <Link to='/admin-login'>Admin</Link>
      </div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserLogin;

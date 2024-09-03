import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./userRegister.css";
//import Navbar from '../../components/Navbar/Navbar';

const UserRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9000/auth/addNewUser', {
        name,
        email,
        password,
        roles: "ROLE_USER",  // Default role for new users
        active
      });
      alert('Registration successful!');
      navigate('/user-login');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed!');
    }
  };

  return (
    <div className="auth-form">
      {/* <Navbar /> */}
      <h1>User Registration</h1>
      <div className="links">
        <Link to='/user-login'>User Login</Link>
        <Link to='/admin-login'>Admin Login</Link>
      </div>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UserRegister;

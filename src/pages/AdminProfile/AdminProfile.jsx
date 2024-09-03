import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./adminProfile.css";
import Navbar from '../../components/Navbar/Navbar';

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    id: '',
    name: '',
    email: '',
    roles: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:9000/admin/auth/currentUser',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdmin(response.data);
      } catch (error) {
        setError('Failed to load profile!');
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-form">
      <Navbar />
      <h1>Admin Profile</h1>
      <div className="profile-info">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <p id="name">{admin.name}</p>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <p id="email">{admin.email}</p>
        </div>
        <div className="form-group">
          <label htmlFor="roles">Roles:</label>
          <p id="roles">{admin.roles}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

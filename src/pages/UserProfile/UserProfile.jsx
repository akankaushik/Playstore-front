import React, { useEffect, useState } from 'react';
import "./userProfile.css";
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token == null) return;
    const response = await axios.get(
      "http://localhost:9000/auth/user/userProfile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      setUserData(response.data);
    } else {
      setUserData(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="user-profile">
        {userData && userData ? (
          <div className="user-details">
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Roles:</strong> {userData.roles}</p>
            <p><strong>Active:</strong> {userData.active ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

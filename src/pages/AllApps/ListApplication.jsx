import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

const ListApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:9000/applications/all');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="list-applications">
      <Navbar />
      <h1>All Applications</h1>
      {applications.length > 0 ? (
        <ul>
          {applications.map((app) => (
            <li key={app.id} className="application-item">
              <h2>{app.name}</h2>
              <p>{app.description}</p>
              {/* <p><strong>Release Date:</strong> {app.releaseDate}</p> */}
              <p><strong>Version:</strong> {app.version}</p>
              <p><strong>Genre:</strong> {app.genre}</p>
              <p><strong>Category:</strong> {app.category}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default ListApplications;

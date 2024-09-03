import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './categoryApplications.css';

const CategoryApplications = () => {
  const [applications, setApplications] = useState([]);
  const location = useLocation();
  const category = new URLSearchParams(location.search).get('category');
  const rating = new URLSearchParams(location.search).get('rating');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/applications/category?category=${category}`);
        let filteredApplications = response.data;
        if (rating) {
          filteredApplications = filteredApplications.filter(app => {
            const averageRating = app.ratings.reduce((acc, rating) => acc + rating.value, 0) / app.ratings.length;
            return averageRating >= rating;
          });
        }
        setApplications(filteredApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    if (category) {
      fetchApplications();
    }
  }, [category, rating]);

  return (
    <div className="category-applications">
      <Navbar />
      <h1>Applications in "{category}" Category</h1>
      {applications.length > 0 ? (
        applications.map((app) => (
          <div key={app.id} className="application">
            <h2>{app.name}</h2>
            <p>{app.description}</p>
            <p>Release Date: {app.releaseDate}</p>
            <p>Version: {app.version}</p>
            <h3>Ratings</h3>
            <ul>
              {app.ratings.map((rating) => (
                <li key={rating.id}>
                  {rating.value} by {rating.user.name}
                </li>
              ))}
            </ul>
            <h3>Comments</h3>
            <ul>
              {app.comments.map((comment) => (
                <li key={comment.id}>
                  {comment.content} by {comment.user.name}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No applications found in this category.</p>
      )}
    </div>
  );
};

export default CategoryApplications;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './search.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('name');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/applications/search?name=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
    if (query) {
      fetchResults();
    }
  }, [query]);

  useEffect(() => {
    const fetchUserData = async () => {
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
    fetchUserData();
  }, []);

  const handleAddComment = async (appId) => {
    if (userData) {
      try {
        const response = await axios.post(
          `http://localhost:9000/comments/create?userId=${userData.id}&applicationId=${appId}&content=${newComment}`
        );
        const updatedResults = results.map(app => {
          if (app.id === appId) {
            return {
              ...app,
              comments: [...app.comments, response.data]
            };
          }
          return app;
        });
        setResults(updatedResults);
        setNewComment("");
      } catch (error) {
        console.error("There was an error adding the comment!", error);
      }
    } else {
      alert("Please log in to add a comment.");
    }
  };

  const handleAddRating = async (appId) => {
    if (userData) {
      const app = results.find(app => app.id === appId);
      const existingRating = app.ratings.find(rating => rating.user.id === userData.id);

      if (existingRating) {
        alert("Rating already given.");
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:9000/ratings/create?userId=${userData.id}&applicationId=${appId}&value=${newRating}`
        );
        const updatedResults = results.map(app => {
          if (app.id === appId) {
            return {
              ...app,
              ratings: [...app.ratings, response.data]
            };
          }
          return app;
        });
        setResults(updatedResults);
        setNewRating(0);
      } catch (error) {
        console.error("There was an error adding the rating!", error);
      }
    } else {
      alert("Please log in to add a rating.");
    }
  };

  return (
    <div className="search-results">
      <Navbar />
      <h1>Search Results for "{query}"</h1>
      {results.length > 0 ? (
        results.map((app) => (
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
            {userData && (
              <div>
                <h3>Add a Rating</h3>
                <input
                  type="number"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  min="1"
                  max="5"
                />
                <button onClick={() => handleAddRating(app.id)}>Add Rating</button>
              </div>
            )}
            <h3>Comments</h3>
            <ul>
              {app.comments.map((comment) => (
                <li key={comment.id}>
                  {comment.content} by {comment.user.name}
                </li>
              ))}
            </ul>
            {userData && (
              <div>
                <h3>Add a Comment</h3>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleAddComment(app.id)}>Add Comment</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;

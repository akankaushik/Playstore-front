import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import Navbar from "../../components/Navbar/Navbar";
 
const Home = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(1);
  const [selectedRating, setSelectedRating] = useState("");
 
  useEffect(() => {
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
    fetchData();
  }, []);
 
  useEffect(() => {
    axios
      .get("http://localhost:9000/applications/all")
      .then((response) => {
        setApplications(response.data);
        setFilteredApplications(response.data); // Initially, no filter applied
      })
      .catch((error) => {
        console.error("There was an error fetching the applications!", error);
      });
  }, []);
  console.log(filteredApplications)
  useEffect(() => {
    if (selectedRating) {
      setFilteredApplications(
        applications.filter((app) => {
          const avgRating = app.averageRating || 0;
          return avgRating >= selectedRating;
        })
      );
    } else {
      setFilteredApplications(applications);
    }
  }, [selectedRating, applications]);
 
  const handleAddComment = async (appId) => {
    if (userData) {
      try {
        const response = await axios.post(
          `http://localhost:9000/comments/create?userId=${userData.id}&applicationId=${appId}&content=${newComment}`
        );
        const updatedApplications = applications.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              comments: [...app.comments, response.data],
            };
          }
          return app;
        });
        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications); // Update filtered list as well
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
      const app = applications.find((app) => app.id === appId);
      const existingRating = app.ratings.find(
        (rating) => rating.user.id === userData.id
      );
 
      if (existingRating) {
        alert("Rating already given.");
        return;
      }
 
      try {
        const response = await axios.post(
          `http://localhost:9000/ratings/create?userId=${userData.id}&applicationId=${appId}&value=${newRating}`
        );
        const updatedApplications = applications.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              ratings: [...app.ratings, response.data],
            };
          }
          return app;
        });
        setApplications(updatedApplications);
        setFilteredApplications(updatedApplications); // Update filtered list as well
        setNewRating(1);
      } catch (error) {
        console.error("There was an error adding the rating!", error);
      }
    } else {
      alert("Please log in to add a rating.");
    }
  };
 
  const handleRatingFilterChange = (e) => {
    setSelectedRating(e.target.value);
  };
 
  const handleDownload = async (appId) => {
    try {
      const response = await axios.post(
        `http://localhost:9000/applications/${appId}/increase-download`
      );
      const updatedApplications = applications.map((app) => {
        if (app.id === appId) {
          return response.data; // Use the updated application from the server response
        }
        return app;
      });
      setApplications(updatedApplications);
      setFilteredApplications(updatedApplications); // Update filtered list as well
    } catch (error) {
      console.error("There was an error increasing the download count!", error);
    }
  };
 
  return (
    <div className="home">
      <Navbar />
      <h1>Applications</h1>
      <div className="rating-filter">
        <label htmlFor="rating-filter">Filter by rating:</label>
        <select
          id="rating-filter"
          value={selectedRating}
          onChange={handleRatingFilterChange}
        >
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating} or higher
            </option>
          ))}
        </select>
      </div>
      {filteredApplications.length > 0 ? (
        filteredApplications.map((app) => (
          <>
            { app.active &&
              <div key={app.id} className="application">
                {console.log(app)}
                <h2>{app.name}</h2>
                <p>{app.description}</p>
                <p>Release Date: {app.releaseDate}</p>
                <p>Version: {app.version}</p>
                <p>Download Count: {app.downloadCount || 0}</p>{" "}
                {/* Display download count */}
                <button onClick={() => handleDownload(app.id)}>
                  Download
                </button>{" "}
                {/* Download button */}
                <p>Average Rating: {app.averageRating || "Not Rated"}</p>
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
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      min="1"
                      max="5"
                    />
                    <button onClick={() => handleAddRating(app.id)}>
                      Add Rating
                    </button>
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
                    <button onClick={() => handleAddComment(app.id)}>
                      Add Comment
                    </button>
                  </div>
                )}
              </div>
            }
          </>
        ))
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};
 
export default Home;
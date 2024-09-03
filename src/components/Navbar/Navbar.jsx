import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const [filteredApplications, setFilteredApplications] = useState([]);


  useEffect(() => {
    fetchData();
    fetchAdminData();
    fetchCategories();
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

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    if (token == null) return;
    const response = await axios.get(
      "http://localhost:9000/admin/auth/currentUser",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      setAdminData(response.data);
    } else {
      setAdminData(null);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/categories/getAll");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    fetchData();
    fetchAdminData();
    navigate("/user-login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?name=${searchQuery}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/applications/category?category=${category}`);
  };


  return (
    <nav className="navbar">
      <div>
      <img src="https://i.imghippo.com/files/MPTEp1725210635.png" alt="" border="0" className="navbar-logo"></img>
      <span className="navbar-app-name">Google Play</span>
      </div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {adminData && (
          <>
            <li>
              <Link to="/admin-profile">Profile</Link>
            </li>
            <li>
              <Link to="/add-application">Add Application</Link>
            </li>
            <li>
              <Link to="/update-application">Update Application</Link>
            </li>
            <li>
              <Link to="/all-application">All Apps</Link>
            </li>
            <li>
              <span>{adminData?.name}</span>
              <button onClick={handleLogOut}>Logout</button>
            </li>
          </>
        )}
        {userData && userData.roles === "ROLE_USER" ? (
          <>
            <li>
              <Link to="/user-profile">Profile</Link>
            </li>
            <li>
              <span>{userData?.name}</span>
              <button onClick={handleLogOut}>Logout</button>
            </li>
          </>
        ) : (
          <>
            {!adminData && (
              <>
                <li>
                  <Link to="/user-register">Register</Link>
                </li>
                <li>
                  <Link to="/user-login">Login</Link>
                </li>
              </>
            )}
          </>
        )}
        <li>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </li>
      </ul>
      <div style={{ display: "flex" }}>
        {categories.map((category) => (
          <div key={category}>
            <button onClick={() => handleCategoryClick(category)}>{category}</button>
          </div>
        ))}
      </div>
      
    </nav>
  );
};

export default Navbar;

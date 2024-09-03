import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./updateApplication.css";
import Navbar from '../../components/Navbar/Navbar';

const UpdateApplication = () => {
  const { id } = useParams(); // Get the application ID from the URL
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    releaseDate: '',
    version: '',
    genre: '',
    category: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/categories/getAll');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchApplication = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/applications/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };

    fetchCategories();
    fetchApplication();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:9000/applications/update/${id}`, formData);
      if (response.status === 200) {
        alert('Application updated successfully!');
        navigate('/applications'); // Redirect to applications list or another page
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  return (
    <div className="add-application">
      <Navbar />
      <h2>Update Application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Release Date:</label>
          <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Version:</label>
          <input type="text" name="version" value={formData.version} onChange={handleChange} required />
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button type="submit">Update Application</button>
      </form>
    </div>
  );
};

export default UpdateApplication;

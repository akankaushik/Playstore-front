import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addApplication.css';
import Navbar from '../../components/Navbar/Navbar';

const AddApplication = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0], // Set current date as default
    version: '',
    genre: '',
    category: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/categories/getAll');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/applications/create', formData);
      if (response.status === 201) {
        alert('Application added successfully!');
      } else {
        alert('Failed to add application. Please try again.');
      }
    } catch (error) {
      console.error('Error adding application:', error);
      alert('An error occurred while adding the application. Please check the console for more details.');
    }
  };
  

  return (
    <div className="add-application">
      <Navbar/>
      <h2>Add Application</h2>
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
        <button type="submit">Add Application</button>
      </form>
    </div>
  );
};

export default AddApplication;
"use client";
import React, { useState } from 'react';
import axios from 'axios';

const AboutForm = () => {
  const [formData, setFormData] = useState({
    heroImage: null, // Changed to store File object
    workImage: null, // Changed to store File object
    heroTitle: '',
    heroDescription: '',
    aboutDescription: '',
    projectsCompleted: '',
    yearsOfExperience: '',
  });
  const [previews, setPreviews] = useState({
    heroImage: null,
    workImage: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle text/number input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      // Validate file type (images only)
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(files[0].type)) {
        setError('Please upload a valid image file (JPEG, PNG, or GIF).');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      // Generate preview URL
      setPreviews((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side validation
    if (
      !formData.heroImage ||
      !formData.workImage ||
      !formData.heroTitle ||
      !formData.heroDescription ||
      !formData.aboutDescription ||
      !formData.projectsCompleted ||
      !formData.yearsOfExperience
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (isNaN(formData.projectsCompleted) || formData.projectsCompleted < 0) {
      setError('Projects Completed must be a valid number.');
      setLoading(false);
      return;
    }
    if (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0) {
      setError('Years of Experience must be a valid number.');
      setLoading(false);
      return;
    }

    // Create FormData for multipart/form-data request
    const data = new FormData();
    data.append('heroImage', formData.heroImage);
    data.append('workImage', formData.workImage);
    data.append('heroTitle', formData.heroTitle);
    data.append('heroDescription', formData.heroDescription);
    data.append('aboutDescription', formData.aboutDescription);
    data.append('projectsCompleted', formData.projectsCompleted);
    data.append('yearsOfExperience', formData.yearsOfExperience);

    try {
      // Send POST request to the API
      const response = await axios.post('/api/about', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('About data saved successfully!');
      // Reset form
      setFormData({
        heroImage: null,
        workImage: null,
        heroTitle: '',
        heroDescription: '',
        aboutDescription: '',
        projectsCompleted: '',
        yearsOfExperience: '',
      });
      setPreviews({ heroImage: null, workImage: null });
      // Reset file input fields
      document.getElementById('heroImage').value = '';
      document.getElementById('workImage').value = '';
    } catch (err) {
      setError('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create About Page Content</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Image */}
          <div>
            <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700">
              Hero Image
            </label>
            <input
              type="file"
              id="heroImage"
              name="heroImage"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {previews.heroImage && (
              <img
                src={previews.heroImage}
                alt="Hero Preview"
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}
          </div>

          {/* Work Image */}
          <div>
            <label htmlFor="workImage" className="block text-sm font-medium text-gray-700">
              Work Image
            </label>
            <input
              type="file"
              id="workImage"
              name="workImage"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {previews.workImage && (
              <img
                src={previews.workImage}
                alt="Work Preview"
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}
          </div>

          {/* Hero Title */}
          <div>
            <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">
              Hero Title
            </label>
            <input
              type="text"
              id="heroTitle"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter hero title"
              required
            />
          </div>

          {/* Hero Description */}
          <div>
            <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700">
              Hero Description
            </label>
            <textarea
              id="heroDescription"
              name="heroDescription"
              value={formData.heroDescription}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Enter hero description"
              required
            />
          </div>

          {/* About Description */}
          <div>
            <label htmlFor="aboutDescription" className="block text-sm font-medium text-gray-700">
              About Description
            </label>
            <textarea
              id="aboutDescription"
              name="aboutDescription"
              value={formData.aboutDescription}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="6"
              placeholder="Enter about description"
              required
            />
          </div>

          {/* Projects Completed */}
          <div>
            <label htmlFor="projectsCompleted" className="block text-sm font-medium text-gray-700">
              Projects Completed
            </label>
            <input
              type="number"
              id="projectsCompleted"
              name="projectsCompleted"
              value={formData.projectsCompleted}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter number of projects"
              min="0"
              required
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter years of experience"
              min="0"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save About Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutForm;
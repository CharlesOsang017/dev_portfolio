'use client';
import React, { useState } from 'react';
import axios from 'axios';

const SkillForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, or GIF).');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side validation
    if (!formData.title || !formData.description || !formData.logo) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    // Create FormData for multipart/form-data request
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('logo', formData.logo);

    try {
      // Send POST request to the API
      const response = await axios.post('/api/skills', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Skill saved successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        logo: null,
      });
      setLogoPreview(null);
      document.getElementById('logo').value = '';
    } catch (err) {
      setError('Failed to save skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Skill</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Skill Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter skill title (e.g., JavaScript)"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Describe the skill"
              required
            />
          </div>

          {/* Logo */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Skill Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="mt-2 w-32 h-32 object-contain rounded-md"
              />
            )}
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
              {loading ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
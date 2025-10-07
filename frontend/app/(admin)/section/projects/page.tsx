'use client';
import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    technologies: '',
    link: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
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
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side validation
    if (!formData.title || !formData.technologies) {
      setError('Title and technologies are required.');
      setLoading(false);
      return;
    }

    // Validate technologies (ensure at least one technology after splitting)
    const techArray = formData.technologies
      .split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech);
    if (techArray.length === 0) {
      setError('Please provide at least one technology.');
      setLoading(false);
      return;
    }

    // Validate link if provided
    if (formData.link && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.link)) {
      setError('Please provide a valid URL for the link.');
      setLoading(false);
      return;
    }

    // Create FormData for multipart/form-data request
    const data = new FormData();
    data.append('title', formData.title);
    data.append('technologies', JSON.stringify(techArray)); // Send as JSON string
    if (formData.link) data.append('link', formData.link);
    if (formData.image) data.append('image', formData.image);

    try {
      // Send POST request to the API
      const response = await axios.post('/api/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Project saved successfully!');
      // Reset form
      setFormData({
        title: '',
        technologies: '',
        link: '',
        image: null,
      });
      setImagePreview(null);
      document.getElementById('image').value = '';
    } catch (err) {
      setError('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Project</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., React, Node.js, MongoDB"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">
              Project Link (Optional)
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Project Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Project Preview"
                className="mt-2 w-full h-40 object-cover rounded-md"
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
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
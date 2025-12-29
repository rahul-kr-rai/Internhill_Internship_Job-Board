import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployerApplicationsModal from '../components/EmployerApplicationsModal';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', location: '', type: '', salary: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [appsJobId, setAppsJobId] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    document.title = 'Employer Dashboard - InternHill';
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUser();
  }, [token, navigate]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const userData = await response.json();
      setUser(userData);

      // Check if user is employer
      if (userData.role !== 'employer') {
        alert('Only employers can access the dashboard');
        navigate('/jobs');
        return;
      }

      fetchJobs();
    } catch (err) {
      console.error('Error:', err);
      navigate('/login');
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/employer/my-jobs`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        console.error('Fetch failed:', response.status);
        setJobs([]);
        return;
      }
      
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setJobs([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', location: '', type: '', salary: '', description: '' });
    setShowForm(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingId 
        ? `${API_URL}/api/jobs/${editingId}`
        : `${API_URL}/api/jobs`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to save job');
      }

      setFormData({ title: '', location: '', type: '', salary: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      setError(null);
      fetchJobs();
      alert(editingId ? 'Job updated successfully!' : 'Job posted successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job?')) return;

    try {
      const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete job');
      fetchJobs();
      alert('Job deleted successfully!');
    } catch (err) {
      console.error('Error:', err);
      alert('Error deleting job: ' + err.message);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user.name}! Manage your job postings</p>
          </div>
          <button
            onClick={() => !showForm ? setShowForm(true) : handleCancel()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {showForm ? 'Cancel' : '+ Post Job'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Job' : 'Create New Job'}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="e.g. Remote, San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Job Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="e.g. $15-18/hr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  placeholder="Job description, requirements, etc."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? (editingId ? 'Updating...' : 'Posting...') : (editingId ? 'Update Job' : 'Post Job')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Your Jobs ({jobs.length})</h2>
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-indigo-600 font-medium">{job.company}</p>
                      <p className="text-gray-600">{job.location} • {job.type}</p>
                      <p className="text-gray-600 text-sm mt-2">{job.description}</p>
                      {job.salary && <p className="text-gray-700 font-medium mt-2">{job.salary}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(job)}
                        className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="px-3 py-1 text-sm bg-red-200 text-red-800 rounded hover:bg-red-300"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setAppsJobId(job._id)}
                        className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded"
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 bg-white p-6 rounded-lg">No jobs posted yet. Create your first job posting!</p>
          )}
        </div>

        {appsJobId && (
          <EmployerApplicationsModal jobId={appsJobId} isOpen={!!appsJobId} onClose={() => setAppsJobId(null)} token={token} />
        )}
      </div>
    </main>
  );
}
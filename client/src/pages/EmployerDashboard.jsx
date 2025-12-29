import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployerApplicationsModal from '../components/EmployerApplicationsModal';
import { 
  Briefcase, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter
} from 'lucide-react';

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', location: '', type: '', salary: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    document.title = 'Employer Dashboard - InternHill';
    if (!token || user?.role !== 'employer') {
      navigate('/login');
      return;
    }
    fetchJobs();
    fetchAllApplications();
  }, [token, user]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs/employer/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const fetchAllApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications/employer/all-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingId ? `${API_URL}/api/jobs/${editingId}` : `${API_URL}/api/jobs`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save');
      }

      setFormData({ title: '', location: '', type: '', salary: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchJobs();
      // alert(editingId ? 'Job updated!' : 'Job posted!'); // Optional: removed for cleaner UX
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- UI Helpers ---

  const stats = {
    posted: jobs.length,
    total: allApplications.length,
    applied: allApplications.filter(a => a.status === 'Applied').length,
    reviewing: allApplications.filter(a => a.status === 'Reviewing').length,
    shortlisted: allApplications.filter(a => a.status === 'Shortlisted').length,
  };

  const statConfig = [
    { label: 'Jobs Posted', value: stats.posted, icon: <Briefcase size={22} className="text-white"/>, bg: 'bg-blue-50', iconBox: 'bg-blue-500' },
    { label: 'Total Apps', value: stats.total, icon: <Users size={22} className="text-white"/>, bg: 'bg-indigo-50', iconBox: 'bg-indigo-500' },
    { label: 'Applied', value: stats.applied, icon: <FileText size={22} className="text-white"/>, bg: 'bg-blue-50', iconBox: 'bg-blue-400' }, // Lighter blue to differentiate
    { label: 'Reviewing', value: stats.reviewing, icon: <Clock size={22} className="text-white"/>, bg: 'bg-yellow-50', iconBox: 'bg-yellow-500' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: <CheckCircle size={22} className="text-white"/>, bg: 'bg-purple-50', iconBox: 'bg-purple-500' },
  ];

  const filteredApps = filter === 'all' ? allApplications : allApplications.filter(a => a.status === filter);

  const getJobIconPlaceholder = (title) => {
    return title ? title.charAt(0).toUpperCase() : 'J';
  };

  const getStatusBadgeColor = (status) => {
      switch(status) {
          case 'Accepted': return 'bg-green-100 text-green-700';
          case 'Rejected': return 'bg-red-100 text-red-700';
          case 'Shortlisted': return 'bg-purple-100 text-purple-700';
          case 'Reviewing': return 'bg-yellow-100 text-yellow-700';
          default: return 'bg-blue-100 text-blue-700';
      }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-6 md:px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage jobs and track applications.</p>
          </div>
          <button
            onClick={() => {
                if (showForm) {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: '', location: '', type: '', salary: '', description: '' });
                } else {
                    setShowForm(true);
                }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-1 ${
                showForm 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-none' 
                : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
            }`}
          >
            {showForm ? <XCircle size={20}/> : <Plus size={20}/>}
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {/* Stats Grid - Colorful Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statConfig.map((s, i) => (
             <div key={i} className={`p-5 rounded-2xl shadow-sm border border-transparent ${s.bg} flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm ${s.iconBox}`}>
                    {s.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
                <p className="text-sm text-gray-600 font-medium">{s.label}</p>
             </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <XCircle size={20} /> {error}
          </div>
        )}

        {/* Post Job Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {editingId ? <Edit className="text-indigo-600"/> : <Plus className="text-indigo-600"/>}
                {editingId ? 'Edit Job Details' : 'Create New Job Posting'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Job Title</label>
                    <input
                    type="text"
                    name="title"
                    placeholder="e.g. MERN Stack Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                    type="text"
                    name="location"
                    placeholder="e.g. Mumbai (Remote)"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Job Type</label>
                    <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white"
                    >
                    <option value="">Select Type</option>
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Salary / Stipend</label>
                    <input
                    type="text"
                    name="salary"
                    placeholder="e.g. 15000"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                    />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    placeholder="Describe the role and requirements..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium shadow-md shadow-indigo-200"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             <Briefcase className="text-gray-400" size={20}/> My Active Jobs
          </h2>
          {jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-200 transition-colors group">
                  
                  {/* Job Info */}
                  <div className="flex items-start gap-5 flex-1">
                     <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold shrink-0">
                        {getJobIconPlaceholder(job.title)}
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                            {job.salary && <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100"><DollarSign size={12}/> {job.salary}</span>}
                        </div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                    <button
                      onClick={() => setSelectedJobId(job._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
                    >
                      <Users size={16} />
                      Apps ({job.applications?.length || 0})
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2 text-gray-500 bg-gray-50 border border-gray-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 text-gray-500 bg-gray-50 border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Briefcase size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
                <p className="text-gray-500 mt-2">Create your first job posting to start finding talent.</p>
            </div>
          )}
        </div>

        {/* All Applications Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-gray-400" size={20}/> Recent Applications
             </h2>
             
             {/* Filter Tabs */}
             <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {['all', 'Applied', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'].map(s => (
                <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === s 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {s === 'all' ? 'All Apps' : s}
                </button>
                ))}
             </div>
          </div>

          {filteredApps.length > 0 ? (
            <div className="grid gap-4">
              {filteredApps.map(app => (
                <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-indigo-200 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-bold text-gray-900">{app.applicant.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border border-transparent ${getStatusBadgeColor(app.status)}`}>
                            {app.status}
                          </span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-2">Applied for <span className="text-indigo-600">{app.job.title}</span> • {new Date(app.appliedAt).toLocaleDateString()}</p>
                      
                      <div className="flex items-center gap-3 text-sm">
                         <span className="text-gray-400">{app.applicant.email}</span>
                         {app.resume && (
                             <a href={`${API_URL}/${app.resume}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline font-medium">
                                <FileText size={14}/> Resume
                             </a>
                         )}
                      </div>
                    </div>

                    <button
                        onClick={() => setSelectedJobId(app.job._id)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap"
                    >
                        Review & Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500">No applications found matching this filter.</p>
            </div>
          )}
        </div>
      </div>

      {selectedJobId && (
        <EmployerApplicationsModal
          jobId={selectedJobId}
          isOpen={!!selectedJobId}
          onClose={() => setSelectedJobId(null)}
          token={token}
          onUpdate={fetchAllApplications}
        />
      )}
    </main>
  );
}
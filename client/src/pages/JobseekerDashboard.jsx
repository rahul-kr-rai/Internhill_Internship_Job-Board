import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  FileText, 
  XCircle, 
  Filter, 
  MapPin, 
  Calendar, 
  Download,
  ChevronDown,
  ChevronUp,
  Building2,
  MessageSquare
} from 'lucide-react';

export default function JobseekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    document.title = 'My Applications - InternHill';
    if (!token || user?.role !== 'jobseeker') {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [token, user, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // --- UI Helpers ---

  const filteredApps = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    reviewing: applications.filter(a => a.status === 'Reviewing').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  // Configuration for the Colorful Stats Cards
  const statConfig = [
    { 
      label: 'Total', 
      count: stats.total, 
      icon: <Briefcase size={22} className="text-white"/>, 
      cardBg: 'bg-blue-50', 
      iconBox: 'bg-blue-500' 
    },
    { 
      label: 'Applied', 
      count: stats.applied, 
      icon: <FileText size={22} className="text-white"/>, 
      cardBg: 'bg-indigo-50', 
      iconBox: 'bg-indigo-500' 
    },
    { 
      label: 'Reviewing', 
      count: stats.reviewing, 
      icon: <Clock size={22} className="text-white"/>, 
      cardBg: 'bg-yellow-50', 
      iconBox: 'bg-yellow-500' 
    },
    { 
      label: 'Shortlisted', 
      count: stats.shortlisted, 
      icon: <Filter size={22} className="text-white"/>, 
      cardBg: 'bg-purple-50', 
      iconBox: 'bg-purple-500' 
    },
    { 
      label: 'Accepted', 
      count: stats.accepted, 
      icon: <CheckCircle size={22} className="text-white"/>, 
      cardBg: 'bg-green-50', 
      iconBox: 'bg-green-500' 
    },
    { 
      label: 'Rejected', 
      count: stats.rejected, 
      icon: <XCircle size={22} className="text-white"/>, 
      cardBg: 'bg-red-50', 
      iconBox: 'bg-red-500' 
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
      'Reviewing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Shortlisted': 'bg-purple-100 text-purple-700 border-purple-200',
      'Accepted': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getLogoPlaceholder = (name) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600', 'bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600', 'bg-rose-100 text-rose-600'];
    const index = name ? name.length % colors.length : 0;
    const initial = name ? name.charAt(0).toUpperCase() : 'C';
    return (
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm border border-white/50 ${colors[index]}`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-slate-500 mt-2">Track and manage your internship journey.</p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {statConfig.map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl shadow-sm border border-transparent ${stat.cardBg} flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow`}>
            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-sm ${stat.iconBox}`}>
              {stat.icon}
            </div>
            {/* Number */}
            <h3 className="text-2xl font-bold text-gray-800">{stat.count}</h3>
            {/* Label */}
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Content */}
      <div className="max-w-7xl mx-auto">
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
          {['all', 'Applied', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap capitalize
                ${filter === tab 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {tab === 'all' ? 'All Applications' : tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading your applications...</p>
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div 
                key={app._id} 
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 overflow-hidden"
              >
                
                {/* Main Card Content */}
                <div className="p-6 flex flex-col md:flex-row gap-6 relative">
                  
                  {/* Status Badge (Desktop: Top Right) */}
                  <div className="md:absolute md:top-6 md:right-6 flex justify-start md:justify-end w-full md:w-auto mb-2 md:mb-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm ${getStatusBadge(app.status)}`}>
                      {app.status === 'Accepted' && <CheckCircle size={14} />}
                      {app.status === 'Rejected' && <XCircle size={14} />}
                      {app.status}
                    </span>
                  </div>

                  {/* Left: Logo & Details */}
                  <div className="flex items-start gap-5 w-full">
                    {/* Logo Placeholder */}
                    <div className="shrink-0 pt-1">
                       {getLogoPlaceholder(app.job.company)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors truncate pr-20">
                        {app.job.title}
                      </h3>
                      
                      {/* Company Name */}
                      <div className="flex items-center text-slate-600 font-medium mb-3">
                         <Building2 size={16} className="mr-1.5 text-slate-400"/>
                         {app.job.company}
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium">
                          <MapPin size={14} /> {app.job.location}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium">
                          <Briefcase size={14} /> {app.job.type}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium">
                          <Calendar size={14} /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Bottom Right) */}
                  <div className="flex items-center gap-3 mt-4 md:mt-0 md:self-end md:ml-auto shrink-0">
                    {app.resume && (
                      <a 
                        href={`${API_URL}/${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center gap-2"
                      >
                        <Download size={16} />
                        Resume
                      </a>
                    )}
                    <button 
                      onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-2"
                    >
                      {expandedId === app._id ? 'Hide Details' : 'Details'}
                      {expandedId === app._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {expandedId === app._id && (
                  <div className="bg-slate-50 border-t border-gray-100 p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* Cover Letter */}
                      {app.coverLetter && (
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500"/>
                            Your Cover Letter
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {app.coverLetter}
                          </p>
                        </div>
                      )}

                      {/* Feedback */}
                      {app.feedback ? (
                         <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                           <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                             <MessageSquare size={16} className="text-blue-500"/>
                             Employer Feedback
                           </h4>
                           <p className="text-sm text-blue-700 leading-relaxed">
                             {app.feedback}
                           </p>
                         </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-slate-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                          <MessageSquare size={24} className="mb-2 opacity-50"/>
                          <p>No feedback provided yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
            <p className="text-slate-500 mt-2 mb-8 max-w-sm mx-auto">
              You haven't applied to any jobs in this category yet. Start exploring opportunities!
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-100"
            >
              Browse Open Positions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
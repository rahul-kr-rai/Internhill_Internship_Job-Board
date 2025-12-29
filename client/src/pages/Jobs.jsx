import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import JobDetailsModal from '../components/JobDetailsModal';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Filter, 
  ChevronRight, 
  Building2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false); // To track if we are using mock data
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { token, user } = useAuth();
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    document.title = 'Browse Jobs - InternHill';
    fetchJobs();
    if (token && user?.role === 'jobseeker') {
      fetchMyApplications();
    }
  }, [token, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/jobs`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
      setIsDemoMode(false);
    } catch (err) {
      console.error(err);
      // Fallback mock data for UI testing if API fails
      const mockJobs = [
        { _id: '1', title: 'Frontend Developer Intern', company: 'Tech Corp', location: 'Remote', type: 'Internship', salary: '15000', description: 'Build responsive UIs with React and modern web technologies. You will work closely with our design team.' },
        { _id: '2', title: 'Backend Developer', company: 'StartUp Inc', location: 'Bangalore', type: 'Full-time', salary: '80000', description: 'Node.js and MongoDB development for scalable applications. Experience with AWS is a plus.' },
        { _id: '3', title: 'UI/UX Designer', company: 'Creative Studio', location: 'Mumbai', type: 'Part-time', salary: '25000', description: 'Design intuitive user interfaces for mobile and web apps. Proficiency in Figma required.' },
      ];
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsDemoMode(true); // Indicate we are in demo mode
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const ids = data.map(a => a.job._id || a.job);
      setAppliedJobIds(ids);
    } catch (err) {
      console.error('Failed to fetch my applications', err);
    }
  };

  const handleFilter = () => {
    let filtered = jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
      const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchType = !jobType || job.type === jobType;
      return matchSearch && matchLocation && matchType;
    });
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [search, location, jobType, jobs]);

  const handleApply = async (applicationData) => {
    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: applicationData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to apply');
      }

      setShowApplyModal(false);
      fetchMyApplications();
      // Optional: Add a toast notification here
    } catch (err) {
      throw err;
    }
  };

  // --- UI Helpers ---

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
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

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Browse Opportunities</h1>
            <p className="text-slate-500 mt-2 text-lg">Find your next internship or entry-level role.</p>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>

        {/* Demo Mode Alert */}
        {isDemoMode && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <div>
              <span className="font-bold">Demo Mode:</span> We couldn't connect to the server, so we're showing sample data.
            </div>
            <button onClick={fetchJobs} className="ml-auto text-sm underline hover:text-amber-900">Retry</button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-10">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Location Input */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="City or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Type Dropdown */}
            <div className="md:col-span-3 relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                <option value="">All Job Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
              </div>
            </div>
            
            {/* Refresh Button */}
            <div className="md:col-span-1">
                <button
                    onClick={fetchJobs}
                    className="w-full flex items-center justify-center p-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95"
                    title="Refresh List"
                >
                    <Clock size={20} className={loading ? "animate-spin text-indigo-600" : ""} />
                </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !isDemoMode ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Searching for open roles...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map(job => (
              <div 
                key={job._id} 
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all duration-300 ease-out"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Logo Section */}
                  <div className="shrink-0 pt-1">
                    {getLogoPlaceholder(job.company)}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header: Title & Company */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-0.5">
                          <Building2 size={14} className="text-slate-400"/>
                          {job.company}
                        </div>
                      </div>
                      
                      {/* Applied Status */}
                      {appliedJobIds.includes(job._id) && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 self-start md:self-auto">
                          <CheckCircle size={14} /> Applied
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold border border-slate-200">
                        <Briefcase size={12} /> {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold border border-slate-200">
                        <MapPin size={12} /> {job.location}
                      </span>
                      {job.salary && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-semibold border border-green-100">
                          <DollarSign size={12} /> {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 pr-4">
                      {truncateText(job.description, 180)}
                    </p>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 md:border-l md:border-gray-100 md:pl-6 md:ml-2 items-center justify-center">
                    {appliedJobIds.includes(job._id) ? (
                        <button 
                          disabled 
                          className="flex-1 md:flex-none w-full px-5 py-2.5 bg-gray-50 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed border border-gray-200"
                        >
                          Applied
                        </button>
                    ) : user?.role === 'jobseeker' ? (
                        <button
                          onClick={() => openApplyModal(job)}
                          className="flex-1 md:flex-none w-full px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold text-sm shadow-md shadow-indigo-100 hover:-translate-y-0.5"
                        >
                          Apply Now
                        </button>
                    ) : (
                        <button
                          disabled
                          className="flex-1 md:flex-none w-full px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed font-semibold text-sm border border-gray-200"
                          title="Log in as a Jobseeker to apply"
                        >
                          Apply
                        </button>
                    )}
                    
                    <button
                      onClick={() => openJobDetails(job)}
                      className="flex-1 md:flex-none w-full px-5 py-2.5 bg-white text-slate-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 transition-all font-semibold text-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              We couldn't find any matches. Try adjusting your search filters.
            </p>
            <button 
                onClick={() => {setSearch(''); setLocation(''); setJobType('');}}
                className="px-6 py-2.5 bg-white border border-gray-300 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
                Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedJob && showDetailsModal && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          isApplied={appliedJobIds.includes(selectedJob._id)}
          onApply={() => {
            setShowDetailsModal(false);
            openApplyModal(selectedJob);
          }}
          userRole={user?.role}
        />
      )}

      {selectedJob && showApplyModal && (
        <ApplyModal
          job={selectedJob}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          onApply={handleApply}
        />
      )}
    </main>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplyModal from '../components/ApplyModal';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API_URL}/api/jobs/${id}`);
        if (!res.ok) {
          if (res.status === 404) navigate('/jobs');
          throw new Error('Failed to fetch job');
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, API_URL, navigate]);

  const handleApply = async (applicationData) => {
    if (!token) {
      alert('Please login as a jobseeker to apply.');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(applicationData),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Failed to apply');
      alert('Application submitted');
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center">Loading...</main>;
  if (!job) return <main className="min-h-screen flex items-center justify-center">Job not found</main>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-indigo-600 font-medium">{job.company}</p>
          <p className="text-gray-600 mt-1">{job.location} • {job.type}</p>
          {job.salary && <p className="text-gray-700 mt-2">{job.salary}</p>}
          <div className="mt-4 text-gray-700 whitespace-pre-wrap">{job.description}</div>

          <div className="mt-6 flex gap-3">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              onClick={() => setShowModal(true)}
            >
              Apply
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ApplyModal
          job={job}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onApply={(data) => handleApply({ ...data, jobId: job._id })}
        />
      )}
    </main>
  );
}

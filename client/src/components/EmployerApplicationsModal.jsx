import React, { useState, useEffect } from 'react';

export default function EmployerApplicationsModal({ jobId, isOpen, onClose, token }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchApps();
  }, [isOpen]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setApplications(data);
    } catch (err) { console.error(err); setApplications([]); }
    finally { setLoading(false); }
  };

  const updateStatus = async (appId, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchApps();
    } catch (err) { alert(err.message || 'Error'); }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow max-w-3xl w-full p-4 overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Applications</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>

        {loading ? <p>Loading...</p> : (
          applications.length ? applications.map(app => (
            <div key={app._id} className="border-b py-3 flex justify-between gap-4">
              <div>
                <p className="font-semibold">{app.applicant?.name || 'Applicant'}</p>
                <p className="text-sm text-gray-600">{app.applicant?.email}</p>
                {app.coverLetter && <p className="text-sm mt-2">{app.coverLetter}</p>}
                {app.resume && <a className="text-indigo-600 text-sm" href={app.resume} target="_blank" rel="noreferrer">View resume</a>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm">{new Date(app.appliedAt).toLocaleDateString()}</span>
                <select value={app.status} onChange={(e) => updateStatus(app._id, e.target.value)} className="px-2 py-1 border rounded">
                  <option>Applied</option>
                  <option>Reviewing</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
          )) : <p>No applications yet.</p>
        )}
      </div>
    </div>
  );
}
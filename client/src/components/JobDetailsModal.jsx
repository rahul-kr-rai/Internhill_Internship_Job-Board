import React from 'react';
import { X, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export default function JobDetailsModal({ job, isOpen, onClose, isApplied, onApply, userRole }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-lg text-indigo-600 font-semibold mt-1">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Job Meta Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Briefcase className="text-indigo-600" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Job Type</p>
                <p className="text-sm font-semibold text-gray-900">{job.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <MapPin className="text-green-600" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Location</p>
                <p className="text-sm font-semibold text-gray-900">{job.location}</p>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <DollarSign className="text-yellow-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Salary</p>
                  <p className="text-sm font-semibold text-gray-900">{job.salary}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-600 font-semibold">Posted</p>
                <p className="text-sm font-semibold text-gray-900">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Job Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.description || 'No description provided'}
            </p>
          </div>

          {/* Requirements (if available) */}
          {job.requirements && (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">✓ Requirements</h3>
              <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Benefits (if available) */}
          {job.benefits && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-3">🎁 Benefits</h3>
              <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                {job.benefits}
              </p>
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Close
          </button>

          {isApplied ? (
            <button
              disabled
              className="flex-1 px-4 py-3 bg-green-100 text-green-700 rounded-lg cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              ✓ Already Applied
            </button>
          ) : userRole === 'jobseeker' ? (
            <button
              onClick={onApply}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Apply Now
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-semibold"
            >
              Login to Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
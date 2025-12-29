import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job, isApplied, onApply, onViewApplications, showApplicationsBtn }) {
  const truncateText = (text, limit) => text?.length > limit ? text.substring(0, limit) + '...' : text;

  const getJobTypeColor = (type) => {
    const colors = {
      'Internship': 'bg-blue-100 text-blue-800',
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-indigo-600">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition">{job.title}</h3>
              <p className="text-indigo-600 font-semibold text-sm">{job.company}</p>
            </div>
            {isApplied && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                ✓ Applied
              </span>
            )}
          </div>

          {/* Job Info Tags */}
          <div className="flex flex-wrap gap-2 my-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getJobTypeColor(job.type)}`}>
              {job.type}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1">
              📍 {job.location}
            </span>
            {job.salary && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                💰 {job.salary}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed my-4 line-clamp-3">
            {truncateText(job.description, 150)}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
            {job.applications?.length > 0 && (
              <span>👥 {job.applications.length} application{job.applications.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          {isApplied ? (
            <button disabled className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium cursor-not-allowed">
              Applied
            </button>
          ) : (
            <button
              onClick={onApply}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              Apply Now
            </button>
          )}
          {showApplicationsBtn && (
            <button
              onClick={onViewApplications}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 transition"
            >
              View Apps
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

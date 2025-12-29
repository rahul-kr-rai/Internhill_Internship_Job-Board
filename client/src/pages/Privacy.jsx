import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-gray-600">Your privacy is important to us.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600">← Back home</Link>
      </div>
    </div>
  );
}
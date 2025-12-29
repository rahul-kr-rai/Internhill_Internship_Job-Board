import React, { useState } from 'react';

export default function SearchFilters({ onSearch }) {
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [minExp, setMinExp] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q, location, minExp });
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow-sm flex gap-3 items-end">
      <div className="flex-1">
        <label className="text-xs text-gray-500">Keywords</label>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Job title, skills..." className="mt-1 w-full border px-3 py-2 rounded"/>
      </div>

      <div>
        <label className="text-xs text-gray-500">Location</label>
        <input value={location} onChange={e => setLocation(e.target.value)} className="mt-1 w-48 border px-3 py-2 rounded"/>
      </div>

      <div>
        <label className="text-xs text-gray-500">Min Exp</label>
        <input value={minExp} onChange={e => setMinExp(e.target.value)} type="number" min="0" className="mt-1 w-24 border px-3 py-2 rounded"/>
      </div>

      <div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Search</button>
      </div>
    </form>
  );
}

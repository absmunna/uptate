import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h1 className="text-4xl font-bold text-[var(--pm-accent)] mb-4">404</h1>
      <p className="text-[var(--pm-text-secondary)] mb-6">Page not found.</p>
      <button onClick={() => navigate('/')} className="px-6 py-2 bg-[var(--pm-accent)] text-white rounded-xl">Go Home</button>
    </div>
  );
};

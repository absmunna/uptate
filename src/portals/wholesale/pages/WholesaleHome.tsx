import React from 'react';
import { Link } from 'react-router-dom';

export const WholesaleHome = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Wholesale Portal</h1>
      <Link to="/wholesale/manage-products" className="text-blue-500 hover:underline">
        Manage Products
      </Link>
    </div>
  );
};

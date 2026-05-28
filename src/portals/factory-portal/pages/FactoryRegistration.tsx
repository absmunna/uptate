import React from 'react';

export const FactoryRegistration = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Factory Registration</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <input className="w-full border p-2 rounded" type="text" placeholder="e.g. Acme Manufacturing" />
        </div>
        <div>
          <label className="block text-sm font-medium">Product Category</label>
          <input className="w-full border p-2 rounded" type="text" />
        </div>
        <div>
          <label className="block text-sm font-medium">Export License Number</label>
          <input className="w-full border p-2 rounded" type="text" />
        </div>
        <div>
          <label className="block text-sm font-medium">International Supply Certificate</label>
          <input className="w-full border p-2 rounded" type="file" />
        </div>
        <div>
          <label className="block text-sm font-medium">Bank Account Details</label>
          <input className="w-full border p-2 rounded" type="text" placeholder="Bank Name & Account Number" />
        </div>
        <div>
          <label className="block text-sm font-medium">Shipping Documents</label>
          <input className="w-full border p-2 rounded" type="file" multiple />
        </div>
        <button className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700">Submit Registration</button>
      </form>
    </div>
  );
};

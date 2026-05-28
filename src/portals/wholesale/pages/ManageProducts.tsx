import React from 'react';
import { calculateLogisticsCost } from '../../../services/logisticsService';

export const ManageProducts = () => {
  const cost = calculateLogisticsCost(10, 5); // 10km, 5kg
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Wholesale Products</h1>
      <p className="mb-2">This is the wholesale product management dashboard.</p>
      <div className="p-4 bg-gray-100 rounded">
        <p className="font-semibold">Sample Logistics Cost (10km, 5kg): ${cost}</p>
      </div>
    </div>
  );
};

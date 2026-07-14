import React from 'react';

export const DocumentsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Documents</h1>

      <p className="text-gray-600 mb-6">
        Manage your uploaded documents here.
      </p>

      <div className="bg-white rounded-lg shadow border p-6">
        <p className="text-gray-500">
          No documents available.
        </p>
      </div>
    </div>
  );
};
import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Trash2, FileText, CheckCircle, Clock } from 'lucide-react'; // Added icons

interface DocumentItem {
  id: number;
  name: string;
  fileUrl: string;
  status: 'Draft' | 'In Review' | 'Signed';
}
export const DocumentPageChamber = () => {
 const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];

    const newDoc: DocumentItem = {
      id: Date.now(),
      name: file.name,
      fileUrl: URL.createObjectURL(file),
      status: 'Draft',
    };

    setDocuments((prev) => [...prev, newDoc]);
  }
};

  // NEW: Delete function
  const deleteDocument = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const updateStatus = (id: number, newStatus: DocumentItem['status']) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: newStatus } : doc))
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Document Chamber</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="font-semibold mb-4">Upload New Document</h2>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="block w-full text-sm text-gray-500" />
      </div>

      {/* Document List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" /> {doc.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'Signed' ? 'bg-green-100 text-green-800' : 
                    doc.status === 'In Review' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3 items-center">

  <button
    onClick={() => window.open(doc.fileUrl, "_blank")}
    className="text-purple-600 hover:text-purple-800 text-sm"
  >
    Preview
  </button>

  <button
    onClick={() => updateStatus(doc.id, 'In Review')}
    className="text-blue-600 hover:text-blue-800 text-sm"
  >
    Review
  </button>

  <button
    onClick={() => updateStatus(doc.id, 'Signed')}
    className="text-green-600 hover:text-green-800 text-sm"
  >
    Sign
  </button>

  <button
    onClick={() => deleteDocument(doc.id)}
    className="text-red-600 hover:text-red-800"
  >
    <Trash2 size={18} />
  </button>

</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="font-semibold mb-4">Apply E-Signature</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-md w-full h-48 mb-4">
          <SignatureCanvas ref={sigCanvas} canvasProps={{ className: 'sigCanvas w-full h-full' }} />
        </div>
        <button onClick={() => sigCanvas.current?.clear()} className="mr-4 px-4 py-2 border rounded hover:bg-gray-50">Clear</button>
        <button onClick={() => alert('Signature applied!')} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Apply Signature</button>
      </div>
    </div>
  );
};
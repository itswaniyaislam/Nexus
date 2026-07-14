import React, { useState } from 'react';
import DocumentChamberDrawer from './DocumentChamberDrawer'; // Make sure the path is correct

export const DocumentsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ name: string } | null>(null);

  // This function is called when you click "Open Chamber"
  const handleOpenChamber = (doc: { name: string }) => {
    setActiveDoc(doc);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-8">
      {/* ... your existing list rendering ... */}
      
      {/* Example of how to trigger the drawer for each file */}
      <button 
        onClick={() => handleOpenChamber({ name: 'Pitch Deck 2024.pdf' })}
        className="text-blue-600 hover:underline"
      >
        Open Chamber
      </button>

      {/* Put the drawer component here at the bottom */}
      <DocumentChamberDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        document={activeDoc} 
      />
    </div>
  );
};
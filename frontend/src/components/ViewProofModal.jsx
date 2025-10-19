import React, { useState, useEffect } from 'react';

export default function ViewProofModal({ isOpen, onClose, proofURL }) {
  const [fileType, setFileType] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (proofURL) {
      const ext = proofURL.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        setFileType('image');
      } else if (ext === 'pdf') {
        setFileType('pdf');
      } else {
        setFileType('unknown');
      }
      setError(null);
    }
  }, [proofURL]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[90vw] h-[90vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#333D79]">Proof Document</h2>
          <div className="flex gap-4 items-center">
            <a
              href={proofURL}
              target="_blank"
              rel="noreferrer"
              className="text-[#333D79] hover:text-[#333D79]/80 text-sm"
            >
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
            >
              Close
            </button>
          </div>
        </div>

        {/* File Display */}
        <div className="flex-1 bg-gray-100 rounded overflow-auto flex items-center justify-center p-4 relative">
          {fileType === 'image' && (
            <img
              src={proofURL}
              alt="Proof Document"
              className="max-w-full max-h-full object-contain"
              onError={() => setError('Failed to load image')}
            />
          )}

          {fileType === 'pdf' && (
            <iframe
              src={proofURL}
              className="w-full h-full border-0 rounded"
              title="Proof PDF"
              onError={() => setError('Failed to load PDF')}
            />
          )}

          {fileType === 'unknown' && (
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                This file type may not be viewable directly in the browser.
              </p>
              <a
                href={proofURL}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-4 py-2 bg-[#333D79] text-white rounded hover:bg-[#333D79]/90"
              >
                Download File
              </a>
            </div>
          )}

          {error && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-red-500 bg-white py-2">
              {error}. Please try opening in a new tab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

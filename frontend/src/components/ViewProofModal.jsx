import React, { useState, useEffect } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ViewProofModal({ isOpen, onClose, proofURL }) {
  const [fileType, setFileType] = useState(null);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  const API_BASE = (import.meta?.env?.VITE_API_BASE_URL) || axios.defaults.baseURL || '';

  const buildCloudinaryDownloadUrl = (urlStr) => {
    try {
      const url = new URL(urlStr);
      // Cloudinary URLs typically contain /upload/ (or /raw/upload/)
      const segments = url.pathname.split('/');
      const uploadIdx = segments.findIndex(s => s === 'upload');
      if (uploadIdx !== -1) {
        // If fl_attachment already present, keep as-is
        if (!segments.includes('fl_attachment') && !segments.some(s => s.startsWith('fl_attachment:'))) {
          segments.splice(uploadIdx + 1, 0, 'fl_attachment');
          url.pathname = segments.join('/');
        }
        return url.toString();
      }
    } catch {}
    return urlStr;
  };

  const buildLocalDownloadUrl = (urlStr) => {
    try {
      const url = new URL(urlStr, window.location.origin);
      const parts = url.pathname.split('/');
      const uploadsIdx = parts.findIndex(p => p === 'uploads');
      if (uploadsIdx !== -1 && parts[uploadsIdx + 1]) {
        const filename = parts.slice(uploadsIdx + 1).join('/');
        const base = (API_BASE || '').replace(/\/$/, '');
        return `${base}/downloads/${encodeURIComponent(filename)}`;
      }
    } catch {}
    return urlStr;
  };

  const getDownloadUrl = () => {
    if (!proofURL) return '#';
    if (proofURL.includes('res.cloudinary.com')) {
      return buildCloudinaryDownloadUrl(proofURL);
    }
    if (proofURL.includes('/uploads/')) {
      return buildLocalDownloadUrl(proofURL);
    }
    return proofURL;
  };

  const triggerDownload = () => {
    const url = getDownloadUrl();
    const a = document.createElement('a');
    a.href = url;
    // download attribute helps for same-origin; Cloudinary will force attachment via fl_attachment
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    if (proofURL) {
      try {
        const url = new URL(proofURL, window.location.origin);
        const pathname = url.pathname || '';
        const last = pathname.split('/').pop() || '';
        const ext = (last.includes('.') ? last.split('.').pop() : '').toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          setFileType("image");
        } else if (ext === "pdf") {
          setFileType("pdf");
        } else {
          // Unknown extension; treat Cloudinary raw PDFs without extension as pdf if URL hints
          if (proofURL.includes("upload") && proofURL.toLowerCase().includes("pdf")) {
            setFileType("pdf");
          } else {
            setFileType("unknown");
          }
        }
      } catch {
        setFileType("unknown");
      }
      setError(null);
      setPageNumber(1);
      setNumPages(null);
    }
  }, [proofURL]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setError("Failed to load PDF in viewer.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-[#333D79]">
            Proof Document
          </h2>
          <div className="flex gap-3 items-center">
            <a
              href={proofURL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm bg-[#333D79] text-white rounded hover:bg-[#333D79]/90 transition-colors"
            >
              Open in New Tab
            </a>
            <button
              type="button"
              onClick={triggerDownload}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* File Display */}
        <div className="flex-1 bg-gray-50 overflow-auto min-h-0">
          <div className="w-full h-full flex flex-col items-center justify-start p-6">
            {fileType === "image" && (
              <img
                src={proofURL}
                alt="Proof Document"
                className="max-w-full h-auto shadow-lg rounded"
                onError={() => setError("Failed to load image")}
              />
            )}

            {fileType === "pdf" && !error && (
              <div className="w-full flex flex-col items-center">
                <div className="bg-white shadow-lg rounded mb-4">
                  <Document
                    file={{
                      url: proofURL,
                      httpHeaders: {
                        Accept: "application/pdf",
                      },
                    }}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex items-center justify-center p-8">
                        <div className="text-[#333D79]">Loading PDF...</div>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={Math.min(900, window.innerWidth - 150)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-sm"
                    />
                  </Document>
                </div>
                {numPages && (
                  <div className="flex justify-center items-center gap-4 p-3 bg-white rounded shadow-md sticky bottom-4">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber <= 1}
                      className="px-4 py-2 bg-[#333D79] text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#333D79]/90 transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="px-4 py-2 text-[#333D79] font-medium bg-gray-50 rounded">
                      Page {pageNumber} of {numPages}
                    </span>
                    <button
                      onClick={() =>
                        setPageNumber(Math.min(numPages, pageNumber + 1))
                      }
                      disabled={pageNumber >= numPages}
                      className="px-4 py-2 bg-[#333D79] text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#333D79]/90 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {fileType === "pdf" && error && (
              <div className="text-center p-8">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex gap-4 justify-center">
                  <a
                    href={proofURL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 bg-[#333D79] text-white rounded hover:bg-[#333D79]/90"
                  >
                    Open in New Tab
                  </a>
                  <button
                    type="button"
                    onClick={triggerDownload}
                    className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            {fileType === "unknown" && (
              <div className="text-center p-8">
                <p className="text-gray-600 mb-4">
                  This file type may not be viewable directly in the browser.
                </p>
                <button
                  type="button"
                  onClick={triggerDownload}
                  className="inline-block px-4 py-2 bg-[#333D79] text-white rounded hover:bg-[#333D79]/90"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

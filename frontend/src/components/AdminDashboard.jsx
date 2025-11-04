import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import ViewProofModal from "./ViewProofModal";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [activities, setActivities] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState("");

  const load = async () => {
    try {
  const res = await api.get("/api/mentor/activities");
      setActivities(res.data);
    } catch (err) {
      console.error("Error loading activities:", err);
      toast.error(err.response?.data?.message || "Failed to load activities");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    try {
  await api.post(`/api/mentor/verify/${id}`);
      toast.success("Approved");
      load();
    } catch (err) {
      console.error("Approve error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to approve activity");
    }
  };

  const reject = async (id) => {
    try {
  await api.post(`/api/mentor/reject/${id}`);
      toast.info("Rejected");
      load();
    } catch (err) {
      console.error("Reject error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to reject activity");
    }
  };

  const openModal = (proofURL) => {
    setSelectedProof(proofURL);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProof("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold text-[#333D79]">
  Mentor - All Activities
      </h1>
      <div className="mb-4">
        <Link
          to="/mentor/students"
          className="bg-[#333D79] text-white px-4 py-2 rounded hover:bg-[#333D79]/90"
        >
          View All Students
        </Link>
      </div>
      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="font-medium">
                {a.studentRollNo} — {a.category}/{a.subCategory}
              </div>
              <div
                className={`px-3 py-1 rounded text-sm font-medium ${
                  a.status === "Verified"
                    ? "bg-green-100 text-green-800"
                    : a.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {a.status}
              </div>
            </div>
            <div className="text-gray-600 text-sm mt-2">
              <span>Semester: {a.semester}</span>
              <span className="mx-2">•</span>
              <span>Points: {a.points}</span>
              {a.description && (
                <>
                  <span className="mx-2">•</span>
                  <span>{a.description}</span>
                </>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="bg-[#333D79] text-white px-3 py-1 rounded hover:bg-[#333D79]/90 text-sm"
                onClick={() => openModal(a.proofURL)}
              >
                View Proof
              </button>
              <button
                onClick={() => approve(a._id)}
                disabled={a.status === "Verified" || a.status === "Rejected"}
                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                  a.status === "Verified" || a.status === "Rejected"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {a.status === "Verified" ? "✓ Approved" : "Approve"}
              </button>
              <button
                onClick={() => reject(a._id)}
                disabled={a.status === "Verified" || a.status === "Rejected"}
                className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
                  a.status === "Verified" || a.status === "Rejected"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {a.status === "Rejected" ? "✗ Rejected" : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <ViewProofModal
        isOpen={modalOpen}
        onClose={closeModal}
        proofURL={selectedProof}
      />
    </div>
  );
}

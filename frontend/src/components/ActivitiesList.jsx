import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ViewProofModal from './ViewProofModal'

export default function ActivitiesList(){
  const [activities, setActivities] = useState([])
  const [selectedProof, setSelectedProof] = useState(null)

  const load = async ()=>{ const res = await axios.get('/api/activities/my'); setActivities(res.data); }

  useEffect(()=>{ load() },[])

  const deleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return
    try {
      await axios.delete(`/api/activities/${id}`)
      toast.success('Activity deleted successfully')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete activity')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold text-[#333D79]">My Activities</h1>
      <div className="space-y-3">
        {activities.map(a=> (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div className="text-[#333D79] font-medium">{a.category} / {a.subCategory}</div>
              <div className="font-medium text-gray-700">{a.status}</div>
            </div>
            <div className="mt-1 text-gray-700">
              <span className="font-medium">Semester:</span> {a.semester} — <span className="font-medium">Points:</span> {a.points}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className="inline-block px-4 py-2 bg-[#333D79] text-white rounded hover:bg-[#333D79]/90 transition-colors duration-200 text-sm font-medium"
                onClick={() => setSelectedProof(a.proofURL)}
              >
                View Proof
              </button>
              {a.status === 'Pending' && (
                <button
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                  onClick={() => deleteActivity(a._id)}
                >
                  Delete
                </button>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-2">{a.description}</div>
          </div>
        ))}
      </div>
      <ViewProofModal
        isOpen={!!selectedProof}
        onClose={() => setSelectedProof(null)}
        proofURL={selectedProof}
      />
    </div>
  )
}

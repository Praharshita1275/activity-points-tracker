import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ViewProofModal from './ViewProofModal'

export default function ActivitiesList(){
  const [activities, setActivities] = useState([])
  const [selectedProof, setSelectedProof] = useState(null)

  useEffect(()=>{ const load = async ()=>{ const res = await axios.get('/api/activities/my'); setActivities(res.data); } ; load() },[])

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
            <div className="mt-2">
              <button 
                className="inline-block px-4 py-2 bg-[#333D79] text-white rounded hover:bg-[#333D79]/90 transition-colors duration-200 text-sm font-medium" 
                onClick={() => setSelectedProof(a.proofURL)}
              >
                View Proof
              </button>
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

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ViewProofModal from './ViewProofModal'
import { Link } from 'react-router-dom'

export default function AdminDashboard(){
  const [activities, setActivities] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProof, setSelectedProof] = useState('')

  const load = async ()=>{
    const res = await axios.get('/api/admin/activities')
    setActivities(res.data)
  }

  useEffect(()=>{ load() },[])

  const approve = async (id)=>{ await axios.post(`/api/admin/verify/${id}`); toast.success('Approved'); load() }
  const reject = async (id)=>{ await axios.post(`/api/admin/reject/${id}`); toast.info('Rejected'); load() }

  const openModal = (proofURL) => {
    setSelectedProof(proofURL)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProof('')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold text-[#333D79]">Admin - All Activities</h1>
      <div className="mb-4">
        <Link to="/admin/students" className="bg-[#333D79] text-white px-4 py-2 rounded hover:bg-[#333D79]/90">
          View All Students
        </Link>
      </div>
      <div className="space-y-3">
        {activities.map(a=> (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between"><div>{a.studentRollNo} — {a.category}/{a.subCategory}</div><div>{a.status}</div></div>
            <div>Semester: {a.semester} — Points: {a.points}</div>
            <div className="mt-2"><button className="bg-[#333D79] text-white px-3 py-1 rounded hover:bg-[#333D79]/90" onClick={() => openModal(a.proofURL)}>View Proof</button></div>
            <div className="mt-2 space-x-2">
              <button onClick={()=>approve(a._id)} className="bg-[#333D79] text-white px-3 py-1 rounded hover:bg-[#333D79]/90">Approve</button>
              <button onClick={()=>reject(a._id)} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
      <ViewProofModal isOpen={modalOpen} onClose={closeModal} proofURL={selectedProof} />
    </div>
  )
}

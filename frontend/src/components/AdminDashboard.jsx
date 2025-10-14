import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function AdminDashboard(){
  const [activities, setActivities] = useState([])

  const load = async ()=>{
    const res = await axios.get('/api/admin/activities')
    setActivities(res.data)
  }

  useEffect(()=>{ load() },[])

  const verify = async (id)=>{ await axios.post(`/api/admin/verify/${id}`); toast.success('Verified'); load() }
  const reject = async (id)=>{ await axios.post(`/api/admin/reject/${id}`); toast.info('Rejected'); load() }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin - All Activities</h1>
      <div className="space-y-3">
        {activities.map(a=> (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between"><div>{a.studentRollNo} — {a.category}/{a.subCategory}</div><div>{a.status}</div></div>
            <div>Semester: {a.semester} — Points: {a.points}</div>
            <div className="mt-2"><a className="text-blue-600" href={a.proofURL} target="_blank" rel="noreferrer">View Proof</a></div>
            <div className="mt-2 space-x-2">
              <button onClick={()=>verify(a._id)} className="bg-green-600 text-white px-3 py-1 rounded">Verify</button>
              <button onClick={()=>reject(a._id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ActivitiesList(){
  const [activities, setActivities] = useState([])

  useEffect(()=>{ const load = async ()=>{ const res = await axios.get('/api/activities/my'); setActivities(res.data); } ; load() },[])

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">My Activities</h1>
      <div className="space-y-3">
        {activities.map(a=> (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between"><div>{a.category} / {a.subCategory}</div><div>{a.status}</div></div>
            <div>Semester: {a.semester} — Points: {a.points}</div>
            <div className="mt-2"><a className="text-blue-600" href={a.proofURL} target="_blank" rel="noreferrer">View Proof</a></div>
            <div className="text-sm text-gray-600 mt-2">{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

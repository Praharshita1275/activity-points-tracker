import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard(){
  const [activities, setActivities] = useState([])
  const [summary, setSummary] = useState({ sem: {}, total: 0 })
  const [loading, setLoading] = useState(false)

  const load = async ()=>{
    setLoading(true)
    try{
      // fetch activities
      const res = await axios.get('/api/activities/my')
      setActivities(res.data)
      // fetch profile for totals
      const prof = await axios.get('/api/auth/me')
      const sem = prof.data.semesterPoints || { sem1:0,sem2:0,sem3:0,sem4:0,sem5:0,sem6:0,sem7:0,sem8:0 }
      const total = prof.data.totalPoints || 0
      setSummary({ sem, total })
    }catch(err){
      console.error('Dashboard load error', err)
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Student Dashboard</h1>
        <div>
          <button onClick={load} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Refresh</button>
          {loading && <span className="text-sm text-gray-600">Loading...</span>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({length:8}).map((_,i)=>{
          const key = `sem${i+1}`
          return (
            <div key={i} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Semester {i+1}</h3>
              <p className="text-2xl">{summary.sem ? (summary.sem[key] || 0) : 0}</p>
            </div>
          )
        })}
      </div>
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg">Total Points</h2>
        <p className="text-3xl">{summary.total || 0}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl mb-2">Recent Activities</h2>
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
    </div>
  )
}

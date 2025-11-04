import React, { useEffect, useState } from 'react'
import api from '../api'

export default function AdminStudents(){
  const [students, setStudents] = useState([])

  const load = async ()=>{
    const res = await api.get('/api/mentor/students')
    setStudents(res.data)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
  <h1 className="text-2xl mb-4 font-semibold text-[#333D79]">Mentor - Student Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Points</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 1</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 2</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 3</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 4</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 5</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 6</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 7</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem 8</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(s => (
              <tr key={s.rollNo}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{s.rollNo}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.department}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.totalPoints}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem1 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem2 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem3 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem4 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem5 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem6 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem7 || 0}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{s.semesterPoints?.sem8 || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

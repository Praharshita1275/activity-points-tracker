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
    <div className="p-6 students-print-area">
      {/* Inline print stylesheet to hide everything except heading & table */}
      <style>{`@media print {
        nav, .print-hide, .no-print { display: none !important; }
        body { background: #fff !important; }
        .students-print-area { padding:0 !important; }
        .students-print-area * { box-shadow:none !important; }
        .students-print-area .actions { display:none !important; }
        /* Compact spacing */
        .students-print-area th, .students-print-area td { padding:3px 6px !important; }
        .students-print-area table { table-layout: auto !important; width:100% !important; border-collapse:collapse; }
        /* Allow controlled wrapping only when too long */
        .students-print-area td.roll-cell, .students-print-area td.name-cell { white-space: nowrap; }
        .students-print-area td.name-cell span { display:inline-block; max-width:160px; white-space:normal; overflow-wrap:break-word; }
      }`}</style>
      <div className="flex items-center justify-between mb-4 actions">
        <h1 className="text-2xl font-semibold text-[#333D79]">Mentor - Student Details</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>
      {/* Heading duplicated outside actions so it prints */}
      <h1 className="text-2xl font-semibold text-[#333D79] print-only" style={{ display:'none' }}>Mentor - Student Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded print-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S1</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S2</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S3</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S4</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S5</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S6</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S7</th>
              <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">S8</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(s => (
              <tr key={s.rollNo}>
                <td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900 roll-cell">{s.rollNo}</td>
                <td className="px-2 py-1 text-xs text-gray-700 name-cell"><span>{s.name}</span></td>
                <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{s.department}</td>
                <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{s.totalPoints}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem1 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem2 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem3 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem4 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem5 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem6 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem7 || 0}</td>
                <td className="px-1 py-1 whitespace-nowrap text-[10px] text-gray-500">{s.semesterPoints?.sem8 || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

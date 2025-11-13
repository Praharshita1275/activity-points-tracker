import React, { useEffect, useState } from 'react'
import api from '../api'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// A4 print layout for mentor student list
export default function MentorStudentsPrint(){
  const [students, setStudents] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/mentor/students')
        setStudents(res.data || [])
      } catch (e) {
        console.error('Failed to load students for print', e)
      }
    }
    load()
  }, [])

  return (
    <div className="print-root">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          .no-print { display: none !important; }
          .page { page-break-after: always; }
        }
        .sheet {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
        }
        .sheet-inner {
          padding: 8mm 10mm;
        }
        .title { font-size: 18px; font-weight: 600; color: #333D79; margin-bottom: 8mm; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e5e7eb; padding: 6px 8px; font-size: 12px; }
        th { background: #f9fafb; text-transform: uppercase; letter-spacing: .02em; font-weight: 600; color: #6b7280; }
      `}</style>

      <div className="no-print" style={{ padding: '12px', background: '#FAEBEF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="title">Mentor - Student Details (Printable A4)</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 text-sm bg-[#333D79] text-white rounded hover:bg-[#333D79]/90"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={() => {
                const doc = new jsPDF({ format: 'a4', unit: 'mm' })
                doc.setFontSize(14)
                doc.text('Mentor - Student Details', 10, 12)
                const head = [['Roll No','Name','Department','Total Points','Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8']]
                const body = students.map(s => [
                  s.rollNo,
                  s.name || '',
                  s.department || '',
                  s.totalPoints ?? 0,
                  s.semesterPoints?.sem1 ?? 0,
                  s.semesterPoints?.sem2 ?? 0,
                  s.semesterPoints?.sem3 ?? 0,
                  s.semesterPoints?.sem4 ?? 0,
                  s.semesterPoints?.sem5 ?? 0,
                  s.semesterPoints?.sem6 ?? 0,
                  s.semesterPoints?.sem7 ?? 0,
                  s.semesterPoints?.sem8 ?? 0,
                ])
                autoTable(doc, {
                  head,
                  body,
                  startY: 16,
                  styles: { fontSize: 9, cellPadding: 2 },
                  headStyles: { fillColor: [249, 250, 251], textColor: [107, 114, 128] },
                })
                doc.save('mentor-students.pdf')
              }}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Download PDF
            </button>
            <a href="/mentor" className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">Back to Mentor</a>
          </div>
        </div>
      </div>

      <div className="sheet">
        <div className="sheet-inner">
          <div style={{ marginBottom: '8mm' }}>
            <div className="title">Mentor - Student Details</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Total Points</th>
                <th>Sem 1</th>
                <th>Sem 2</th>
                <th>Sem 3</th>
                <th>Sem 4</th>
                <th>Sem 5</th>
                <th>Sem 6</th>
                <th>Sem 7</th>
                <th>Sem 8</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.rollNo}>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.totalPoints}</td>
                  <td>{s.semesterPoints?.sem1 || 0}</td>
                  <td>{s.semesterPoints?.sem2 || 0}</td>
                  <td>{s.semesterPoints?.sem3 || 0}</td>
                  <td>{s.semesterPoints?.sem4 || 0}</td>
                  <td>{s.semesterPoints?.sem5 || 0}</td>
                  <td>{s.semesterPoints?.sem6 || 0}</td>
                  <td>{s.semesterPoints?.sem7 || 0}</td>
                  <td>{s.semesterPoints?.sem8 || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

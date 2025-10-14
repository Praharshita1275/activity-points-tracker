import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function UploadActivity(){
  const [pointsRef, setPointsRef] = useState([])
  const [form, setForm] = useState({ category: '', subCategory: '', semester: 1, description: '' })
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(()=>{ const load = async ()=>{ const res = await axios.get('/api/points'); setPointsRef(res.data); } ; load() },[])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try{
      const fd = new FormData()
      fd.append('category', form.category)
      fd.append('subCategory', form.subCategory)
      fd.append('semester', form.semester)
      fd.append('description', form.description)
      if (file) fd.append('proof', file)
      await axios.post('/api/activities/upload', fd, { headers: {'Content-Type':'multipart/form-data'} })
      toast.success('Uploaded. Waiting for verification')
      // reset form
      setForm({ category: '', subCategory: '', semester: 1, description: '' })
      setFile(null)
    }catch(err){ console.error(err); toast.error(err.response?.data?.message || 'Upload failed') }
    finally{ setIsSubmitting(false) }
  }

  const subCats = pointsRef.filter(p=>p.category===form.category).map(p=>p.subCategory)

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Upload Activity</h2>
      <form onSubmit={handleSubmit}>
        <select className="w-full p-2 border mb-2" value={form.category} onChange={e=>setForm({...form, category: e.target.value, subCategory: ''})}>
          <option value="">Select Category</option>
          {[...new Set(pointsRef.map(p=>p.category))].map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="w-full p-2 border mb-2" value={form.subCategory} onChange={e=>setForm({...form, subCategory: e.target.value})}>
          <option value="">Select Sub Category</option>
          {subCats.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="w-full p-2 border mb-2" value={form.semester} onChange={e=>setForm({...form, semester: e.target.value})}>
          {Array.from({length:8}).map((_,i)=><option key={i} value={i+1}>Semester {i+1}</option>)}
        </select>
        <input className="w-full p-2 border mb-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
        <input className="w-full p-2 border mb-2" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>setFile(e.target.files[0])} />
        <button disabled={isSubmitting} className={`w-full ${isSubmitting? 'bg-gray-400':'bg-blue-600'} text-white p-2 rounded`}>
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

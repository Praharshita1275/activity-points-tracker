import React, { useEffect, useMemo, useState } from "react";
import api, { apiMultipart } from "../api";
import { toast } from "react-toastify";

export default function UploadActivity() {
  // Fallback categories if backend has no PointsReference seeded
  const FALLBACK_POINTS = useMemo(() => (
    [
      { category: 'MOOCs', subCategory: '12 weeks', defaultPoints: 0 },
      { category: 'MOOCs', subCategory: '8 weeks', defaultPoints: 0 },
      { category: 'Tech Fest / R&D Day / Freshers Workshop / Conference / Hackathons etc.', subCategory: 'Organizer', defaultPoints: 0 },
      { category: 'Tech Fest / R&D Day / Freshers Workshop / Conference / Hackathons etc.', subCategory: 'Participant', defaultPoints: 0 },
      { category: 'Rural Reporting', subCategory: 'General', defaultPoints: 0 },
      { category: 'Harithaharam / Plantation', subCategory: 'General', defaultPoints: 0 },
      { category: 'Participation in Relief Camps', subCategory: 'General', defaultPoints: 0 },
      { category: 'Participation in Debate / Group Discussion / Technical Quiz', subCategory: 'General', defaultPoints: 0 },
      { category: 'Publication in Newspaper, Magazines (Institution Level / Article / Internet)', subCategory: 'Editor', defaultPoints: 0 },
      { category: 'Publication in Newspaper, Magazines (Institution Level / Article / Internet)', subCategory: 'Writer', defaultPoints: 0 },
      { category: 'Publication in Newspaper, Magazine & Blogs', subCategory: 'General', defaultPoints: 0 },
      { category: 'Research Publication', subCategory: 'General', defaultPoints: 0 },
      { category: 'Innovation Projects', subCategory: 'General', defaultPoints: 0 },
      { category: 'Blood Donation / NSS or NCC Participation', subCategory: 'General', defaultPoints: 0 },
      { category: 'Blood Donation / NSS Camp Organization', subCategory: 'General', defaultPoints: 0 },
      { category: 'Participation in Sports / Games', subCategory: 'College', defaultPoints: 0 },
      { category: 'Participation in Sports / Games', subCategory: 'University', defaultPoints: 0 },
      { category: 'Participation in Sports / Games', subCategory: 'Region', defaultPoints: 0 },
      { category: 'Participation in Sports / Games', subCategory: 'State', defaultPoints: 0 },
      { category: 'Participation in Sports / Games', subCategory: 'National', defaultPoints: 0 },
      { category: 'Cultural Programme', subCategory: 'General', defaultPoints: 0 },
      { category: 'Member of Professional Society', subCategory: 'General', defaultPoints: 0 },
      { category: 'Student Chapter / Club', subCategory: 'General', defaultPoints: 0 },
      { category: 'Relevant Industry Visit & Report', subCategory: 'General', defaultPoints: 0 },
      { category: 'Photography Activity in Different Clubs', subCategory: 'General', defaultPoints: 0 },
      { category: 'Participation in Yoga Camp', subCategory: 'General', defaultPoints: 0 },
      { category: 'Self-Entrepreneurship Program', subCategory: 'General', defaultPoints: 0 },
      { category: 'Adventure Sports with Certification', subCategory: 'General', defaultPoints: 0 },
      { category: 'Training to Under-Privileged Physically Challenged', subCategory: 'General', defaultPoints: 0 },
      { category: 'Community Service & Allied Activities', subCategory: 'General', defaultPoints: 0 },
      { category: 'Class Representative', subCategory: 'General', defaultPoints: 0 },
    ]
  ), []);

  const [pointsRef, setPointsRef] = useState([]);
  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    semester: 1,
    description: "",
    durationWeeks: "",
    points: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/points");
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          setPointsRef(data);
        } else {
          setPointsRef(FALLBACK_POINTS);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        // Use fallback so the user can proceed
        setPointsRef(FALLBACK_POINTS);
        toast.info("Loaded default categories");
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!form.category) return toast.error("Please select Activity Category");
    if (!form.subCategory) return toast.error("Please select Sub Category");
    if (!form.semester) return toast.error("Please select Semester");
    if (!form.description.trim()) return toast.error("Please enter Activity Title / Description");
  if (!form.durationWeeks || Number(form.durationWeeks) <= 0) return toast.error("Please enter duration in weeks (> 0)");
    if (form.points === "" || isNaN(Number(form.points))) return toast.error("Please enter Points (number)");
    if (!file) return toast.error("Please upload proof (PDF/Image)");

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("category", form.category);
      fd.append("subCategory", form.subCategory);
      fd.append("semester", form.semester);
      fd.append("description", form.description);
  fd.append("durationWeeks", form.durationWeeks);
      fd.append("points", form.points);
      fd.append("proof", file);

      console.log(
        "Uploading file:",
        file.name,
        "Type:",
        file.type,
        "Size:",
        file.size
      );

      await apiMultipart.post("/api/activities/upload", fd);
      toast.success("Successfully uploaded! Waiting for verification");
      // reset form
  setForm({ category: "", subCategory: "", semester: 1, description: "", durationWeeks: "", points: "" });
      setFile(null);
      setFileName("");
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = useMemo(() => {
    return [...new Set(pointsRef.map((p) => p.category))];
  }, [pointsRef]);

  const subCats = useMemo(() => {
    const subs = pointsRef
      .filter((p) => p.category === form.category)
      .map((p) => p.subCategory);
    return [...new Set(subs)];
  }, [pointsRef, form.category]);

  // Auto-select 'General' subcategory if it's the only option
  useEffect(() => {
    if (form.category) {
      if (subCats.length === 1 && subCats[0] === 'General') {
        setForm((f) => ({ ...f, subCategory: 'General' }));
      } else if (!subCats.includes(form.subCategory)) {
        setForm((f) => ({ ...f, subCategory: '' }));
      }
    } else {
      setForm((f) => ({ ...f, subCategory: '' }));
    }
  }, [form.category, subCats]);

  // Auto-fill points when subcategory is chosen
  useEffect(() => {
    if (form.category && form.subCategory) {
      const ref = pointsRef.find(
        (p) => p.category === form.category && p.subCategory === form.subCategory
      );
      if (ref) {
        setForm((f) => ({ ...f, points: String(ref.defaultPoints ?? 0) }));
      }
    }
  }, [form.category, form.subCategory, pointsRef]);

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold text-[#333D79]">Upload Activity</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium mb-1 text-gray-700">Activity Category</label>
        <select
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {form.category && !(subCats.length === 1 && subCats[0] === 'General') && (
          <>
            <label className="block text-sm font-medium mb-1 text-gray-700">Sub Category</label>
            <select
              className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
            >
              <option value="">Select Sub Category</option>
              {subCats.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}

        <label className="block text-sm font-medium mb-1 text-gray-700">Semester</label>
        <select
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <option key={i} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1 text-gray-700">Activity Title / Description</label>
        <input
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
          placeholder="Enter brief title or description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Duration (weeks)</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
              placeholder="e.g., 8"
              value={form.durationWeeks}
              onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Points Earned</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
              placeholder="Auto-filled; you can edit"
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
            />
          </div>
        </div>

        <label className="block text-sm font-medium mb-1 text-gray-700">Proof Upload (PDF/Image)</label>
        <input
          className="w-full p-2 border rounded mb-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-[#333D79] file:text-white hover:file:bg-[#333D79]/90"
          type="file"
          accept=".pdf,application/pdf,image/*"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            console.log("File selected:", selectedFile);

            if (selectedFile) {
              console.log("File details:", {
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
              });

              // Allow PDFs and images
              const isPDF =
                selectedFile.type === "application/pdf" ||
                selectedFile.name.toLowerCase().endsWith(".pdf");
              const isImage = selectedFile.type.startsWith('image/');

              if (!isPDF && !isImage) {
                toast.error("Please select a PDF or Image file");
                e.target.value = "";
                setFile(null);
                setFileName("");
              } else {
                setFile(selectedFile);
                setFileName(selectedFile.name);
                toast.info(`File selected: ${selectedFile.name}`);
              }
            } else {
              setFile(null);
              setFileName("");
            }
          }}
        />
        {fileName && (
          <p className="text-sm text-green-600 mb-2">✓ Selected: {fileName}</p>
        )}
        <p className="text-sm text-gray-600 mb-4">Note: PDF or image formats are accepted as proof.</p>
        <button
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting ? "bg-gray-400" : "bg-[#333D79] hover:bg-[#333D79]/90"
          } text-white p-2 rounded font-medium transition-colors duration-200`}
        >
          {isSubmitting ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

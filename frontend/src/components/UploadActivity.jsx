import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UploadActivity() {
  const [pointsRef, setPointsRef] = useState([]);
  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    semester: 1,
    description: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/points");
      setPointsRef(res.data);
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate that file is selected
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("category", form.category);
      fd.append("subCategory", form.subCategory);
      fd.append("semester", form.semester);
      fd.append("description", form.description);
      fd.append("proof", file);

      console.log(
        "Uploading file:",
        file.name,
        "Type:",
        file.type,
        "Size:",
        file.size
      );

      await axios.post("/api/activities/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Successfully uploaded! Waiting for verification");
      // reset form
      setForm({ category: "", subCategory: "", semester: 1, description: "" });
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

  const subCats = pointsRef
    .filter((p) => p.category === form.category)
    .map((p) => p.subCategory);

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold text-[#333D79]">
        Upload Activity
      </h2>
      <form onSubmit={handleSubmit}>
        <select
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value, subCategory: "" })
          }
        >
          <option value="">Select Category</option>
          {[...new Set(pointsRef.map((p) => p.category))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
          value={form.subCategory}
          onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
        >
          <option value="">Select Sub Category</option>
          {subCats.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
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
        <input
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#333D79] focus:border-[#333D79]"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-[#333D79] file:text-white hover:file:bg-[#333D79]/90"
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            console.log("File selected:", selectedFile);

            if (selectedFile) {
              console.log("File details:", {
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
              });

              // Check if it's a PDF
              const isPDF =
                selectedFile.type === "application/pdf" ||
                selectedFile.name.toLowerCase().endsWith(".pdf");

              if (!isPDF) {
                toast.error("Please select a PDF file only");
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
        <p className="text-sm text-gray-600 mb-4">
          Note: Only PDF files are accepted for proof documents.
        </p>
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

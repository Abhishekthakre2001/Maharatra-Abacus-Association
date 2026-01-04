import React, { useState } from "react";
import Papa from "papaparse";

export default function CsvQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Handle CSV file
  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formatted = result.data.map((q, index) => ({
          id: index + 1,
          ...q,
        }));
        setQuestions(formatted);
      },
    });
  };

  // File input
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      parseCSV(e.target.files[0]);
    }
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      parseCSV(e.dataTransfer.files[0]);
    }
  };

  // Update question
  const handleChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  // Delete question
  const handleDelete = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  console.log("questions",questions)

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center mb-6
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p className="text-lg font-semibold mb-2">
          Drag & Drop CSV File Here
        </p>
        <p className="text-gray-500 mb-4">Preview, Update & Delete Questions</p>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csvUpload"
        />
        <label
          htmlFor="csvUpload"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Browse CSV
        </label>
      </div>

      {/* Preview Table */}
      {questions.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="border px-3 py-2">Question</th>
                <th className="border px-3 py-2">Option 1</th>
                <th className="border px-3 py-2">Option 2</th>
                <th className="border px-3 py-2">Option 3</th>
                <th className="border px-3 py-2">Option 4</th>
                <th className="border px-3 py-2">Answer</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="text-sm">
                  {["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Option"].map((field) => (
                    <td key={field} className="border px-2 py-1">
                      <input
                        value={q[field]}
                        onChange={(e) =>
                          handleChange(q.id, field, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

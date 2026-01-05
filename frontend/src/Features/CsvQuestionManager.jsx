import React, { useState } from "react";
import Papa from "papaparse";
import Button from "../UI/Button";
import InputField from "../UI/InputField";
import Modal from "../UI/Modal";
import { Trash, Plus } from "lucide-react";

export default function CsvQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("");
  const [set, setSet] = useState("");
  const [time, setTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    Question: "",
    "Option 1": "",
    "Option 2": "",
    "Option 3": "",
    "Option 4": "",
    "Correct Option": ""
  });

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

  // Filter questions based on search
  const filteredQuestions = questions.filter((q) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      q.Question?.toLowerCase().includes(searchLower) ||
      q["Option 1"]?.toLowerCase().includes(searchLower) ||
      q["Option 2"]?.toLowerCase().includes(searchLower) ||
      q["Option 3"]?.toLowerCase().includes(searchLower) ||
      q["Option 4"]?.toLowerCase().includes(searchLower) ||
      q["Correct Option"]?.toLowerCase().includes(searchLower)
    );
  });

  // Handle manual question addition
  const handleAddQuestion = () => {
    if (newQuestion.Question && newQuestion["Correct Option"]) {
      const newQ = {
        id: questions.length + 1,
        ...newQuestion
      };
      setQuestions([...questions, newQ]);
      setNewQuestion({
        Question: "",
        "Option 1": "",
        "Option 2": "",
        "Option 3": "",
        "Option 4": "",
        "Correct Option": ""
      });
      setIsModalOpen(false);
    }
  };

  console.log("questions",questions)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Input Fields Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <InputField
              label="Level"
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Enter level"
            />
          </div>
          <div>
            <InputField
              label="Set"
              type="number"
              value={set}
              onChange={(e) => setSet(e.target.value)}
              placeholder="Enter set"
            />
          </div>
          <div>
            <InputField
              label="Time (minutes)"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Enter time"
            />
          </div>
          <div>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              icon={Plus}
              className="w-full mb-6"
            >
              Add Question
            </Button>
          </div>
        </div>
      </div>

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
        <div className="bg-white rounded-xl shadow-lg">
          {/* Search Bar and Count Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-md">
                  {questions.length}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Questions Loaded</h2>
                  <p className="text-sm text-gray-600">
                    {filteredQuestions.length === questions.length
                      ? `Total ${questions.length} questions`
                      : `Showing ${filteredQuestions.length} of ${questions.length} questions`}
                  </p>
                </div>
              </div>
              
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search questions, options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[300px]">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                    Option 1
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                    Option 2
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                    Option 3
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                    Option 4
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q, index) => (
                    <tr key={q.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {index + 1}
                      </td>
                      {["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Option"].map((field) => (
                        <td key={field} className="px-4 py-3">
                          <input
                            value={q[field] || ""}
                            onChange={(e) =>
                              handleChange(q.id, field, e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={`Enter ${field.toLowerCase()}`}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <Button
                          onClick={() => handleDelete(q.id)}
                          variant="danger"
                          size="sm"
                          icon={Trash}
                        >
                         
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">No questions found</p>
                        <p className="text-sm">Try adjusting your search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Question"
        width="max-w-3xl"
      >
        <div className="space-y-4">
          <InputField
            label="Question"
            value={newQuestion.Question}
            onChange={(e) => setNewQuestion({ ...newQuestion, Question: e.target.value })}
            placeholder="Enter your question"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Option 1"
              value={newQuestion["Option 1"]}
              onChange={(e) => setNewQuestion({ ...newQuestion, "Option 1": e.target.value })}
              placeholder="Enter option 1"
            />
            <InputField
              label="Option 2"
              value={newQuestion["Option 2"]}
              onChange={(e) => setNewQuestion({ ...newQuestion, "Option 2": e.target.value })}
              placeholder="Enter option 2"
            />
            <InputField
              label="Option 3"
              value={newQuestion["Option 3"]}
              onChange={(e) => setNewQuestion({ ...newQuestion, "Option 3": e.target.value })}
              placeholder="Enter option 3"
            />
            <InputField
              label="Option 4"
              value={newQuestion["Option 4"]}
              onChange={(e) => setNewQuestion({ ...newQuestion, "Option 4": e.target.value })}
              placeholder="Enter option 4"
            />
          </div>

          <InputField
            label="Correct Option"
            value={newQuestion["Correct Option"]}
            onChange={(e) => setNewQuestion({ ...newQuestion, "Correct Option": e.target.value })}
            placeholder="Enter correct option (1, 2, 3, or 4)"
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddQuestion}
              variant="primary"
            >
              Add Question
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

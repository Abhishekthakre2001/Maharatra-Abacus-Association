import React, { useState } from "react";
import Papa from "papaparse";
import Button from "../UI/Button";
import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";
import Modal from "../UI/Modal";
import MessageModal from "../utils/MessageModal";
import { Trash, Plus } from "lucide-react";
import questionApi from "../api/questionApi";
import setsApi from "../api/SetsApi";
import { useEffect } from "react";
import levelApi from "../api/LevelApi";

export default function CsvQuestionManager() {
  const [modal, setModal] = useState({ open: false, type: "success", title: "", message: "" });
  const [adminId, setAdminId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null);
  const [questions, setQuestions] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("");
  const [set, setSet] = useState("");
  const [time, setTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newQuestion, setNewQuestion] = useState({
    Question: "",
    "Option 1": "",
    "Option 2": "",
    "Option 3": "",
    "Option 4": "",
    "Correct Option": ""
  });
  const [availableSets, setAvailableSets] = useState([]);
  const [modalSetId, setModalSetId] = useState("");
  const [isMockSet, setIsMockSet] = useState(0); // default No
  const [availableLevels, setAvailableLevels] = useState([]);
  const [modalLevelId, setModalLevelId] = useState("");

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
  const handleAddQuestion = async () => {
    if (newQuestion.Question && newQuestion["Correct Option"]) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        question: newQuestion.Question,
        option1: newQuestion["Option 1"] || "",
        option2: newQuestion["Option 2"] || "",
        option3: newQuestion["Option 3"] || "",
        option4: newQuestion["Option 4"] || "",
        correctoption: Number(newQuestion["Correct Option"]),
        level: Number(modalLevelId) || Number(level) || null,
        set_id: String(modalSetId) || String(set) || null,
        ismockset: isMockSet,
        createdby: user.id
      };

      try {
        const res = await questionApi.create(payload);
        const newQ = {
          id: res.data && res.data.id ? res.data.id : questions.length + 1,
          Question: newQuestion.Question,
          "Option 1": newQuestion["Option 1"],
          "Option 2": newQuestion["Option 2"],
          "Option 3": newQuestion["Option 3"],
          "Option 4": newQuestion["Option 4"],
          "Correct Option": newQuestion["Correct Option"]
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
      } catch (err) {
        console.error(err);
        setModal({ open: true, type: "error", title: "Error", message: "Failed to save question." });
      }
    }
  };

  useEffect(() => {
    // load sets for modal selector
    let mounted = true;
    setsApi.getbyadminid(adminId)
      .then(res => {
        if (!mounted) return;
        const payload = res && res.data !== undefined ? res.data : res;
        setAvailableSets(Array.isArray(payload) ? payload : []);
      })
      .catch(err => console.error('Failed to load sets', err));
    // load levels for modal selector
    levelApi.getbyadminid(adminId)
      .then(res => {
        if (!mounted) return;
        const payload = res && res.data !== undefined ? res.data : res;
        setAvailableLevels(Array.isArray(payload) ? payload : []);
      })
      .catch(err => console.error('Failed to load levels', err));
    return () => { mounted = false; };
  }, []);

  const handleTimeChange = (e) => {
    let v = e.target.value.replace(/[^0-9]/g, '');

    if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2);
    if (v.length >= 6) v = v.slice(0, 5) + ':' + v.slice(5, 7);

    setTime(v);
  };


  // Submit all data: log payload and validate required fields
  const handleSubmit = async () => {
    const payload = {
      level: Number(level),
      set: set,
      time: time,
      ismockset: isMockSet,
    };

    console.log("Submitting payload:", { ...payload, questions });

    // Validation
    if (!questions || questions.length < 1) {
      setModal({ open: true, type: "error", title: "Error", message: "Please upload or add at least one question before submitting." });
      return;
    }

    if (!level || !set || !time) {
      setModal({ open: true, type: "error", title: "Error", message: "Please fill Level, Set and Time before submitting." });
      return;
    }

    // Prepare questions for backend
    const mapped = questions.map((q) => ({
      question: q.Question ?? q.question ?? "",
      option1: q["Option 1"] ?? q.option1 ?? "",
      option2: q["Option 2"] ?? q.option2 ?? "",
      option3: q["Option 3"] ?? q.option3 ?? "",
      option4: q["Option 4"] ?? q.option4 ?? "",
      correctoption: Number(q["Correct Option"] ?? q.correctoption ?? 0)
    }));

    setIsUploading(true);
    setUploadProgress(0);
    setLevel("");
    setSet("");
    setTime("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const body = { ...payload, questions: mapped, createdby: user.id || 3 };
      const response = await questionApi.bulkSave(body, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      console.log("Bulk save response:", response.data);
      setModal({ open: true, type: "success", title: "Success", message: "Questions saved successfully." });
      // Optionally clear questions after save
      setQuestions([]);
      
    } catch (err) {
      console.error(err);
      setModal({ open: true, type: "error", title: "Error", message: "Failed to save questions." });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  console.log("isMockSet", isMockSet)

  return (
    <>
      <MessageModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 sticky top-0 ">
        {/* Input Fields Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <SelectField
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              options={availableLevels.map(lv => ({
                value: lv.level,
                label: lv.level || lv.name || `Level ${lv.id}`
              }))}
              placeholder="-- Select Level --"
            />
            <SelectField
              label="Set"
              value={set}
              onChange={(e) => setSet(e.target.value)}
              options={availableSets.map(s => ({
                value: s.set_name,
                label: s.set_name || s.name || `Set ${s.id}`
              }))}
              placeholder="-- Select Set --"
            />
            <div>
              <InputField
                label="Time (HH:MM:SS)"
                type="text"
                value={time}
                onChange={handleTimeChange}
                placeholder="HH:MM:SS"
                inputMode="numeric"
                pattern="^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mock Set
              </label>

              <select
                value={isMockSet}
                onChange={(e) => setIsMockSet(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select --</option>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 mt-6">
            <Button
              onClick={handleSubmit}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Save Questions
            </Button>

            {questions.length === 0 && (
              <Button
                onClick={() => { setModalSetId(set); setModalLevelId(level); setIsModalOpen(true); }}
                variant="primary"
                icon={Plus}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Add Question Manually in Set
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2"
                  style={{ width: `${uploadProgress}%`, transition: 'width 200ms' }}
                />
              </div>
              <div className="text-sm text-gray-600 text-right mt-1">{uploadProgress}%</div>
            </div>
          )}
        </div>

        {/* Upload Box (hidden once CSV/questions are loaded) */}
        {questions.length === 0 && (
          <div
            className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center mb-6
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <p className="text-lg font-semibold mb-2">Drag & Drop CSV File Here</p>
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
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Browse CSV
            </label>
          </div>
        )}

        {/* Preview Table */}
        {questions.length > 0 && (
          <div className="sticky top-0 bg-white rounded-xl shadow-lg">
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
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[300px] bg-gray-50">
                      Question
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] bg-gray-50">
                      Option 1
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] bg-gray-50">
                      Option 2
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] bg-gray-50">
                      Option 3
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] bg-gray-50">
                      Option 4
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                      Answer
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
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

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set</label>
                <select
                  value={modalSetId}
                  onChange={(e) => setModalSetId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select set (or leave to use top Set) --</option>
                  {availableSets.map((s) => (
                    <option key={s.id} value={s.set_name}>{s.set_name || s.name || `Set ${s.id}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={modalLevelId}
                  onChange={(e) => setModalLevelId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select level (or leave to use top Level) --</option>
                  {availableLevels.map((lv) => (
                    <option key={lv.id} value={lv.level}>{lv.level || lv.name || `Level ${lv.id}`}</option>
                  ))}
                </select>
              </div>
            </div> */}

            <div className="flex justify-end gap-3 my-8">
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
    </>
  );
}

import React, { useState } from "react";
import * as XLSX from "xlsx";
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
import sampleExcel from "../assets/Questions_Bank.xls?url";
// import sampleExcel from "../assets/Questions_Bank.csv?url";


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
  const [ButtonLoading, setButtonLoading] = useState(false);
  const [iserror, setiserror] = useState(false);


  const parseFile = async (file) => {
    const fileName = file.name.toLowerCase();

    // CSV
    if (fileName.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => validateAndSetQuestions(result.data),
        error: () => {
          setModal({
            open: true,
            type: "error",
            title: "File Error",
            message: "Unable to read CSV file."
          });
        }
      });
      return;
    }

    // Fake .xls / text-based file -> parse as TSV
    if (fileName.endsWith(".xls")) {
      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          const text = e.target.result;

          Papa.parse(text, {
            header: true,
            delimiter: "\t",
            skipEmptyLines: true,
            complete: (result) => validateAndSetQuestions(result.data),
            error: () => {
              setModal({
                open: true,
                type: "error",
                title: "File Error",
                message: "Unable to read XLS file."
              });
            }
          });
        };

        // 👇 IMPORTANT: use correct encoding
        reader.readAsText(file, "ISO-8859-1");
        // try "UTF-8" if file is saved as UTF-8

      } catch (error) {
        setModal({
          open: true,
          type: "error",
          title: "File Error",
          message: "Unable to read XLS file."
        });
      }
      return;
    }

    // Real Excel
    if (fileName.endsWith(".xlsx")) {
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
          raw: false
        });

        validateAndSetQuestions(jsonData);
      } catch (error) {
        setModal({
          open: true,
          type: "error",
          title: "File Error",
          message: "Unable to read Excel file."
        });
      }
      return;
    }

    setModal({
      open: true,
      type: "error",
      title: "Unsupported File",
      message: "Please upload only CSV, XLSX or XLS file."
    });
  };

  const validateAndSetQuestions = (data) => {
    const normalizedData = data.map((row) => ({
      Question: row["Question"]?.toString().trim() || "",
      "Option 1": row["Option 1"]?.toString().trim() || "",
      "Option 2": row["Option 2"]?.toString().trim() || "",
      "Option 3": row["Option 3"]?.toString().trim() || "",
      "Option 4": row["Option 4"]?.toString().trim() || "",
      "Correct Option": row["Correct Option"]?.toString().trim() || "",
    }));

    const invalidRow = normalizedData.find((q) => {
      const val = Number(q["Correct Option"]);
      return ![1, 2, 3, 4].includes(val);
    });

    if (invalidRow) {
      setQuestions([]);
      setModal({
        open: true,
        type: "error",
        title: "Invalid File Format",
        message:
          "Correct Option must be only 1, 2, 3 or 4. Please download and use the sample file."
      });
      return;
    }

    const formatted = normalizedData.map((q, index) => ({
      id: index + 1,
      ...q,
    }));

    setQuestions(formatted);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      parseFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  // Update question
  const handleChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );

    // clear error for this field
    setErrors((prev) => ({
      ...prev,
      [field]: ""
    }));
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



  const handleAddQuestion = async () => {
    let newErrors = {};

    // 🔴 VALIDATIONS FIRST
    if (!level) newErrors.level = "Please select level";
    if (!set) newErrors.set = "Please select set";

    if (!newQuestion.Question?.trim())
      newErrors.Question = "Question is required";

    if (!newQuestion["Option 1"]?.trim())
      newErrors["Option 1"] = "Option 1 is required";

    if (!newQuestion["Option 2"]?.trim())
      newErrors["Option 2"] = "Option 2 is required";

    if (!newQuestion["Option 3"]?.trim())
      newErrors["Option 3"] = "Option 3 is required";

    if (!newQuestion["Option 4"]?.trim())
      newErrors["Option 4"] = "Option 4 is required";

    const correctOption = Number(newQuestion["Correct Option"]);
    if (![1, 2, 3, 4].includes(correctOption))
      newErrors["Correct Option"] = "Correct option must be between 1 and 4";

    // ❌ STOP if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModal({
        open: true,
        type: "error",
        title: "Validation Error",
        message: "All fields are mandatory"
      });
      return; // 🚫 DO NOT set loading
    }

    // ✅ NOW start loading
    setButtonLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) throw new Error("User not logged in");

      const payload = {
        question: newQuestion.Question.trim(),
        option1: newQuestion["Option 1"].trim(),
        option2: newQuestion["Option 2"].trim(),
        option3: newQuestion["Option 3"].trim(),
        option4: newQuestion["Option 4"].trim(),
        correctoption: correctOption,
        level: Number(modalLevelId) || Number(level),
        set_id: String(modalSetId) || String(set),
        ismockset: isMockSet,
        createdby: user.id
      };

      await questionApi.create(payload);

      // ✅ RESET FORM
      setNewQuestion({
        Question: "",
        "Option 1": "",
        "Option 2": "",
        "Option 3": "",
        "Option 4": "",
        "Correct Option": ""
      });

      setSet("");
      setLevel("");
      setErrors({});
      setIsModalOpen(false);

      setModal({
        open: true,
        type: "success",
        title: "Success",
        message: "Question added successfully"
      });
      setiserror(false);
    } catch (err) {
      console.error(err);
      setiserror(true);
      setIsModalOpen(false);

      const msg =
        err?.response?.data?.error ===
          "set_time not found for given level and set_id"
          ? `${level}${set} Question Set is not available`
          : "Failed to add question";

      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: msg
      });
    } finally {
      // ✅ ALWAYS stop loading
      setButtonLoading(false);
      // setiserror(false);
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
    setErrors(prev => ({ ...prev, time: "" }));
  };

  const handleTimeBlur = () => {
    if (!time) return;

    const parts = time.split(":").map(p => p.padEnd(2, "0"));

    let hh = parts[0] || "00";
    let mm = parts[1] || "00";
    let ss = parts[2] || "00";

    // clamp values safely
    hh = Math.min(23, Number(hh)).toString().padStart(2, "0");
    mm = Math.min(59, Number(mm)).toString().padStart(2, "0");
    ss = Math.min(59, Number(ss)).toString().padStart(2, "0");

    setTime(`${hh}:${mm}:${ss}`);
  };


  // Submit all data: log payload and validate required fields
  const handleSubmit = async () => {
    setButtonLoading(true);
    let newErrors = {};

    if (!level) {
      newErrors.level = "Please select level";
    }

    if (!set) {
      newErrors.set = "Please select set";
    }

    if (!time) {
      newErrors.time = "Please enter time";
    }


    const payload = {
      level: Number(level),
      set: set,
      time: time,
      ismockset: isMockSet,
    };

    console.log("Submitting payload:", { ...payload, questions });

    // Validation
    if (!questions || questions.length < 1) {
      setButtonLoading(false);
      setModal({ open: true, type: "error", title: "Error", message: "Please upload or add at least one question before submitting." });
      return;
    }


    // ❌ If validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModal({
        open: true,
        type: "error",
        title: "Error",
        message: "Please fix validation errors"
      });
      setButtonLoading(false);
      return;
    }

    // ✅ Clear errors if valid
    setErrors({});

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
      setButtonLoading(false);
      setModal({ open: true, type: "success", title: "Success", message: "Questions saved successfully." });
      // Optionally clear questions after save
      setQuestions([]);

    } catch (err) {
      if (err.response?.status === 409) {
        setModal({
          open: true,
          type: "error",
          title: "Set Already Exists",
          message: err.response.data.message
        });
      } else {
        setModal({
          open: true,
          type: "error",
          title: "Error",
          message: "Failed to upload questions"
        });
      }
    }
    finally {
      setIsUploading(false);
      setButtonLoading(false);
      setUploadProgress(0);
    }
  };

  console.log("isMockSet", isMockSet)
  const yesNoOptions = [
    { id: 1, name: "Yes" },
    { id: 0, name: "No" }
  ];

  const [errors, setErrors] = useState({});

  console.log("iserror", iserror)


  return (
    <>
      <MessageModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => {
          setModal(prev => ({ ...prev, open: false }));

          if (iserror) {
            setIsModalOpen(true);
          }
        }}

      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 sticky top-0 ">
        {/* Input Fields Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            <SelectField
              label="Level"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setErrors(prev => ({ ...prev, level: "" })); // clear error
              }}
              options={availableLevels.map(lv => ({
                value: lv.level,
                label: lv.level_name && lv.level_name.trim() !== ""
                  ? `${lv.level} - ${lv.level_name}`
                  : `${lv.level}`
              }))}
              placeholder="-- Select Level --"
              error={errors.level}
              showError={!!errors.level}
            />
            <SelectField
              label="Set"
              value={set}
              onChange={(e) => {
                setSet(e.target.value);
                setErrors(prev => ({ ...prev, set: "" })); // ✅ clear error
              }}
              options={availableSets.map(s => ({
                value: s.set_name,
                label: s.set_name || s.name || `Set ${s.id}`
              }))}
              placeholder="-- Select Set --"
              error={errors.set} showError={!!errors.set}
            />
            <div>
              <InputField
                label="Time (HH:MM:SS)"
                type="text"
                value={time}
                onChange={handleTimeChange}
                onBlur={handleTimeBlur}
                placeholder="HH:MM:SS"
                inputMode="numeric"
                pattern="^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$"
                error={errors.time}
                showError={!!errors.time}
              />
            </div>

            <div>

              <SelectField
                label="Is Test Set"
                value={isMockSet}
                onChange={(e) => setIsMockSet(Number(e.target.value))}
                options={yesNoOptions.map(opt => ({
                  value: opt.id,
                  label: opt.name
                }))}
                placeholder="-- Select --"
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 mt-6">
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={ButtonLoading}
              className="w-full sm:w-auto"
            >
              {ButtonLoading ? "Saveing..." : "Save Questions"}

            </Button>

            {questions.length === 0 && (
              <Button
                onClick={() => { setModalSetId(set); setModalLevelId(level); setIsModalOpen(true); setSet(""); setTime(""); setLevel(""); }}
                variant="primary"
                icon={Plus}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Add Question Manually in Set
              </Button>
            )}

            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = sampleExcel;
                link.download = "Questions_Bank.xls";
                link.click();
              }}
              variant="primary"
            >
              Download Sample Excel Sheet
            </Button>

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


          {/* Upload Box (hidden once CSV/questions are loaded) */}
          {questions.length === 0 && (
            <div
              className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center mb-6 mt-6
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <p className="text-lg font-semibold mb-2">Drag & Drop Excel File Here</p>
              <p className="text-gray-500 mb-4">Preview, Update & Delete Questions</p>

              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
                id="csvUpload"
              />
              <label
                htmlFor="csvUpload"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Browse File
              </label>
            </div>
          )}
        </div>

        {/* Preview Table */}
        {questions.length > 0 && (
          <div className="sticky top-15 bg-white rounded-xl shadow-lg">
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
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
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


      </div>

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



          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SelectField
              label="Correct Option"
              value={newQuestion["Correct Option"]}
              onChange={e => setNewQuestion({ ...newQuestion, "Correct Option": e.target.value })}
              options={[
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
                { value: "4", label: "Option 4" }
              ]}
              placeholder="Select correct option"
              required
            />

            <SelectField
              label="Level"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setErrors(prev => ({ ...prev, level: "" })); // ✅ clear error
              }}
              options={availableLevels.map(lv => ({
                value: lv.level,
                label: lv.level || lv.name || `Level ${lv.id}`
              }))}
              placeholder="-- Select Level --"
              error={errors.level} showError={!!errors.level}
            />
            <SelectField
              label="Set"
              value={set}
              onChange={(e) => {
                setSet(e.target.value);
                setErrors(prev => ({ ...prev, set: "" })); // ✅ clear error
              }}
              options={availableSets.map(s => ({
                value: s.set_name,
                label: s.set_name || s.name || `Set ${s.id}`
              }))}
              placeholder="-- Select Set --"
              error={errors.set} showError={!!errors.set}
            />


            <div>

            </div>

          </div>


          <div className="flex justify-end gap-3 my-8">
            <Button
              onClick={() => {
                setIsModalOpen(false); setSet(""); setTime(""); setLevel(""); setErrors({}); setNewQuestion({
                  Question: "",
                  "Option 1": "",
                  "Option 2": "",
                  "Option 3": "",
                  "Option 4": "",
                  "Correct Option": ""
                });
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={ButtonLoading}
              onClick={() => {
                handleAddQuestion();
              }}
              variant="primary"
            >
              {ButtonLoading ? "Saveing..." : "Add Question"}
            </Button>

          </div>
        </div>
      </Modal>
    </>
  );
}

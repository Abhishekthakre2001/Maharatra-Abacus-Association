import React, { useState } from 'react'
import Sidebar from "../Components/Sidebar";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import DataTable from '../UI/DataTable';
import UpdateQuestionModal from '../Components/UpdateQuestionModal';
import DeleteConfirmModal from '../UI/DeleteConfirmModal';
import AppBar from '../UI/AppBar';
import { useFetchData } from '../hooks/useFetchData';
import questionApi from '../api/questionApi';
import { useEffect } from 'react';
import Modal from '../UI/Modal';
import InputField from '../UI/InputField';
import MessageModal from "../utils/MessageModal";

export default function QuestionPage() {
    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: ""
    });

    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("");
    const [isMockSet, setIsMockSet] = useState(0); // default No
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null);
    // Modal states
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [QuestionsView, setQuestionsView] = useState(false);
    const [Paperset, SetPaperset] = useState("")
    const user = JSON.parse(localStorage.getItem("user"));
    // const { data: fetchedQuestions, reload } = useFetchData(questionApi.getbyadmin(adminId));
    const { data: fetchedQuestions, reload } = useFetchData(() => questionApi.getbyadmin(adminId));

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        setQuestions(fetchedQuestions || []);
    }, [fetchedQuestions]);

    const handleUpdate = (row) => {

        console.log("row", row);
        setTime(row?.total_time);
        setIsMockSet(row?.ismock)
        setSelectedQuestion(row);
        if (QuestionsView) {
            setShowUpdateModal(true);
        } else {
            setOpen(true);
        }


    };

    const handleDelete = (row) => {
        console.log("row", row)
        setSelectedQuestion(row);
        setShowDeleteModal(true);
    };

    const handleview = (row) => {
        console.log("row", row.questions);
        SetPaperset(row.paper_set);
        setQuestions(row.questions);
        setQuestionsView(true);
    }
    console.log("Question View", QuestionsView)

    const handleUpdateSubmit = async (updatedQuestion) => {
        console.log("selectedQuestion", selectedQuestion)
        setLoading(true);
        try {
            const id = updatedQuestion.id;
            // Send update to API (strip id)
            // const payload = { ...updatedQuestion };
            const payload = {
                level: selectedQuestion.level,
                set: selectedQuestion.set,
                total_time: time,
                isMockSet: isMockSet
            }
            delete payload.id;
            // await questionApi.update(id, payload);
            await questionApi.updateSet(payload);
            await reload();
            setModal({ open: true, type: "success", title: "Success", message: "Update successfully." });
            setQuestionsView(false);
            reload();
            setShowUpdateModal(false);
            setOpen(false);
            setSelectedQuestion(null);
            console.log('Updated question:', updatedQuestion);
        } catch (err) {
            console.error('Update failed', err);
            setModal({ open: true, type: "error", title: "Success", message: "Not Update successfully." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        console.log("selectedQuestion", selectedQuestion)
        setLoading(true);
        try {
            if (QuestionsView) {
                await questionApi.remove(selectedQuestion.id);
            } else {
                await questionApi.removeSet(selectedQuestion.level, selectedQuestion.set);
            }

            await reload();
            setQuestionsView(false);
            setShowDeleteModal(false);
            setSelectedQuestion(null);
            console.log('Deleted question:', selectedQuestion);
        } catch (err) {
            console.error('Delete failed', err);
            alert('Failed to delete question');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        console.log('Create new question');
        // Add your create logic here
        alert('Create new question functionality');
    };

    const setcolumns = [
        // {
        //     key: 'id',
        //     label: '#',
        //     render: (value) => <span className="font-semibold text-gray-700">#{value}</span>
        // },
        {
            key: 'paper_set',
            label: 'Paper Set',
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${value === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                    value === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'ismock',
            label: 'Is Mock Test',
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${value === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                    value === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {value === 1 ? "Yes" : "No"}
                </span>
            )
        },
        {
            key: 'total_time',
            label: 'Time ( HH:MM:SS )',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 1 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'total_question',
            label: 'Total Questions',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 2 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'level',
            label: 'Level',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 3 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'set',
            label: 'Set',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 4 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },


    ]

    const questionscolumn = [
        // {
        //     key: 'id',
        //     label: '#',
        //     render: (value) => <span className="font-semibold text-gray-700">#{value}</span>
        // },
        {
            key: 'question',
            label: 'Question',
            render: (value) => <span className="font-medium text-gray-800">{value}</span>
        },
        {
            key: 'option1',
            label: 'Option A',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 1 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'option2',
            label: 'Option B',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 2 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'option3',
            label: 'Option C',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 3 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'option4',
            label: 'Option D',
            render: (value, row) => (
                <span className={`${Number(row.correctoption) === 4 ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'correctoption',
            label: 'Correct Answer',
            render: (value, row) => {
                const map = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
                const v = Number(row.correctoption || value) || 0;
                return (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        Option {map[v] || '-'}
                    </span>
                );
            }
        },
        {
            key: 'level',
            label: 'Paper Set',
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${value === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                    value === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {Paperset}
                </span>
            )
        },

    ]

    const handleTimeChange = (e) => {
        let v = e.target.value.replace(/[^0-9]/g, '');

        if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2);
        if (v.length >= 6) v = v.slice(0, 5) + ':' + v.slice(5, 7);

        setTime(v);
    };

    console.log("time", time)

    return (
        <>
            <MessageModal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, open: false })}
            />
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`transition-all duration-500 ${isCollapsed ? "md:ml-20" : "md:ml-64"} px-2 md:px-8 py-6 mb-12`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <AppBar
                        title="Student Management"
                        subtitle="Manage and view all students"
                    />

                    <div className="mt-8">
                        {/* Back Button for QuestionsView */}
                        {QuestionsView && (
                            <button
                                className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition"
                                onClick={() => {
                                    setQuestionsView(false);
                                    reload();
                                }}
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        )}
                        {/* Questions DataTable */}
                        <DataTable
                            title="Questions Bank"
                            data={questions}
                            columns={QuestionsView ? questionscolumn : setcolumns}
                            showActions={true}
                            onEdit={handleUpdate}
                            onDelete={handleDelete}
                            onView={QuestionsView ? false : handleview}
                            onCreate={() => navigate('/add-question')}
                            searchable={true}
                            pagination={true}
                        />
                    </div>

                </div>
            </main>

            {/* Update Question Modal */}
            <UpdateQuestionModal
                open={showUpdateModal}
                onClose={() => {
                    setShowUpdateModal(false);
                    setSelectedQuestion(null);
                }}
                onUpdate={handleUpdateSubmit}
                question={selectedQuestion}
                loading={loading}
            />

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedQuestion(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Question"
                message={`Are you sure you want to delete the question: "${selectedQuestion?.question}"? This action cannot be undone.`}
                loading={loading}
            />

            {/* update set model */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Update set Time"
                width="max-w-md"
            >
                {/* Input 1 */}
                <div className="mb-4">
                    <InputField
                        label="Time (HH:MM:SS)"
                        type="text"
                        value={time}
                        onChange={handleTimeChange}
                        placeholder="HH:MM:SS"
                        inputMode="numeric"
                    />
                </div>

                {/* Input 1 */}
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




                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleUpdateSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </Modal>
        </>
    )
}

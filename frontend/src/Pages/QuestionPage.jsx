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

export default function QuestionPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null);
    // Modal states
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    // const { data: fetchedQuestions, reload } = useFetchData(questionApi.getbyadmin(adminId));
    const { data: fetchedQuestions, reload } = useFetchData(() => questionApi.getbyadmin(adminId));

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        setQuestions(fetchedQuestions || []);
    }, [fetchedQuestions]);

    const handleUpdate = (row) => {
        setSelectedQuestion(row);
        setShowUpdateModal(true);
    };

    const handleDelete = (row) => {
        console.log("row", row)
        setSelectedQuestion(row);
        setShowDeleteModal(true);
    };

    const handleUpdateSubmit = async (updatedQuestion) => {
        setLoading(true);
        try {
            const id = updatedQuestion.id;
            // Send update to API (strip id)
            const payload = { ...updatedQuestion };
            delete payload.id;
            await questionApi.update(id, payload);
            await reload();
            setShowUpdateModal(false);
            setSelectedQuestion(null);
            console.log('Updated question:', updatedQuestion);
        } catch (err) {
            console.error('Update failed', err);
            alert('Failed to update question');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        console.log("selectedQuestion", selectedQuestion)
        setLoading(true);
        try {
            await questionApi.removeSet(selectedQuestion.level, selectedQuestion.set);
            await reload();
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
        {
            key: 'id',
            label: '#',
            render: (value) => <span className="font-semibold text-gray-700">#{value}</span>
        },
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
        {
            key: 'id',
            label: '#',
            render: (value) => <span className="font-semibold text-gray-700">#{value}</span>
        },
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
            label: 'Level',
            render: (value) => (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${value === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                    value === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    {value}
                </span>
            )
        },

    ]

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`transition-all duration-500 ${isCollapsed ? "md:ml-20" : "md:ml-64"} px-2 md:px-8 py-6 mb-12`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <AppBar
                        title="Student Management"
                        subtitle="Manage and view all students"
                    />

                    <div className="mt-8">
                        {/* Questions DataTable */}
                        <DataTable
                            title="Questions Bank"
                            data={questions}
                            columns={setcolumns}
                            showActions={true}
                            onEdit={handleUpdate}
                            onDelete={handleDelete}
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
        </>
    )
}

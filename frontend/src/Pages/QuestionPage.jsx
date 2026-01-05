import React, { useState } from 'react'
import Sidebar from "../Components/Sidebar";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import DataTable from '../UI/DataTable';
import UpdateQuestionModal from '../Components/UpdateQuestionModal';
import DeleteConfirmModal from '../UI/DeleteConfirmModal';
import AppBar from '../UI/AppBar';

export default function QuestionPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    // Modal states
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dummy questions data
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: 'What is 15 + 27?',
            option1: '40',
            option2: '42',
            option3: '45',
            option4: '38',
            correctAnswer: 'option2',
            level: 'Basic',
            category: 'Addition'
        },
        {
            id: 2,
            question: 'Calculate: 128 - 56',
            option1: '72',
            option2: '68',
            option3: '74',
            option4: '70',
            correctAnswer: 'option1',
            level: 'Intermediate',
            category: 'Subtraction'
        },
        {
            id: 3,
            question: 'What is 12 × 8?',
            option1: '84',
            option2: '92',
            option3: '96',
            option4: '88',
            correctAnswer: 'option3',
            level: 'Basic',
            category: 'Multiplication'
        },
        {
            id: 4,
            question: 'Solve: 144 ÷ 12',
            option1: '10',
            option2: '11',
            option3: '12',
            option4: '14',
            correctAnswer: 'option3',
            level: 'Intermediate',
            category: 'Division'
        },
        {
            id: 5,
            question: 'What is the square of 15?',
            option1: '225',
            option2: '215',
            option3: '235',
            option4: '205',
            correctAnswer: 'option1',
            level: 'Advanced',
            category: 'Algebra'
        }
    ]);

    const handleUpdate = (row) => {
        setSelectedQuestion(row);
        setShowUpdateModal(true);
    };

    const handleDelete = (row) => {
        setSelectedQuestion(row);
        setShowDeleteModal(true);
    };

    const handleUpdateSubmit = (updatedQuestion) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setQuestions(questions.map(q =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            ));
            setLoading(false);
            setShowUpdateModal(false);
            setSelectedQuestion(null);
            console.log('Updated question:', updatedQuestion);
        }, 1000);
    };

    const handleDeleteConfirm = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setQuestions(questions.filter(q => q.id !== selectedQuestion.id));
            setLoading(false);
            setShowDeleteModal(false);
            setSelectedQuestion(null);
            console.log('Deleted question:', selectedQuestion);
        }, 1000);
    };

    const handleCreate = () => {
        console.log('Create new question');
        // Add your create logic here
        alert('Create new question functionality');
    };

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


                    {/* Questions DataTable */}
                    <DataTable
                        title="Questions Bank"

                        data={questions}
                        columns={[
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
                                    <span className={`${row.correctAnswer === 'option1' ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                        {value}
                                    </span>
                                )
                            },
                            {
                                key: 'option2',
                                label: 'Option B',
                                render: (value, row) => (
                                    <span className={`${row.correctAnswer === 'option2' ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                        {value}
                                    </span>
                                )
                            },
                            {
                                key: 'option3',
                                label: 'Option C',
                                render: (value, row) => (
                                    <span className={`${row.correctAnswer === 'option3' ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                        {value}
                                    </span>
                                )
                            },
                            {
                                key: 'option4',
                                label: 'Option D',
                                render: (value, row) => (
                                    <span className={`${row.correctAnswer === 'option4' ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                        {value}
                                    </span>
                                )
                            },
                            {
                                key: 'correctAnswer',
                                label: 'Correct Answer',
                                render: (value, row) => {
                                    const optionMap = {
                                        'option1': 'A',
                                        'option2': 'B',
                                        'option3': 'C',
                                        'option4': 'D'
                                    };
                                    return (
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                            Option {optionMap[value]}
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

                        ]}
                        showActions={true}
                        onEdit={handleUpdate}
                        onDelete={handleDelete}
                        onCreate={() => navigate('/add-question')}
                        searchable={true}
                        pagination={true}
                    />
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

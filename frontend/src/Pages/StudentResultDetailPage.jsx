import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import DataTable from '../UI/DataTable';
import { ArrowLeft, Calendar, User, Award, TrendingUp } from 'lucide-react';

export default function StudentResultDetailPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // Dummy student data (same as in Result.jsx)
    const students = [
        {
            id: 1,
            name: 'Aarav Sharma',
            totalExams: 8,
            averageScore: 92,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', timeTaken: '45 min', totalTime: '60 min', marks: 95, level: 'Advanced' },
                { name: 'Science - Quarter 1', date: '2025-09-20', timeTaken: '52 min', totalTime: '60 min', marks: 88, level: 'Intermediate' },
                { name: 'English - Quarter 1', date: '2025-09-25', timeTaken: '48 min', totalTime: '60 min', marks: 90, level: 'Advanced' },
                { name: 'Math - Quarter 2', date: '2025-11-10', timeTaken: '43 min', totalTime: '60 min', marks: 94, level: 'Advanced' },
                { name: 'Science - Quarter 2', date: '2025-11-15', timeTaken: '47 min', totalTime: '60 min', marks: 92, level: 'Advanced' },
                { name: 'English - Quarter 2', date: '2025-11-20', timeTaken: '50 min', totalTime: '60 min', marks: 89, level: 'Intermediate' },
                { name: 'Math - Final', date: '2025-12-10', timeTaken: '44 min', totalTime: '60 min', marks: 96, level: 'Advanced' },
                { name: 'Science - Final', date: '2025-12-15', timeTaken: '46 min', totalTime: '60 min', marks: 93, level: 'Advanced' }
            ]
        },
        {
            id: 2,
            name: 'Priya Patel',
            totalExams: 7,
            averageScore: 87,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', timeTaken: '55 min', totalTime: '60 min', marks: 85, level: 'Intermediate' },
                { name: 'Science - Quarter 1', date: '2025-09-20', timeTaken: '48 min', totalTime: '60 min', marks: 90, level: 'Advanced' },
                { name: 'English - Quarter 1', date: '2025-09-25', timeTaken: '50 min', totalTime: '60 min', marks: 88, level: 'Intermediate' },
                { name: 'Math - Quarter 2', date: '2025-11-10', timeTaken: '54 min', totalTime: '60 min', marks: 86, level: 'Intermediate' },
                { name: 'Science - Quarter 2', date: '2025-11-15', timeTaken: '49 min', totalTime: '60 min', marks: 89, level: 'Advanced' },
                { name: 'English - Quarter 2', date: '2025-11-20', timeTaken: '56 min', totalTime: '60 min', marks: 84, level: 'Intermediate' },
                { name: 'Math - Final', date: '2025-12-10', timeTaken: '53 min', totalTime: '60 min', marks: 87, level: 'Intermediate' }
            ]
        },
        {
            id: 3,
            name: 'Rohan Kumar',
            totalExams: 9,
            averageScore: 78,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', timeTaken: '58 min', totalTime: '60 min', marks: 75, level: 'Basic' },
                { name: 'Science - Quarter 1', date: '2025-09-20', timeTaken: '52 min', totalTime: '60 min', marks: 80, level: 'Intermediate' },
                { name: 'English - Quarter 1', date: '2025-09-25', timeTaken: '55 min', totalTime: '60 min', marks: 78, level: 'Basic' },
                { name: 'Math - Quarter 2', date: '2025-11-10', timeTaken: '57 min', totalTime: '60 min', marks: 76, level: 'Basic' },
                { name: 'Science - Quarter 2', date: '2025-11-15', timeTaken: '51 min', totalTime: '60 min', marks: 82, level: 'Intermediate' },
                { name: 'English - Quarter 2', date: '2025-11-20', timeTaken: '54 min', totalTime: '60 min', marks: 79, level: 'Intermediate' },
                { name: 'Math - Mid Term', date: '2025-10-10', timeTaken: '59 min', totalTime: '60 min', marks: 74, level: 'Basic' },
                { name: 'Math - Final', date: '2025-12-10', timeTaken: '56 min', totalTime: '60 min', marks: 77, level: 'Basic' },
                { name: 'Science - Final', date: '2025-12-15', timeTaken: '53 min', totalTime: '60 min', marks: 81, level: 'Intermediate' }
            ]
        },
        {
            id: 4,
            name: 'Ananya Singh',
            totalExams: 6,
            averageScore: 95,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', timeTaken: '40 min', totalTime: '60 min', marks: 98, level: 'Advanced' },
                { name: 'Science - Quarter 1', date: '2025-09-20', timeTaken: '42 min', totalTime: '60 min', marks: 96, level: 'Advanced' },
                { name: 'English - Quarter 1', date: '2025-09-25', timeTaken: '44 min', totalTime: '60 min', marks: 94, level: 'Advanced' },
                { name: 'Math - Quarter 2', date: '2025-11-10', timeTaken: '41 min', totalTime: '60 min', marks: 97, level: 'Advanced' },
                { name: 'Science - Quarter 2', date: '2025-11-15', timeTaken: '43 min', totalTime: '60 min', marks: 93, level: 'Advanced' },
                { name: 'English - Quarter 2', date: '2025-11-20', timeTaken: '45 min', totalTime: '60 min', marks: 92, level: 'Advanced' }
            ]
        },
        {
            id: 5,
            name: 'Kabir Mehta',
            totalExams: 8,
            averageScore: 81,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', timeTaken: '57 min', totalTime: '60 min', marks: 78, level: 'Basic' },
                { name: 'Science - Quarter 1', date: '2025-09-20', timeTaken: '50 min', totalTime: '60 min', marks: 83, level: 'Intermediate' },
                { name: 'English - Quarter 1', date: '2025-09-25', timeTaken: '53 min', totalTime: '60 min', marks: 80, level: 'Intermediate' },
                { name: 'Math - Quarter 2', date: '2025-11-10', timeTaken: '54 min', totalTime: '60 min', marks: 82, level: 'Intermediate' },
                { name: 'Science - Quarter 2', date: '2025-11-15', timeTaken: '49 min', totalTime: '60 min', marks: 85, level: 'Intermediate' },
                { name: 'English - Quarter 2', date: '2025-11-20', timeTaken: '55 min', totalTime: '60 min', marks: 79, level: 'Basic' },
                { name: 'Math - Final', date: '2025-12-10', timeTaken: '52 min', totalTime: '60 min', marks: 81, level: 'Intermediate' },
                { name: 'Science - Final', date: '2025-12-15', timeTaken: '51 min', totalTime: '60 min', marks: 84, level: 'Intermediate' }
            ]
        }
    ];

    const student = students.find(s => s.id === parseInt(id));

    if (!student) {
        return (
            <>
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <main className={`transition-all duration-500 ${isCollapsed ? "md:ml-20" : "md:ml-64"} px-2 md:px-8 py-6 mb-12`}>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Not Found</h2>
                            <button
                                onClick={() => navigate('/results')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                            >
                                Back to Results
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`transition-all duration-500 ${isCollapsed ? "md:ml-20" : "md:ml-64"} px-2 md:px-8 py-6 mb-12`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header with Back Button */}
                    <div className="bg-gradient-to-r from-blue-600 to-[#110F12] bg-opacity-70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl mb-6">
                        <button
                            onClick={() => navigate('/results')}
                            className="flex items-center gap-2 text-white hover:text-blue-200 transition mb-4"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Results</span>
                        </button>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{student.name}</h1>
                            <p className="text-white text-sm md:text-lg">Detailed Exam Results</p>
                        </div>
                    </div>

                    {/* Student Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Student Name</p>
                                    <p className="font-semibold text-gray-800 text-lg">{student.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Award className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Exams</p>
                                    <p className="font-semibold text-gray-800 text-lg">{student.totalExams}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Average Score</p>
                                    <p className="font-semibold text-gray-800 text-lg">{student.averageScore}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exam Results Table using DataTable */}
                    <DataTable
                        title="Exam History"
                        data={student.exams}
                        columns={[
                            {
                                key: 'name',
                                label: 'Exam Name',
                                render: (value) => <span className="font-medium text-gray-800">{value}</span>
                            },
                            {
                                key: 'date',
                                label: 'Date',
                                isDate: true,
                                render: (value) => (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>{value}</span>
                                    </div>
                                )
                            },
                            {
                                key: 'timeTaken',
                                label: 'Time Taken',
                                render: (value) => <span className="text-blue-600 font-medium">{value}</span>
                            },
                            {
                                key: 'totalTime',
                                label: 'Total Time',
                                render: (value) => <span className="text-gray-600">{value}</span>
                            },
                            {
                                key: 'marks',
                                label: 'Marks',
                                render: (value) => (
                                    <span className={`font-semibold ${value >= 90 ? 'text-green-600' :
                                            value >= 75 ? 'text-blue-600' :
                                                value >= 60 ? 'text-yellow-600' :
                                                    'text-red-600'
                                        }`}>
                                        {value}%
                                    </span>
                                )
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
                            }
                        ]}
                        showActions={false}
                        searchable={true}
                        pagination={true}
                    />
                </div>
            </main>
        </>
    );
}

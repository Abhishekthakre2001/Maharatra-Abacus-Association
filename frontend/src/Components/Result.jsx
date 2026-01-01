import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import ReportCard from '../UI/ReportCard';

export default function Result() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Dummy student data
    const students = [
        {
            id: 1,
            name: 'Aarav Sharma',
            totalExams: 8,
            averageScore: 92,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', score: 95, grade: 'A+' },
                { name: 'Science - Quarter 1', date: '2025-09-20', score: 88, grade: 'A' },
                { name: 'English - Quarter 1', date: '2025-09-25', score: 90, grade: 'A' },
                { name: 'Math - Quarter 2', date: '2025-11-10', score: 94, grade: 'A+' },
                { name: 'Science - Quarter 2', date: '2025-11-15', score: 92, grade: 'A+' },
                { name: 'English - Quarter 2', date: '2025-11-20', score: 89, grade: 'A' },
                { name: 'Math - Final', date: '2025-12-10', score: 96, grade: 'A+' },
                { name: 'Science - Final', date: '2025-12-15', score: 93, grade: 'A+' }
            ]
        },
        {
            id: 2,
            name: 'Priya Patel',
            totalExams: 7,
            averageScore: 87,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', score: 85, grade: 'B+' },
                { name: 'Science - Quarter 1', date: '2025-09-20', score: 90, grade: 'A' },
                { name: 'English - Quarter 1', date: '2025-09-25', score: 88, grade: 'A' },
                { name: 'Math - Quarter 2', date: '2025-11-10', score: 86, grade: 'B+' },
                { name: 'Science - Quarter 2', date: '2025-11-15', score: 89, grade: 'A' },
                { name: 'English - Quarter 2', date: '2025-11-20', score: 84, grade: 'B' },
                { name: 'Math - Final', date: '2025-12-10', score: 87, grade: 'A' }
            ]
        },
        {
            id: 3,
            name: 'Rohan Kumar',
            totalExams: 9,
            averageScore: 78,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', score: 75, grade: 'C+' },
                { name: 'Science - Quarter 1', date: '2025-09-20', score: 80, grade: 'B' },
                { name: 'English - Quarter 1', date: '2025-09-25', score: 78, grade: 'C+' },
                { name: 'Math - Quarter 2', date: '2025-11-10', score: 76, grade: 'C+' },
                { name: 'Science - Quarter 2', date: '2025-11-15', score: 82, grade: 'B' },
                { name: 'English - Quarter 2', date: '2025-11-20', score: 79, grade: 'B' },
                { name: 'Math - Mid Term', date: '2025-10-10', score: 74, grade: 'C' },
                { name: 'Math - Final', date: '2025-12-10', score: 77, grade: 'C+' },
                { name: 'Science - Final', date: '2025-12-15', score: 81, grade: 'B' }
            ]
        },
        {
            id: 4,
            name: 'Ananya Singh',
            totalExams: 6,
            averageScore: 95,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', score: 98, grade: 'A+' },
                { name: 'Science - Quarter 1', date: '2025-09-20', score: 96, grade: 'A+' },
                { name: 'English - Quarter 1', date: '2025-09-25', score: 94, grade: 'A+' },
                { name: 'Math - Quarter 2', date: '2025-11-10', score: 97, grade: 'A+' },
                { name: 'Science - Quarter 2', date: '2025-11-15', score: 93, grade: 'A+' },
                { name: 'English - Quarter 2', date: '2025-11-20', score: 92, grade: 'A+' }
            ]
        },
        {
            id: 5,
            name: 'Kabir Mehta',
            totalExams: 8,
            averageScore: 81,
            exams: [
                { name: 'Math - Quarter 1', date: '2025-09-15', score: 78, grade: 'C+' },
                { name: 'Science - Quarter 1', date: '2025-09-20', score: 83, grade: 'B' },
                { name: 'English - Quarter 1', date: '2025-09-25', score: 80, grade: 'B' },
                { name: 'Math - Quarter 2', date: '2025-11-10', score: 82, grade: 'B' },
                { name: 'Science - Quarter 2', date: '2025-11-15', score: 85, grade: 'B+' },
                { name: 'English - Quarter 2', date: '2025-11-20', score: 79, grade: 'B' },
                { name: 'Math - Final', date: '2025-12-10', score: 81, grade: 'B' },
                { name: 'Science - Final', date: '2025-12-15', score: 84, grade: 'B' }
            ]
        }
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const gradients = [
        'from-blue-500 to-indigo-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-cyan-500 to-blue-600'
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
      bg-opacity-70
      backdrop-blur-xl
      shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Student Results</h1>
                        <p className="hidden md:block text-white text-sm md:text-lg">View student exam results and performance</p>
                        <div className='flex gap-4 my-4 md:my-0'>
                            {/* User Icon */}
                            <div className="md:hidden w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
                                {"AT"}
                            </div>
                            {/* Welcome Text */}
                            <div className="text-left md:hidden">
                                <p className="text-sm text-blue-200">Welcome Back,</p>
                                <p className="text-lg font-semibold text-white">
                                    User Name
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative my-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>

            {/* Student Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {filteredStudents.map((student, index) => (
                    <ReportCard
                        key={student.id}
                        title={student.name}
                        subtitle={`Total Exams: ${student.totalExams}`}
                        icon={User}
                        gradient={gradients[index % gradients.length]}
                        onClick={() => navigate(`/results/${student.id}`)}
                    />
                ))}
            </div>

            {/* No Results */}
            {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No students found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    )
}

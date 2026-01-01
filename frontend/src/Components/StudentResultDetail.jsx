// import React from 'react';
// import { X, Calendar, User, Award, TrendingUp } from 'lucide-react';


// export default function StudentResultDetail({ student, onClose }) {
//     if (!student) return null;

//     return (
//         <div className="max-w-7xl mx-auto">
//             <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
//       bg-opacity-70
//       backdrop-blur-xl
//       shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold mb-2">Student Management</h1>
//                         <p className="hidden md:block text-white text-sm md:text-lg">Manage and view all students</p>
//                         <div className='flex gap-4 my-4 md:my-0'>
//                             {/* User Icon */}
//                             <div className="md:hidden w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
//                                 {"AT"}
//                             </div>
//                             {/* Welcome Text */}
//                             <div className="text-left md:hidden">
//                                 <p className="text-sm text-blue-200">Welcome Back,</p>
//                                 <p className="text-lg font-semibold text-white">
//                                     User Name
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
//                     <div>
//                         <h2 className="text-2xl font-bold">{student.name}</h2>
//                         <p className="text-blue-100 text-sm mt-1">Detailed Exam Results</p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Student Info */}
//                 <div className="p-6 border-b">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                                 <User className="text-blue-600" size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Student Name</p>
//                                 <p className="font-semibold text-gray-800">{student.name}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                                 <Award className="text-green-600" size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Total Exams</p>
//                                 <p className="font-semibold text-gray-800">{student.totalExams}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
//                                 <TrendingUp className="text-purple-600" size={24} />
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Average Score</p>
//                                 <p className="font-semibold text-gray-800">{student.averageScore}%</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Exam Results Table */}
//                 <div className="p-6">
//                     <h3 className="text-xl font-bold text-gray-800 mb-4">Exam History</h3>
//                     <div className="overflow-x-auto">
//                         <table className="w-full border-collapse">
//                             <thead>
//                                 <tr className="bg-gray-100">
//                                     <th className="text-left p-3 font-semibold text-gray-700 rounded-tl-lg">#</th>
//                                     <th className="text-left p-3 font-semibold text-gray-700">Exam Name</th>
//                                     <th className="text-left p-3 font-semibold text-gray-700">Date</th>
//                                     <th className="text-left p-3 font-semibold text-gray-700">Score</th>
//                                     <th className="text-left p-3 font-semibold text-gray-700 rounded-tr-lg">Grade</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {student.exams.map((exam, index) => (
//                                     <tr key={index} className="border-b hover:bg-gray-50 transition">
//                                         <td className="p-3 text-gray-600">{index + 1}</td>
//                                         <td className="p-3 text-gray-800 font-medium">{exam.name}</td>
//                                         <td className="p-3 text-gray-600">
//                                             <div className="flex items-center gap-2">
//                                                 <Calendar size={16} className="text-gray-400" />
//                                                 {exam.date}
//                                             </div>
//                                         </td>
//                                         <td className="p-3">
//                                             <span className="font-semibold text-gray-800">{exam.score}%</span>
//                                         </td>
//                                         <td className="p-3">
//                                             <span className={`px-3 py-1 rounded-full text-sm font-semibold ${exam.grade === 'A+' || exam.grade === 'A' ? 'bg-green-100 text-green-700' :
//                                                 exam.grade === 'B+' || exam.grade === 'B' ? 'bg-blue-100 text-blue-700' :
//                                                     exam.grade === 'C+' || exam.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
//                                                         'bg-red-100 text-red-700'
//                                                 }`}>
//                                                 {exam.grade}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end">
//                     <button
//                         onClick={onClose}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// }

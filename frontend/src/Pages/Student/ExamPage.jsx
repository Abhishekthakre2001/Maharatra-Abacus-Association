import React, { useState, useEffect } from 'react'
import StudentAppBar from '../../Components/Student/StudentAppBar';
import Button from '../../UI/Button';
import { ChevronLeft, ChevronRight, Clock, User, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExamPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

    const navigate = useNavigate();

    // Dummy exam data
    const examData = {
        studentName: "John Doe",
        level: "Level 1 - Basic Abacus",
        totalMarks: 100,
        totalQuestions: 20,
        questions: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            question: `Question ${i + 1}: What is the result of ${(i + 1) * 5} + ${(i + 1) * 3}?`,
            options: [
                `${(i + 1) * 8}`,
                `${(i + 1) * 7}`,
                `${(i + 1) * 9}`,
                `${(i + 1) * 6}`
            ]
        }))
    };

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (optionIndex) => {
        setAnswers({
            ...answers,
            [currentQuestion]: optionIndex
        });
    };

    const handleNext = () => {
        if (currentQuestion < examData.totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleQuestionClick = (index) => {
        setCurrentQuestion(index);
    };

    return (
        <>
            <div className='max-w-full h-screen overflow-hidden flex flex-col'>
                <div className="m-2 mb-0 flex-shrink-0">
                    <StudentAppBar title={examData.level} />
                </div>

                <div className="flex-1 overflow-y-auto m-2">
                    {/* Exam Info Bar */}
                    <div className="bg-white rounded-lg shadow-md p-3 mb-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="text-blue-600" size={18} />
                                <div>
                                    <p className="text-gray-500 text-xs">Student</p>
                                    <p className="font-semibold text-gray-800">{examData.studentName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="text-green-600" size={18} />
                                <div>
                                    <p className="text-gray-500 text-xs">Total Marks</p>
                                    <p className="font-semibold text-gray-800">{examData.totalMarks}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="text-purple-600" size={18} />
                                <div>
                                    <p className="text-gray-500 text-xs">Questions</p>
                                    <p className="font-semibold text-gray-800">{examData.totalQuestions}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="text-red-600" size={18} />
                                <div>
                                    <p className="text-gray-500 text-xs">Time Remaining</p>
                                    <p className={`font-semibold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-800'}`}>
                                        {formatTime(timeRemaining)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Timeline */}
                    <div className="bg-white rounded-lg shadow-md p-3 mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Question Progress</h3>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: examData.totalQuestions }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionClick(index)}
                                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${currentQuestion === index
                                            ? 'bg-blue-600 text-white shadow-lg scale-110'
                                            : answers[index] !== undefined
                                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                                : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-3 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                                <span className="text-gray-600">Current</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                                <span className="text-gray-600">Answered</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                                <span className="text-gray-600">Not Answered</span>
                            </div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-bold text-gray-800">
                                    Question {currentQuestion + 1} of {examData.totalQuestions}
                                </h2>
                                <span className="text-sm text-gray-500">
                                    Marks: {examData.totalMarks / examData.totalQuestions}
                                </span>
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {examData.questions[currentQuestion].question}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {examData.questions[currentQuestion].options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${answers[currentQuestion] === index
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion}`}
                                        checked={answers[currentQuestion] === index}
                                        onChange={() => handleAnswerSelect(index)}
                                        className="w-5 h-5 text-blue-600 cursor-pointer"
                                    />
                                    <span className="text-gray-700 font-medium">
                                        {String.fromCharCode(65 + index)}. {option}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <Button
                                variant="secondary"
                                size="md"
                                icon={ChevronLeft}
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-gray-600">
                                {Object.keys(answers).length} of {examData.totalQuestions} answered
                            </span>

                            {currentQuestion < examData.totalQuestions - 1 ? (
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleNext}
                                    className="flex-row-reverse"
                                >
                                    <ChevronRight className="ml-2" size={20} />
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => navigate('/student-result')}
                                >
                                    Submit Exam
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

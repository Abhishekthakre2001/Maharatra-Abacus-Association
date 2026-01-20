import React, { useState, useEffect } from 'react';
import ExamLoading from './ExamLoading';
import StudentAppBar from '../../Components/Student/StudentAppBar';
import Button from '../../UI/Button';
import { ChevronLeft, ChevronRight, Clock, User, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchData } from '../../hooks/useFetchData';
import questionApi from '../../api/questionApi';
import ResultApi from '../../api/result';
import { useCreate } from '../../hooks/useCreate';
import MessageModal from "../../utils/MessageModal";


/* ---------- Helpers ---------- */

const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
};

const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/* ---------- Component ---------- */

export default function ExamPage() {
    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: ""
    });
    const [blockNav, setBlockNav] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalExamTime, setTotalExamTime] = useState(0);

    const [visited, setVisited] = useState(new Set());

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const paperset = localStorage.getItem("paperset");
    const examType = localStorage.getItem("examType"); // "mock" or "live"

    /* ---------- Fetch Questions ---------- */

    const { data: PaperQuestion, loading } = useFetchData(
        () => questionApi.getpapersetformock(user.level, user.createdby, paperset),
        [user.level, user.id, paperset]
    );

    /* ---------- Init Exam ---------- */

    useEffect(() => {
        if (!PaperQuestion || PaperQuestion.length === 0) return;

        setQuestions(PaperQuestion);

        const seconds = timeToSeconds(PaperQuestion[0].set_time);
        setTimeRemaining(seconds);
        setTotalExamTime(seconds);
    }, [PaperQuestion]);

    // Block browser navigation during exam
    useEffect(() => {
        if (!blockNav) return;
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        const handlePopState = (e) => {
            // Show custom modal instead of navigating
            Endexamwarning();
            window.history.pushState(null, '', window.location.href); // Prevent back
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
        window.history.pushState(null, '', window.location.href); // Push state to block back
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [blockNav]);

    /* ---------- Timer ---------- */

    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);

                    setModal({
                        open: true,
                        type: "warning",
                        title: "Times Up",
                        message: "Your Time is Reach",
                    });
                    handleSubmitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    /* ---------- Handlers ---------- */

    const handleAnswerSelect = (optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setVisited(prev => new Set(prev).add(currentQuestion + 1));
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setVisited(prev => new Set(prev).add(currentQuestion - 1));
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleQuestionClick = (index) => {
        setVisited(prev => new Set(prev).add(index));
        setCurrentQuestion(index);
    };


    /* ---------- Submit Exam ---------- */
    const { create, loading: createLoading } = useCreate(
        ResultApi.create,
        (response, payload) => {
            const isMockTest = examType === "mock";

            // ✅ show success modal
            setModal({
                open: true,
                type: "success",
                title: "Success",
                message: "Exam Submitted successfully",
            });

            console.log("isMockTest", isMockTest)

            // ⏳ navigate after 3 seconds
            setTimeout(() => {
                if (isMockTest) {
                    // For mock test - navigate to result page
                    navigate('/student-result', {
                        state: payload,
                    });
                } else {
                    // For live exam - navigate back to dashboard
                    navigate('/student-dashboard');
                }
            }, 3000);
        },
        (error) => {
            setModal({
                open: true,
                type: "error",
                title: "Error",
                message: error?.message || "Something went wrong",
            });
        }
    );

    const Endexamwarning = () => {
        setModal({
            open: true,
            type: "warning",
            title: "Warning",
            message: "Really want to submit Exam? If you leave, your progress may be lost.",
        });
    }

    const handleSubmitExam = async () => {
        const total_question = questions.length;

        const answeredIndexes = Object.keys(answers).map(Number);
        const total_answer = answeredIndexes.length;

        let total_correct = 0;

        answeredIndexes.forEach((qIndex) => {
            const selected = answers[qIndex];
            const correct = questions[qIndex].correctoption - 1; // DB is 1-based

            if (selected === correct) {
                total_correct++;
            }
        });

        const total_unsolve = total_question - total_answer;

        const now = new Date();

        const mysqlDate = now.toISOString().split('T')[0];
        const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');


        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const resultPayload = {
            user_id: user.id,
            total_question,
            total_answer,
            total_correct,
            total_unsolve,
            date: mysqlDate,
            time: mysqlDateTime,
            totaltime: formatTime(totalExamTime),
            time_taken: formatTime(totalExamTime - timeRemaining),
            createdby: user.createdby, // ✅ usually user.id, not createdby
        };

        console.log("📊 EXAM RESULT:", resultPayload);
        localStorage.setItem("result", JSON.stringify(resultPayload))

        // ✅ THIS WILL CALL API
        create(resultPayload);

    };


    /* ---------- UI ---------- */

    if (loading) {
        return <ExamLoading />;
    }

    if (questions.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center text-red-600">
                No questions found for this paper.
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="max-w-full h-screen overflow-hidden flex flex-col bg-blue-200">
            <div className="m-2 mb-0 flex-shrink-0">
                {/* <StudentAppBar
                    title="Exam Rules & Regulations"
                    subtitle="Train Your Brain Daily"
                /> */}
            </div>
            <MessageModal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, open: false })}
                onConfirm={() => {
                    console.log("OK");        // ✅ YES clicked
                    handleSubmitExam();       // your submit logic
                }}
            />


            {/* <div className="m-2 mb-0 flex-shrink-0">
                <StudentAppBar title={`Level ${currentQ.level} - Set ${currentQ.set_id}`} />
            </div> */}

            <div className="flex-1 overflow-y-auto m-2">

                {/* Exam Info */}
                {/* <div className="bg-white rounded-lg shadow-md p-3 mb-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <Info icon={User} label="Student" value={user?.name || 'Student'} />
                        <Info icon={Award} label="Total Marks" value={questions.length} />
                        <Info icon={BookOpen} label="Questions" value={questions.length} />
                       
                    </div>
                </div> */}



                {/* Question */}
                <div className="bg-white rounded-lg shadow-lg p-4">

                    <div className="flex justify-between">
                        <h2 className="font-bold mb-3">
                            Question {currentQuestion + 1} of {questions.length}
                        </h2>
                        <Info
                            icon={Clock}
                            label="Time Remaining"
                            value={formatTime(timeRemaining)}
                            danger={timeRemaining < 300}
                        />
                    </div>


                    {/* Vertical Number Display */}
                    <div className="mb-4 flex justify-center">
                        <div className="text-center">
                            {(() => {
                                // Parse the question like "1+9" or "15-7"
                                const questionStr = currentQ.question.toString();
                                const parts = questionStr.match(/(-?\d+)|([+\-×÷])/g) || [questionStr];

                                const numbers = [];
                                const operators = [];

                                parts.forEach((part) => {
                                    if (/[+\-×÷]/.test(part)) {
                                        operators.push(part);
                                    } else {
                                        numbers.push(part);
                                    }
                                });

                                return (
                                    <div className="inline-block text-right">
                                        {numbers.map((num, i) => (
                                            <div key={i} className="font-mono text-2xl mb-1">
                                                {i > 0 && <span className="mr-2">{operators[i - 1] === '-' ? '−' : operators[i - 1]}</span>}
                                                {i === 0 && <span className="mr-2 invisible">+</span>}
                                                {num}
                                            </div>
                                        ))}
                                        <div className="border-t-2 border-black my-1"></div>
                                        <div className="font-mono text-2xl">?</div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].map(
                            (opt, i) => (
                                <label
                                    key={i}
                                    className={`border p-3 rounded cursor-pointer ${answers[currentQuestion] === i
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        checked={answers[currentQuestion] === i}
                                        onChange={() => handleAnswerSelect(i)}
                                    />
                                    <span className="ml-2">{String.fromCharCode(65 + i)}. {opt}</span>
                                </label>
                            )
                        )}
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-400 pt-4">
                        <Button
                            variant="secondary"
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                        >
                            <ChevronLeft /> Previous
                        </Button>

                        {currentQuestion < questions.length - 1 ? (
                            <Button variant="primary" onClick={handleNext}>
                                Next <ChevronRight />
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={Endexamwarning}>
                                Submit Exam
                            </Button>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-md p-3 my-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Question Progress</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionClick(index)}
                                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${currentQuestion === index
                                    ? 'bg-blue-600 text-white scale-110'          // CURRENT
                                    : answers[index] !== undefined
                                        ? 'bg-green-500 text-white'           // SOLVED
                                        : visited.has(index)
                                            ? 'bg-yellow-500 text-white'     // VISITED (UNSOLVED)
                                            : 'bg-gray-100 text-gray-600'          // UNVISITED
                                    }`}

                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <Button variant="danger" onClick={Endexamwarning} className='w-[100%]'>
                        Submit Exam
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Small Info Component ---------- */

function Info({ icon: Icon, label, value, danger }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className={danger ? 'text-red-600' : 'text-blue-600'} size={18} />
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`font-semibold ${danger ? 'text-red-600' : 'text-gray-800'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

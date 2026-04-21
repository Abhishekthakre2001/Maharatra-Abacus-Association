import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ExamLoading from "./ExamLoading";
import Button from "../../UI/Button";
import MessageModal from "../../utils/MessageModal";

import { useFetchData } from "../../hooks/useFetchData";
import { useCreate } from "../../hooks/useCreate";

import questionApi from "../../api/questionApi";
import ExamResultApi from "../../api/examResultApi";

import ResultApi from "../../api/result";

/* ---------------- Helpers ---------------- */

// convert HH:mm:ss -> total seconds
const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;

    const parts = String(timeStr).split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 0;

    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
};

// convert seconds -> HH:mm:ss
const formatTime = (seconds) => {
    const safe = Math.max(0, Number(seconds) || 0);

    const hrs = Math.floor(safe / 3600);
    const mins = Math.floor((safe % 3600) / 60);
    const secs = safe % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

// add one second safely
const addOneSecond = (time) => {
    if (!time || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        return "00:00:01";
    }

    let [hh, mm, ss] = time.split(":").map(Number);
    ss += 1;

    if (ss >= 60) {
        ss = 0;
        mm += 1;
    }

    if (mm >= 60) {
        mm = 0;
        hh += 1;
    }

    return [
        String(hh).padStart(2, "0"),
        String(mm).padStart(2, "0"),
        String(ss).padStart(2, "0"),
    ].join(":");
};

// safe question math formatter
const renderMathQuestion = (rawQuestion) => {
    const raw = String(rawQuestion || "").trim();

    const questionStr = raw
        .replace(/[xX*]/g, "×")
        .replace(/\//g, "÷")
        .replace(/\s+/g, "");

    const percentMatch = questionStr.match(/^(\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)$/);

    if (percentMatch) {
        const [, firstNum, secondNum] = percentMatch;

        return (
            <div className="inline-block text-right font-mono tabular-nums text-2xl leading-tight">
                <div className="flex justify-end gap-1">
                    <span>{firstNum}</span>
                    <span>%</span>
                </div>
                <div>{secondNum}</div>
                <div className="border-t-2 border-black my-1"></div>
            </div>
        );
    }

    const terms = questionStr.match(/[+\-×÷]?\d+(?:\.\d+)?/g) || [];

    if (!terms.length) {
        return <div className="text-2xl font-mono tabular-nums">{raw}</div>;
    }

    return (
        <div className="inline-block text-right font-mono tabular-nums text-2xl leading-tight">
            {terms.map((term, i) => {
                let operator = "";
                let number = term;

                if (i === 0) {
                    number = term.replace(/^[+\-×÷]/, "");
                } else {
                    const firstChar = term.charAt(0);
                    if (["+", "-", "×", "÷"].includes(firstChar)) {
                        operator = firstChar === "-" ? "−" : firstChar;
                        number = term.slice(1);
                    }
                }

                return (
                    <div
                        key={i}
                        className="grid grid-cols-[40px_auto] justify-end items-center mb-1"
                    >
                        <span className="text-center">{operator}</span>
                        <span>{number}</span>
                    </div>
                );
            })}
            <div className="border-t-2 border-black my-1"></div>
        </div>
    );
};

/* ---------------- Component ---------------- */

export default function ExamPage() {
    const navigate = useNavigate();

    // logged-in user data
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const examType = localStorage.getItem("examType"); // mock or live
    const paperset = localStorage.getItem("paperset");
    const paperlevel = localStorage.getItem("paperlevel");
    const userLevel = localStorage.getItem("Userlevl") || "";
    const examTitle = localStorage.getItem("Exam_Tittle") || "Not Available";
    const examId = localStorage.getItem("exam_id");
    const [startCalled, setStartCalled] = useState(false);
    const [isFinishingMock, setIsFinishingMock] = useState(false);


    /* ---------------- UI State ---------------- */
    const [modal, setModal] = useState({
        open: false,
        type: "",
        title: "",
        message: "",
    });

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // this decides if exam UI should be shown or not
    const [examReady, setExamReady] = useState(false);

    /* ---------------- Exam State ---------------- */
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [visited, setVisited] = useState(new Set([0]));

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalExamTime, setTotalExamTime] = useState(0);

    // DB row id returned by start exam API
    const [examRowId, setExamRowId] = useState(
        localStorage.getItem("exam_result_row_id") || null
    );

    /* ---------------- Fetch Questions ---------------- */
    const { data: paperQuestions, loading: questionLoading } = useFetchData(
        () => questionApi.getpapersetformock(user.level, user.createdby, paperset),
        [user.level, user.createdby, paperset]
    );

    /* ---------------- Start Exam API ---------------- */
    const { create: startExam, loading: startExamLoading } = useCreate(
        ExamResultApi.start,
        (response) => {
            const rowId = response?.id;

            if (!rowId) {
                setModal({
                    open: true,
                    type: "error",
                    title: "Error",
                    message: "Start exam response invalid",
                });
                return;
            }

            localStorage.setItem("exam_result_row_id", rowId);
            setExamRowId(rowId);
            setExamReady(true);
        },
        (error) => {
            setModal({
                open: true,
                type: "error",
                title: "Start Failed",
                message: error?.message || "Unable to start exam",
            });
        }
    );

    /* ---------------- Submit Exam API ---------------- */
    const submitExamApi = ({ id, payload }) => ExamResultApi.submit(id, payload);

    const { create: submitExam, loading: submitExamLoading } = useCreate(
        submitExamApi,
        () => {
            setSubmitting(false);
            setStartCalled(true);

            setModal({
                open: true,
                type: "success",
                title: "Success",
                message: "Exam Submitted successfully",
            });

            localStorage.removeItem("examState");
            localStorage.removeItem("exam_result_row_id");
            localStorage.removeItem("examType");
            localStorage.removeItem("paperlevel");
            localStorage.removeItem("Exam_Tittle");

            setTimeout(() => {
                if (examType === "mock") {
                    navigate("/student-result");
                } else {
                    navigate("/student-dashboard");
                }
            }, 2000);
        },
        (error) => {
            setSubmitting(false);
            setModal({
                open: true,
                type: "error",
                title: "Submit Failed",
                message: error?.message || "Something went wrong while submitting exam",
            });
        }
    );

    const { create: createMockResult, loading: createMockLoading } = useCreate(
        ResultApi.create,
        (response, payload) => {
            setSubmitting(false);
            setIsFinishingMock(true);

            setModal({
                open: true,
                type: "success",
                title: "Success",
                message: "Exam Submitted successfully",
            });

            // localStorage.removeItem("examType");
            localStorage.removeItem("paperlevel");
            localStorage.removeItem("examState");
            localStorage.removeItem("Exam_Tittle");

            setTimeout(() => {
                navigate("/student-result", {
                    state: payload,
                });
                localStorage.removeItem("examType");
            }, 2000);
        },
        (error) => {
            setSubmitting(false);
            console.log("errorsdsdsds", error.message)
            setModal({
                open: true,
                type: "error",
                title: "Error",
                message: error?.message || "Something went wrong",
            });
        }
    );

    /* ---------------- Validation ---------------- */
    const hasValidExamContext = useMemo(() => {
        return Boolean(
            user?.id &&
            user?.createdby &&
            paperset &&
            // examId &&
            userLevel &&
            examTitle
        );
    }, [user, paperset, examId, userLevel, examTitle]);

    /* ---------------- Initialize Questions ---------------- */
    useEffect(() => {
        if (!paperQuestions || paperQuestions.length === 0) return;

        const savedExamState = localStorage.getItem("examState");

        setQuestions(paperQuestions);

        if (savedExamState) {
            try {
                const parsed = JSON.parse(savedExamState);

                setCurrentQuestion(parsed?.currentQ ?? 0);
                setAnswers(parsed?.answers || {});
                setTimeRemaining(Number(parsed?.timeRemaining || 0));
                setVisited(new Set(parsed?.visited || [0]));
            } catch (error) {
                console.error("examState parse error:", error);

                const seconds = Math.max(
                    0,
                    timeToSeconds(paperQuestions[0]?.set_time || "00:00:00")
                );

                setCurrentQuestion(0);
                setAnswers({});
                setVisited(new Set([0]));
                setTimeRemaining(seconds);
                setTotalExamTime(seconds);
            }
        } else {
            const seconds = Math.max(
                0,
                timeToSeconds(paperQuestions[0]?.set_time || "00:00:00")
            );

            setCurrentQuestion(0);
            setAnswers({});
            setVisited(new Set([0]));
            setTimeRemaining(seconds);
            setTotalExamTime(seconds);
        }
    }, [paperQuestions]);

    /* ---------------- Ensure total time exists when restore ---------------- */
    useEffect(() => {
        if (!paperQuestions || paperQuestions.length === 0) return;

        const seconds = Math.max(
            0,
            timeToSeconds(paperQuestions[0]?.set_time || "00:00:00")
        );

        if (!totalExamTime) {
            setTotalExamTime(seconds);
        }
    }, [paperQuestions, totalExamTime]);

    /* ---------------- Start Exam Only After Questions Ready ---------------- */
    useEffect(() => {
        if (!questions.length) return;
        if (!hasValidExamContext) return;
        if (!totalExamTime) return;
        if (examReady) return;           // ✅ already ready, do nothing
        if (submitting) return;          // ✅ during submit, do nothing
        if (isFinishingMock) return;     // ✅ mock finished, do nothing
        if (startCalled) return;         // ✅ prevent duplicate live start calls

        // MOCK TEST => never call start exam API
        if (examType === "mock") {
            setExamReady(true);
            return;
        }

        // LIVE EXAM resume
        if (examRowId) {
            setExamReady(true);
            setStartCalled(true);
            return;
        }

        const startPayload = {
            user_id: user.id,
            exam_id: examId,
            admin_id: user.createdby,
            Exam_name: examTitle,
            exam_time: formatTime(totalExamTime),
            total_question: questions.length,
            Exam_level: userLevel,
            paper_set: paperset,
        };

        setStartCalled(true);
        startExam(startPayload);
    }, [
        questions.length,
        totalExamTime,
        hasValidExamContext,
        examType,
        examRowId,
        examReady,
        submitting,
        isFinishingMock,
    ]);

    /* ---------------- Save Exam State ---------------- */
    useEffect(() => {
        if (!questions.length || !examReady) return;

        const examState = {
            currentQ: currentQuestion,
            answers,
            timeRemaining,
            visited: Array.from(visited),
        };

        localStorage.setItem("examState", JSON.stringify(examState));
    }, [currentQuestion, answers, timeRemaining, visited, questions.length, examReady]);

    /* ---------------- Timer ---------------- */
    useEffect(() => {
        if (!examReady) return;
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);

                    setModal({
                        open: true,
                        type: "warning",
                        title: "Time's Up",
                        message: "Your exam time is over.",
                    });

                    // auto submit
                    setTimeout(() => {
                        handleSubmitExam();
                    }, 300);

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, examReady]);

    /* ---------------- Prevent Enter Default ---------------- */
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!examReady) return;
            if (e.key !== "Enter") return;

            e.preventDefault();

            if (modal.open) return;

            if (currentQuestion < questions.length - 1) {
                handleNext();
            } else if (questions.length > 0) {
                openSubmitWarning();
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [examReady, modal.open, currentQuestion, questions.length]);

    /* ---------------- Page Leave Protection ---------------- */
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!examReady) return;
            if (submitting || submitExamLoading) return;

            e.preventDefault();
            e.returnValue = "Your exam may be submitted if you leave.";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [examReady, submitting, submitExamLoading]);

    /* ---------------- Back Button Protection ---------------- */
    useEffect(() => {
        const handleBackButton = () => {
            if (!examReady) return;
            if (submitting || submitExamLoading) return;

            const confirmLeave = window.confirm(
                "Leaving the exam will submit your answers. Do you want to continue?"
            );

            if (confirmLeave) {
                handleSubmitExam();
            } else {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [examReady, submitting, submitExamLoading, answers]);

    /* ---------------- Derived Values ---------------- */
    const currentQ = questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = Math.max(0, questions.length - answeredCount);
    const unvisitedCount = Math.max(0, questions.length - visited.size);
    const [fatalError, setFatalError] = useState(null);
    const progressPercent =
        questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

    /* ---------------- Handlers ---------------- */
    const handleAnswerSelect = (optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: optionIndex,
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            const nextIndex = currentQuestion + 1;
            setVisited((prev) => new Set([...prev, nextIndex]));
            setCurrentQuestion(nextIndex);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            const prevIndex = currentQuestion - 1;
            setVisited((prev) => new Set([...prev, prevIndex]));
            setCurrentQuestion(prevIndex);
        }
    };

    const handleQuestionClick = (index) => {
        setVisited((prev) => new Set([...prev, index]));
        setCurrentQuestion(index);
        setDrawerOpen(false);
    };

    const openSubmitWarning = () => {
        setModal({
            open: true,
            type: "warning",
            title: "Warning",
            message: "Really want to submit Exam?",
        });
    };

    const handleSubmitExam = async () => {
        if (submitting) return;

        if (!questions.length) {
            setModal({
                open: true,
                type: "error",
                title: "Error",
                message: "No questions found for submission.",
            });
            return;
        }

        // ✅ for live exam row must exist
        if (examType !== "mock" && !examRowId) {
            setModal({
                open: true,
                type: "error",
                title: "Error",
                message: "Exam session not found. Please restart the exam.",
            });
            return;
        }

        setSubmitting(true);

        const total_question = questions.length;
        const usedTime = Math.max(0, totalExamTime - timeRemaining);

        const answeredIndexes = Object.keys(answers).map(Number);

        // ✅ mock table uses total_answer
        const total_answer = answeredIndexes.length;

        // ✅ live table uses total_solve
        const total_solve = answeredIndexes.length;

        let total_correct = 0;

        answeredIndexes.forEach((qIndex) => {
            const selected = answers[qIndex];
            const correct = Number(questions[qIndex]?.correctoption) - 1;

            if (selected === correct) {
                total_correct += 1;
            }
        });

        const total_unsolve = total_question - answeredIndexes.length;

        // ✅ MOCK TEST FLOW
        if (examType === "mock") {
            const now = new Date();
            const mysqlDate = now.toISOString().split("T")[0];
            const mysqlDateTime = now.toISOString().slice(0, 19).replace("T", " ");

            const resultPayload = {
                PaperLevel: paperlevel,
                set: paperset,
                Level: userLevel,
                user_id: user.id,
                total_question,
                total_answer,
                total_correct,
                total_unsolve,
                date: mysqlDate,
                time: mysqlDateTime,
                totaltime: formatTime(totalExamTime),
                time_taken: addOneSecond(formatTime(usedTime)),
                createdby: user.createdby,
                resultfor: "Test",
                examtitle: examTitle || "Not Available",
                exam_id: examId || null,
            };

            localStorage.removeItem("examState");
            localStorage.setItem("result", JSON.stringify(resultPayload));

            // try {
            //     await createMockResult(resultPayload);
            // } catch (error) {
            //     console.error("Mock submit error:", error);
            // }

            try {
                setSubmitting(true);

                const res = await ResultApi.create(resultPayload);

                setSubmitting(false);
                setIsFinishingMock(true);

                setModal({
                    open: true,
                    type: "success",
                    title: "Success",
                    message: "Exam Submitted successfully",
                });

                localStorage.removeItem("paperlevel");
                localStorage.removeItem("examState");
                localStorage.removeItem("Exam_Tittle");

                setTimeout(() => {
                    navigate("/student-result", {
                        state: resultPayload,
                    });
                    localStorage.removeItem("examType");
                }, 2000);

            } catch (error) {
                setSubmitting(false);

                const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong";

                const isLiveExamError =
                    errorMessage ===
                    "Your exam is live now. Please give the exam, not a mock test.";

                if (isLiveExamError) {
                    setFatalError(errorMessage);
                    return;
                }

                setModal({
                    open: true,
                    type: "error",
                    title: "Error",
                    message: errorMessage,
                });
            }

            return;
        }

        // ✅ LIVE EXAM FLOW
        const submitPayload = {
            total_solve,
            total_unsolve,
            total_correct,
            time_taken: addOneSecond(formatTime(usedTime)),
        };

        localStorage.setItem(
            "result",
            JSON.stringify({
                exam_row_id: examRowId,
                total_question,
                total_solve,
                total_unsolve,
                total_correct,
                time_taken: addOneSecond(formatTime(usedTime)),
            })
        );

        localStorage.removeItem("examState");

        try {
            await submitExam({
                id: examRowId,
                payload: submitPayload,
            });
        } catch (error) {
            console.error("Live submit error:", error);
        }
    };

    const handleGoToDashboard = () => {
        // 🔥 clear everything
        localStorage.clear();
        sessionStorage.clear();

        // optional: clear cookies (basic way)
        document.cookie.split(";").forEach((c) => {
            document.cookie =
                c.trim().split("=")[0] +
                "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        });

        // 🔥 hard refresh + redirect
        window.location.href = "/student-dashboard";
    };

    /* ---------------- Loaders / Validations ---------------- */
    if (questionLoading || (examType !== "mock" && startExamLoading)) {
        return <ExamLoading />;
    }

    if (!hasValidExamContext) {
        return (
            <div className="h-screen flex items-center justify-center text-red-600 px-4 text-center">
                Missing exam details. Please go back and start exam again.
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="h-screen flex items-center justify-center text-red-600">
                No questions found for this paper.
            </div>
        );
    }

    if (!examReady && examType !== "mock") {
        return (
            <div className="h-screen flex items-center justify-center bg-blue-50">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-lg font-bold">Starting Exam...</h2>
                    <p className="text-gray-600 text-sm">Please wait</p>
                </div>
            </div>
        );
    }

    if (fatalError) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-red-50 px-6 text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Error
                    </h2>

                    <p className="text-gray-700 mb-6">
                        {fatalError}
                    </p>

                    <Button
                        variant="primary"
                        onClick={handleGoToDashboard}
                        className="w-full"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        );
    }

    if (submitting || submitExamLoading || createMockLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-blue-100">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-lg font-bold">Submitting Exam…</h2>
                    <p className="text-gray-600 text-sm">Please wait</p>
                </div>
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="max-w-full h-screen overflow-hidden flex flex-col bg-blue-50 mb-8">
            <MessageModal
                showOkButton={false}
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal((prev) => ({ ...prev, open: false }))}
                onConfirm={() => {
                    handleSubmitExam();
                }}
            />


            <div className="flex-1 overflow-y-auto m-2">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    {/* Top Sticky Header */}
                    <div className="bg-white sticky top-0 p-2 z-50 flex justify-between items-center mb-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="font-bold">
                                Question {currentQuestion + 1} of {questions.length}
                            </h2>
                            <p>
                                <b>Level : </b>
                                {userLevel}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Info
                                icon={Clock}
                                label="Time Remaining"
                                value={formatTime(timeRemaining)}
                                danger={timeRemaining < 300}
                            />

                            <button
                                onClick={() => setDrawerOpen(!drawerOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                title="Toggle Questions Panel"
                            >
                                {drawerOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-4 flex justify-center">
                        <div className="text-center">{renderMathQuestion(currentQ?.question)}</div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[currentQ?.option1, currentQ?.option2, currentQ?.option3, currentQ?.option4].map(
                            (opt, i) => (
                                <label
                                    key={i}
                                    className={`border p-3 rounded cursor-pointer ${answers[currentQuestion] === i
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        checked={answers[currentQuestion] === i}
                                        onChange={() => handleAnswerSelect(i)}
                                    />
                                    <span className="ml-2">
                                        {String.fromCharCode(65 + i)}. {opt}
                                    </span>
                                </label>
                            )
                        )}
                    </div>

                    {/* Bottom Nav */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-4 py-3 z-50">
                        <div className="max-w-5xl mx-auto flex justify-between items-center">
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
                                <Button variant="primary" onClick={openSubmitWarning}>
                                    Submit Exam
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-40"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Right Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-slate-50 to-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="h-full flex flex-col p-5">
                    {/* Drawer Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-200">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Question Progress</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {answeredCount}/{questions.length} Answered
                            </p>
                        </div>
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="p-2 hover:bg-red-100 rounded-lg transition duration-200"
                        >
                            <X size={24} className="text-red-600" />
                        </button>
                    </div>

                    {/* Overall Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>Overall Progress</span>
                            <span className="font-semibold">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Answered / Unanswered / Unvisited */}
                    <div className="bg-white rounded-lg p-0 shadow-sm border border-gray-200">
                        <div className="mt-8 space-y-3 flex gap-2 p-2">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <div className="flex flex-col justify-between items-center">
                                    <span className="text-xs text-green-600 font-medium">Answered</span>
                                    <span className="text-lg font-bold text-green-600">{answeredCount}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <div className="flex flex-col justify-between items-center">
                                    <span className="text-xs text-yellow-600 font-medium">Unanswered</span>
                                    <span className="text-lg font-bold text-yellow-600">{unansweredCount}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <div className="flex flex-col justify-between items-center">
                                    <span className="text-xs text-gray-600 font-medium">Unvisited</span>
                                    <span className="text-lg font-bold text-gray-600">{unvisitedCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Buttons */}
                    <div className="flex-1 overflow-y-auto p-2">
                        <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                            Questions
                        </h4>

                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionClick(index)}
                                    className={`h-10 rounded-lg font-semibold text-xs transition-all duration-200 transform hover:scale-105 ${currentQuestion === index
                                        ? "bg-blue-600 text-white shadow-lg scale-110 ring-2 ring-blue-400"
                                        : answers[index] !== undefined
                                            ? "bg-green-500 text-white shadow-md hover:shadow-lg"
                                            : visited.has(index)
                                                ? "bg-yellow-500 text-white shadow-md hover:shadow-lg"
                                                : "bg-gray-200 text-gray-600 hover:bg-gray-300 shadow-sm"
                                        }`}
                                    title={`Question ${index + 1}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        variant="danger"
                        onClick={openSubmitWarning}
                        className="w-full mt-6 py-3 font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                        Submit Exam
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Small Info Component ---------------- */
function Info({ icon: Icon, label, value, danger }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className={danger ? "text-red-600" : "text-blue-600"} size={18} />
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`font-semibold ${danger ? "text-red-600" : "text-gray-800"}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}
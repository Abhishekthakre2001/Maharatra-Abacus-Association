import React, { useState, useEffect } from 'react';
import StudentAppBar from './StudentAppBar';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';
import examScheduleApi from '../../api/examScheduleApi';
import questionApi from '../../api/questionApi';
import resultapi from '../../api/result';
import { useFetchData } from '../../hooks/useFetchData';
import TopAutoCarousel from './LightDashboardCard';
import CreamCarouselCard from './CreamCarouselCard';
import examImg from "../../assets/exam.png";

export default function StudentDashboard() {

  const navigate = useNavigate();

  const [showSets, setShowSets] = useState(false);
  const [attemptedExamIds, setAttemptedExamIds] = useState([]);
  const [examCheckLoading, setExamCheckLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userName =
    user?.name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User Name";

  const userImage = user?.image || user?.avatar || null;

  const userInitials =
    userName
      .split(" ")
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AT";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  /* ================= API ================= */

  const {
    data: upcomeingexam = [],
    loading: examLoading
  } = useFetchData(() =>
    examScheduleApi.getstudnetupcomeingexam(user.level, user.createdby)
  );

  const {
    data: levelwise_set = [],
    loading: setLoading
  } = useFetchData(() =>
    questionApi.getset(user.level, user.createdby)
  );

  /* ================= DATE HELPERS ================= */

  const isToday = (dateStr) =>
    new Date(dateStr).toDateString() === new Date().toDateString();

  const isFutureDate = (dateStr) => {
    const examDate = new Date(dateStr);
    const today = new Date();
    examDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return examDate > today;
  };

  const isLiveTime = (startTime, endTime) => {
    const now = new Date();
    const [sh, sm, ss] = startTime.split(":").map(Number);
    const [eh, em, es] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sh, sm, ss || 0);

    const end = new Date();
    end.setHours(eh, em, es || 0);

    return now >= start && now <= end;
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (timeStr) => timeStr?.slice(0, 5);

  /* ================= USER-ID + EXAM-ID CHECK ================= */

  useEffect(() => {
    // 🔥 IMPORTANT: reset loader whenever exams change (refresh-safe)
    setExamCheckLoading(true);

    const checkAttemptedExams = async () => {
      if (!user?.id || upcomeingexam.length === 0) {
        setExamCheckLoading(false);
        return;
      }

      try {
        const results = await Promise.all(
          upcomeingexam.map(exam =>
            resultapi.examcheck(user.id, exam.id)
              .then(res => res.data.exam ? exam.id : null)
              .catch(() => null)
          )
        );

        setAttemptedExamIds(results.filter(Boolean));
      } catch (err) {
        console.error("Exam check failed", err);
      } finally {
        setExamCheckLoading(false); // ✅ loader stops ONLY here
      }
    };

    checkAttemptedExams();
  }, [user?.id, upcomeingexam]);

  /* ================= CAROUSEL LOGIC ================= */

  const filteredUpcomingExams = upcomeingexam.filter(exam => {
    const notAttempted = !attemptedExamIds.includes(exam.id);

    const future = isFutureDate(exam.date);

    const todayBeforeLive =
      isToday(exam.date) &&
      !isLiveTime(exam.start_time, exam.end_time);

    return notAttempted && (future || todayBeforeLive);
  });

  /* ================= LIVE EXAM ================= */

  const liveExamData = upcomeingexam.find(
    exam =>
      isToday(exam.date) &&
      isLiveTime(exam.start_time, exam.end_time) &&
      !attemptedExamIds.includes(exam.id)
  );

  /* ================= ACTIONS ================= */

  const handleSetSelect = (level, set) => {
    localStorage.setItem("paperset", set);
    localStorage.setItem("paperlevel", level);
    localStorage.setItem("examType", "mock");
    navigate("/exam-rule");
  };

  const liveExam = () => {
    localStorage.setItem("paperset", liveExamData.paper_set);
    localStorage.setItem("paperlevel", liveExamData.exam_level);
    localStorage.setItem("Exam_Tittle", liveExamData.exam_title);
    localStorage.setItem("examType", "live");
    localStorage.setItem("exam_id", liveExamData.id);
    navigate("/exam-rule");
  };

  /* ================= LOADING FLAG ================= */

  const isYourExamLoading =
    examLoading || setLoading || examCheckLoading;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#E6F2FF] to-[#D9EBFF]">

      <StudentAppBar
        title="Student Dashboard"
        subtitle="Train Your Brain Daily"
        userName={userName}
        userInitials={userInitials}
        userImage={userImage}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-4 pb-10">

        {/* ================= CAROUSEL ================= */}
        <div className="my-8">
          <TopAutoCarousel
            items={
              filteredUpcomingExams.length > 0
                ? filteredUpcomingExams.map((exam) => (
                  <CreamCarouselCard
                    key={exam.id}
                    title={`Abacus Level ${exam.exam_level} Examination`}
                    subtitle={exam.exam_title}
                    examDate={formatDate(exam.date)}
                    startTime={formatTime(exam.start_time)}
                    endTime={formatTime(exam.end_time)}
                    image={examImg}
                  />
                ))
                : [
                  <CreamCarouselCard
                    key="no-exam"
                    title="No Upcoming Exams"
                    subtitle="Please check back later"
                    examDate="—"
                    startTime="—"
                    endTime="—"
                    image={examImg}
                  />
                ]
            }
          />
        </div>

        {/* ================= YOUR EXAMS ================= */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Your Exams
          </h3>

          {isYourExamLoading ? (
            <div className="flex items-center gap-3 text-slate-500">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span>Loading your exams…</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">

                {!showSets && levelwise_set.length > 0 && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowSets(true)}
                    className="w-full"
                  >
                    Start Test Exam
                  </Button>
                )}

                {liveExamData && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={liveExam}
                    className="w-full"
                  >
                    Start Live Exam
                  </Button>
                )}
              </div>

              {showSets && (
                <div className="mt-6">
                  <p className="text-sm text-slate-500 mb-4">
                    Select Set For Test
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {levelwise_set.map((item) => (
                      <button
                        key={`${item.level}-${item.set_id}`}
                        onClick={() => handleSetSelect(item.level, item.set_id)}
                        className="border-2 border-blue-600 text-blue-600 rounded-xl py-3 font-semibold
                                   hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Set {item.level}{item.set_id}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

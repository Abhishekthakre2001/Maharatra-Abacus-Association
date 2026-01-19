import React, { useState } from 'react'
import StudentAppBar from './StudentAppBar';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';
import examScheduleApi from '../../api/examScheduleApi';
import questionApi from '../../api/questionApi';
import { useFetchData } from '../../hooks/useFetchData';
import TopAutoCarousel from './LightDashboardCard';
import CreamCarouselCard from './CreamCarouselCard';
import examImg from "../../assets/exam.png";

export default function StudentDashboard() {

  const navigate = useNavigate();
  const [showSets, setShowSets] = useState(false);

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

  const { data: upcomeingexam } = useFetchData(() =>
    examScheduleApi.getstudnetupcomeingexam(user.level, user.createdby)
  );

  const { data: levelwise_set } = useFetchData(() =>
    questionApi.getset(user.level, user.createdby)
  );

  /* ================= DATE HELPERS ================= */

  const isTodayOrFuture = (dateStr) => {
    const examDate = new Date(dateStr);
    const today = new Date();

    examDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return examDate >= today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.slice(0, 5);
  };

  /* ================= FILTERED EXAMS (🔥 FIX) ================= */

  const filteredUpcomingExams =
    upcomeingexam?.filter(exam => isTodayOrFuture(exam.date)) || [];

  /* ================= LIVE EXAM LOGIC ================= */

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

  const liveExamData = filteredUpcomingExams.find(
    exam =>
      new Date(exam.date).toDateString() === new Date().toDateString() &&
      isLiveTime(exam.start_time, exam.end_time)
  );

  const handleSetSelect = (level, set) => {
    localStorage.setItem("paperset", set);
    localStorage.setItem("paperlevel", level);
    localStorage.setItem("examType", "mock");
    navigate("/exam-rule");
  };

  const liveExam = () => {
    localStorage.setItem("paperset", liveExamData.paper_set);
    localStorage.setItem("paperlevel", liveExamData.exam_level);
    localStorage.setItem("examType", "live");
    navigate("/exam-rule");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#E6F2FF] to-[#D9EBFF]">

        {/* ================= APP BAR ================= */}
        <StudentAppBar
          title="Student Dashboard"
          subtitle="Train Your Brain Daily"
          userName={userName}
          userInitials={userInitials}
          userImage={userImage}
          onLogout={handleLogout}
        />

        <div className="max-w-6xl mx-auto px-4 pb-10">

          {/* ================= UPCOMING EXAMS ================= */}
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

          {/* ================= ACTION SECTION ================= */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Your Exams
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Test exams anytime • Live exams only during scheduled time
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              {!showSets && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowSets(true)}
                  className="w-full"
                >
                  Start Mock Exam
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
              <div className="mt-6 bg-white rounded-2xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {levelwise_set?.map((item) => (
                    <button
                      key={`${item.level}-${item.set_id}`}
                      onClick={() => handleSetSelect(item.level, item.set_id)}
                      className="
                        border-2 border-blue-600 text-blue-600
                        rounded-xl py-3 font-semibold text-sm
                        hover:bg-blue-600 hover:text-white
                        transition-all active:scale-95
                      "
                    >
                      Set {item.level}{item.set_id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

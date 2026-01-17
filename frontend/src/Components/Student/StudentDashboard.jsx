import React, { useState, useRef } from 'react'
import StudentAppBar from './StudentAppBar';
import DashboardCard from '../../UI/Dashboardcard';
import { BookOpenCheck, Percent, BarChart3, Users, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';
import examScheduleApi from '../../api/examScheduleApi';
import questionApi from '../../api/questionApi';
import { useFetchData } from '../../hooks/useFetchData';
import colors from '../../utils/Color';
import TopAutoCarousel from './LightDashboardCard';
import CreamCarouselCard from './CreamCarouselCard';
import examImg from "../../assets/exam.png";

export default function StudentDashboard() {

  const navigate = useNavigate();
  const [showSets, setShowSets] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User Name";
  const userImage = user?.image || user?.avatar || null;
  const userInitials = userName.split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase() || "AT";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  const { data: upcomeingexam, reload } = useFetchData(() => examScheduleApi.getstudnetupcomeingexam(user.level, user.createdby));
  const { data: levelwise_set } = useFetchData(() => questionApi.getset(user.level, user.createdby));

  const isToday = (dateStr) => {
    const examDate = new Date(dateStr);
    const today = new Date();

    return (
      examDate.getDate() === today.getDate() &&
      examDate.getMonth() === today.getMonth() &&
      examDate.getFullYear() === today.getFullYear()
    );
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

  const liveExamData = upcomeingexam?.find(
    (exam) =>
      isToday(exam.date) && isLiveTime(exam.start_time, exam.end_time)
  );

  const firstExam = upcomeingexam?.[0];

  const handleSetSelect = (level, set) => {
    localStorage.setItem("paperset", set);
    localStorage.setItem("paperlevel", level);
    localStorage.setItem("examType", "mock")
    navigate("/exam-rule");
  };

  const liveExam = () => {
    localStorage.setItem("paperset", liveExamData?.paper_set);
    localStorage.setItem("paperlevel", liveExamData?.exam_level);
    localStorage.setItem("examType", "live")
    navigate("/exam-rule");
  }


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
    return timeStr.slice(0, 5); // "10:00:00" -> "10:00"
  };


  console.log("upcomeingexam", upcomeingexam)


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

          {/* ================= WELCOME SECTION ================= */}
          {/* <div className="mt-6 bg-white/70 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Welcome back, {userName}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                You are currently practicing <span className="font-semibold text-blue-600">Abacus Level {user.level}</span>
              </p>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Practice daily with mock exams or attempt live exams scheduled by your teacher to improve accuracy and speed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold">
                Level {user.level}
              </div>
            </div>
          </div> */}

          {/* ================= UPCOMING EXAMS ================= */}
          <div className="my-8">
            {/* <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Upcoming Examinations
            </h3> */}

            <TopAutoCarousel
              className="mb-6"
              items={
                upcomeingexam && upcomeingexam.length > 0
                  ? upcomeingexam.map((exam) => (
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
                      key="default-exam"
                      title="No Upcoming Exams"
                      subtitle="Please check back later"
                      examDate="—"
                      startTime="—"
                      endTime="—"
                      image={examImg}
                    />,
                  ]
              }
            />
          </div>

          {/* ================= ACTION SECTION ================= */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Start Your Practice
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Choose a mock test to practice or start a live exam if it is currently active.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              {/* MOCK EXAM */}

              {!showSets && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSets(true)}
                  className="w-full"
                >
                  Start Mock Exam
                </Button>
              )}


              {/* LIVE EXAM */}
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

            {/* ================= MOCK SET SELECT ================= */}
          {showSets && (
            <div className="mt-6 bg-white rounded-2xl  ">
              {/* <h3 className="text-base font-semibold text-slate-800 mb-4">
                Select Question Set
              </h3> */}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {levelwise_set?.map((item) => (
                  <button
                    key={`${item.level}-${item.set_id}`}
                    type="button"
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


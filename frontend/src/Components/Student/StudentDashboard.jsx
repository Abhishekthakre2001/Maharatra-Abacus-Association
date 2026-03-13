import React, { useState, useEffect } from 'react'
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
import Modal from '../../UI/Modal';

export default function StudentDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [showSets, setShowSets] = useState(false);
  const [attemptedExamId, setAttemptedExamId] = useState(null);

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
      .toUpperCase() ;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const { data: upcomeingexam, examscheduleloading } = useFetchData(() =>
    examScheduleApi.getstudnetupcomeingexam(user.level, user.createdby)
  );

  const { data: levelwise_set, levelsetloading } = useFetchData(() =>
    questionApi.getset(user.level, user.createdby),
  );

  useEffect(() => {
  if (levelwise_set?.length > 0 && levelwise_set[0]?.level_name) {
    localStorage.setItem("Userlevl", levelwise_set[0].level_name);
  }
}, [levelwise_set]);


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
  const isExamStillActiveOrFuture = (exam) => {
    const now = new Date();

    // exam date (YYYY-MM-DD)
    const examDate = new Date(exam.date);

    // build full end datetime
    const [hh, mm, ss] = exam.end_time.split(":").map(Number);
    const examEndDateTime = new Date(examDate);
    examEndDateTime.setHours(hh, mm, ss || 0, 0);

    return examEndDateTime > now;
  };


  // const filteredUpcomingExams =
  //   upcomeingexam?.filter(
  //     exam =>
  //       isTodayOrFuture(exam.date) &&
  //       isExamStillActiveOrFuture(exam) &&
  //       exam.id !== attemptedExamId
  //   ) || [];

  const filteredUpcomingExams =
    upcomeingexam?.filter(
      exam =>
        isTodayOrFuture(exam.date) &&
        isExamStillActiveOrFuture(exam)
    ) || [];


  console.log("upcomeingexam", upcomeingexam)
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

  const [isexam, setIsExam] = useState(false);
  const [examloading, setexamloading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('exam_id');
    localStorage.removeItem('examState');
    const checkExam = async () => {
      if (!user?.id || !liveExamData?.id) {
        setexamloading(false);
        return;
      }

      try {
        const res = await resultapi.examcheck(user.id, liveExamData.id);
        console.log("res", res.data)
        setIsExam(Boolean(res.data.exam));
        setAttemptedExamId(res.data.exam_id || null);
        setexamloading(false)
      } catch (err) {
        console.error("Exam check failed", err);
        setIsExam(false);
        setAttemptedExamId(null);
      }
    };

    checkExam();
  }, [user?.id, liveExamData?.id]);

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
    localStorage.setItem('exam_id', liveExamData.id)
    navigate("/exam-rule");
  };


  console.log("liveExamData", levelwise_set[0]?.level_name);

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex flex-col">

        {/* <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#E6F2FF] to-[#D9EBFF]"> */}

        {/* ================= APP BAR ================= */}
        <StudentAppBar
          title="Student Dashboard"
          subtitle="Train Your Brain Daily"
          userName={userName}
          userInitials={userInitials}
          userImage={userImage}
          onLogout={handleLogout}
        />

        {/* <div className="max-w-6xl mx-auto px-4 pb-10"> */}
        <div className="flex-1 w-full max-w-md mx-auto px-4 pb-28">


          {/* ================= UPCOMING EXAMS ================= */}
          <div className="mt-4">
            <div className="bg-white rounded-2xl shadow-sm p-3">
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
          </div>

          {/* ================= ACTION SECTION ================= */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-base font-semibold text-slate-800">
              Your Exams
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Test exams anytime • Live exams only during scheduled time
            </p>

            {/* {examloading ? <> */}
            {levelsetloading || examscheduleloading || examloading || levelwise_set === null ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : levelwise_set.length === 0 ? (
              <p className="text-sm text-center text-slate-500 mb-5">
                Sorry Practice Question Sets Not Available,<br />
                Please Contact Your Admin
              </p>
            ) : (
              <div className="space-y-3">
                {!showSets && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setModalOpen(true)}
                    className="w-full"
                  >
                    Start Test Exam
                  </Button>
                )}

                {liveExamData && (
                  <div className="relative group w-full">
                    <Button
                      variant="green"
                      size="lg"
                      disabled={isexam}
                      onClick={liveExam}
                      className={`w-full ${!isexam ? "cursor-pointer" : "cursor-not-allowed"}`}

                    >
                      Start Live Exam
                    </Button>
                    {isexam && (
                      <div
                        className="
          absolute -top-10 left-1/2 -translate-x-1/2
          whitespace-nowrap
          bg-gray-800 text-white text-xs
          px-3 py-1 rounded-md
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
        "
                      >
                        Exam already submitted
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}


            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Select Practice Set"
              width="max-w-md"
            >
              {levelwise_set?.length === 0 ? (
                <p className="text-sm text-center text-slate-500 py-6">
                  Practice Question Sets Not Available.<br />
                  Please contact your admin.
                </p>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-4">
                    Choose a set to start your test

                  </p>
                  <p><b>Level : </b>{levelwise_set[0]?.level_name}</p>
                  <br />
                  <div className="grid grid-cols-3 gap-3">
                    {levelwise_set?.map(item => (
                      <button
                        key={`${item.level}-${item.set_id}`}
                        onClick={() => handleSetSelect(item.level, item.set_id)}
                        className="
              h-12 rounded-xl font-semibold text-sm
              border border-blue-500 text-blue-600
              hover:bg-blue-600 hover:text-white
              active:scale-95 transition
            "
                      >
                        {/* {item.level}{item.set_id} */}
                        {item.set_id}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setModalOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </Modal>

          </div>

        </div>
      </div>
    </>
  );
}

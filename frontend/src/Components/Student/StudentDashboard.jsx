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

  const { data: upcomeingexam, reload } = useFetchData(() => examScheduleApi.getstudnetupcomeingexam(user.level, user.id));
  const { data: levelwise_set } = useFetchData(() => questionApi.getset(user.level, user.id));

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
    navigate("/exam-rule");
  };

  const liveExam = () => {
    localStorage.setItem("paperset", liveExamData?.paper_set);
    localStorage.setItem("paperlevel", liveExamData?.exam_level);
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
      <div className=' bg-gradient-to-br from-[#F0F7FF] via-[#E6F2FF] to-[#D9EBFF] h-[100vh]'>


        <div className="max-w-full m-2 md:m-4 px-2 md:px-0 ">
          <StudentAppBar
            title="Student Dashboard"
            subtitle="Train Your Brain Daily"
            userName={userName}
            userInitials={userInitials}
            userImage={userImage}
            onLogout={handleLogout}
          />

          {/* Upcoming Exams Carousel Section */}
          <div className="my-6 md:my-10">

            <TopAutoCarousel
              className="mb-6"
              items={
                upcomeingexam?.map((exam) => (
                  <CreamCarouselCard
                    key={exam.id}
                    title={`Abacus Level ${exam.exam_level} Examination`}
                    subtitle={exam.exam_title}
                    examDate={formatDate(exam.date)}
                    startTime={formatTime(exam.start_time)}
                    endTime={formatTime(exam.end_time)}
                    image={examImg}
                  />
                )) || []
              }
            />



            {/* Start Exam Buttons */}
            <div className="flex justify-center my-6 md:my-8">
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 w-full max-w-md px-4 sm:px-0">
                {/* Mock Exam */}
                {firstExam && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowSets(true)}
                    className="w-full sm:w-auto"
                  >
                    Mock Exam
                  </Button>
                )}

                {/* Live Exam */}
                {liveExamData && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => liveExam()}
                    className="w-full sm:w-auto"
                  >
                    Live Exam
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>



        {showSets &&

          <div className='p-4'>
            <h3 className="text-base md:text-lg font-semibold mb-4 text-center pr-8">
              Select Question Set
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {levelwise_set?.map((item) => (
                <>
                  <button
                    key={`${item.level}-${item.set_id}`}
                    type="button"
                    onClick={() => handleSetSelect(item.level, item.set_id)}
                    className="border-2 border-blue-600 text-blue-600 rounded-lg py-2 md:py-3 px-2 font-semibold text-sm md:text-base hover:bg-blue-600 hover:text-white transition active:scale-95"
                  >
                    Set {item.level}{item.set_id}
                  </button>
                </>

              ))}
            </div>
          </div>
        }

      </div>
    </>
  )
}


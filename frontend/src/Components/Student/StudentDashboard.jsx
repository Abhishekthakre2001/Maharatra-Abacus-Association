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

export default function StudentDashboard() {

  const navigate = useNavigate();
  const [showSets, setShowSets] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User Name";
  const userImage = user?.image || user?.avatar || null;
  const userInitials = userName.split(" ").filter(Boolean).map(n => n[0]).slice(0,2).join("").toUpperCase() || "AT";

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
    localStorage.setItem("paperlevel",level);
    navigate("/exam-rule");
  };

  const liveExam = () =>{
     localStorage.setItem("paperset", liveExamData?.paper_set);
    localStorage.setItem("paperlevel",liveExamData?.exam_level);
    navigate("/exam-rule");
  }

  const scrollToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    const maxSlides = upcomeingexam?.length || 0;
    if (currentSlide < maxSlides - 1) {
      scrollToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      scrollToSlide(currentSlide - 1);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <div className="max-w-full m-2 md:m-4 px-2 md:px-0">
        <StudentAppBar
          title="Student Dashboard"
          subtitle="Overview of student activities and performance"
          userName={userName}
          userInitials={userInitials}
          userImage={userImage}
          onLogout={handleLogout}
        />

        {/* Upcoming Exams Carousel Section */}
        <div className="my-6 md:my-10">
          <div className="relative mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white p-4 md:p-6 rounded-2xl flex items-center gap-2 md:gap-3"
                style={{ background: `linear-gradient(135deg, ${colors.primary.blue600}, ${colors.primary.blue700})` }}>
              <BookOpenCheck className="flex-shrink-0" size={24} />
              Upcoming Exams
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8" 
               style={{ background: `linear-gradient(135deg, ${colors.primary.blue500}, ${colors.primary.blue600})` }}>
            
            {/* Navigation Buttons */}
            {upcomeingexam && upcomeingexam.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="absolute left-1 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 md:p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: colors.primary.blue600 }}
                >
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                </button>
                
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === (upcomeingexam?.length || 0) - 1}
                  className="absolute right-1 md:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 md:p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ color: colors.primary.blue600 }}
                >
                  <ChevronRight size={16} className="md:w-5 md:h-5" />
                </button>
              </>
            )}

            {/* Carousel Wrapper */}
            <div
              ref={carouselRef}
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div 
                className="flex transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {upcomeingexam?.map((exam, index) => {
                  const liveExamFlag = isToday(exam.date) && isLiveTime(exam.start_time, exam.end_time);

                  return (
                    <div
                      key={exam.id}
                      className="flex-shrink-0 w-full px-1 md:px-2 lg:px-4"
                    >
                      {/* Exam Card */}
                      <div
                        className="rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl mx-auto max-w-xs md:max-w-sm lg:max-w-md"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary.blue700}, ${colors.primary.blue600})`,
                          border: `2px solid ${colors.background.white}`
                        }}
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3 md:mb-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-white/20 backdrop-blur-sm p-2 md:p-2.5 rounded-lg md:rounded-xl">
                              <BookOpenCheck className="text-white" size={18} />
                            </div>
                            {liveExamFlag && (
                              <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full animate-pulse">
                                LIVE NOW
                              </span>
                            )}
                          </div>
                          <span className="bg-white/90 text-blue-700 text-xs md:text-sm font-bold px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl shadow">
                            Level {exam.level_name}
                          </span>
                        </div>

                        {/* Card Number (decorative) */}
                        <div className="mb-4 md:mb-6">
                          <div className="text-white/60 text-[10px] md:text-xs mb-1 md:mb-2 font-medium">EXAM ID</div>
                          <div className="text-white text-sm md:text-lg lg:text-xl font-mono tracking-wider">
                            {String(exam.id).padStart(4, '0')} •••• •••• {exam.paper_set}
                          </div>
                        </div>

                        {/* Exam Title */}
                        <h3 className="text-white text-base md:text-lg lg:text-xl font-bold mb-4 md:mb-6 line-clamp-2">
                          {exam.exam_title}
                        </h3>

                        {/* Exam Details */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4">
                            <div className="flex items-center text-white/70 text-[10px] md:text-xs mb-1 md:mb-2">
                              <Calendar size={12} className="mr-1 md:mr-2" />
                              DATE
                            </div>
                            <div className="text-white font-semibold text-xs md:text-sm">
                              {new Date(exam.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4">
                            <div className="flex items-center text-white/70 text-[10px] md:text-xs mb-1 md:mb-2">
                              <Clock size={12} className="mr-1 md:mr-2" />
                              TIME
                            </div>
                            <div className="text-white font-semibold text-xs md:text-sm">
                              {exam.start_time.slice(0, 5)} - {exam.end_time.slice(0, 5)}
                            </div>
                          </div>
                        </div>

                        {/* Paper Set Info */}
                        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4">
                          <span className="text-white/70 text-xs md:text-sm">Paper Set</span>
                          <span className="text-white font-bold text-base md:text-lg">{exam.paper_set}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            {upcomeingexam && upcomeingexam.length > 1 && (
              <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
                {upcomeingexam.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={`transition-all rounded-full ${
                      currentSlide === index 
                        ? 'w-6 md:w-8 h-2 md:h-3' 
                        : 'w-2 md:w-3 h-2 md:h-3 opacity-50'
                    }`}
                    style={{
                      backgroundColor: colors.background.white
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

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

      {showSets && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-[9999] p-4 overflow-auto">
          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 w-full max-w-sm md:max-w-md mx-auto relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSets(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
            
            <h3 className="text-base md:text-lg font-semibold mb-4 text-center pr-8">
              Select Question Set
            </h3>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {levelwise_set?.map((item) => (
                <button
                  key={`${item.level}-${item.set_id}`}
                  type="button"
                  onClick={() => handleSetSelect(item.level, item.set_id)}
                  className="border-2 border-blue-600 text-blue-600 rounded-lg py-2 md:py-3 px-2 font-semibold text-sm md:text-base hover:bg-blue-600 hover:text-white transition active:scale-95"
                >
                  Set {item.level}{item.set_id}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </>
  )
}


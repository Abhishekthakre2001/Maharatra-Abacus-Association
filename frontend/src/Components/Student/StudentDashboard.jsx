import React, { useState } from 'react'
import StudentAppBar from './StudentAppBar';
import DashboardCard from '../../UI/Dashboardcard';
import {
  BookOpenCheck, Percent, BarChart3, Users, Calendar, Clock
} from 'lucide-react';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';
import examScheduleApi from '../../api/examScheduleApi';
import questionApi from '../../api/questionApi';
import { useFetchData } from '../../hooks/useFetchData';

export default function StudentDashboard() {

  const navigate = useNavigate();
  const [showSets, setShowSets] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const { data: upcomeingexam, reload } = useFetchData(() => examScheduleApi.getstudnetupcomeingexam(user.level, user.id));
  const { data: levelwise_set } = useFetchData(() => questionApi.getset(user.level, user.id));

  console.log("levelwise_set", levelwise_set);

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


  console.log("showSets", showSets)
  console.log("levelwise_set", levelwise_set)

  const liveExam = () =>{
     localStorage.setItem("paperset", liveExamData.paper_set);
    localStorage.setItem("paperlevel",liveExamData.exam_level);
    // console.log("liveExamData",liveExamData.exam_level)
    navigate("/exam-rule");
  }

  return (
    <>
      <div className="max-w-full m-2">
        <StudentAppBar
          title="Student Dashboard"
          subtitle="Overview of student activities and performance"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-10">
          <DashboardCard
            title="Total Exams"
            value={0}
            icon={BookOpenCheck}
          />

          <DashboardCard
            title="Avarage Marks"
            value={0}
            icon={Percent}
          />
        </div>

        {/* Upcoming Exams Section */}
        <div className="my-10">
          <div className="relative mb-8">
            <h2 className="text-3xl font-bold  bg-blue-600 text-white p-4 rounded-t-2xl flex items-center gap-3">

              Upcoming Exams
            </h2>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomeingexam?.map((exam) => {
              const liveExam =
                isToday(exam.date) && isLiveTime(exam.start_time, exam.end_time);

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <BookOpenCheck className="text-blue-600" size={24} />
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                      Level {exam.level_name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                    {exam.exam_title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Calendar size={14} className="mr-2" />
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-xs">
                      <Clock size={14} className="mr-2" />
                      <span>
                        {exam.start_time} – {exam.end_time}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Paper Set: <b>{exam.paper_set}</b>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>

          {/* Start Exam Button */}
          <div className="flex justify-center my-6">
            <div className="flex justify-center gap-4 my-8 flex-wrap">
              {/* Mock Exam */}
              {firstExam && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSets(true)}
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
                >
                  Live Exam
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSets && (
        <div className="flex justify-center mt-4">
          <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Select Question Set
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {levelwise_set?.map((item) => (
                <button
                  key={`${item.level}-${item.set_id}`}
                  type="button"
                  onClick={() => handleSetSelect(item.level, item.set_id)}
                  className="border border-blue-600 text-blue-600 rounded-lg py-3 font-semibold
                 hover:bg-blue-600 hover:text-white transition"
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

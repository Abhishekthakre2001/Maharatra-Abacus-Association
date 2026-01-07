import React from 'react'
import StudentAppBar from './StudentAppBar';
import DashboardCard from '../../UI/Dashboardcard';
import {
  BookOpenCheck, Percent, BarChart3, Users, Calendar, Clock
} from 'lucide-react';
import Button from '../../UI/Button';
import { useNavigate } from 'react-router-dom';


export default function StudentDashboard() {

  const navigate = useNavigate();
  const upcomingExams = [
    {
      id: 1,
      title: "Level 1 - Basic Abacus",
      date: "Jan 15, 2026",
      time: "10:00 AM",
      duration: "30 mins",
      totalQuestions: 20
    },
    {
      id: 2,
      title: "Level 2 - Intermediate Abacus",
      date: "Jan 20, 2026",
      time: "11:00 AM",
      duration: "45 mins",
      totalQuestions: 30
    },
    {
      id: 3,
      title: "Level 3 - Advanced Abacus",
      date: "Jan 25, 2026",
      time: "2:00 PM",
      duration: "60 mins",
      totalQuestions: 40
    },
    {
      id: 4,
      title: "Level 4 - Expert Abacus",
      date: "Jan 30, 2026",
      time: "3:00 PM",
      duration: "60 mins",
      totalQuestions: 50
    }
  ];

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
            {upcomingExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <BookOpenCheck className="text-blue-600" size={24} />
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                    Level {exam.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                  {exam.title}
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center text-gray-600 text-xs">
                    <Calendar size={14} className="mr-2" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs">
                    <Clock size={14} className="mr-2" />
                    <span>{exam.time} • {exam.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs">
                    <span className="font-semibold">Questions: {exam.totalQuestions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Start Exam Button */}
          <div className="flex justify-center my-6">
            <Button variant="primary" size="lg" onClick={() => navigate('/exam-rule')}>
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

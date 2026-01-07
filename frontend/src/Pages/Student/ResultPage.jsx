import React from 'react'
import StudentAppBar from '../../Components/Student/StudentAppBar'
import Button from '../../UI/Button'
import { CheckCircle, XCircle, Award, TrendingUp, Home } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function ResultPage() {

  const navigate = useNavigate();
  // Dummy result data
  const resultData = {
    studentName: "John Doe",
    examTitle: "Level 1 - Basic Abacus",
    totalQuestions: 20,
    correctAnswers: 15,
    incorrectAnswers: 5,
    totalMarks: 100,
    obtainedMarks: 75,
    percentage: 75,
    timeTaken: "25:30",
    date: "Jan 7, 2026"
  }

  // Data for pie chart
  const chartData = [
    { name: 'Correct Answers', value: resultData.correctAnswers },
    { name: 'Incorrect Answers', value: resultData.incorrectAnswers }
  ]

  const COLORS = ['#10b981', '#ef4444']

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">Count: {payload[0].value}</p>
          <p className="text-sm text-gray-600">Percentage: {((payload[0].value / resultData.totalQuestions) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const getResultMessage = (percentage) => {
    if (percentage >= 90) return { title: "Outstanding!", message: "Excellent performance! Keep up the great work!", emoji: "🎉" }
    if (percentage >= 75) return { title: "Great Job!", message: "You did really well! Keep practicing!", emoji: "🌟" }
    if (percentage >= 60) return { title: "Good Work!", message: "Nice effort! A bit more practice will help!", emoji: "👏" }
    return { title: "Keep Trying!", message: "Don't worry! Practice makes perfect!", emoji: "💪" }
  }

  const result = getResultMessage(resultData.percentage)

  return (
    <>
      <div className='max-w-full h-screen overflow-hidden flex flex-col'>
        <div className="m-2 mb-0 flex-shrink-0">
          <StudentAppBar
            title="Exam Result"
            subtitle="Your performance summary"
          />
        </div>

        <div className="flex-1 overflow-y-auto m-2">
          {/* Thank You Message Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-4 text-white text-center">
            <div className="text-6xl mb-3">{result.emoji}</div>
            <h2 className="text-3xl font-bold mb-2">{result.title}</h2>
            <p className="text-lg opacity-90 mb-3">{result.message}</p>
            <p className="text-sm opacity-75">Thank you for completing {resultData.examTitle}</p>
          </div>

          {/* Result Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Award className="mx-auto text-yellow-500 mb-2" size={32} />
              <p className="text-gray-500 text-xs mb-1">Score</p>
              <p className="text-2xl font-bold text-gray-800">{resultData.percentage}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
              <p className="text-gray-500 text-xs mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-600">{resultData.correctAnswers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <XCircle className="mx-auto text-red-500 mb-2" size={32} />
              <p className="text-gray-500 text-xs mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-red-600">{resultData.incorrectAnswers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <TrendingUp className="mx-auto text-blue-500 mb-2" size={32} />
              <p className="text-gray-500 text-xs mb-1">Marks</p>
              <p className="text-2xl font-bold text-blue-600">{resultData.obtainedMarks}/{resultData.totalMarks}</p>
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 mb-4 border border-blue-100">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 text-center">
              Performance Overview
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Pie Chart */}
              <div className="w-full md:w-1/2 relative" style={{ height: '350px' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 blur-3xl"></div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={5}
                      animationBegin={0}
                      animationDuration={800}
                      filter="url(#shadow)"
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          strokeWidth={3}
                          stroke="#fff"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span className="font-semibold text-gray-700">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Score Display */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                    {resultData.percentage}%
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-1">Total Score</div>
                </div>
              </div>

              {/* Statistics */}
              <div className="w-full md:w-1/2 space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Total Questions</span>
                    <span className="font-bold text-gray-800">{resultData.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Time Taken</span>
                    <span className="font-bold text-gray-800">{resultData.timeTaken}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Date</span>
                    <span className="font-bold text-gray-800">{resultData.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Status</span>
                    <span className={`font-bold ${resultData.percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                      {resultData.percentage >= 60 ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Overall Performance</span>
                    <span className="text-sm font-semibold text-gray-800">{resultData.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${resultData.percentage >= 75 ? 'bg-green-500' : resultData.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${resultData.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pb-4">
            <Button
              variant="secondary"
              size="md"
              icon={Home}
              onClick={() => navigate('/student-dashboard')}
            >
              Back to Dashboard
            </Button>
            {/* <Button
                            variant="primary"
                            size="md"
                            onClick={() => console.log('View detailed report')}
                        >
                            View Detailed Report
                        </Button> */}
          </div>
        </div>
      </div>
    </>
  )
}

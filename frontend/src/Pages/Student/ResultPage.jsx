import React from "react";
import { useNavigate } from "react-router-dom";
import StudentAppBar from "../../Components/Student/StudentAppBar";
import Button from "../../UI/Button";
import {
  Award,
  CheckCircle2,
  XCircle,
  Timer,
  Calendar,
  Home
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function ResultPage() {
  const navigate = useNavigate();

  /* ================= READ FROM LOCAL STORAGE ================= */
  const storedResult = JSON.parse(localStorage.getItem("result")) || {};

  /* ================= MAP BACKEND DATA ================= */
  const totalQuestions = storedResult.total_question || 0;
  const correctAnswers = storedResult.total_correct || 0;
  const unsolved = storedResult.total_unsolve || 0;

  const incorrectAnswers = Math.max(
    totalQuestions - correctAnswers - unsolved,
    0
  );


  const obtainedMarks = correctAnswers * 1; // adjust if needed
  const totalMarks = totalQuestions * 1;

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const resultData = {
    examTitle: "Abacus Examination",
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    obtainedMarks,
    totalMarks,
    percentage,
    timeTaken: storedResult.time_taken || "00:00:00",
    date: storedResult.date || "--"
  };

  /* ================= PIE DATA ================= */
  const pieData =
    totalQuestions > 0
      ? [
        { name: "Correct", value: correctAnswers },
        { name: "Incorrect", value: incorrectAnswers },
        { name: "Unattempted", value: unsolved }
      ]
      : [{ name: "No Data", value: 1 }];

  const COLORS =
    totalQuestions > 0
      ? ["#22c55e", "#ef4444", "#facc15"] // green, red, yellow
      : ["#cbd5e1"];


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StudentAppBar
        title="Exam Result"
        subtitle="Performance Summary"
      />

      <div className="flex-1 px-4 py-4 space-y-4 max-w-md mx-auto w-full">

        {/* ================= SUMMARY CARD ================= */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <h2 className="text-lg font-semibold">
            {resultData.examTitle}
          </h2>

          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-sm opacity-80">Score</p>
              <p className="text-4xl font-bold">
                {percentage}%
              </p>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${percentage >= 60
                ? "bg-green-500/20 text-green-100"
                : "bg-red-500/20 text-red-100"
                }`}
            >
              {percentage >= 60 ? "PASS" : "FAIL"}
            </div>
          </div>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={CheckCircle2}
            label="Correct"
            value={resultData.correctAnswers}
            color="text-green-600"
          />
          <StatCard
            icon={XCircle}
            label="Incorrect"
            value={resultData.incorrectAnswers}
            color="text-red-600"
          />
          <StatCard
            icon={Award}
            label="Marks"
            value={`${resultData.obtainedMarks}/${resultData.totalMarks}`}
            color="text-blue-600"
          />
          <StatCard
            icon={Timer}
            label="Time"
            value={resultData.timeTaken}
            color="text-purple-600"
          />
        </div>

        {/* ================= PIE CHART ================= */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Answer Distribution
          </h3>

          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-slate-800">
                {percentage}%
              </p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-2 text-xs">
            <LegendDot color="bg-green-500" label="Correct" />
            <LegendDot color="bg-red-500" label="Incorrect" />
            <LegendDot color="bg-yellow-400" label="Unattempted" />
          </div>

        </div>

        {/* ================= META INFO ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2 text-sm">
          <InfoRow
            icon={Calendar}
            label="Exam Date"
            value={resultData.date}
          />
          <InfoRow
            icon={Award}
            label="Total Questions"
            value={resultData.totalQuestions}
          />
        </div>

        {/* ================= ACTION ================= */}
        <Button
          icon={Home}
          className="w-full"
          variant="secondary"
          onClick={() => navigate("/student-dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
    <div className={`p-2 rounded-lg bg-gray-100 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
    <span className="text-gray-600">{label}</span>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon size={16} className="text-gray-400" />
    <span className="text-gray-600">{label}</span>
    <span className="ml-auto font-medium text-gray-800">{value}</span>
  </div>
);

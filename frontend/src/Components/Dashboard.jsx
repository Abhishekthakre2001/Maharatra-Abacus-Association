import React from 'react';
import {
  Package, ShoppingCart, BarChart3, Users
} from 'lucide-react';
import DashboardCard from "../UI/Dashboardcard.jsx";
import DataTable from '../UI/DataTable.jsx';
import AppBar from '../UI/AppBar.jsx';
import { useFetchData } from '../hooks/useFetchData.js';
import summaryapi from "../api/summary.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";




export default function Dashboard() {
  // Sample static data for display
  const products = [];
  const loading = false;

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: summary, reload } = useFetchData(() => summaryapi.getsummary(user.id));
  const summaryData = Array.isArray(summary) ? summary[0] : summary;

  console.log("summary", summary)

  const chartData = (summaryData?.questions?.set_wise || []).map(item => ({
    name: `L${item.level}-${item.set_id}`,
    questions: item.question_count
  }));




  return (
    <>
      {/* header */}
      <div className="max-w-7xl mx-auto">
        <AppBar
          title="Student Management"
          subtitle="Manage and view all students"
        />

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
          <DashboardCard
            title="Total Students"
            value={summaryData?.students?.total_students || 0}
            icon={Users}
          />

          <DashboardCard
            title="Total Questions"
            value={summaryData?.questions?.total_questions || 0}
            icon={ShoppingCart}
          />

          <DashboardCard
            title="Total Levels"
            value={summaryData?.levels?.total_levels || 0}
            icon={Package}
          />

          <DashboardCard
            title="Upcoming Exams"
            value={summaryData?.exams?.upcoming_exams || 0}
            icon={BarChart3}
          />

        </div>

      </div>


      <div className="bg-white rounded-2xl shadow p-6 my-10">
        <h3 className="text-lg font-semibold mb-1">
          Set-wise Question Trend
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Questions distribution across Level & Sets
        </p>

        {chartData.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopOpacity={0.4} />
                  <stop offset="100%" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="questions"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>





    </>
  );
}
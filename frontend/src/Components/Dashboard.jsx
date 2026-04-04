import React, { useState } from 'react';
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
import ResultApi from "../api/result.js";
import { Download } from "lucide-react";




export default function Dashboard() {
  // Sample static data for display
  const products = [];
  const loading = false;
  const [isDownloading, setIsDownloading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};

  const { data: summary, reload } = useFetchData(() => {
    if (!user?.id) return Promise.resolve(null);
    return summaryapi.getsummary(user.id);
  });
  const summaryData = Array.isArray(summary) ? summary[0] : summary;

  console.log("summary", summary)

  const chartData = (summaryData?.questions?.set_wise || []).map(item => ({
    name: `L${item.level}-${item.set_id}`,
    questions: item.question_count
  }));


  const handleDownloadAllResults = async () => {
    try {
      if (!user?.id) {
        alert("User id not found");
        return;
      }

      setIsDownloading(true); // 🔥 start loading

      const response = await ResultApi.downloadAllResultsExcel(user.id);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `results_${user.id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Excel download failed:", error);
      alert("Failed to download Excel file");
    } finally {
      setIsDownloading(false); // 🔥 stop loading
    }
  };

  return (
    <>
      {/* header */}
      <div className="max-w-7xl mx-auto">
        <AppBar
          title="Abacus"
          subtitle="Think Faster with Abacus"
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
      <button
        onClick={handleDownloadAllResults}
        disabled={isDownloading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition
    ${isDownloading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"}`}
      >
        {isDownloading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            Downloading...
          </>
        ) : (
          <>
            <Download size={18} />
            Download All Results
          </>
        )}
      </button>

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
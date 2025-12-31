import React from 'react';
import {
  Package, ShoppingCart, BarChart3, Users
} from 'lucide-react';
import DashboardCard from "../UI/Dashboardcard.jsx";
import DataTable from '../UI/DataTable.jsx';


export default function Dashboard() {
  // Sample static data for display
  const products = [];
  const loading = false;

  const columns = [
    {
      key: 'id',
      label: 'Sr. No.',
      render: (value, row, index, serial) => serial + 1
    },
    {
      key: 'qr_code_number',
      label: 'QR Code Number',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'net_weight',
      label: 'Net Weight',
      sortable: true,
      render: (value) => <span>{value} kg</span>
    },
    {
      key: 'created_by',
      label: 'Added By',
      sortable: true,
      render: (value) => <span>{value}</span>
    },
    {
      key: 'created_at',
      label: 'Added On',
      sortable: true,
      render: (value) =>
        value ? new Date(value).toLocaleDateString("en-GB") : ""
    }
  ];

  return (
    <>
      {/* header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
      bg-opacity-70
      backdrop-blur-xl
      shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Student Management</h1>
              <p className="hidden md:block text-white text-sm md:text-lg">Manage and view all students</p>
              <div className='flex gap-4 my-4 md:my-0'>
                {/* User Icon */}
                <div className="md:hidden w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
                  {"AT"}
                </div>
                {/* Welcome Text */}
                <div className="text-left md:hidden">
                  <p className="text-sm text-blue-200">Welcome Back,</p>
                  <p className="text-lg font-semibold text-white">
                    User Name
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
          <DashboardCard
            title="Total Students"
            value={0}
            icon={Package}
          />

          <DashboardCard
            title="Total Questions"
            value={0}
            icon={ShoppingCart}
          />

          <DashboardCard
            title="Total Levels"
            value={0}
            icon={Users}
          />

          <DashboardCard
            title="Upcoming Tests"
            value={0}
            icon={BarChart3}
          />
        </div>
      </div>




    </>
  );
}
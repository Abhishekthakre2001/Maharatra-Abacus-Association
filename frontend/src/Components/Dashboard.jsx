import React from 'react';
import {
  Package, ShoppingCart, BarChart3, Users
} from 'lucide-react';
import DashboardCard from "../UI/Dashboardcard.jsx";
import DataTable from '../UI/DataTable.jsx';
import AppBar from '../UI/AppBar.jsx';


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
        <AppBar
          title="Student Management"
          subtitle="Manage and view all students"
        />

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
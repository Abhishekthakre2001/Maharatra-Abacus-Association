import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTableState from "../../hooks/useTableState";
import { useDelete } from "../../hooks/useDelete";
import { useFetchData } from "../../hooks/useFetchData";
import userApi from "../../api/userApi";
import colors from "../../utils/Color";
import { downloadExcelFile } from "../../utils/downloadExcelFile";
import DeleteConfirmModal from "../../UI/DeleteConfirmModal";
import AppBar from "../../UI/AppBar";
import Tabs from "../../UI/Tabs";
import DataTable from "../../UI/DataTable";

export default function AdminList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [registrationType, setRegistrationType] = useState(undefined);
  const {
    page,
    limit,
    search,
    debouncedSearch,

    setPage,
    handleSearchChange,
    handleLimitChange,
  } = useTableState();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { remove, loading: deleteLoading } = useDelete(userApi.delete, () => {
    setDeleteOpen(false);
    setSelectedRow(null);
    reload(); // 🔄 reload table after delete
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const {
    data: response,
    loading,
    reload,
  } = useFetchData(
    () => {
      if (!user?.id) return Promise.resolve(null);

      return userApi.getBySuperAdminId(
        user.id,
        page,
        limit,
        debouncedSearch,
        registrationType,
      );
    },
    [page, limit, debouncedSearch, activeTab, registrationType],
    { preserveResponse: true },
  );

  const Admins = response?.data || [];
  const totalPages = response?.pagination?.totalPages || 1;

  const totalRecords = response?.pagination?.totalRecords || 0;

  const handleEdit = (row) => {
    // Navigate to add-student in update mode with id
    navigate(`/add-admin/${row.id}?from=admins`);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    if (selectedRow?.id) {
      remove(selectedRow.id);
    }
  };

  const columns = [
    // {
    //     key: "id",
    //     label: "Sr. No.",
    //     render: (value, row, index, serial) => serial + 1
    // },
    {
      key: "name",
      label: "Student Name",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    // {
    //     key: "class",
    //     label: "Class",
    //     sortable: true
    // },
    {
      key: "class",
      label: "Class",
      sortable: true,
      render: (value) => value || "N/A",
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
      render: (value) => <span className="text-sm">{value}</span>,
    },
    {
      key: "mobilenumber",
      label: "Mobile Number",
      sortable: true,
    },
    {
      key: "dob",
      label: "Date of Birth",
      sortable: true,
      isDate: true,
      render: (value) =>
        value ? new Date(value).toLocaleDateString("en-GB") : "",
    },
    {
      key: "subscription_end_date",
      label: "Subscription End Date",
      sortable: true,
      isDate: true,

      render: (value) =>
        value ? new Date(value).toLocaleDateString("en-GB") : "",
    },

    // {
    //     key: "level",
    //     label: "Level",
    //     sortable: true,
    //     render: (value) => (
    //         <span
    //             className="px-2 py-1 rounded-full text-xs"
    //             style={{
    //                 backgroundColor: colors.common.blue100,
    //                 color: colors.common.blue700
    //             }}
    //         >
    //             {value}
    //         </span>
    //     )
    // },
    {
      key: "level",
      label: "Level",
      sortable: true,
      render: (value, row) => {
        const levelText = row.level_name
          ? `${value} - ${row.level_name}`
          : value;

        return (
          <span
            className="px-2 py-1 rounded-full text-xs"
            style={{
              backgroundColor: colors.common.blue100,
              color: colors.common.blue700,
            }}
          >
            {levelText}
          </span>
        );
      },
    },
    {
      key: "username",
      label: "Username",
      sortable: true,
      render: (value) => (
        <span className="font-medium" style={{ color: colors.common.gray600 }}>
          {value}
        </span>
      ),
    },
    {
      key: "password",
      label: "Password",
      sortable: true,
      render: (value) => (
        <span className="font-medium" style={{ color: colors.common.gray600 }}>
          {value}
        </span>
      ),
    },
  ];

  const handleExport = () => {
    downloadExcelFile(() => userApi.exportData(user?.id), "users.xlsx");
  };
  
  return (
    <>
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Student"
        message={`Are you sure you want to delete "${selectedRow?.name}"? This action cannot be undone.`}
      />

      <div className="max-w-7xl mx-auto">
        <AppBar
          title="Admin Management"
          subtitle="Manage and view all admins"
        />
      </div>

      <div className="p-0 my-8">
        <DataTable
          columns={columns}
          data={Admins}
          title="All Admins"
          currentPage={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          searchTerm={search}
          onSearchChange={handleSearchChange}
          onCreate={() => navigate("/add-admin")}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable
          pagination
          showActions
          loading={loading}
          onExport={handleExport}
        />
      </div>
    </>
  );
}

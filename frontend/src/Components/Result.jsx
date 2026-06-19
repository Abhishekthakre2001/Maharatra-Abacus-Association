import React from "react";
import { useFetchData } from "../hooks/useFetchData";
import DataTable from "../UI/DataTable";
import { useNavigate } from "react-router-dom";
import AppBar from "../UI/AppBar";
import Tabs from "../UI/Tabs";
import userApi from "../api/userApi";
import ExamResult from "../Pages/Examresult";
import useTableState from "../hooks/useTableState";
export default function Result() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const {
    page,
    limit,
    search,
    debouncedSearch,

    setPage,
    handleSearchChange,
    handleLimitChange,
  } = useTableState();
  const {
    data: response,
    loading,
    reload,
  } = useFetchData(
    () => {
      if (!user?.id) return Promise.resolve(null);

      return userApi.getresultbyadminid(user.id, page, limit, debouncedSearch);
    },
    [page, limit, debouncedSearch],
    { preserveResponse: true },
  );
  const students = response?.data || [];

  const totalPages = response?.pagination?.totalPages || 1;

  const totalRecords = response?.pagination?.totalRecords || 0;
  const handleView = (student) => {
    navigate(`/studentresults/${student.user_id}`);
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) =>
        value ? new Date(value).toLocaleDateString("en-GB") : "",
    },
    {
      key: "time",
      label: "Time",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "name",
      label: "Student Name",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },

    {
      key: "address",
      label: "Address",
      sortable: true,
      render: (value) => <span className="text-sm">{value}</span>,
    },

    {
      key: "city",
      label: "City",
      sortable: true,
      render: (value) => <span className="text-sm">{value}</span>,
    },
    {
      key: "Paperlevel",
      label: "Level",
      sortable: true,
    },
    {
      key: "PaperSet",
      label: "Set",
      sortable: true,
    },

    {
      key: "total_question",
      label: "Total Questions",
      sortable: true,
    },
    {
      key: "total_answer",
      label: "Total Answer",
      sortable: true,
    },
    {
      key: "total_correct",
      label: "Total Correct",
      sortable: true,
    },
    {
      key: "total_unsolve",
      label: "Total Unsolve",
      sortable: true,
    },
    {
      key: "totaltime",
      label: "Total Time",
      sortable: true,
    },
    {
      key: "time_taken",
      label: "Time Taken",
      sortable: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <AppBar
        title="Performance Results"
        subtitle="Insights into student achievements"
      />

      {/* tabs */}
      <div className="p-6">
        <Tabs
          tabs={[
            {
              label: "Test Result",
              content: (
                <>
                  <div className="p-0 my-8">
                    {/* <DataTable
                      columns={columns}
                      data={students}
                      title="All Students Results"
                      // onView={handleView}
                      searchable
                      pagination
                      showActions={false}
                      loading={loading}
                    /> */}

                    <DataTable
                      columns={columns}
                      data={students}
                      title="All Students Results"
                      currentPage={page}
                      totalPages={totalPages}
                      totalRecords={totalRecords}
                      onPageChange={setPage}
                      onLimitChange={handleLimitChange}
                      searchTerm={search}
                      onSearchChange={handleSearchChange}
                      searchable
                      pagination
                      showActions={false}
                      loading={loading}
                    />
                  </div>
                </>
              ),
            },
            { label: "Exam Result", content: <ExamResult /> },
          ]}
        />
      </div>
    </div>
  );
}

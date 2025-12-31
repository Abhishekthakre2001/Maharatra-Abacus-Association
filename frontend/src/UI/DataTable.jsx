import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Plus,
  X
} from 'lucide-react';

const DataTable = ({
  columns = [],
  data = [],
  title = "Data Table",
  onEdit,
  onDelete,
  onView,
  onCreate,
  onExport,
  showActions = true,
  searchable = true,
  pagination = true,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Date Filter States
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateColumn, setSelectedDateColumn] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Filtering Logic
  const filteredData = useMemo(() => {
    let result = data;

    if (searchTerm) {
      result = result.filter(item =>
        columns.some(column =>
          String(item[column.key] ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedDateColumn && fromDate && toDate) {
      result = result.filter(item => {
        const date = new Date(item[selectedDateColumn]);
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    }

    return result;
  }, [data, searchTerm, columns, selectedDateColumn, fromDate, toDate]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const col = columns.find(c => c.key === sortConfig.key);
      const isDate = col?.isDate;

      const valA = isDate ? new Date(a[sortConfig.key]) : a[sortConfig.key];
      const valB = isDate ? new Date(b[sortConfig.key]) : b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, fromDate, toDate]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = columns.map(col => col.label);
    const rows = sortedData.map(row =>
      columns.map(col => {
        const val = row[col.key];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      })
    );

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: columnKey, direction: "asc" };
    });
  };


  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            {/* <p className="text-slate-600 mt-1">
              Showing {paginatedData.length} of {sortedData.length} entries
            </p> */}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            )}

            <div className="flex gap-2">
              {onCreate && (
                <button
                  onClick={onCreate}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <Plus size={16} />
                  Add New
                </button>
              )}

              <button
                onClick={onExport ?? handleExportCSV}
                className="flex items-center gap-2 bg-[#FF7F36] hover:bg-[#e86f2c] text-white px-4 py-2 rounded-lg"
              >
                <Download size={16} />
                Export CSV
              </button>

              {/* ⭐ CLEAR FILTER BUTTON */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFromDate("");
                  setToDate("");
                  setSelectedDateColumn(null);
                  setSortConfig({ key: null, direction: "asc" });
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>

          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map(column => (
                  <th key={column.key} className="px-6 py-4 text-left font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span onClick={() => handleSort(column.key)} className="cursor-pointer">
                        {column.label}
                      </span>

                      <Filter
                        size={14}
                        className="text-slate-400 cursor-pointer"
                        title="Filter"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (column.isDate) {
                            setSelectedDateColumn(column.key);
                            setShowDateModal(true);
                          } else {
                            handleSort(column.key);
                          }
                        }}
                      />
                    </div>
                  </th>
                ))}

                {showActions && <th className="px-6 py-4 text-left font-semibold text-slate-700">Actions</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {loading ? (
                // 🔵 LOADING STATE
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 text-sm">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length ? (
                paginatedData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    {/* {columns.map(column => (
                      <td key={column.key} className="px-6 py-4 text-sm text-slate-600">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))} */}
                    {columns.map(column => (
                      <td key={column.key} className="px-6 py-4 text-sm text-slate-600">
                        {column.render
                          ? column.render(
                            row[column.key],  // VALUE
                            row,              // FULL ROW
                            index,            // INDEX
                            index + 1         // SERIAL NUMBER
                          )

                          : row[column.key]}
                      </td>
                    ))}


                    {showActions && (
                      <td className="px-6 py-4 flex gap-2">
                        {onView && (
                          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" onClick={() => onView(row)}>
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button className="p-1.5 text-orange-600 hover:bg-orange-100 rounded" onClick={() => onEdit(row)}>
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button className="p-1.5 text-red-600 hover:bg-red-100 rounded" onClick={() => onDelete(row)}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-16 text-center text-slate-500">
                    <Search size={40} className="text-slate-300 mx-auto mb-2" />
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="border border-slate-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-slate-600">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Beautiful Animated Date Filter Modal */}
      {showDateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={() => setShowDateModal(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-80 space-y-4 animate-scaleIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition"
              onClick={() => setShowDateModal(false)}
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold text-slate-800">
              Filter by Date
            </h3>

            <div className="flex flex-col gap-3">
              <label className="text-sm text-slate-600">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-sm text-slate-600">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition"
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                  setSelectedDateColumn(null);
                  setShowDateModal(false);
                }}
              >
                Clear
              </button>

              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                onClick={() => setShowDateModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Animation Class */}
      <style>
        {`
          .animate-scaleIn {
            animation: scaleIn 0.25s ease-out;
          }
          @keyframes scaleIn {
            0% {
              opacity: 0;
              transform: scale(0.85);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default DataTable;
import React, { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";
import useTableState from "../hooks/useTableState";

import districtApi from "../api/DistrictApi";
import stateApi from "../api/StateApi";

import DataTable from "../UI/DataTable";
import Modal from "../UI/Modal";
import DeleteConfirmModal from "../UI/DeleteConfirmModal";

import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";

export default function District() {
  const {
    page,
    limit,
    search,
    debouncedSearch,
    setPage,
    handleSearchChange,
    handleLimitChange,
  } = useTableState();

  // District List
  const {
    data: response,
    loading,
    reload,
  } = useFetchData(
    () => districtApi.getAll(page, limit, debouncedSearch),
    [page, limit, debouncedSearch],
    { preserveResponse: true }
  );

  // State Dropdown
  const { data: stateResponse } = useFetchData(
    () => stateApi.getAll(1, 1000, ""),
    [],
    { preserveResponse: true }
  );

  const districts = response?.data || [];

  const stateOptions =
    stateResponse?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const totalPages = response?.pagination?.totalPages || 1;
  const totalRecords = response?.pagination?.total || 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [stateId, setStateId] = useState("");
  const [name, setName] = useState("");
  const [prantId, setPrantId] = useState("0");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    {
      key: "state_name",
      label: "State",
    },
    {
      key: "name",
      label: "District",
    },
    // {
    //   key: "prant_id",
    //   label: "Prant ID",
    // },
  ];

  const resetForm = () => {
    setStateId("");
    setName("");
    setPrantId("");
    setError("");
  };

  const openCreate = () => {
    setEditingRow(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);

    setStateId(row.state_id || "");
    setName(row.name || "");
    setPrantId(row.prant_id || "");

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRow(null);
    resetForm();
  };

  const handleSave = async () => {
    if (!stateId) {
      setError("State is required");
      return;
    }

    if (!name.trim()) {
      setError("District name is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        state_id: stateId,
        prant_id: 0,
      };

      if (editingRow?.id) {
        await districtApi.update(editingRow.id, payload);
      } else {
        await districtApi.create(payload);
      }

      await reload();
      closeModal();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);

    try {
      await districtApi.delete(deleteTarget.id);

      await reload();

      setDeleteTarget(null);
      setDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <DataTable
        title="Districts"
        columns={columns}
        data={districts}
        currentPage={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        searchTerm={search}
        onSearchChange={handleSearchChange}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDeleteClick}
        searchable
        pagination
        showActions
        loading={loading}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}" ?`
            : ""
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingRow ? "Edit District" : "Create District"}
      >
        <div className="space-y-4">
          <SelectField
            label="State"
            required
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
            options={stateOptions}
            placeholder="Select State"
          />

          <InputField
            label="District Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter district name"
          />

          {/* <InputField
            label="Prant ID"
            type="number"
            required
            value={prantId}
            onChange={(e) => setPrantId(e.target.value)}
            placeholder="Enter Prant ID"
          />

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )} */}

          <div className="flex justify-end gap-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
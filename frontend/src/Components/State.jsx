import React, { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";
import useTableState from "../hooks/useTableState";

import stateApi from "../api/StateApi";

import DataTable from "../UI/DataTable";
import Modal from "../UI/Modal";
import DeleteConfirmModal from "../UI/DeleteConfirmModal";

import InputField from "../UI/InputField";
import SelectField from "../UI/SelectField";

export default function State() {
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
        () => stateApi.getAll(page, limit, debouncedSearch),
        [page, limit, debouncedSearch],
        { preserveResponse: true }
    );


    const states = response?.data || [];


    const totalPages = response?.pagination?.totalPages || 1;
    const totalRecords = response?.pagination?.total || 0;

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    const [countryId, setCountryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [isActive, setIsActive] = useState(1);

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


    const columns = [
        {
            key: "country_name",
            label: "Country",
        },
        {
            key: "name",
            label: "State",
        },
        {
            key: "description",
            label: "Description",
        },
        {
            key: "code",
            label: "Code",
        },
        {
            key: "zone_id",
            label: "Zone",
        },
    ];

    const countryOptions = [
        { value: 1, label: "India" },
        { value: 2, label: "UAE" },
        { value: 3, label: "Oman" },
        { value: 4, label: "Qatar" },
        { value: 5, label: "Saudi Arabia" },
        { value: 6, label: "Bahrain" },
        { value: 7, label: "Kuwait" },
    ];

    const resetForm = () => {
        setCountryId("");
        setName("");
        setDescription("");
        setCode("");
        setZoneId("");
        setIsActive(1);
        setError("");
    };

    const openCreate = () => {
        setEditingRow(null);
        resetForm();
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditingRow(row);

        setCountryId(row.country_id || "");
        setName(row.name || "");
        setDescription(row.description || "");
        setCode(row.code || "");
        setZoneId(row.zone_id || "");
        setIsActive(row.is_active ?? 1);

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingRow(null);
        resetForm();
    };

    const handleSave = async () => {
        if (!countryId) {
            setError("Country is required");
            return;
        }

        if (!name.trim()) {
            setError("State name is required");
            return;
        }

        if (!code.trim()) {
            setError("State code is required");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                country_id: countryId,
                name,
                description,
                code,
                zone_id: zoneId,
                image: "",
                is_active: isActive,
            };

            if (editingRow?.id) {
                await stateApi.update(editingRow.id, payload);
            } else {
                await stateApi.create(payload);
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
            await stateApi.delete(deleteTarget.id);

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
                title="States"
                columns={columns}
                data={states}
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
                title={editingRow ? "Edit State" : "Create State"}
            >
                <div className="space-y-4">
                    <SelectField
                        label="Country"
                        required
                        value={countryId}
                        onChange={(e) => setCountryId(e.target.value)}
                        options={countryOptions}
                        placeholder="Select Country"
                    />

                    <InputField
                        label="State Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter state name"
                    />

                    <InputField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                    />

                    <InputField
                        label="State Code"
                        required
                        value={code}
                        onChange={(e) =>
                            setCode(e.target.value.toUpperCase())
                        }
                        placeholder="MH"
                    />

                    <InputField
                        label="Zone ID"
                        type="number"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        placeholder="Enter zone id"
                    />

                    <SelectField
                        label="Status"
                        value={isActive}
                        options={[
                            {
                                label: "Active",
                                value: 1,
                            },
                            {
                                label: "Inactive",
                                value: 0,
                            },
                        ]}
                        onChange={(e) =>
                            setIsActive(Number(e.target.value))
                        }
                    />

                    {error && (
                        <p className="text-red-600 text-sm">
                            {error}
                        </p>
                    )}

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
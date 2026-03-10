import React, { useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import levelApi from '../api/LevelApi';
import DataTable from '../UI/DataTable';
import Modal from '../UI/Modal';
import DeleteConfirmModal from '../UI/DeleteConfirmModal';

export default function Level() {
  const adminid = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).id
    : null;

  const { data: levels, loading, reload } = useFetchData(() =>
    levelApi.getbyadminid(adminid)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [level, setLevel] = useState('');
  const [levelName, setLevelName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    { key: 'level', label: 'Level' },
    { key: 'level_name', label: 'Level Name' }
  ];

  const openCreate = () => {
    setEditingRow(null);
    setLevel('');
    setLevelName('');
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setLevel(row?.level ?? '');
    setLevelName(row?.level_name ?? '');
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRow(null);
    setLevel('');
    setLevelName('');
    setError('');
  };

  const handleSave = async () => {
    if (!level || !level.toString().trim()) {
      setError('Level is required');
      return;
    }

    if (!levelName || !levelName.trim()) {
      setError('Level name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        level,
        level_name: levelName,
        createdby: adminid
      };

      if (editingRow && editingRow.id) {
        await levelApi.update(editingRow.id, payload);
      } else {
        await levelApi.create(payload);
      }

      await reload();
      closeModal();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Save failed';

      if (errorMsg.includes('already exists')) {
        setError('This level already exists. Please use a different value.');
      } else {
        setError(errorMsg);
      }
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
      await levelApi.delete(deleteTarget.id);
      await reload();
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      // handle delete error if needed
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={levels}
        title="Levels"
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDeleteClick}
        searchable
        pagination
        showActions
        loading={loading}
        exportable={false}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.level}"?`
            : undefined
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingRow ? 'Edit Level' : 'Create Level'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Level
            </label>
            <input
              type="text"
              value={level}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setLevel(numericValue);
              }}
              className="w-full border border-slate-300 rounded px-3 py-2"
              placeholder="Enter numeric level (e.g., 1, 2, 3)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Level Name
            </label>
            <input
              type="text"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
              placeholder="Enter level name (e.g., Beginner)"
            />
          </div>

          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

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
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
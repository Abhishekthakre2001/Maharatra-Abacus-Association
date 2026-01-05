import React, { useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import levelApi from '../api/LevelApi';
import DataTable from '../UI/DataTable';
import Modal from '../UI/Modal';
import DeleteConfirmModal from '../UI/DeleteConfirmModal';

export default function Level() {
    const adminid = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null ;
  const { data: levels, loading, reload } = useFetchData(() => levelApi.getbyadminid(adminid));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'level', label: 'Level' }
  ];

  const openCreate = () => {
    setEditingRow(null);
    setValue('');
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setValue(row?.level ?? '');
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRow(null);
    setValue('');
    setError('');
  };

  const handleSave = async () => {
    if (!value || !value.trim()) {
      setError('This field is required');
      return;
    }

    setSaving(true);
    try {
      const payload = { level: value , createdby: adminid };
      if (editingRow && editingRow.id) {
        await levelApi.update(editingRow.id, payload);
      } else {
        await levelApi.create(payload);
      }
      await reload();
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed');
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
      // optionally handle error
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
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.level}"?` : undefined}
      />

      <Modal open={modalOpen} onClose={closeModal} title={editingRow ? 'Edit Level' : 'Create Level'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Level Name</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

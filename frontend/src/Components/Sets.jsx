// import React, { useState } from 'react';
// import { useFetchData } from '../hooks/useFetchData';
// import setsApi from '../api/SetsApi';
// import DataTable from '../UI/DataTable';
// import Modal from '../UI/Modal';
// import DeleteConfirmModal from '../UI/DeleteConfirmModal';

// export default function Sets() {
//     const [adminId, setAdminId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null );
//     const { data: sets, loading, reload } = useFetchData(() => setsApi.getbyadminid(adminId));

//     const [modalOpen, setModalOpen] = useState(false);
//     const [editingRow, setEditingRow] = useState(null);
//     const [value, setValue] = useState('');
//     const [error, setError] = useState('');
//     const [saving, setSaving] = useState(false);
//     const [deleteOpen, setDeleteOpen] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState(null);
//     const [deleteLoading, setDeleteLoading] = useState(false);

//     const columns = [
//         // { key: 'id', label: 'ID' },
//         { key: 'set_name', label: 'Set Name' },
//     ];

//     const openCreate = () => {
//         setEditingRow(null);
//         setValue('');
//         setError('');
//         setModalOpen(true);
//     };

//     const openEdit = (row) => {
//         setEditingRow(row);
//         setValue(row?.set_name ?? '');
//         setError('');
//         setModalOpen(true);
//     };

//     const closeModal = () => {
//         setModalOpen(false);
//         setEditingRow(null);
//         setValue('');
//         setError('');
//     };

//     const handleSave = async () => {
//         if (!value || !value.trim()) {
//             setError('This field is required');
//             return;
//         }

//         setSaving(true);
//         try {
//             const payload = { set_name: value, createdby: adminId }; // assuming admin id is 3
//             if (editingRow && editingRow.id) {
//                 await setsApi.update(editingRow.id, payload);
//             } else {
//                 await setsApi.create(payload);
//             }
//             await reload();
//             closeModal();
//         } catch (err) {
//             const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Save failed';
//             if (errorMsg.includes('already exists')) {
//                 setError('This set already exists. Please use a different name.');
//             } else {
//                 setError(errorMsg);
//             }
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDeleteClick = (row) => {
//         setDeleteTarget(row);
//         setDeleteOpen(true);
//     };

//     const handleDeleteConfirm = async () => {
//         if (!deleteTarget) return;
//         setDeleteLoading(true);
//         try {
//             await setsApi.delete(deleteTarget.id);
//             await reload();
//             setDeleteOpen(false);
//             setDeleteTarget(null);
//         } catch (err) {
//             // optionally show error
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     return (
//         <>
//             <DataTable
//                 columns={columns}
//                 data={sets}
//                 title="Sets"
//                 onCreate={openCreate}
//                 onEdit={openEdit}
//                 onDelete={handleDeleteClick}
//                 searchable
//                 pagination
//                 showActions
//                 loading={loading}
//                 exportable={false}
//             />

//             <DeleteConfirmModal
//                 open={deleteOpen}
//                 onClose={() => setDeleteOpen(false)}
//                 onConfirm={handleDeleteConfirm}
//                 loading={deleteLoading}
//                 message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.set_name}"?` : undefined}
//             />

//             <Modal open={modalOpen} onClose={closeModal} title={editingRow ? 'Edit Set' : 'Create Set'}>
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-1">Set Name</label>
//                         <input
//                             type="text"
//                             value={value}
//                             maxLength={1}
//                             onChange={(e) => {
//                                 const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
//                                 setValue(v);
//                             }}
//                             className="w-full border border-slate-300 rounded px-3 py-2"
//                             placeholder="A, B, C, ..."
//                         />
//                         {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
//                     </div>

//                     <div className="flex justify-end gap-2">
//                         <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Close</button>
//                         <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
//                             {saving ? 'Saving...' : 'Save'}
//                         </button>
//                     </div>
//                 </div>
//             </Modal>
//         </>
//     );
// }

import React, { useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import setsApi from '../api/SetsApi';
import DataTable from '../UI/DataTable';
import Modal from '../UI/Modal';
import DeleteConfirmModal from '../UI/DeleteConfirmModal';
import useTableState from "../hooks/useTableState";
export default function Sets() {
    const [adminId, setAdminId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null );
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
    reload
} = useFetchData(
    () => {
        if (!adminId)
            return Promise.resolve(null);

        return setsApi.getbyadminid(
            adminId,
            page,
            limit,
            debouncedSearch
        );
    },
    [adminId, page, limit, debouncedSearch],
    { preserveResponse: true }
);
const sets = response?.data || [];

const totalPages =
    response?.pagination?.totalPages || 1;

const totalRecords =
    response?.pagination?.totalRecords || 0;
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const columns = [
        // { key: 'id', label: 'ID' },
        { key: 'set_name', label: 'Set Name' },
    ];

    const openCreate = () => {
        setEditingRow(null);
        setValue('');
        setError('');
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditingRow(row);
        setValue(row?.set_name ?? '');
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
            const payload = { set_name: value, createdby: adminId }; // assuming admin id is 3
            if (editingRow && editingRow.id) {
                await setsApi.update(editingRow.id, payload);
            } else {
                await setsApi.create(payload);
            }
            await reload();
            closeModal();
        } catch (err) {
            const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Save failed';
            if (errorMsg.includes('already exists')) {
                setError('This set already exists. Please use a different name.');
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
            await setsApi.delete(deleteTarget.id);
            await reload();
            setDeleteOpen(false);
            setDeleteTarget(null);
        } catch (err) {
            // optionally show error
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            {/* <DataTable
                columns={columns}
                data={sets}
                title="Sets"
                onCreate={openCreate}
                onEdit={openEdit}
                onDelete={handleDeleteClick}
                searchable
                pagination
                showActions
                loading={loading}
                exportable={false}
            /> */}
<DataTable
    columns={columns}
    data={sets}
    title="Sets"

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
    exportable={false}
/>
            <DeleteConfirmModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.set_name}"?` : undefined}
            />

            <Modal open={modalOpen} onClose={closeModal} title={editingRow ? 'Edit Set' : 'Create Set'}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Set Name</label>
                        <input
                            type="text"
                            value={value}
                            maxLength={1}
                            onChange={(e) => {
                                const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                                setValue(v);
                            }}
                            className="w-full border border-slate-300 rounded px-3 py-2"
                            placeholder="A, B, C, ..."
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

'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from '../../hooks/useUsers';
import { Button } from '../../components/ui/Button';
import { UserFormData } from '../../schemas/user.schema';
import {
  UserFilterBar,
  UsersTable,
  CreateUserModal,
  DeleteUserModal,
  UserDocumentLinkedTab,
  UserComplaintsTab,
} from '../../components/users';
import { useComplaintsQuery } from '../../hooks/useComplaints';
import { Users, UserPlus, Link2, AlertCircle } from 'lucide-react';

export default function UsersPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'users' | 'linked-docs' | 'complaints'>('users');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useUsersQuery({
    page,
    limit: 10,
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  });

  const { data: complaints = [] } = useComplaintsQuery();
  const pendingComplaintsCount = complaints.filter((c) => c.status === 'PENDING').length;

  const createMutation = useCreateUserMutation();
  const statusMutation = useUpdateUserStatusMutation();
  const deleteMutation = useDeleteUserMutation();

  const handleCreateUser = async (formData: UserFormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await statusMutation.mutateAsync({ id, status: nextStatus });
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <AppLayout allowedRoles={['ADMIN', 'OFFICER']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              {activeTab === 'users' && <Users className="w-6 h-6 text-blue-900" />}
              {activeTab === 'linked-docs' && <Link2 className="w-6 h-6 text-blue-900" />}
              {activeTab === 'complaints' && <AlertCircle className="w-6 h-6 text-amber-600" />}
              {activeTab === 'users' && t('officerUsers.title', { defaultValue: 'User & Role Governance' })}
              {activeTab === 'linked-docs' && 'User & Document Linked Registry'}
              {activeTab === 'complaints' && 'User Grievance & Cadastral Complaints'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'users' &&
                t('officerUsers.subtitle', {
                  defaultValue: 'Admin-level provisioning, RBAC permission assignment, and account status controls.',
                })}
              {activeTab === 'linked-docs' &&
                'Cross-reference citizens, landowners, and official users with their uploaded cadastral deeds, 7/12 extracts, and digital records.'}
              {activeTab === 'complaints' &&
                'Statutory grievance redressal portal for boundary disputes, fraudulent title claims, delayed verifications, and mutation errors.'}
            </p>
          </div>

          {activeTab === 'users' && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="sm:self-start">
              <UserPlus className="w-4 h-4 mr-1.5" />
              {t('officerUsers.addUser', { defaultValue: 'Create Official Account' })}
            </Button>
          )}
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            User Accounts & RBAC
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {data?.pagination?.total ?? data?.users?.length ?? 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('linked-docs')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'linked-docs'
                ? 'border-blue-600 text-blue-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-4 h-4 text-blue-600" />
            User & Document Linked
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Cross-Referenced
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'complaints'
                ? 'border-blue-600 text-blue-900 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            User Complaints & Grievances
            {pendingComplaintsCount > 0 ? (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                {pendingComplaintsCount} Pending
              </span>
            ) : (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
                {complaints.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: ALL USER ACCOUNTS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters Toolbar */}
            <UserFilterBar
              search={search}
              onSearchChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              roleFilter={roleFilter}
              onRoleFilterChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            />

            {/* Users Table & Pagination */}
            <UsersTable
              isLoading={isLoading}
              isError={isError}
              errorMessage={(error as Error)?.message}
              users={data?.users}
              pagination={data?.pagination}
              currentPage={page}
              onPageChange={setPage}
              onToggleStatus={handleToggleStatus}
              onConfirmDelete={setDeleteTargetId}
            />
          </div>
        )}

        {/* TAB 2: USER & DOCUMENT LINKED */}
        {activeTab === 'linked-docs' && (
          <UserDocumentLinkedTab users={data?.users} isLoadingUsers={isLoading} />
        )}

        {/* TAB 3: USER COMPLAINTS */}
        {activeTab === 'complaints' && <UserComplaintsTab />}
      </div>

      {/* Provision User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
        isCreating={createMutation.isPending}
      />

      {/* Delete User Confirmation Modal */}
      <DeleteUserModal
        deleteTargetId={deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirmDelete={handleDeleteUser}
        isDeleting={deleteMutation.isPending}
      />
    </AppLayout>
  );
}

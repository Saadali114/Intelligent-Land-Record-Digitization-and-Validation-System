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
} from '../../components/users';
import { Users, UserPlus } from 'lucide-react';

export default function UsersPage() {
  const { t } = useTranslation();
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
    <AppLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-900" />
              {t('officerUsers.title', { defaultValue: 'User & Role Governance' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('officerUsers.subtitle', { defaultValue: 'Admin-level provisioning, RBAC permission assignment, and account status controls.' })}
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="sm:self-start">
            <UserPlus className="w-4 h-4 mr-1.5" />
            {t('officerUsers.addUser', { defaultValue: 'Create Official Account' })}
          </Button>
        </div>

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

'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from '../../hooks/useUsers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormSchema, UserFormData } from '../../schemas/user.schema';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  ShieldAlert,
  Edit2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function UsersPage() {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      role: 'OFFICER',
      status: 'ACTIVE',
      department: 'Revenue & Land Survey',
      district: 'Pune',
    },
  });

  const handleCreateUser = async (formData: UserFormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
      reset();
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
              User & Role Governance
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Admin-level provisioning, RBAC permission assignment, and account status controls.
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="sm:self-start">
            <UserPlus className="w-4 h-4 mr-1.5" />
            Create Official Account
          </Button>
        </div>

        {/* Filters and Search Bar */}
        <div className="gov-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, district..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="OFFICER">Officer</option>
              <option value="VERIFIER">Verifier</option>
              <option value="VIEWER">Viewer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="gov-card overflow-hidden">
          {isLoading && (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 text-center text-rose-600 text-xs font-semibold">
              {(error as Error)?.message || 'Failed to load users'}
            </div>
          )}

          {data && data.users.length === 0 && (
            <EmptyState
              title="No Users Found"
              description="No accounts match your search and filter criteria."
            />
          )}

          {data && data.users.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">User Details</th>
                      <th className="px-4 py-3.5">Role</th>
                      <th className="px-4 py-3.5">Department</th>
                      <th className="px-4 py-3.5">District</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Joined</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge status={user.role} />
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">{user.department}</td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">{user.district}</td>
                        <td className="px-4 py-3.5">
                          <Badge status={user.status} />
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{formatDate(user.createdAt)}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(user._id, user.status)}
                              className="px-2 py-1 rounded text-[11px] font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                              title="Toggle account active/inactive"
                            >
                              {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(user._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.pagination && (
                <div className="border-t border-slate-100 px-4">
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.totalPages}
                    totalItems={data.pagination.total}
                    limit={data.pagination.limit}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New Official Account"
        description="Create an authorized administrative or field officer account."
      >
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Patil"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Official Email"
            type="email"
            placeholder="name@landrecord.gov.in"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Initial Password"
            type="password"
            placeholder="Minimum 6 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assigned Role"
              options={[
                { value: 'OFFICER', label: 'Officer' },
                { value: 'VERIFIER', label: 'Verifier' },
                { value: 'VIEWER', label: 'Viewer' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />

            <Select
              label="Account Status"
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'SUSPENDED', label: 'Suspended' },
              ]}
              error={errors.status?.message}
              {...register('status')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department / Wing"
              placeholder="e.g. Settlement Office"
              error={errors.department?.message}
              {...register('department')}
            />

            <Input
              label="Jurisdiction District"
              placeholder="e.g. Pune"
              error={errors.district?.message}
              {...register('district')}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Account Deletion"
        description="Are you sure you want to permanently revoke and delete this account?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            This action cannot be undone. All audit records associated with this account will remain logged for compliance.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={handleDeleteUser}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

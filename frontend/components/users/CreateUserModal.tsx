import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserFormSchema, UserFormData } from '../../schemas/user.schema';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (formData: UserFormData) => Promise<void>;
  isCreating: boolean;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreateUser,
  isCreating,
}) => {
  const { t } = useTranslation();
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

  const onSubmit = async (data: UserFormData) => {
    await onCreateUser(data);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('officerUsers.provisionTitle', { defaultValue: 'Provision New Official Account' })}
      description={t('officerUsers.provisionDesc', { defaultValue: 'Create an authorized administrative or field officer account.' })}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('profile.fullName', { defaultValue: 'Full Name' })}
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
            label={t('officerProfile.accountStatus', { defaultValue: 'Account Status' })}
            options={[
              { value: 'ACTIVE', label: t('status.active', { defaultValue: 'Active' }) },
              { value: 'INACTIVE', label: t('status.inactive', { defaultValue: 'Inactive' }) },
              { value: 'SUSPENDED', label: t('status.suspended', { defaultValue: 'Suspended' }) },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('officerProfile.department', { defaultValue: 'Department / Wing' })}
            placeholder="e.g. Settlement Office"
            error={errors.department?.message}
            {...register('department')}
          />

          <Input
            label={t('officerProfile.jurisdictionDistrict', { defaultValue: 'Jurisdiction District' })}
            placeholder="e.g. Pune"
            error={errors.district?.message}
            {...register('district')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button type="submit" isLoading={isCreating}>
            {t('officerUsers.addUser', { defaultValue: 'Create Account' })}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

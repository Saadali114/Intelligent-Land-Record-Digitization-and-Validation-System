import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteUserModalProps {
  deleteTargetId: string | null;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  deleteTargetId,
  onClose,
  onConfirmDelete,
  isDeleting,
}) => {
  const { t } = useTranslation();
  if (!deleteTargetId) return null;

  return (
    <Modal
      isOpen={Boolean(deleteTargetId)}
      onClose={onClose}
      title={t('officerUsers.deleteTitle', { defaultValue: 'Confirm Account Deletion' })}
      description={t('officerUsers.deleteDesc', { defaultValue: 'Are you sure you want to permanently revoke and delete this account?' })}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600">
          {t('officerUsers.deleteWarning', { defaultValue: 'This action cannot be undone. All audit records associated with this account will remain logged for compliance.' })}
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={onConfirmDelete}
          >
            {t('officerUsers.confirmDeleteButton', { defaultValue: 'Confirm Deletion' })}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

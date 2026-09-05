import React from 'react';
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
  if (!deleteTargetId) return null;

  return (
    <Modal
      isOpen={Boolean(deleteTargetId)}
      onClose={onClose}
      title="Confirm Account Deletion"
      description="Are you sure you want to permanently revoke and delete this account?"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600">
          This action cannot be undone. All audit records associated with this account will remain logged for compliance.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={onConfirmDelete}
          >
            Confirm Deletion
          </Button>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { LandRecord } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface EditLandRecordModalProps {
  editRecord: LandRecord | null;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => Promise<void>;
  onRecordChange: (updated: LandRecord) => void;
  isUpdating: boolean;
}

export const EditLandRecordModal: React.FC<EditLandRecordModalProps> = ({
  editRecord,
  onClose,
  onUpdate,
  onRecordChange,
  isUpdating,
}) => {
  const { t } = useTranslation();
  if (!editRecord) return null;

  const handleFieldChange = (key: keyof LandRecord, value: any) => {
    onRecordChange({
      ...editRecord,
      [key]: value,
    });
  };

  return (
    <Modal
      isOpen={Boolean(editRecord)}
      onClose={onClose}
      title={t('officerLandRecords.editModalTitle', { defaultValue: 'Edit Land Record' })}
      description={`Updating parcel attributes for Survey #${editRecord.surveyNumber}`}
    >
      <form onSubmit={onUpdate} className="space-y-3">
        <Input
          label={t('officerLandRecords.primaryOwner', { defaultValue: 'Owner Name' })}
          value={editRecord.ownerName}
          onChange={(e) => handleFieldChange('ownerName', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('officerLandRecords.surveyDivision', { defaultValue: 'Survey Number' })}
            value={editRecord.surveyNumber}
            onChange={(e) => handleFieldChange('surveyNumber', e.target.value)}
          />
          <Input
            label={t('officerLandRecords.khasra', { defaultValue: 'Khasra Number' })}
            value={editRecord.khasraNumber}
            onChange={(e) => handleFieldChange('khasraNumber', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('officerLandRecords.khata', { defaultValue: 'Khata Number' })}
            value={editRecord.khataNumber}
            onChange={(e) => handleFieldChange('khataNumber', e.target.value)}
          />
          <Input
            label={t('officerLandRecords.plotArea', { defaultValue: 'Plot Area' })}
            value={editRecord.plotArea}
            onChange={(e) => handleFieldChange('plotArea', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label={t('officerLandRecords.classification', { defaultValue: 'Land Classification' })}
            value={editRecord.landClassification}
            onChange={(e) => handleFieldChange('landClassification', e.target.value)}
            options={[
              { label: 'Agricultural (Jirayat)', value: 'Agricultural (Jirayat)' },
              { label: 'Agricultural (Bagayat)', value: 'Agricultural (Bagayat)' },
              { label: 'Non-Agricultural (Residential)', value: 'Non-Agricultural (Residential)' },
              { label: 'Non-Agricultural (Commercial)', value: 'Non-Agricultural (Commercial)' },
              { label: 'Forest Land', value: 'Forest Land' },
            ]}
          />
          <Select
            label={t('officerLandRecords.ownershipType', { defaultValue: 'Ownership Type' })}
            value={editRecord.ownershipType}
            onChange={(e) => handleFieldChange('ownershipType', e.target.value)}
            options={[
              { label: 'Single Owner', value: 'Single Owner' },
              { label: 'Joint Ownership', value: 'Joint Ownership' },
              { label: 'Government Lessee', value: 'Government Lessee' },
              { label: 'Trust / Institutional', value: 'Trust / Institutional' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            label={t('officerLandRecords.village', { defaultValue: 'Village' })}
            value={editRecord.village}
            onChange={(e) => handleFieldChange('village', e.target.value)}
          />
          <Input
            label={t('officerLandRecords.tehsil', { defaultValue: 'Tehsil' })}
            value={editRecord.tehsil}
            onChange={(e) => handleFieldChange('tehsil', e.target.value)}
          />
          <Input
            label={t('officerLandRecords.district', { defaultValue: 'District' })}
            value={editRecord.district}
            onChange={(e) => handleFieldChange('district', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button type="submit" isLoading={isUpdating}>
            {t('profile.saveChanges', { defaultValue: 'Save Changes' })}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

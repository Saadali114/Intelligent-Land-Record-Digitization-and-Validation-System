import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LandRecordFormSchema, LandRecordFormData } from '../../schemas/land-record.schema';

interface CreateLandRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: LandRecordFormData) => Promise<void>;
  isCreating: boolean;
}

export const CreateLandRecordModal: React.FC<CreateLandRecordModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LandRecordFormData>({
    resolver: zodResolver(LandRecordFormSchema),
    defaultValues: {
      district: 'Pune',
      tehsil: 'Haveli',
      village: 'Khadakwasla',
      landClassification: 'Agricultural (Jirayat)',
      ownershipType: 'Single Owner',
      confidenceScore: 0.94,
    },
  });

  const onSubmit = async (formData: LandRecordFormData) => {
    await onCreate(formData);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Cadastral Record"
      description="Manually ingest official land parcel attributes into repository."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="Primary Owner Name"
          {...register('ownerName')}
          error={errors.ownerName?.message}
          placeholder="e.g. Ramesh Shankar Patil"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Survey Number"
            {...register('surveyNumber')}
            error={errors.surveyNumber?.message}
            placeholder="e.g. 142/2A"
          />
          <Input
            label="Khasra Number"
            {...register('khasraNumber')}
            error={errors.khasraNumber?.message}
            placeholder="e.g. KH-88"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Khata Number"
            {...register('khataNumber')}
            error={errors.khataNumber?.message}
            placeholder="e.g. 450"
          />
          <Input
            label="Plot Area"
            {...register('plotArea')}
            error={errors.plotArea?.message}
            placeholder="e.g. 1.45 Hectares"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Land Classification"
            {...register('landClassification')}
            error={errors.landClassification?.message}
            options={[
              { label: 'Agricultural (Jirayat)', value: 'Agricultural (Jirayat)' },
              { label: 'Agricultural (Bagayat)', value: 'Agricultural (Bagayat)' },
              { label: 'Non-Agricultural (Residential)', value: 'Non-Agricultural (Residential)' },
              { label: 'Non-Agricultural (Commercial)', value: 'Non-Agricultural (Commercial)' },
              { label: 'Forest Land', value: 'Forest Land' },
            ]}
          />
          <Select
            label="Ownership Type"
            {...register('ownershipType')}
            error={errors.ownershipType?.message}
            options={[
              { label: 'Single Owner', value: 'Single Owner' },
              { label: 'Joint Ownership', value: 'Joint Ownership' },
              { label: 'Government Lessee', value: 'Government Lessee' },
              { label: 'Trust / Institutional', value: 'Trust / Institutional' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input label="Village" {...register('village')} error={errors.village?.message} />
          <Input label="Tehsil" {...register('tehsil')} error={errors.tehsil?.message} />
          <Input label="District" {...register('district')} error={errors.district?.message} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isCreating}>
            Create Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};

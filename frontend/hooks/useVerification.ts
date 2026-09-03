import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationService, VerificationQueueParams } from '../services/verification.service';
import { VerificationActionFormData } from '../schemas/verification.schema';
import { LAND_RECORDS_QUERY_KEY } from './useLandRecords';

export const VERIFICATION_QUEUE_KEY = ['verification-queue'];

export function useVerificationRecordsQuery(params?: VerificationQueueParams) {
  return useQuery({
    queryKey: [...VERIFICATION_QUEUE_KEY, params],
    queryFn: () => verificationService.getQueue(params),
  });
}

export function useVerificationHistoryQuery(recordId: string) {
  return useQuery({
    queryKey: ['verification-history', recordId],
    queryFn: () => verificationService.getHistory(recordId),
    enabled: !!recordId,
  });
}

export function useVerifyRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordId,
      data,
    }: {
      recordId: string;
      data: VerificationActionFormData;
    }) => verificationService.verifyRecord(recordId, data),
    onSuccess: (_, { recordId }) => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_QUEUE_KEY });
      queryClient.invalidateQueries({ queryKey: LAND_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LAND_RECORDS_QUERY_KEY, recordId] });
      queryClient.invalidateQueries({ queryKey: ['verification-history', recordId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

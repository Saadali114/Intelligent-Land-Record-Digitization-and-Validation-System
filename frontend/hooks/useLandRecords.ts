import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { landRecordsService, LandRecordQueryParams } from '../services/land-records.service';
import { LandRecordFormData } from '../schemas/land-record.schema';

export const LAND_RECORDS_QUERY_KEY = ['land-records'];

export function useLandRecordsQuery(params?: LandRecordQueryParams) {
  return useQuery({
    queryKey: [...LAND_RECORDS_QUERY_KEY, params],
    queryFn: () => landRecordsService.getLandRecords(params),
  });
}

export function useLandRecordQuery(id: string) {
  return useQuery({
    queryKey: [...LAND_RECORDS_QUERY_KEY, id],
    queryFn: () => landRecordsService.getLandRecordById(id),
    enabled: !!id,
  });
}

export function useFilterMetadataQuery() {
  return useQuery({
    queryKey: ['land-records-filter-meta'],
    queryFn: () => landRecordsService.getFilterMetadata(),
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useCreateLandRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LandRecordFormData) => landRecordsService.createLandRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAND_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['verification-queue'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useUpdateLandRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LandRecordFormData> }) =>
      landRecordsService.updateLandRecord(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: LAND_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...LAND_RECORDS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ['verification-queue'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useDeleteLandRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => landRecordsService.deleteLandRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LAND_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

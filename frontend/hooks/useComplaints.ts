import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  complaintsService,
  ComplaintQueryParams,
  CreateComplaintInput,
  UserComplaint,
} from '../services/complaints.service';

export const COMPLAINTS_QUERY_KEY = ['complaints'];

export function useComplaintsQuery(params?: ComplaintQueryParams) {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, params],
    queryFn: () => complaintsService.getComplaints(params),
  });
}

export function useComplaintQuery(id: string) {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, id],
    queryFn: () => complaintsService.getComplaintById(id),
    enabled: !!id,
  });
}

export function useCreateComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateComplaintInput) => complaintsService.createComplaint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY });
    },
  });
}

export function useUpdateComplaintStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      resolutionRemarks,
      investigatingOfficer,
    }: {
      id: string;
      status: string;
      resolutionRemarks?: string;
      investigatingOfficer?: string;
    }) =>
      complaintsService.updateComplaintStatus(
        id,
        status,
        resolutionRemarks,
        investigatingOfficer
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY });
    },
  });
}

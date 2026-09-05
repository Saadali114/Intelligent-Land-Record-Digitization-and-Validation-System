import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService, DocumentQueryParams } from '../services/documents.service';

export const DOCUMENTS_QUERY_KEY = ['documents'];

/** Final statuses — polling stops when document reaches one of these */
export const TERMINAL_STATUSES = ['PROCESSED', 'NEEDS_REVIEW', 'FAILED'];

export function useDocumentsQuery(params?: DocumentQueryParams) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, params],
    queryFn: () => documentsService.getDocuments(params),
  });
}

export function useDocumentQuery(id: string) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, id],
    queryFn: () => documentsService.getDocumentById(id),
    enabled: !!id,
  });
}

/**
 * Polls a single document by ID every `intervalMs` milliseconds.
 * Stops automatically once the document reaches a terminal status
 * (PROCESSED, NEEDS_REVIEW, FAILED).
 */
export function useDocumentPolling(id: string | null, intervalMs = 2500) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, 'poll', id],
    queryFn: () => documentsService.getDocumentById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.processingStatus;
      // Stop polling once we reach a terminal status
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      return intervalMs;
    },
    refetchIntervalInBackground: false,
  });
}

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => documentsService.uploadDocument(formData),
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      // Pre-seed the polling query cache so it can start immediately
      queryClient.setQueryData([...DOCUMENTS_QUERY_KEY, 'poll', newDoc._id], newDoc);
    },
  });
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useExtractDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsService.extractDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['land-records'] });
      queryClient.invalidateQueries({ queryKey: ['verification-records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

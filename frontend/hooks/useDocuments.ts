import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService, DocumentQueryParams } from '../services/documents.service';

export const DOCUMENTS_QUERY_KEY = ['documents'];

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

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => documentsService.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
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

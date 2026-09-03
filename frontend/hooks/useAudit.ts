import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/audit.service';

export function useAuditLogsQuery(params?: {
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
}) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditService.getAuditLogs(params),
  });
}

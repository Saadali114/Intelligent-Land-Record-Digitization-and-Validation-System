import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const DASHBOARD_QUERY_KEY = ['dashboard-stats'];

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
}

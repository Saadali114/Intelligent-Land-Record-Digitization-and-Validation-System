'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import { useDashboardStatsQuery } from '../../hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate, formatDateTime } from '../../lib/utils';
import { formatRole, formatStatus, formatDistrict, normalizeDistrictKey } from '../../lib/translationHelpers';
import {
  Users,
  Files,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  Cpu,
  TrendingUp,
  Activity,
  AlertTriangle,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const CHART_COLORS = ['#1e3a8a', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0284c7'];

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError, error } = useDashboardStatsQuery();

  // Strictly localized chart datasets to prevent Hindi & English mixing
  const documentStatusData = useMemo(() => {
    return (stats?.charts?.documentStatus || []).map((entry) => ({
      ...entry,
      displayName: formatStatus(entry.status, t),
    }));
  }, [stats?.charts?.documentStatus, t]);

  const verificationStatusData = useMemo(() => {
    return (stats?.charts?.verificationStatus || []).map((entry) => ({
      ...entry,
      displayName: formatStatus(entry.status, t),
    }));
  }, [stats?.charts?.verificationStatus, t]);

  const districtWiseData = useMemo(() => {
    const mergedMap = new Map<string, number>();
    (stats?.charts?.districtWise || []).forEach((entry) => {
      const canonicalKey = normalizeDistrictKey(entry.district);
      if (!canonicalKey) return;
      const count = typeof entry.count === 'number' ? entry.count : 0;
      mergedMap.set(canonicalKey, (mergedMap.get(canonicalKey) || 0) + count);
    });

    return Array.from(mergedMap.entries())
      .map(([key, count]) => ({
        key,
        displayName: formatDistrict(key, t),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [stats?.charts?.districtWise, t]);

  const userRolesData = useMemo(() => {
    return (stats?.charts?.userRoles || []).map((entry) => ({
      ...entry,
      displayName: formatRole(entry.role, t),
    }));
  }, [stats?.charts?.userRoles, t]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t('officerDashboard.title', { defaultValue: 'Operations & Validation Dashboard' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('officerDashboard.subtitle', { defaultValue: 'Real-time synchronization across district land registries, document ingestion, and verification queues.' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('officerDashboard.liveFeed', { defaultValue: 'Live Database Feed' })}
            </span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-xl" />
              <Skeleton className="h-80 rounded-xl" />
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold">
                {t('dashboard.failedFetchMetrics', { defaultValue: 'Failed to fetch dashboard metrics' })}
              </h4>
              <p className="text-xs text-rose-700">
                {(error as Error)?.message ||
                  t('dashboard.dbConnectionError', { defaultValue: 'Database connection error' })}
              </p>
            </div>
          </div>
        )}

        {stats && (
          <>
            {/* 7 Required Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Total Users */}
              <div className="gov-card p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('officerDashboard.totalUsers', { defaultValue: 'Total Users' })}
                  </span>
                  <Users className="w-4 h-4 text-blue-900" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-slate-900">{stats.overview.totalUsers}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {t('dashboard.acrossRoles', { defaultValue: 'Across 4 roles' })}
                  </div>
                </div>
              </div>

              {/* Total Documents */}
              <div className="gov-card p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('officerDashboard.registeredDocuments', { defaultValue: 'Documents' })}
                  </span>
                  <Files className="w-4 h-4 text-slate-700" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-slate-900">{stats.overview.totalDocuments}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {t('dashboard.scannedFiles', { defaultValue: 'Scanned files' })}
                  </div>
                </div>
              </div>

              {/* Total Land Records */}
              <div className="gov-card p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('officerDashboard.activeLandRecords', { defaultValue: 'Land Records' })}
                  </span>
                  <FileSpreadsheet className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-slate-900">{stats.overview.totalLandRecords}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {t('dashboard.digitizedEntries', { defaultValue: 'Digitized entries' })}
                  </div>
                </div>
              </div>

              {/* Pending Verification */}
              <div className="gov-card p-4 flex flex-col justify-between bg-amber-50/40 border-amber-200">
                <div className="flex items-center justify-between text-amber-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('officerDashboard.pendingVerification', { defaultValue: 'Pending' })}
                  </span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-amber-900">{stats.overview.pendingVerification}</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">
                    {t('dashboard.awaitingReview', { defaultValue: 'Awaiting review' })}
                  </div>
                </div>
              </div>

              {/* Verified Records */}
              <div className="gov-card p-4 flex flex-col justify-between bg-emerald-50/40 border-emerald-200">
                <div className="flex items-center justify-between text-emerald-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('status.verified', { defaultValue: 'Verified' })}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-emerald-900">{stats.overview.verifiedRecords}</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">
                    {t('dashboard.officiallyCertified', { defaultValue: 'Officially certified' })}
                  </div>
                </div>
              </div>

              {/* Rejected Records */}
              <div className="gov-card p-4 flex flex-col justify-between bg-rose-50/40 border-rose-200">
                <div className="flex items-center justify-between text-rose-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('status.rejected', { defaultValue: 'Rejected' })}
                  </span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-rose-900">{stats.overview.rejectedRecords}</div>
                  <div className="text-[10px] text-rose-700 mt-0.5">
                    {t('dashboard.issuesFound', { defaultValue: 'Issues found' })}
                  </div>
                </div>
              </div>

              {/* Documents Processing */}
              <div className="gov-card p-4 flex flex-col justify-between bg-sky-50/40 border-sky-200">
                <div className="flex items-center justify-between text-sky-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {t('status.processing', { defaultValue: 'Processing' })}
                  </span>
                  <Cpu className="w-4 h-4 text-sky-600 animate-pulse" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-sky-900">{stats.overview.documentsProcessing}</div>
                  <div className="text-[10px] text-sky-700 mt-0.5">
                    {t('dashboard.inPipeline', { defaultValue: 'In pipeline' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Processing Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Files className="w-4 h-4 text-blue-900" />
                    {t('officerDashboard.ingestionStatusTitle', { defaultValue: 'Document Ingestion & Processing Status' })}
                  </CardTitle>
                  <CardDescription>
                    {t('officerDashboard.ingestionStatusDesc', { defaultValue: 'Breakdown of uploaded archival records across pipeline states' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentStatusData}
                        dataKey="count"
                        nameKey="displayName"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        label={({ displayName, percent }) => `${displayName} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {documentStatusData.map((_, index) => (
                          <Cell
                            key={`doc-status-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Verification Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t('officerVerification.title', { defaultValue: 'Verification Status Distribution' })}
                  </CardTitle>
                  <CardDescription>
                    {t('officerDashboard.velocityDesc', { defaultValue: 'Current audit state of digitized land records' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={verificationStatusData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="displayName" fontSize={11} stroke="#64748b" />
                      <YAxis allowDecimals={false} fontSize={11} stroke="#64748b" />
                      <Tooltip
                        formatter={(value: any) => [value, t('dashboard.recordsLabel', { defaultValue: 'Records' })]}
                        labelFormatter={(label: any) => String(label)}
                      />
                      <Bar
                        dataKey="count"
                        name={t('dashboard.recordsLabel', { defaultValue: 'Records' })}
                        fill="#1e3a8a"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* District-wise Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-700" />
                    {t('officerDashboard.districtRecordsTitle', { defaultValue: 'District-wise Land Records' })}
                  </CardTitle>
                  <CardDescription>
                    {t('officerDashboard.districtRecordsDesc', { defaultValue: 'Spatial distribution of records registered in the system' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={districtWiseData}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" allowDecimals={false} fontSize={11} stroke="#64748b" />
                      <YAxis
                        dataKey="displayName"
                        type="category"
                        fontSize={11}
                        stroke="#64748b"
                        width={90}
                      />
                      <Tooltip
                        formatter={(value: any) => [value, t('dashboard.recordsLabel', { defaultValue: 'Records' })]}
                        labelFormatter={(label: any) => String(label)}
                      />
                      <Bar
                        dataKey="count"
                        name={t('dashboard.recordsLabel', { defaultValue: 'Records' })}
                        fill="#059669"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Roles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-700" />
                    {t('officerUsers.title', { defaultValue: 'Authorized Personnel by Role' })}
                  </CardTitle>
                  <CardDescription>
                    {t('officerUsers.subtitle', { defaultValue: 'Role-based access distribution across system accounts' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userRolesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="displayName" fontSize={11} stroke="#64748b" />
                      <YAxis allowDecimals={false} fontSize={11} stroke="#64748b" />
                      <Tooltip
                        formatter={(value: any) => [value, t('dashboard.usersLabel', { defaultValue: 'Users' })]}
                        labelFormatter={(label: any) => String(label)}
                      />
                      <Bar
                        dataKey="count"
                        name={t('dashboard.usersLabel', { defaultValue: 'Users' })}
                        fill="#d97706"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent System Audit Feed */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-900" />
                      {t('officerDashboard.auditLogsTitle', { defaultValue: 'Recent Governance Audit Trail' })}
                    </CardTitle>
                    <CardDescription>
                      {t('officerDashboard.auditLogsDesc', { defaultValue: 'Cryptographically tracked administrative and verification actions' })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100">
                  {stats.recentActivity.map((log) => (
                    <div key={log._id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {log.action}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {log.resourceType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{log.description}</p>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {t('dashboard.actor', { defaultValue: 'Actor' })}:{' '}
                          {log.userId?.name || t('dashboard.systemGuest', { defaultValue: 'System / Guest' })}{' '}
                          ({log.userId?.role ? formatRole(log.userId.role, t) : 'N/A'}) &bull; IP: {log.ipAddress}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}

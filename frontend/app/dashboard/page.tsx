'use client';

import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useDashboardStatsQuery } from '../../hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate, formatDateTime } from '../../lib/utils';
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
  const { data: stats, isLoading, isError, error } = useDashboardStatsQuery();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Operations & Validation Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time synchronization across district land registries, document ingestion, and verification queues.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Database Feed
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
              <h4 className="text-sm font-semibold">Failed to fetch dashboard metrics</h4>
              <p className="text-xs text-rose-700">{(error as Error)?.message || 'Database connection error'}</p>
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
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                  <Users className="w-4 h-4 text-blue-900" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-slate-900">{stats.overview.totalUsers}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Across 4 roles</div>
                </div>
              </div>

              {/* Total Documents */}
              <div className="gov-card p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Documents</span>
                  <Files className="w-4 h-4 text-slate-700" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-slate-900">{stats.overview.totalDocuments}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Scanned files</div>
                </div>
              </div>

              {/* Total Land Records */}
              <div className="gov-card p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Land Records</span>
                  <FileSpreadsheet className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-slate-900">{stats.overview.totalLandRecords}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Digitized entries</div>
                </div>
              </div>

              {/* Pending Verification */}
              <div className="gov-card p-4 flex flex-col justify-between bg-amber-50/40 border-amber-200">
                <div className="flex items-center justify-between text-amber-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-amber-900">{stats.overview.pendingVerification}</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">Awaiting review</div>
                </div>
              </div>

              {/* Verified Records */}
              <div className="gov-card p-4 flex flex-col justify-between bg-emerald-50/40 border-emerald-200">
                <div className="flex items-center justify-between text-emerald-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-emerald-900">{stats.overview.verifiedRecords}</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Officially certified</div>
                </div>
              </div>

              {/* Rejected Records */}
              <div className="gov-card p-4 flex flex-col justify-between bg-rose-50/40 border-rose-200">
                <div className="flex items-center justify-between text-rose-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Rejected</span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-rose-900">{stats.overview.rejectedRecords}</div>
                  <div className="text-[10px] text-rose-700 mt-0.5">Issues found</div>
                </div>
              </div>

              {/* Documents Processing */}
              <div className="gov-card p-4 flex flex-col justify-between bg-sky-50/40 border-sky-200">
                <div className="flex items-center justify-between text-sky-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Processing</span>
                  <Cpu className="w-4 h-4 text-sky-600 animate-pulse" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-sky-900">{stats.overview.documentsProcessing}</div>
                  <div className="text-[10px] text-sky-700 mt-0.5">In pipeline</div>
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
                    Document Processing Status
                  </CardTitle>
                  <CardDescription>
                    Breakdown of uploaded archival records across pipeline states
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.documentStatus}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {stats.charts.documentStatus.map((entry, index) => (
                          <Cell
                            key={`doc-status-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Verification Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verification Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Current audit state of digitized land records
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.verificationStatus}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="status" fontSize={11} stroke="#64748b" />
                      <YAxis allowDecimals={false} fontSize={11} stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="count" name="Records" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* District-wise Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-700" />
                    District-wise Land Records
                  </CardTitle>
                  <CardDescription>
                    Spatial distribution of records registered in the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.charts.districtWise}
                      layout="vertical"
                      margin={{ left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" allowDecimals={false} fontSize={11} stroke="#64748b" />
                      <YAxis dataKey="district" type="category" fontSize={11} stroke="#64748b" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" name="Records" fill="#059669" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Roles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-700" />
                    Authorized Personnel by Role
                  </CardTitle>
                  <CardDescription>
                    Role-based access distribution across system accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.userRoles}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="role" fontSize={11} stroke="#64748b" />
                      <YAxis allowDecimals={false} fontSize={11} stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="count" name="Users" fill="#d97706" radius={[6, 6, 0, 0]} />
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
                      Recent Governance Audit Trail
                    </CardTitle>
                    <CardDescription>
                      Cryptographically tracked administrative and verification actions
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
                          Actor: {log.userId?.name || 'System / Guest'} ({log.userId?.role || 'N/A'}) &bull; IP: {log.ipAddress}
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

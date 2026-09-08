'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { AppLayout } from '../../../components/layout/AppLayout';
import { authService } from '../../../services/auth.service';

export default function AdminOfficerApplicationsPage() {
  const { t } = useTranslation();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Prototype mock applications for instant demo / fallback
  const mockApplications = [
    {
      _id: 'OFF-APP-001',
      name: 'Priya Ramesh Deshmukh',
      email: 'priya.deshmukh@maharashtra.gov.in',
      employeeId: 'REV-MH-2026-1042',
      department: 'Revenue & Forest Department',
      designation: 'Revenue Officer',
      office: 'Pune Collectorate Office',
      district: 'Pune',
      taluka: 'Haveli',
      emailVerified: true,
      status: 'PENDING_APPROVAL',
      createdAt: '2026-09-04T10:30:00Z',
    },
    {
      _id: 'OFF-APP-002',
      name: 'Amit Vasant Joshi',
      email: 'amit.joshi@revenue.gov.in',
      employeeId: 'REV-MH-2026-0891',
      department: 'Revenue Department',
      designation: 'Circle Officer',
      office: 'Nashik Tahsil Office',
      district: 'Nashik',
      taluka: 'Nashik',
      emailVerified: true,
      status: 'PENDING_APPROVAL',
      createdAt: '2026-09-04T14:15:00Z',
    },
    {
      _id: 'OFF-APP-003',
      name: 'Sunita Balasaheb Shinde',
      email: 'sunita.shinde@maharashtra.gov.in',
      employeeId: 'REV-MH-2025-0412',
      department: 'Land Records & Settlement',
      designation: 'Inspector of Land Records',
      office: 'Nagpur District Survey Office',
      district: 'Nagpur',
      taluka: 'Nagpur Rural',
      emailVerified: true,
      status: 'APPROVED',
      createdAt: '2026-08-28T09:00:00Z',
    },
  ];

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await authService.listOfficerApplications({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });

      if (res && res.applications && res.applications.length > 0) {
        setApplications(res.applications);
      } else {
        // Fallback to mock applications if none in database
        setApplications(mockApplications);
      }
    } catch {
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.employeeId.toLowerCase().includes(q) ||
        app.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            {t('adminOfficer.approvedFilter', { defaultValue: 'Approved' })}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            {t('adminOfficer.rejectedFilter', { defaultValue: 'Rejected' })}
          </span>
        );
      case 'ACTION_REQUIRED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            {t('adminOfficer.actionRequiredFilter', { defaultValue: 'Action Required' })}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            {t('adminOfficer.pendingReviewFilter', { defaultValue: 'Pending Review' })}
          </span>
        );
    }
  };

  return (
    <AppLayout allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-blue-900" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                {t('adminOfficer.administrativeGovernance', { defaultValue: 'Administrative Governance' })}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t('adminOfficer.officerAccessApplications', { defaultValue: 'Officer Access Applications' })}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('adminOfficer.officerAccessDesc', {
                defaultValue:
                  'Review, verify official credentials, and grant statutory access to revenue officers.',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchApplications}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{t('adminOfficer.refresh', { defaultValue: 'Refresh' })}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'PENDING_APPROVAL', 'ACTION_REQUIRED', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL'
                  ? t('adminOfficer.allApplications', { defaultValue: 'All Applications' })
                  : st === 'PENDING_APPROVAL'
                  ? t('adminOfficer.pendingReviewFilter', { defaultValue: 'Pending Review' })
                  : st === 'ACTION_REQUIRED'
                  ? t('adminOfficer.actionRequiredFilter', { defaultValue: 'Action Required' })
                  : st === 'APPROVED'
                  ? t('adminOfficer.approvedFilter', { defaultValue: 'Approved' })
                  : t('adminOfficer.rejectedFilter', { defaultValue: 'Rejected' })}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('adminOfficer.searchPlaceholder', { defaultValue: 'Search by name, ID, district...' })}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">{t('adminOfficer.officerNameEmailCol', { defaultValue: 'Officer Name & Email' })}</th>
                  <th className="py-3 px-4">{t('adminOfficer.employeeIdCol', { defaultValue: 'Employee ID' })}</th>
                  <th className="py-3 px-4">{t('adminOfficer.departmentOfficeCol', { defaultValue: 'Department & Office' })}</th>
                  <th className="py-3 px-4">{t('adminOfficer.districtCol', { defaultValue: 'District' })}</th>
                  <th className="py-3 px-4">{t('adminOfficer.emailOtpCol', { defaultValue: 'Email OTP' })}</th>
                  <th className="py-3 px-4">{t('adminOfficer.statusCol', { defaultValue: 'Status' })}</th>
                  <th className="py-3 px-4 text-right">{t('adminOfficer.actionCol', { defaultValue: 'Action' })}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      {t('adminOfficer.noAppsFound', { defaultValue: 'No officer applications found matching criteria.' })}
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{app.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {app.employeeId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{app.designation}</div>
                        <div className="text-[11px] text-slate-500">{app.department}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {app.district} {app.taluka ? `(${app.taluka})` : ''}
                      </td>
                      <td className="py-3 px-4">
                        {app.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('status.verified', { defaultValue: 'Verified' })}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">{t('status.pending', { defaultValue: 'Pending' })}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/officer-applications/${app._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          <span>{t('adminOfficer.reviewBtn', { defaultValue: 'Review' })}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

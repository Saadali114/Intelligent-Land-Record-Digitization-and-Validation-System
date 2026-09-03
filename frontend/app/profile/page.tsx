'use client';

import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';
import { UserCheck, Shield, Building, MapPin, KeyRound } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-900" />
            Official Account Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authenticated credentials, role-based authorization parameters, and department jurisdiction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 text-center p-6 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
            <p className="text-xs text-slate-500 mb-3">{user.email}</p>
            <Badge status={user.role} />
            <div className="mt-6 pt-4 border-t border-slate-100 w-full text-xs text-slate-500">
              Account Status:{' '}
              <span className="font-semibold text-emerald-700">{user.status}</span>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-900" />
                Security & Administrative Assignment
              </CardTitle>
              <CardDescription>
                System identification and jurisdiction parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-medium">Department</span>
                  <span className="font-semibold text-slate-900 text-xs mt-0.5 block">
                    {user.department}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-medium">Jurisdiction District</span>
                  <span className="font-semibold text-slate-900 text-xs mt-0.5 block">
                    {user.district}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-medium">Account ID</span>
                  <span className="font-mono text-slate-900 text-[11px] mt-0.5 block truncate">
                    {user._id}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-medium">Registered Since</span>
                  <span className="font-semibold text-slate-900 text-xs mt-0.5 block">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  End active session across this terminal
                </span>
                <Button variant="danger" size="sm" onClick={logout}>
                  Sign Out of Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { SupportTicket, AdminAnnouncement, Profile } from '@/types';
import {
  ShieldAlert,
  Users,
  Briefcase,
  AlertCircle,
  Megaphone,
  CreditCard,
  CheckCircle2,
  Trash2,
  Lock,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function AdminPage() {
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  // New announcement modal
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Simulated metrics
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalApplications: 1250,
    activePaidTiers: 38,
    openTickets: 3,
  });

  const loadData = async () => {
    try {
      const [tList, aList] = await Promise.all([
        DataService.getSupportTickets(),
        DataService.getAnnouncements(),
      ]);
      setTickets(tList);
      setAnnouncements(aList);
      setStats((prev) => ({
        ...prev,
        openTickets: tList.filter((t) => t.status === 'open').length,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleResolveTicket = (id: string) => {
    const updated = tickets.map((t) => (t.id === id ? { ...t, status: 'resolved' as const } : t));
    setTickets(updated);
    localStorage.setItem('applytrack_support_tickets', JSON.stringify(updated));
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newA: AdminAnnouncement = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      content: newContent.trim(),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const updated = [newA, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('applytrack_admin_announcements', JSON.stringify(updated));
    setShowAddAnnouncement(false);
    setNewTitle('');
    setNewContent('');
  };

  // If user is not admin, show restricted notice
  const isAdmin = profile?.role === 'admin' || user?.email?.includes('admin');

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
              Platform Administration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Restricted management console for metrics, user feedback, and announcements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Role: {profile?.role || 'user'}
            </span>
          </div>
        </div>

        {!isAdmin ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Restricted Admin Access</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              This area is restricted to authorized platform administrators. Ordinary candidate accounts are prevented from accessing global platform records and support queues.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Admin Permission Test Mode:</p>
              <p className="text-[11px]">
                To test the admin console in this demo preview, update your profile role to <code className="bg-slate-200 px-1 py-0.5 rounded">admin</code> in PostgreSQL or click below to simulate administrator elevation.
              </p>
            </div>
            <button
              onClick={async () => {
                if (user) {
                  await DataService.updateProfile(user.id, { role: 'admin' });
                  window.location.reload();
                }
              }}
              className="mt-6 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
            >
              Elevate Role to Admin (Demo Preview)
            </button>
          </div>
        ) : (
          <>
            {/* PLATFORM METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalUsers}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">+18% this month</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tracked Jobs</span>
                <p className="text-3xl font-extrabold text-blue-600 mt-2">{stats.totalApplications}</p>
                <span className="text-[10px] text-slate-400">Applications across drives</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paid Tier Upgrades</span>
                <p className="text-3xl font-extrabold text-indigo-600 mt-2">{stats.activePaidTiers}</p>
                <span className="text-[10px] text-slate-400">Pro & Plus subscriptions</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Support Tickets</span>
                <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.openTickets}</p>
                <span className="text-[10px] text-slate-400">Pending inquiries</span>
              </div>
            </div>

            {/* ANNOUNCEMENT MANAGEMENT */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  Public Dashboard Announcements
                </h3>
                <button
                  onClick={() => setShowAddAnnouncement(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" /> New Announcement
                </button>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{ann.title}</p>
                      <p className="text-slate-600 mt-0.5">{ann.content}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Published: {new Date(ann.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Active Banner
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REPORTED ISSUES / SUPPORT TICKETS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Reported Inquiries & Support Tickets
              </h3>

              {tickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No support tickets reported. Form inquiries from /contact will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{t.subject}</span>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-semibold uppercase ${
                              t.status === 'open'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <p className="text-slate-600">{t.message}</p>
                        <p className="text-[11px] text-slate-400">
                          From: {t.name} ({t.email}) • {new Date(t.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {t.status === 'open' && (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg self-start sm:self-auto"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Publish Dashboard Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Placement Season Update"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Remember to update your technical rounds before Friday..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncement(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

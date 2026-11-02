'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { Application, ApplicationStatus, Resume, ActivityLog } from '@/types';
import AddApplicationModal from '@/components/add-application-modal';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Kanban,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  Award,
  XCircle,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  MoreVertical,
  Calendar,
  Building,
  MapPin,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

const ALL_STATUSES: ApplicationStatus[] = [
  'Interested',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Selected',
  'Rejected',
  'Withdrawn',
];

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
  Interested: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  Applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Assessment: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Interview: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  Selected: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-300' },
  Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  Withdrawn: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: 'table' or 'kanban'
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals & Selection
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    try {
      const [apps, resList, acts] = await Promise.all([
        DataService.getApplications(user.id),
        DataService.getResumes(user.id),
        DataService.getActivityLogs(user.id),
      ]);
      setApplications(apps);
      setResumes(resList);
      setActivityLogs(acts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleRefresh = () => loadData();
    window.addEventListener('applytrack_refresh_apps', handleRefresh);
    return () => window.removeEventListener('applytrack_refresh_apps', handleRefresh);
  }, [user]);

  // Real database statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === 'Applied').length;
    const assessments = applications.filter((a) => a.status === 'Assessment').length;
    const interviews = applications.filter((a) => a.status === 'Interview').length;
    const offers = applications.filter((a) => a.status === 'Offer' || a.status === 'Selected').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;

    // Upcoming deadlines count (deadlines in the future)
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingDeadlines = applications.filter(
      (a) => a.application_deadline && a.application_deadline >= todayStr
    ).length;

    return { total, applied, assessments, interviews, offers, rejected, upcomingDeadlines };
  }, [applications]);

  // Unique companies and roles for filter dropdowns
  const uniqueCompanies = useMemo(() => {
    const set = new Set(applications.map((a) => a.company_name).filter(Boolean));
    return Array.from(set).sort();
  }, [applications]);

  const uniqueRoles = useMemo(() => {
    const set = new Set(applications.map((a) => a.job_title).filter(Boolean));
    return Array.from(set).sort();
  }, [applications]);

  // Filtered & Sorted applications
  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            app.company_name.toLowerCase().includes(q) ||
            app.job_title.toLowerCase().includes(q) ||
            (app.location && app.location.toLowerCase().includes(q)) ||
            (app.notes && app.notes.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Status filter
        if (statusFilter !== 'ALL' && app.status !== statusFilter) {
          return false;
        }

        // Company filter
        if (companyFilter !== 'ALL' && app.company_name !== companyFilter) {
          return false;
        }

        // Role filter
        if (roleFilter !== 'ALL' && app.job_title !== roleFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.application_date).getTime();
        const timeB = new Date(b.application_date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [applications, searchQuery, statusFilter, companyFilter, roleFilter, sortOrder]);

  // Handlers
  const handleSaveApp = async (appData: Partial<Application>) => {
    if (!user) return;
    if (editingApp) {
      await DataService.updateApplication(user.id, editingApp.id, appData);
      setEditingApp(null);
    } else {
      await DataService.createApplication(user.id, appData);
    }
    await loadData();
  };

  const handleDeleteApp = async (id: string) => {
    if (!user) return;
    await DataService.deleteApplication(user.id, id);
    setDeleteConfirmId(null);
    if (viewingApp?.id === id) setViewingApp(null);
    await loadData();
  };

  const handleStatusChange = async (app: Application, newStatus: ApplicationStatus) => {
    if (!user) return;
    await DataService.updateApplication(user.id, app.id, { status: newStatus });
    await loadData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* TOP GREETING & STATS CARDS */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Application Pipeline</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of your job hunt momentum derived directly from database records.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingApp(null);
                setIsAddOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Job Application
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
              <span className="text-[10px] text-slate-400">Applications</span>
            </div>

            {/* Applied */}
            <div className="bg-white p-4 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-sm">
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Applied</span>
              <p className="text-2xl font-extrabold text-blue-700 mt-1">{stats.applied}</p>
              <span className="text-[10px] text-blue-600">Initial Stage</span>
            </div>

            {/* Assessments */}
            <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-sm">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Assessments</span>
              <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.assessments}</p>
              <span className="text-[10px] text-amber-600">Tests Pending</span>
            </div>

            {/* Interviews */}
            <div className="bg-white p-4 rounded-xl border border-purple-200/80 bg-purple-50/20 shadow-sm">
              <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Interviews</span>
              <p className="text-2xl font-extrabold text-purple-700 mt-1">{stats.interviews}</p>
              <span className="text-[10px] text-purple-600">Rounds Scheduled</span>
            </div>

            {/* Offers */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-sm">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Offers</span>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.offers}</p>
              <span className="text-[10px] text-emerald-600">Success Milestones</span>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/20 shadow-sm">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">Deadlines</span>
              <p className="text-2xl font-extrabold text-indigo-700 mt-1">{stats.upcomingDeadlines}</p>
              <span className="text-[10px] text-indigo-600">Active Windows</span>
            </div>
          </div>
        </div>

        {/* PIPELINE VISUAL STATUS BAR */}
        {stats.total > 0 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Pipeline Conversion Breakdown
              </span>
              <span className="text-slate-400 font-normal">
                Offer Rate: {stats.total > 0 ? ((stats.offers / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
            {/* Multi-segment bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
              {stats.applied > 0 && (
                <div
                  style={{ width: `${(stats.applied / stats.total) * 100}%` }}
                  className="bg-blue-500 h-full"
                  title={`Applied: ${stats.applied}`}
                />
              )}
              {stats.assessments > 0 && (
                <div
                  style={{ width: `${(stats.assessments / stats.total) * 100}%` }}
                  className="bg-amber-400 h-full"
                  title={`Assessments: ${stats.assessments}`}
                />
              )}
              {stats.interviews > 0 && (
                <div
                  style={{ width: `${(stats.interviews / stats.total) * 100}%` }}
                  className="bg-purple-500 h-full"
                  title={`Interviews: ${stats.interviews}`}
                />
              )}
              {stats.offers > 0 && (
                <div
                  style={{ width: `${(stats.offers / stats.total) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Offers: ${stats.offers}`}
                />
              )}
              {stats.rejected > 0 && (
                <div
                  style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                  className="bg-rose-400 h-full"
                  title={`Rejected: ${stats.rejected}`}
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Applied ({stats.applied})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Assessments ({stats.assessments})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Interviews ({stats.interviews})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Offers ({stats.offers})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Rejected ({stats.rejected})
              </span>
            </div>
          </div>
        )}

        {/* SEARCH, FILTERS & VIEW TOGGLE TOOLBAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company, job role, location or notes..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Switcher (Kanban / Table) */}
            <div className="flex items-center self-end md:self-auto gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>

              {/* Sort Order Toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                title="Toggle Date Sorting"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st} ({applications.filter((a) => a.status === st).length})
                </option>
              ))}
            </select>

            {/* Company Filter */}
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Companies</option>
              {uniqueCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Roles</option>
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {(statusFilter !== 'ALL' || companyFilter !== 'ALL' || roleFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setCompanyFilter('ALL');
                  setRoleFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* LOADING & EMPTY STATES */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Retrieving application records...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Applications Logged Yet</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
              Start building your career pipeline. Track on-campus placements, off-campus referrals, and test deadlines in one organized workspace.
            </p>
            <button
              onClick={() => {
                setEditingApp(null);
                setIsAddOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Log Your First Job Application
            </button>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No applications match your active filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setCompanyFilter('ALL');
                setRoleFilter('ALL');
              }}
              className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
            >
              Clear filters to view all {applications.length} applications
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          /* =========================================================================
             KANBAN BOARD VIEW
             ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {ALL_STATUSES.map((colStatus) => {
              const colApps = filteredApps.filter((a) => a.status === colStatus);
              const color = STATUS_COLORS[colStatus];

              return (
                <div
                  key={colStatus}
                  className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col max-h-[800px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color.bg} border ${color.border}`} />
                      <h4 className="text-xs font-bold text-slate-800">{colStatus}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 border border-slate-200 shadow-2xs">
                      {colApps.length}
                    </span>
                  </div>

                  {/* Cards container */}
                  <div className="space-y-2.5 overflow-y-auto pr-1">
                    {colApps.length === 0 ? (
                      <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-[11px] text-slate-400">
                        No applications in {colStatus}
                      </div>
                    ) : (
                      colApps.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow group relative"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="truncate">
                              <h5
                                onClick={() => setViewingApp(app)}
                                className="font-bold text-xs text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                              >
                                {app.company_name}
                              </h5>
                              <p className="text-[11px] text-slate-600 truncate mt-0.5">{app.job_title}</p>
                            </div>

                            {/* Dropdown status changer */}
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                              className="text-[10px] py-0.5 px-1 rounded border border-slate-200 bg-slate-50 font-medium text-slate-700"
                              title="Move stage"
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Extra info pills */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                            {app.salary_ctc && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                {app.salary_ctc}
                              </span>
                            )}
                            {app.work_mode && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {app.work_mode}
                              </span>
                            )}
                            {app.application_deadline && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> Due: {app.application_deadline}
                              </span>
                            )}
                          </div>

                          {/* Card Footer: actions */}
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Applied: {app.application_date}</span>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => setViewingApp(app)}
                                className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded"
                                title="View details"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingApp(app);
                                  setIsAddOpen(true);
                                }}
                                className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(app.id)}
                                className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
             TABLE VIEW
             ========================================================================= */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Company & Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Work Mode</th>
                    <th className="py-3.5 px-4">Salary / CTC</th>
                    <th className="py-3.5 px-4">Application Date</th>
                    <th className="py-3.5 px-4">Deadline</th>
                    <th className="py-3.5 px-4">Resume</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => {
                    const color = STATUS_COLORS[app.status];
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setViewingApp(app)}
                            className="font-bold text-slate-900 cursor-pointer hover:text-blue-600"
                          >
                            {app.company_name}
                          </div>
                          <div className="text-[11px] text-slate-500">{app.job_title}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${color.bg} ${color.text} border ${color.border}`}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600">{app.work_mode || '—'}</td>

                        <td className="py-3 px-4 font-medium text-slate-800">
                          {app.salary_ctc ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                              {app.salary_ctc}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-600">{app.application_date}</td>

                        <td className="py-3 px-4 text-slate-600">
                          {app.application_deadline ? (
                            <span className="flex items-center gap-1 text-amber-700 font-medium">
                              <Clock className="w-3 h-3" />
                              {app.application_deadline}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          {app.resume_name ? (
                            <span className="flex items-center gap-1 text-slate-700 truncate max-w-[120px]" title={app.resume_name}>
                              <FileText className="w-3 h-3 text-blue-600 flex-shrink-0" />
                              {app.resume_name}
                            </span>
                          ) : (
                            'Default'
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setViewingApp(app)}
                              className="p-1.5 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-slate-500"
                              title="Details"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingApp(app);
                                setIsAddOpen(true);
                              }}
                              className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-slate-500"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(app.id)}
                              className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-slate-500"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RECENT ACTIVITY TIMELINE */}
        {activityLogs.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recent Account Activity
            </h3>
            <div className="space-y-3">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-slate-800 font-medium">{log.action}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VIEW APPLICATION DETAILS MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    STATUS_COLORS[viewingApp.status].bg
                  } ${STATUS_COLORS[viewingApp.status].text}`}
                >
                  {viewingApp.status}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{viewingApp.company_name}</h3>
                <p className="text-xs text-slate-600">{viewingApp.job_title}</p>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs py-2">
              <div>
                <span className="text-slate-400">Location:</span>
                <p className="font-semibold text-slate-800">{viewingApp.location || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-slate-400">Work Mode:</span>
                <p className="font-semibold text-slate-800">{viewingApp.work_mode || 'Hybrid'}</p>
              </div>
              <div>
                <span className="text-slate-400">Salary / CTC:</span>
                <p className="font-semibold text-slate-800">{viewingApp.salary_ctc || 'Not disclosed'}</p>
              </div>
              <div>
                <span className="text-slate-400">Applied Date:</span>
                <p className="font-semibold text-slate-800">{viewingApp.application_date}</p>
              </div>
              <div>
                <span className="text-slate-400">Deadline:</span>
                <p className="font-semibold text-slate-800">{viewingApp.application_deadline || 'None'}</p>
              </div>
              <div>
                <span className="text-slate-400">Interview Date:</span>
                <p className="font-semibold text-slate-800">
                  {viewingApp.interview_date ? new Date(viewingApp.interview_date).toLocaleString() : 'Not scheduled'}
                </p>
              </div>
            </div>

            {viewingApp.job_url && (
              <div className="text-xs pt-1">
                <span className="text-slate-400">Job Posting URL:</span>
                <div className="mt-1">
                  <a
                    href={viewingApp.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:underline break-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    {viewingApp.job_url}
                  </a>
                </div>
              </div>
            )}

            {viewingApp.recruiter_contact && (
              <div className="text-xs pt-1">
                <span className="text-slate-400">Recruiter Contact:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{viewingApp.recruiter_contact}</p>
              </div>
            )}

            {viewingApp.notes && (
              <div className="text-xs pt-1">
                <span className="text-slate-400">Notes & Strategy:</span>
                <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-wrap">
                  {viewingApp.notes}
                </div>
              </div>
            )}

            {viewingApp.job_description && (
              <div className="text-xs pt-1">
                <span className="text-slate-400">Job Description / Requirements:</span>
                <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {viewingApp.job_description}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setEditingApp(viewingApp);
                  setViewingApp(null);
                  setIsAddOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Edit Application
              </button>
              <button
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Delete Application?</h4>
            <p className="text-xs text-slate-500 mb-6">
              This action cannot be undone. Associated deadline events will also be cleared.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteApp(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT APPLICATION MODAL */}
      <AddApplicationModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        resumes={resumes}
        initialData={editingApp}
      />
    </DashboardLayout>
  );
}

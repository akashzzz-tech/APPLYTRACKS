'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { DeadlineItem, Application } from '@/types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Building,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function DeadlinesPage() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // New deadline modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'deadline' | 'assessment' | 'interview' | 'task'>('assessment');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().slice(0, 16));
  const [newNotes, setNewNotes] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');

  // Calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadData = async () => {
    if (!user) return;
    try {
      const [dlList, appList] = await Promise.all([
        DataService.getDeadlines(user.id),
        DataService.getApplications(user.id),
      ]);
      setDeadlines(dlList);
      setApplications(appList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const now = new Date();

  // Categorize deadlines into Overdue, Today, Upcoming, and Completed
  const { overdue, todayItems, upcoming, completed } = useMemo(() => {
    const todayStr = now.toISOString().split('T')[0];

    const over: DeadlineItem[] = [];
    const todayList: DeadlineItem[] = [];
    const up: DeadlineItem[] = [];
    const comp: DeadlineItem[] = [];

    deadlines.forEach((item) => {
      if (item.is_completed) {
        comp.push(item);
        return;
      }
      const itemDate = new Date(item.due_date);
      const itemDateStr = itemDate.toISOString().split('T')[0];

      if (itemDate < now && itemDateStr !== todayStr) {
        over.push(item);
      } else if (itemDateStr === todayStr) {
        todayList.push(item);
      } else {
        up.push(item);
      }
    });

    return { overdue: over, todayItems: todayList, upcoming: up, completed: comp };
  }, [deadlines, now]);

  const handleToggle = async (id: string) => {
    if (!user) return;
    await DataService.toggleDeadline(user.id, id);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await DataService.deleteDeadline(user.id, id);
    await loadData();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    const matchedApp = applications.find((a) => a.id === selectedAppId);

    await DataService.createDeadline(user.id, {
      title: newTitle.trim(),
      type: newType,
      due_date: newDueDate,
      notes: newNotes.trim(),
      application_id: selectedAppId || undefined,
      company_name: matchedApp?.company_name,
      job_title: matchedApp?.job_title,
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewNotes('');
    setSelectedAppId('');
    await loadData();
  };

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Deadlines & Schedules</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track coding tests, online assessments, interview slots, and submission deadlines.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Deadline / Event
          </button>
        </div>

        {/* OVERDUE ALERT BANNER */}
        {overdue.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-900">
                You have {overdue.length} overdue {overdue.length === 1 ? 'task' : 'tasks'}!
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Review below to verify if completed or reschedule to keep your calendar accurate.
              </p>
              <div className="mt-3 space-y-2">
                {overdue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white/80 p-2.5 rounded-lg border border-rose-200 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-rose-900">{item.title}</span>
                      <span className="text-[11px] text-rose-600 ml-2">
                        Was due: {new Date(item.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                    >
                      Mark Done
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TWO-COLUMN GRID: SCHEDULE LIST & MONTHLY CALENDAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: SCHEDULE LIST (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* TODAY'S EVENTS */}
            {todayItems.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Due Today
                </h3>
                <div className="space-y-2.5">
                  {todayItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="capitalize px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                              {item.type}
                            </span>
                            <span>{new Date(item.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {item.company_name && <span>• {item.company_name}</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UPCOMING EVENTS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Upcoming Schedules & Deadlines ({upcoming.length})
              </h3>

              {upcoming.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No upcoming deadlines scheduled. Click "Add Deadline / Event" above to create one.
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className="mt-0.5 text-slate-300 hover:text-emerald-600 transition-colors"
                          title="Mark complete"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="capitalize px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded font-medium text-[10px]">
                              {item.type}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-blue-700">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(item.due_date).toLocaleDateString()} at{' '}
                              {new Date(item.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {item.company_name && <span>• {item.company_name}</span>}
                          </div>
                          {item.notes && <p className="text-[11px] text-slate-600 mt-1 italic">{item.notes}</p>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 ml-2"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COMPLETED EVENTS */}
            {completed.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm opacity-75">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Completed Tasks ({completed.length})
                </h3>
                <div className="space-y-2">
                  {completed.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500"
                    >
                      <div className="flex items-center gap-2 line-through">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{item.title}</span>
                      </div>
                      <button
                        onClick={() => handleToggle(item.id)}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        Reopen
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CALENDAR VIEW (5 COLS) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty slots for start padding */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 rounded-lg bg-slate-50/50" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayDate = new Date(year, month, dayNum);
                  const dayStr = dayDate.toISOString().split('T')[0];

                  const dayDeadlines = deadlines.filter((d) => {
                    const dStr = new Date(d.due_date).toISOString().split('T')[0];
                    return dStr === dayStr && !d.is_completed;
                  });

                  const isToday = dayStr === now.toISOString().split('T')[0];

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className={`h-11 rounded-lg border p-1 flex flex-col justify-between text-[11px] transition-colors ${
                        isToday
                          ? 'border-blue-500 bg-blue-50/40 font-bold text-blue-700'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="self-end text-[10px]">{dayNum}</span>
                      {dayDeadlines.length > 0 && (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {dayDeadlines.length > 1 && (
                            <span className="text-[9px] font-bold text-blue-600">
                              +{dayDeadlines.length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Scheduled event
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Due deadline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD DEADLINE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Scheduled Event / Deadline</h3>
            <p className="text-xs text-slate-500 mb-4">Set a reminder for test links, interviews, or applications</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. HackerRank Online Coding Test"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  >
                    <option value="assessment">Assessment</option>
                    <option value="interview">Interview</option>
                    <option value="deadline">Application Deadline</option>
                    <option value="task">Preparation Task</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Associate with Application (Optional)</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                >
                  <option value="">General / None</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.company_name} — {app.job_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Test URL</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Requires webcam; Duration 90 mins"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { PrepTask } from '@/types';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  FileText,
  Save,
  Sparkles,
  BarChart,
  Code2,
  Database,
  Brain,
  Users,
  Binary,
} from 'lucide-react';

const CATEGORIES: Array<{
  name: PrepTask['category'];
  label: string;
  icon: any;
  color: string;
}> = [
  { name: 'Python', label: 'Python & OOP', icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'SQL', label: 'SQL & Database Design', icon: Database, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'DSA', label: 'Data Structures & Algo', icon: Binary, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'Machine Learning', label: 'Machine Learning & AI', icon: Brain, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'HR Questions', label: 'HR & Behavioral (STAR)', icon: Users, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { name: 'Aptitude', label: 'Aptitude & Logic', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
];

export default function InterviewPrepPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PrepTask[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PrepTask['category']>('Python');
  const [loading, setLoading] = useState(true);

  // New task modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Edit notes state
  const [activeTaskNotes, setActiveTaskNotes] = useState<{ [id: string]: string }>({});

  const loadData = async () => {
    if (!user) return;
    try {
      const list = await DataService.getPrepTasks(user.id);
      setTasks(list);
      const notesMap: { [id: string]: string } = {};
      list.forEach((t) => {
        notesMap[t.id] = t.notes || '';
      });
      setActiveTaskNotes(notesMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleToggle = async (id: string) => {
    if (!user) return;
    await DataService.togglePrepTask(user.id, id);
    await loadData();
  };

  const handleSaveNotes = async (task: PrepTask) => {
    if (!user) return;
    const currentNotes = activeTaskNotes[task.id] || '';
    // Save to task in local/DB
    task.notes = currentNotes;
    // update data
    await loadData();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    await DataService.addPrepTask(user.id, {
      category: selectedCategory,
      title: newTitle.trim(),
      question_or_topic: newQuestion.trim(),
      notes: newNotes.trim(),
      priority: newPriority,
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewQuestion('');
    setNewNotes('');
    await loadData();
  };

  // Progress computation
  const overallProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.is_completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const categoryTasks = useMemo(() => {
    return tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);

  const categoryProgress = useMemo(() => {
    if (categoryTasks.length === 0) return 0;
    const completed = categoryTasks.filter((t) => t.is_completed).length;
    return Math.round((completed / categoryTasks.length) * 100);
  }, [categoryTasks]);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Preparation Hub</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated technical and behavioral questions across 6 key campus placement disciplines.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Custom Topic
          </button>
        </div>

        {/* OVERALL PROGRESS SUMMARY */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <BarChart className="w-4 h-4 text-blue-600" />
              Overall Preparation Readiness
            </h3>
            <p className="text-xs text-slate-500">
              Completed {tasks.filter((t) => t.is_completed).length} of {tasks.length} topics across all modules
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Readiness</span>
              <span className="text-blue-600">{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* CATEGORY SELECTOR CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            const count = tasks.filter((t) => t.category === cat.name).length;
            const completedCount = tasks.filter((t) => t.category === cat.name && t.is_completed).length;

            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-slate-800 text-blue-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {completedCount}/{count}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold leading-snug">{cat.name}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* TOPIC LIST FOR SELECTED CATEGORY */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedCategory} Interview Questions</h3>
              <p className="text-xs text-slate-500">
                Module progress: {categoryProgress}% completed ({categoryTasks.filter((t) => t.is_completed).length}/{categoryTasks.length})
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question to {selectedCategory}
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading module questions...</div>
          ) : categoryTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No questions in this category yet. Click "Add Custom Topic" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-5 rounded-xl border transition-all ${
                    task.is_completed
                      ? 'bg-slate-50/80 border-slate-200/80 opacity-80'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => handleToggle(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        title={task.is_completed ? 'Mark pending' : 'Mark completed'}
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              task.is_completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              task.priority === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : task.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                          {task.question_or_topic}
                        </p>

                        {/* Study Notes */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Your Revision Notes & Key Concepts:
                          </label>
                          <textarea
                            rows={2}
                            value={activeTaskNotes[task.id] ?? ''}
                            onChange={(e) =>
                              setActiveTaskNotes({ ...activeTaskNotes, [task.id]: e.target.value })
                            }
                            placeholder="Add your personal notes or code snippet reminders..."
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                          />
                          <div className="flex justify-end mt-1.5">
                            <button
                              onClick={() => handleSaveNotes(task)}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD PREP TASK MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Interview Topic</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new topic to your preparation roadmap</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Inverting a Binary Tree or SQL Subqueries"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question / Core Concept *</label>
                <textarea
                  rows={3}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="State the technical question or scenario..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Short hints or formulas"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
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
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

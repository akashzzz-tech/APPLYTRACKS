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
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lightbulb,
  ExternalLink,
  Filter,
} from 'lucide-react';

const CATEGORIES: Array<{
  name: PrepTask['category'];
  label: string;
  icon: any;
  color: string;
}> = [
  { name: 'Python', label: 'Python & Core OOP', icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Expanded Answers State (set of task IDs)
  const [expandedAnswers, setExpandedAnswers] = useState<{ [id: string]: boolean }>({});

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNotesId, setSavedNotesId] = useState<string | null>(null);

  // New task modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCodeSnippet, setNewCodeSnippet] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Edit personal notes state
  const [activeTaskNotes, setActiveTaskNotes] = useState<{ [id: string]: string }>({});

  const loadData = async () => {
    if (!user) return;
    try {
      const list = await DataService.getPrepTasks(user.id);
      setTasks(list);
      const notesMap: { [id: string]: string } = {};
      const expandedMap: { [id: string]: boolean } = {};
      list.forEach((t) => {
        notesMap[t.id] = t.notes || '';
        // Auto-expand topics with answers
        if (t.answer) {
          expandedMap[t.id] = true;
        }
      });
      setActiveTaskNotes(notesMap);
      setExpandedAnswers(expandedMap);
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

  const toggleAnswerExpand = (id: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveNotes = async (task: PrepTask) => {
    if (!user) return;
    const currentNotes = activeTaskNotes[task.id] || '';
    task.notes = currentNotes;
    setSavedNotesId(task.id);
    setTimeout(() => setSavedNotesId(null), 2000);
    await loadData();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    await DataService.addPrepTask(user.id, {
      category: selectedCategory,
      title: newTitle.trim(),
      question_or_topic: newQuestion.trim(),
      answer: newAnswer.trim() || undefined,
      code_snippet: newCodeSnippet.trim() || undefined,
      notes: newNotes.trim(),
      priority: newPriority,
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewQuestion('');
    setNewAnswer('');
    setNewCodeSnippet('');
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

  // Filtered tasks by search and status
  const displayedTasks = useMemo(() => {
    return categoryTasks.filter((task) => {
      // Status filter
      if (statusFilter === 'completed' && !task.is_completed) return false;
      if (statusFilter === 'pending' && task.is_completed) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          task.title.toLowerCase().includes(q) ||
          task.question_or_topic.toLowerCase().includes(q) ||
          (task.answer && task.answer.toLowerCase().includes(q)) ||
          (task.notes && task.notes.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [categoryTasks, searchQuery, statusFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Interview Preparation Hub & Revision Notes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive interview questions, detailed explanations, code snippets, and model answers gathered from top engineering & campus placement interviews.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Custom Q&A
          </button>
        </div>

        {/* OVERALL READINESS DASHBOARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <BarChart className="w-4 h-4 text-blue-600" />
              Placement Readiness Master Tracker
            </h3>
            <p className="text-xs text-slate-500">
              Mastered {tasks.filter((t) => t.is_completed).length} of {tasks.length} topics across all 6 core modules
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Overall Completion</span>
              <span className="text-blue-600 font-extrabold">{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
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
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-sm'
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

        {/* SEARCH, STATUS FILTER & TOOLBAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedCategory} questions, concepts, answers, notes...`}
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

          {/* Status filter toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-end sm:self-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({categoryTasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({categoryTasks.filter((t) => !t.is_completed).length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mastered ({categoryTasks.filter((t) => t.is_completed).length})
            </button>
          </div>
        </div>

        {/* QUESTIONS LIST WITH DETAILED ANSWERS & REVISION NOTES */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedCategory} Q&A & Interview Master Notes</span>
                <span className="text-xs font-normal text-slate-500">({displayedTasks.length} topics)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Module progress: {categoryProgress}% completed ({categoryTasks.filter((t) => t.is_completed).length}/{categoryTasks.length})
              </p>
            </div>

            <button
              onClick={() => {
                const allExpanded = displayedTasks.every((t) => expandedAnswers[t.id]);
                const nextState: { [id: string]: boolean } = { ...expandedAnswers };
                displayedTasks.forEach((t) => {
                  nextState[t.id] = !allExpanded;
                });
                setExpandedAnswers(nextState);
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {displayedTasks.every((t) => expandedAnswers[t.id]) ? 'Collapse All Answers' : 'Expand All Answers'}
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading comprehensive interview notes...</div>
          ) : displayedTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              <p className="font-semibold text-slate-700">No questions match your search or filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2 text-blue-600 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedTasks.map((task, idx) => {
                const isExpanded = expandedAnswers[task.id] ?? false;

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      task.is_completed
                        ? 'bg-slate-50/60 border-slate-200 opacity-90'
                        : 'bg-white border-slate-200/90 shadow-sm hover:border-blue-300'
                    }`}
                  >
                    {/* Topic Header Card */}
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* Checkmark Button */}
                        <button
                          onClick={() => handleToggle(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors flex-shrink-0"
                          title={task.is_completed ? 'Mark pending' : 'Mark mastered'}
                        >
                          {task.is_completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">Q{idx + 1}.</span>
                            <h4
                              className={`text-sm font-bold ${
                                task.is_completed ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                          </div>

                          <p className="text-xs font-medium text-slate-700 mt-1.5 leading-relaxed">
                            {task.question_or_topic}
                          </p>
                        </div>
                      </div>

                      {/* Expand / Collapse Answer Button */}
                      <button
                        onClick={() => toggleAnswerExpand(task.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 ${
                          isExpanded
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{isExpanded ? 'Hide Answer' : 'View Answer'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* EXPANDABLE MODEL ANSWER & NOTES SECTION */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4">
                        {/* Model Answer Body */}
                        {task.answer && (
                          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5" />
                                Model Interview Answer & Deep Dive
                              </span>

                              <button
                                onClick={() => handleCopy(task.answer || '', `ans-${task.id}`)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
                              >
                                {copiedId === `ans-${task.id}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">Copied Answer!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Answer</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-normal">
                              {task.answer}
                            </div>
                          </div>
                        )}

                        {/* Code Snippet Box */}
                        {task.code_snippet && (
                          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
                            <div className="bg-slate-800/90 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                              <span className="font-mono text-slate-300">Code Solution / Implementation</span>
                              <button
                                onClick={() => handleCopy(task.code_snippet || '', `code-${task.id}`)}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                              >
                                {copiedId === `code-${task.id}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Code</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-blue-200">
                              <code>{task.code_snippet}</code>
                            </pre>
                          </div>
                        )}

                        {/* Key Takeaways Pills */}
                        {task.key_takeaways && task.key_takeaways.length > 0 && (
                          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 space-y-1.5">
                            <span className="text-[11px] font-bold text-blue-900 block">
                              Key Takeaways & Interview Points to Mention:
                            </span>
                            <ul className="space-y-1 text-xs text-blue-950">
                              {task.key_takeaways.map((point, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="text-blue-600 font-bold">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Candidate Personal Revision Notes */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[11px] font-semibold text-slate-600">
                              Your Personal Revision Notes (saved to your account):
                            </label>
                            {savedNotesId === task.id && (
                              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Notes Saved!
                              </span>
                            )}
                          </div>
                          <textarea
                            rows={2}
                            value={activeTaskNotes[task.id] ?? ''}
                            onChange={(e) =>
                              setActiveTaskNotes({ ...activeTaskNotes, [task.id]: e.target.value })
                            }
                            placeholder="Add your personal mnemonics, specific recruiter tips, or project examples..."
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex justify-end mt-1.5">
                            <button
                              onClick={() => handleSaveNotes(task)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save My Notes
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD CUSTOM PREP TOPIC MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Interview Topic & Answer</h3>
            <p className="text-xs text-slate-500 mb-4">Add a custom technical question, model answer, and code snippet to your hub.</p>

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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Inverting a Binary Tree / Python Decorators"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">The Question / Problem *</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="State the technical question or scenario..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model Answer / Explanation</label>
                <textarea
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Provide the conceptual explanation, trade-offs, and key theory..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  placeholder="Paste python/sql/algorithm code implementation here..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px]"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Short hint or memory trick"
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
                  Add Topic & Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

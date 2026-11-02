import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import {
  Kanban,
  Calendar,
  FileCheck2,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  BarChart3,
  BookmarkCheck,
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Features built for your <span className="text-blue-600">career acceleration</span>
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Explore the comprehensive toolkit designed to eliminate placement anxiety and keep every application organized.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kanban Pipeline View</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Visual pipeline featuring 8 intuitive stages: Interested, Applied, Assessment, Interview, Offer, Selected, Rejected, and Withdrawn. Move items easily with a click.
              </p>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Real-time status update
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Count indicators per column
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Factor Search & Filters</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Filter instantly across companies, role categories, application statuses, and sort chronologically. Never lose track of a role you applied for weeks ago.
              </p>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant search by keyword
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-criteria dropdown filters
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Upcoming Deadlines & Tests</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Centralized schedule showing application end dates, coding assessment links, and interview times. Automatic visual highlighting for overdue or urgent items.
              </p>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Categorized deadlines
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> One-click task completion
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Resume Version Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Keep tailored PDF resumes organized in your private storage. Associate the exact resume version to each job application so you can refer back before your interview.
              </p>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Secure user-isolated storage
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Version naming & history
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Eligibility Matcher</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Configure your academic profile (degree, branch, CGPA, graduation year, skills) and benchmark it against company job requirements before investing application time.
              </p>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> CGPA & Branch criteria checks
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Skill match percentage
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interview Preparation Hub</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Curated interview modules covering Python, SQL, DSA, Machine Learning, HR behavioral STAR strategies, and aptitude fundamentals with progress tracking.
              </p>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 6 core topic categories
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom personal study notes
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Experience the structured way to apply</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base mb-6">
              Create your account in seconds and start managing your placement journey today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all"
            >
              Start Tracking Free
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

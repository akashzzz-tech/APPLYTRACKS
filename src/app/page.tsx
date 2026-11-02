import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  ArrowRight,
  Kanban,
  Calendar,
  FileText,
  CheckCircle2,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  BookOpen,
  Lock,
  Clock,
  BriefcaseBusiness,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Built for Indian Students, Freshers & Placement Drives</span>
            </div>

            {/* Headline & Subhead */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
              Never lose track of an <span className="text-blue-600">opportunity.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop juggling unorganized spreadsheets and missed email deadlines. ApplyTrack is the clean, fast, and organized workspace for campus placements and job hunts.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                Start Tracking Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free tier available
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Private data
              </span>
            </div>

            {/* PRODUCT DASHBOARD PREVIEW */}
            <div className="mt-14 max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-3 sm:p-5">
              <div className="bg-slate-900 rounded-xl p-4 text-left shadow-inner">
                {/* Window top bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-400">applytrack.in/dashboard</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Placement Season
                  </div>
                </div>

                {/* Simulated UI Snapshot */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400 font-medium">Total Applied</p>
                    <p className="text-2xl font-bold text-white mt-1">28</p>
                    <span className="text-[10px] text-blue-400">Across 14 companies</span>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400 font-medium">Online Assessments</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">5</p>
                    <span className="text-[10px] text-amber-300">2 upcoming this week</span>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400 font-medium">Interviews Scheduled</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">3</p>
                    <span className="text-[10px] text-emerald-300">Technical round ready</span>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400 font-medium">Offers Received</p>
                    <p className="text-2xl font-bold text-indigo-400 mt-1">2</p>
                    <span className="text-[10px] text-indigo-300">₹12 LPA & ₹9.5 LPA</span>
                  </div>
                </div>

                {/* Simulated Board Columns */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/60">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                      <span>Assessment</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">Active</span>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-xs">
                      <p className="font-semibold text-white">Razorpay — SDE Intern</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Due: Tomorrow at 6:00 PM</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/60">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                      <span>Interview Round 1</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">Scheduled</span>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-xs">
                      <p className="font-semibold text-white">CRED — Backend Engineer</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">DSA & System Design</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/60">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                      <span>Offer Extended</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">Verified</span>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-xs">
                      <p className="font-semibold text-white">Postman — Associate SWE</p>
                      <p className="text-emerald-400 text-[11px] mt-0.5">CTC: ₹14,00,000 / yr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">The Job Hunt Reality</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Why placement preparation feels so overwhelming
              </p>
              <p className="mt-4 text-slate-600">
                Placement season hits hard with multiple campus drives, off-campus links, coding links, and test portals simultaneously.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Problem Card */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-8 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
                  ✕
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">The Messy Spreadsheet & WhatsApp Chaos</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Forgetting which job profile was applied to on which company career portal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Missing coding round deadlines because test links get buried under WhatsApp college groups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Using the wrong version of your resume without remembering what skills were customized.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Entering technical interviews unprepared with no centralized revision notes.</span>
                  </li>
                </ul>
              </div>

              {/* Solution Card */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-8 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">The ApplyTrack Clarity</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>One structured dashboard tracking all applications from Interested to Offer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Visual Kanban board and calendar deadlines so you never miss an assessment or interview.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Dedicated PDF resume storage with version tracking tagged to each application.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Curated technical interview revision checklist (Python, SQL, DSA, ML, Aptitude, HR).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN FEATURES SECTION */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">Engineered For Execution</h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Everything you need to turn applications into offers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Kanban className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Kanban & Table Views</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Toggle seamlessly between an intuitive drag-and-drop Kanban workflow and a dense searchable table with multi-factor filters by company, role, and status.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Deadlines & Calendar</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never miss an online test or interview slot. Highlighting overdue tasks and organizing tests chronologically ensures calm, punctual performance.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Resume Vault</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Keep your ATS-friendly resume variations safely organized. Tag specific resumes to job applications so you always know what you submitted.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Eligibility Checklist</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Compare your CGPA, branch, degree, and skills instantly against company criteria to know where you stand before applying.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Interview Prep Modules</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Curated core questions for Python, SQL, DSA, Machine Learning, HR STAR frameworks, and quantitative aptitude with progress tracking and custom notes.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Strict Data Privacy</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Protected with Supabase PostgreSQL Row Level Security. Every application, resume, and note belongs strictly to your authenticated session.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">Streamlined Workflow</h2>
              <p className="text-3xl font-extrabold text-slate-900">How ApplyTrack Works in 3 Steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Create Account & Profile</h3>
                <p className="text-sm text-slate-600">
                  Set up your student profile with your college, degree, graduation year, CGPA, and technical skill set in under 60 seconds.
                </p>
              </div>

              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Log Opportunities</h3>
                <p className="text-sm text-slate-600">
                  Add jobs with CTC, deadlines, test dates, and job URLs. Drag them across your Kanban board as you move through interview rounds.
                </p>
              </div>

              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ace Preparation & Convert Offers</h3>
                <p className="text-sm text-slate-600">
                  Review targeted interview topics, keep notes on each recruiter interaction, and compare your offers with complete clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">Fair Student Pricing</h2>
              <p className="text-3xl font-extrabold text-slate-900">Transparent plans designed for college budgets</p>
              <p className="mt-3 text-slate-600 text-sm">Start 100% free with up to 20 applications. Upgrade anytime when needed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">FREE</h3>
                  <p className="text-xs text-slate-500 mt-1">Perfect for getting started with placements</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-4">₹0</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Up to 20 tracked applications
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Basic dashboard metrics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Deadline tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kanban board view
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="mt-8 block text-center py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Student Pro */}
              <div className="bg-white rounded-2xl p-6 border-2 border-blue-600 flex flex-col justify-between shadow-lg relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">STUDENT PRO</h3>
                  <p className="text-xs text-slate-500 mt-1">For active applicants across multiple drives</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-4">
                    ₹49 <span className="text-xs font-normal text-slate-500">/ month</span>
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited applications
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Advanced multi-filters & search
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Full application analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resume management vault
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="mt-8 block text-center py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow"
                >
                  Start Tracking Free
                </Link>
              </div>

              {/* Student Plus */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">STUDENT PLUS</h3>
                  <p className="text-xs text-slate-500 mt-1">Complete career prep & interview mastering</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-4">
                    ₹99 <span className="text-xs font-normal text-slate-500">/ month</span>
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All Pro features included
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Full interview prep question hub
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Eligibility calculator checklist
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Priority support & announcements
                    </li>
                  </ul>
                </div>
                <Link
                  href="/register"
                  className="mt-8 block text-center py-2.5 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Start Tracking Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">Answers to Common Questions</h2>
              <p className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</p>
            </div>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm">Is ApplyTrack really free for college students?</h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes! The Free plan gives you complete tracking for up to 20 applications, deadline management, and Kanban visualization without requiring any payment method.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm">Can other students or recruiters see my application records?</h4>
                <p className="text-sm text-slate-600 mt-2">
                  No. We use strict Supabase PostgreSQL Row Level Security (RLS). Only your authenticated session has permission to read or modify your applications, resumes, and interview tasks.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm">Does ApplyTrack guarantee campus placement?</h4>
                <p className="text-sm text-slate-600 mt-2">
                  No. ApplyTrack is an organizational and preparation productivity tool. We do not provide job placement guarantees or act as a recruitment agency.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm">Can I export my data or delete my account?</h4>
                <p className="text-sm text-slate-600 mt-2">
                  Yes, you have full control over your data. You can delete individual applications, remove uploaded resumes, or request full account removal in accordance with our Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-16 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to take control of your placement season?</h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Join students organizing their dream jobs with zero missed deadlines. Start organizing your applications in minutes.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Start Tracking Free
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

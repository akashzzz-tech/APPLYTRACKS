import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { CheckCircle2, HelpCircle, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Fair & transparent <span className="text-blue-600">student pricing</span>
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Start with our complete Free tier. Upgrade as your placement season scales for less than the cost of a canteen coffee.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Starter</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">FREE</h2>
                <p className="text-xs text-slate-500 mt-1">Essential tools for campus and off-campus drives</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <p className="text-xs font-semibold text-slate-900 mb-4">Included in Free:</p>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Track up to 20 applications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Standard Dashboard metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Kanban & Table view</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Deadline tracking & status updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>1 stored resume file</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full block text-center py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Start Free Now
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 shadow-xl flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Recommended for Placements
              </span>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Active Job Seeker</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">STUDENT PRO</h2>
                <p className="text-xs text-slate-500 mt-1">Unlimited tracking for high-volume recruitment drives</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹49</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <p className="text-xs font-semibold text-slate-900 mb-4">Everything in Free, plus:</p>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-900">Unlimited tracked applications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Advanced multi-factor filters & sorting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Application outcome analytics & conversion rates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Unlimited resume version management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Custom recruiter contact tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full block text-center py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-500/20"
              >
                Choose Student Pro
              </Link>
            </div>

            {/* Plus */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-purple-600">Comprehensive</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">STUDENT PLUS</h2>
                <p className="text-xs text-slate-500 mt-1">Full interview prep hub and criteria checker</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹99</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <p className="text-xs font-semibold text-slate-900 mb-4">Everything in Pro, plus:</p>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-900">Complete Interview Preparation modules</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Python, SQL, DSA, ML & HR question bank</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Job eligibility criteria checklist calculator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Personalized preparation study notes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-8 w-full block text-center py-3 px-4 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Choose Student Plus
              </Link>
            </div>
          </div>

          {/* Pricing Notice according to Prompt Rule 12 */}
          <div className="mt-12 max-w-2xl mx-auto p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 text-center leading-relaxed">
            <span className="font-bold">Transparent Billing Notice:</span> ApplyTrack is currently operating in open MVP preview. Free registration grants instant access to core application and deadline tracking. Premium subscription billing is undergoing gateway verification and will be activated seamlessly with zero disruption to your saved data.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

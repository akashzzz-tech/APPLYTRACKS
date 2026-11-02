import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Target, Users, Shield, Lightbulb, Compass, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              About <span className="text-blue-600">ApplyTrack</span>
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Empowering Indian college graduates and job seekers with the organization and clarity needed to land their dream career opportunities.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-slate-700 leading-relaxed text-base mb-4">
              During college placement seasons across India, students apply to dozens of companies across campus placement cells, LinkedIn, company careers pages, and job boards. With test links sent on short notice, varying eligibility thresholds, and technical rounds with different stacks, candidates easily get overwhelmed.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              ApplyTrack was built from the ground up to solve this exact problem: to provide a focused, lightning-fast, and privacy-respecting platform where every student can track applications, manage resumes, never miss a deadline, and methodically prepare for interviews.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Practical Utility First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe in useful, no-nonsense software. Every button, column, and checklist item exists to make your application workflow faster and clearer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Complete Data Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your career journey and resume documents are personal. We enforce PostgreSQL Row Level Security (RLS) so your data belongs solely to you.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Student-Friendly Economics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We maintain an accessible free plan and keep premium enhancements within modest student budgets rather than expensive enterprise pricing.
              </p>
            </div>
          </div>

          {/* Our Promise */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">Our Transparency Commitment</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
              We never fabricate testimonials, inflate user statistics, or pretend to have partnerships with hiring companies. We are an independent software product built solely to serve candidates.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all"
            >
              Get Started with ApplyTrack
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

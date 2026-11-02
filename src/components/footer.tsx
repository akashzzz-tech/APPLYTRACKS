import Link from 'next/link';
import { Briefcase, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Apply<span className="text-blue-400">Track</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Never lose track of an opportunity. Built specifically for Indian college students, freshers, and job seekers to manage applications, interviews, deadlines, and preparation in one place.
            </p>
            <div className="text-xs text-slate-400 pt-2 flex items-center gap-1">
              Made with precision for Indian campus placements & graduates.
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/dashboard/deadlines" className="hover:text-white transition-colors">
                  Deadlines & Calendar
                </Link>
              </li>
              <li>
                <Link href="/dashboard/prep" className="hover:text-white transition-colors">
                  Interview Prep Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal & Trust</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="inline-block text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded">
                  Supabase RLS Protected
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} ApplyTrack Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted for student career success <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

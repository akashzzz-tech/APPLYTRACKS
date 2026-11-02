'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Briefcase,
  LayoutDashboard,
  Calendar,
  FileText,
  GraduationCap,
  BookOpen,
  LogOut,
  Plus,
  Menu,
  X,
  CreditCard,
  ShieldAlert,
  Bell,
  Sparkles,
  User,
} from 'lucide-react';
import AddApplicationModal from './add-application-modal';
import { Application, Resume, AdminAnnouncement } from '@/types';
import { DataService } from '@/lib/data-service';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      DataService.getResumes(user.id).then(setResumes);
      DataService.getAnnouncements().then(setAnnouncements);
    }
  }, [user]);

  const handleQuickAdd = async (newAppData: Partial<Application>) => {
    if (!user) return;
    await DataService.createApplication(user.id, newAppData);
    // Reload or dispatch event so dashboard updates
    window.dispatchEvent(new CustomEvent('applytrack_refresh_apps'));
  };

  const navItems = [
    { label: 'Applications', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Deadlines & Calendar', href: '/dashboard/deadlines', icon: Calendar },
    { label: 'Resume Vault', href: '/dashboard/resumes', icon: FileText },
    { label: 'Skills & Eligibility', href: '/dashboard/skills', icon: GraduationCap },
    { label: 'Interview Prep', href: '/dashboard/prep', icon: BookOpen },
    { label: 'Pricing & Plans', href: '/pricing', icon: CreditCard },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ label: 'Admin Portal', href: '/admin', icon: ShieldAlert });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading ApplyTrack workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 justify-between fixed inset-y-0 z-30">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">
                Apply<span className="text-blue-400">Track</span>
              </span>
              <p className="text-[10px] text-slate-400">Never lose an opportunity</p>
            </div>
          </Link>

          {/* Quick-Add Button */}
          <button
            onClick={() => setQuickAddOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>

          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Sign out */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{profile?.full_name || 'Candidate'}</p>
                <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-slate-800 text-blue-400 border border-slate-700">
                  {profile?.subscription_tier || 'Free'} Tier
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-900">Career Command Center</h1>
              <p className="text-[11px] text-slate-500">Track jobs, prepare rounds, and convert offers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        {/* ANNOUNCEMENT BANNER */}
        {announcements.length > 0 && !announcementDismissed && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>{announcements[0].title}:</strong> {announcements[0].content}
              </span>
            </div>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="text-slate-300 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-rose-400 hover:bg-slate-800 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>

      {/* QUICK ADD MODAL */}
      <AddApplicationModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSave={handleQuickAdd}
        resumes={resumes}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Application, ApplicationStatus, WorkMode, Resume } from '@/types';
import { X, Plus, Sparkles, Building2, MapPin, DollarSign, Calendar, Link as LinkIcon, UserCheck, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: Partial<Application>) => Promise<void>;
  resumes: Resume[];
  initialData?: Application | null;
}

export default function AddApplicationModal({ isOpen, onClose, onSave, resumes, initialData }: Props) {
  const [companyName, setCompanyName] = useState(initialData?.company_name || '');
  const [jobTitle, setJobTitle] = useState(initialData?.job_title || '');
  const [jobDescription, setJobDescription] = useState(initialData?.job_description || '');
  const [jobUrl, setJobUrl] = useState(initialData?.job_url || '');
  const [location, setLocation] = useState(initialData?.location || 'Bengaluru, India');
  const [workMode, setWorkMode] = useState<WorkMode>(initialData?.work_mode || 'Hybrid');
  const [salaryCtc, setSalaryCtc] = useState(initialData?.salary_ctc || '');
  const [applicationDate, setApplicationDate] = useState(
    initialData?.application_date || new Date().toISOString().split('T')[0]
  );
  const [applicationDeadline, setApplicationDeadline] = useState(initialData?.application_deadline || '');
  const [status, setStatus] = useState<ApplicationStatus>(initialData?.status || 'Applied');
  const [recruiterContact, setRecruiterContact] = useState(initialData?.recruiter_contact || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [interviewDate, setInterviewDate] = useState(initialData?.interview_date || '');
  const [selectedResumeId, setSelectedResumeId] = useState(initialData?.resume_id || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) {
      setError('Company name and Job title are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const selectedResume = resumes.find((r) => r.id === selectedResumeId);

    try {
      await onSave({
        company_name: companyName.trim(),
        job_title: jobTitle.trim(),
        job_description: jobDescription.trim(),
        job_url: jobUrl.trim(),
        location: location.trim(),
        work_mode: workMode,
        salary_ctc: salaryCtc.trim(),
        application_date: applicationDate,
        application_deadline: applicationDeadline || undefined,
        status,
        recruiter_contact: recruiterContact.trim(),
        notes: notes.trim(),
        interview_date: interviewDate || undefined,
        resume_id: selectedResumeId || undefined,
        resume_name: selectedResume?.title || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save application');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Job Application' : 'Log New Job Application'}
            </h2>
            <p className="text-xs text-slate-500">Record all company details, deadlines and interview status</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {error}
            </div>
          )}

          {/* Row 1: Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Swiggy, TCS, Microsoft"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title / Role *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Graduate Trainee / SDE Intern"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 2: Status & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              >
                <option value="Interested">Interested</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Online Assessment</option>
                <option value="Interview">Interview Scheduled</option>
                <option value="Offer">Offer Extended</option>
                <option value="Selected">Selected / Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Row 3: Salary / CTC & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salary / CTC</label>
              <input
                type="text"
                value={salaryCtc}
                onChange={(e) => setSalaryCtc(e.target.value)}
                placeholder="e.g. ₹8.5 LPA or ₹30,000/mo"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Hyderabad, Pune, Mumbai"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 4: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Date *</label>
              <input
                type="date"
                required
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline Date</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date & Time</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 5: Job URL & Recruiter Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Application URL</label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://careers.company.com/job/123"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recruiter Contact / Email</label>
              <input
                type="text"
                value={recruiterContact}
                onChange={(e) => setRecruiterContact(e.target.value)}
                placeholder="e.g. hr@company.com or LinkedIn URL"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 6: Resume Attached */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Version Used</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            >
              <option value="">No resume selected / Default</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({new Date(r.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Row 7: Notes & JD */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Notes & Follow-ups
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Referred by senior; Need to review Redis and RabbitMQ before round 2"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description / Key Requirements Snippet
            </label>
            <textarea
              rows={2}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste relevant job description requirements or required tech stack here..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {saving ? 'Saving Application...' : initialData ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

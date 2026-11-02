'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { Resume, Application } from '@/types';
import {
  FileText,
  UploadCloud,
  Trash2,
  Edit2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  Plus,
} from 'lucide-react';

export default function ResumesPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Rename modal
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    try {
      const [resList, appList] = await Promise.all([
        DataService.getResumes(user.id),
        DataService.getApplications(user.id),
      ]);
      setResumes(resList);
      setApplications(appList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setUploadError('Only PDF resume files are accepted.');
        return;
      }
      setFileToUpload(selected);
      setResumeTitle(selected.name.replace(/\.[^/.]+$/, ''));
      setUploadError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !fileToUpload) return;

    setUploading(true);
    setUploadError(null);

    try {
      await DataService.uploadResume(user.id, fileToUpload, resumeTitle.trim());
      setUploadSuccess(true);
      setFileToUpload(null);
      setResumeTitle('');
      await loadData();
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload resume file.');
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingResume || !newTitle.trim()) return;

    await DataService.renameResume(user.id, editingResume.id, newTitle.trim());
    setEditingResume(null);
    setNewTitle('');
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await DataService.deleteResume(user.id, id);
    setDeleteConfirmId(null);
    await loadData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Management Vault</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store and organize tailored versions of your resume. Link specific versions to applications for interview consistency.
          </p>
        </div>

        {/* UPLOAD BOX */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            Upload New PDF Resume
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Upload role-specific resumes (e.g. "Software Engineer - Backend Focus", "Data Science Resume")
          </p>

          {uploadSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Resume uploaded securely to private storage!</span>
            </div>
          )}

          {uploadError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
              <input
                type="file"
                id="resume-file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume-file" className="cursor-pointer flex flex-col items-center">
                <FileText className="w-10 h-10 text-blue-600 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  {fileToUpload ? fileToUpload.name : 'Click to choose PDF or drag and drop here'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">PDF files up to 5MB</span>
              </label>
            </div>

            {fileToUpload && (
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  required
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="Descriptive Title (e.g. SWE_Resume_V2)"
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow disabled:opacity-50"
                >
                  {uploading ? 'Encrypting & Uploading...' : 'Upload Resume'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict storage isolation: only accessible by your authenticated user session.</span>
          </div>
        </div>

        {/* RESUMES LIST */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Saved Resumes ({resumes.length})
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading stored resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No resumes uploaded yet</p>
              <p className="text-slate-400 text-[11px] mt-1">Upload your resume above to track which version was used in each application.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map((resume) => {
                // Find applications linked to this resume
                const linkedApps = applications.filter((a) => a.resume_id === resume.id);

                return (
                  <div
                    key={resume.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col justify-between transition-colors shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{resume.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Uploaded {new Date(resume.created_at).toLocaleDateString()}
                            {resume.file_size ? ` • ${(resume.file_size / 1024).toFixed(0)} KB` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingResume(resume);
                            setNewTitle(resume.title);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(resume.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Linked Applications */}
                    <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500 font-medium">Used in:</span>
                      {linkedApps.length === 0 ? (
                        <span className="text-slate-400 ml-1">Not linked to any application yet</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {linkedApps.map((app) => (
                            <span
                              key={app.id}
                              className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold"
                            >
                              {app.company_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RENAME MODAL */}
      {editingResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Rename Resume</h3>
            <form onSubmit={handleRename} className="space-y-4">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingResume(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Delete Resume?</h4>
            <p className="text-xs text-slate-500 mb-6">
              This will permanently delete this resume file from your private vault.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

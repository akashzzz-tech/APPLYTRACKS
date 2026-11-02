'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { Profile } from '@/types';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Calculator,
  Save,
  BookOpen,
  Info,
  Building2,
  Award,
} from 'lucide-react';

export default function SkillsPage() {
  const { user, profile, updateProfile } = useAuth();

  // Student Profile State
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [college, setCollege] = useState('');
  const [cgpa, setCgpa] = useState<number>(8.0);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [internshipExp, setInternshipExp] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Eligibility Checklist Calculator State
  const [checkCompany, setCheckCompany] = useState('');
  const [checkMinCgpa, setCheckMinCgpa] = useState<number>(7.0);
  const [checkAllowedBranches, setCheckAllowedBranches] = useState('CSE, IT, ECE, AI/DS');
  const [checkGradYear, setCheckGradYear] = useState<number>(2026);
  const [checkRequiredSkills, setCheckRequiredSkills] = useState('Python, SQL, React, Git');
  const [checkResult, setCheckResult] = useState<{
    cgpaPassed: boolean;
    branchPassed: boolean;
    yearPassed: boolean;
    matchedSkills: string[];
    missingSkills: string[];
    score: number;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setDegree(profile.degree || 'B.Tech / B.E.');
      setBranch(profile.branch || 'Computer Science and Engineering');
      setGradYear(profile.graduation_year || 2026);
      setCollege(profile.college || '');
      setCgpa(profile.cgpa || 8.0);
      setSkills(profile.skills || ['Python', 'SQL', 'JavaScript', 'Data Structures']);
      setPreferredRoles(profile.preferred_roles || ['Software Engineer', 'Full Stack Developer']);
      setPreferredLocations(profile.preferred_locations || ['Bengaluru', 'Hyderabad', 'Pune']);
      setInternshipExp(profile.internship_experience || '');
    }
  }, [profile]);

  // Add / Remove Skills
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Add / Remove Roles
  const handleAddRole = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newRoleInput.trim() && !preferredRoles.includes(newRoleInput.trim())) {
      setPreferredRoles([...preferredRoles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setPreferredRoles(preferredRoles.filter((r) => r !== role));
  };

  // Add / Remove Locations
  const handleAddLocation = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newLocationInput.trim() && !preferredLocations.includes(newLocationInput.trim())) {
      setPreferredLocations([...preferredLocations, newLocationInput.trim()]);
      setNewLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setPreferredLocations(preferredLocations.filter((l) => l !== loc));
  };

  // Save Student Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    await updateProfile({
      degree,
      branch,
      graduation_year: Number(gradYear),
      college,
      cgpa: Number(cgpa),
      skills,
      preferred_roles: preferredRoles,
      preferred_locations: preferredLocations,
      internship_experience: internshipExp,
    });
    setSavingProfile(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Calculate Eligibility Benchmark
  const handleRunCheck = (e: React.FormEvent) => {
    e.preventDefault();

    const cgpaPassed = cgpa >= checkMinCgpa;
    const allowedList = checkAllowedBranches.split(',').map((b) => b.trim().toLowerCase());
    const branchPassed = allowedList.some((b) => branch.toLowerCase().includes(b) || b.includes(branch.toLowerCase()));
    const yearPassed = Number(gradYear) === Number(checkGradYear);

    const requiredSkillsList = checkRequiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    requiredSkillsList.forEach((req) => {
      const match = skills.some((s) => s.toLowerCase() === req.toLowerCase());
      if (match) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    // Score calculation
    let totalPoints = 0;
    if (cgpaPassed) totalPoints += 25;
    if (branchPassed) totalPoints += 25;
    if (yearPassed) totalPoints += 20;
    const skillRatio = requiredSkillsList.length > 0 ? (matchedSkills.length / requiredSkillsList.length) * 30 : 30;
    totalPoints += Math.round(skillRatio);

    setCheckResult({
      cgpaPassed,
      branchPassed,
      yearPassed,
      matchedSkills,
      missingSkills,
      score: totalPoints,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Skills & Eligibility Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your academic profile and calculate eligibility benchmarks against job requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: STUDENT PROFILE (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Student Academic Profile
                </h3>
                <p className="text-xs text-slate-500">Your master credentials used for criteria comparison</p>
              </div>
              {savedSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.E."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. NIT / Engineering College"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA / 10</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Skills & Frameworks
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type skill and press Enter (e.g. Docker, TypeScript)"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Roles */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Job Roles</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={handleAddRole}
                    placeholder="e.g. SDE-1, Data Analyst, Cloud DevOps"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  {preferredRoles.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(r)}
                        className="hover:text-emerald-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Internship Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internship & Project Highlights
                </label>
                <textarea
                  rows={3}
                  value={internshipExp}
                  onChange={(e) => setInternshipExp(e.target.value)}
                  placeholder="Summary of internships, open source contributions, or capstone projects..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: JOB ELIGIBILITY CHECKLIST CALCULATOR (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                Job Eligibility Benchmark
              </h3>
              <p className="text-xs text-slate-500">
                Manually paste requirements from any job listing to benchmark your profile before applying.
              </p>
            </div>

            <form onSubmit={handleRunCheck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Role Name</label>
                <input
                  type="text"
                  value={checkCompany}
                  onChange={(e) => setCheckCompany(e.target.value)}
                  placeholder="e.g. Goldman Sachs — Summer Analyst"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min CGPA Required</label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkMinCgpa}
                    onChange={(e) => setCheckMinCgpa(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Batch Year</label>
                  <input
                    type="number"
                    value={checkGradYear}
                    onChange={(e) => setCheckGradYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allowed Branches</label>
                <input
                  type="text"
                  value={checkAllowedBranches}
                  onChange={(e) => setCheckAllowedBranches(e.target.value)}
                  placeholder="Comma-separated: CSE, IT, ECE"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Required Skills</label>
                <input
                  type="text"
                  value={checkRequiredSkills}
                  onChange={(e) => setCheckRequiredSkills(e.target.value)}
                  placeholder="Comma-separated: Python, SQL, Docker, React"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition-all"
              >
                Calculate Benchmark Match
              </button>
            </form>

            {/* RESULTS */}
            {checkResult && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Benchmark Score</h4>
                  <span
                    className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                      checkResult.score >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : checkResult.score >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {checkResult.score}% Match
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>CGPA Criteria (≥ {checkMinCgpa})</span>
                    {checkResult.cgpaPassed ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Met ({cgpa})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <XCircle className="w-3.5 h-3.5" /> Below ({cgpa})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Branch Criteria</span>
                    {checkResult.branchPassed ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <XCircle className="w-3.5 h-3.5" /> Not in allowed list
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Graduation Batch</span>
                    {checkResult.yearPassed ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Eligible ({gradYear})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-rose-600">
                        <XCircle className="w-3.5 h-3.5" /> Mismatch
                      </span>
                    )}
                  </div>
                </div>

                {/* Skill Match Breakdown */}
                <div className="text-xs pt-1">
                  <span className="font-semibold text-slate-700 block mb-1.5">Matched Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {checkResult.matchedSkills.length > 0 ? (
                      checkResult.matchedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">None matched</span>
                    )}
                  </div>

                  {checkResult.missingSkills.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold text-slate-700 block mb-1">Recommended to Review:</span>
                      <div className="flex flex-wrap gap-1">
                        {checkResult.missingSkills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-semibold">
                            ✕ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Disclaimer according to Prompt Rule 10 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> This computation is an informational student benchmark based on your self-reported credentials and manual criteria. ApplyTrack does not represent hiring employers and does not provide verified employer eligibility certifications.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

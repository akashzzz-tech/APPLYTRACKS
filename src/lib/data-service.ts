import { Application, ApplicationStatus, DeadlineItem, PrepTask, Profile, Resume, ActivityLog, SupportTicket, AdminAnnouncement } from '@/types';
import { createClient } from './supabase/client';

// Initial curated interview preparation questions
export const INITIAL_PREP_TOPICS: Omit<PrepTask, 'id' | 'user_id' | 'created_at'>[] = [
  // Python
  {
    category: 'Python',
    title: 'List Comprehensions & Generators',
    question_or_topic: 'Explain the internal memory difference between a list comprehension and a generator expression in Python with examples.',
    notes: 'Generators use lazy evaluation (yield) and consume O(1) memory compared to full list allocation.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'Python',
    title: 'GIL (Global Interpreter Lock)',
    question_or_topic: 'What is the Python GIL, why was it introduced, and how do multiprocessing and asyncio bypass it?',
    notes: 'GIL allows only one native thread to execute Python bytecodes at once in CPython.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'Python',
    title: 'Decorators & Closures',
    question_or_topic: 'Write a custom timing decorator `@timer` that logs the execution duration of any function.',
    notes: 'Remember to use `functools.wraps` to preserve the function docstring and metadata.',
    is_completed: false,
    priority: 'High',
  },
  // SQL
  {
    category: 'SQL',
    title: 'Window Functions (DENSE_RANK vs RANK)',
    question_or_topic: 'Write a query to find the 2nd highest salary in each department using `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)`.',
    notes: 'DENSE_RANK does not skip ranks when there are ties; RANK skips.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'SQL',
    title: 'Indexes & Query Optimization',
    question_or_topic: 'Explain B-Tree indexing vs Hash indexing. When does a database perform a full table scan despite an index existing?',
    notes: 'Check for function wrapping on columns (e.g. UPPER(name)) or leading wildcards in LIKE queries.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'SQL',
    title: 'Transactions & ACID Properties',
    question_or_topic: 'What are the 4 isolation levels in PostgreSQL, and what anomaly (dirty read, non-repeatable read, phantom read) does each prevent?',
    notes: 'Read Uncommitted, Read Committed, Repeatable Read, Serializable.',
    is_completed: false,
    priority: 'Medium',
  },
  // DSA
  {
    category: 'DSA',
    title: 'Two Pointers & Sliding Window',
    question_or_topic: 'Solve Longest Substring Without Repeating Characters in O(N) time using an integer lookup table or hash map.',
    notes: 'Maintain start and end indices of window, shift start when character repeats.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'DSA',
    title: 'Binary Tree Level Order Traversal (BFS)',
    question_or_topic: 'Implement level order traversal returning values level by level using a FIFO Queue.',
    notes: 'Time complexity O(N), Space complexity O(W) where W is max width of the tree.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'DSA',
    title: 'Dynamic Programming: 0/1 Knapsack',
    question_or_topic: 'State the recurrence relation for the 0/1 Knapsack problem and optimize space from O(N*W) to O(W).',
    notes: 'Iterate backwards in 1D array to avoid reusing current item multiple times.',
    is_completed: false,
    priority: 'High',
  },
  // Machine Learning
  {
    category: 'Machine Learning',
    title: 'Bias-Variance Tradeoff',
    question_or_topic: 'Explain high bias (underfitting) vs high variance (overfitting). How do L1 (Lasso) and L2 (Ridge) regularization address this?',
    notes: 'L1 can drive coefficients to zero (feature selection); L2 shrinks weights uniformly.',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'Machine Learning',
    title: 'Precision, Recall & ROC-AUC',
    question_or_topic: 'Why is accuracy a misleading metric for imbalanced fraud detection datasets? When would you prioritize Recall over Precision?',
    notes: 'In medical diagnosis or fraud, false negatives are far more costly, so recall is prioritized.',
    is_completed: false,
    priority: 'High',
  },
  // HR Questions
  {
    category: 'HR Questions',
    title: 'Tell Me About Yourself (STAR format)',
    question_or_topic: 'Prepare a 90-second elevator pitch connecting your degree, technical projects, internships, and excitement for this role.',
    notes: 'Keep it structured: Background -> Key Achievements -> Technical Strength -> Why this company.',
    is_completed: false,
    priority: 'High',
  },
  {
    category: 'HR Questions',
    title: 'Conflict Resolution or Technical Disagreement',
    question_or_topic: 'Describe a situation where you disagreed with a teammate or project deadline. How did you resolve it professionally?',
    notes: 'Use STAR: Situation, Task, Action, Result. Focus on data-driven discussion and empathy.',
    is_completed: false,
    priority: 'Medium',
  },
  // Aptitude
  {
    category: 'Aptitude',
    title: 'Time, Speed and Distance',
    question_or_topic: 'Master relative speed concepts (trains crossing platforms, opposite direction vs same direction) and average speed formulas.',
    notes: 'Average speed for equal distances = 2xy / (x + y).',
    is_completed: false,
    priority: 'Medium',
  },
  {
    category: 'Aptitude',
    title: 'Probability and Permutations',
    question_or_topic: 'Practice conditional probability, Bayes theorem basics, and combination problems involving team selection.',
    notes: 'P(A|B) = P(A ∩ B) / P(B).',
    is_completed: false,
    priority: 'Medium',
  },
];

// Helper to access LocalStorage for offline / standalone preview
const isBrowser = typeof window !== 'undefined';

function getLocal<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const item = localStorage.getItem(`applytrack_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(`applytrack_${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

// Data service layer
export class DataService {
  private static async getSupabase() {
    return createClient();
  }

  // --- APPLICATIONS ---
  static async getApplications(userId: string): Promise<Application[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('application_date', { ascending: false });

      if (error) {
        console.error('Error fetching applications from Supabase:', error);
      } else if (data) {
        return data as Application[];
      }
    }

    // Local fallback
    const all = getLocal<Application[]>('applications', []);
    return all.filter((a) => a.user_id === userId);
  }

  static async createApplication(userId: string, app: Partial<Application>): Promise<Application> {
    const newApp: Application = {
      id: crypto.randomUUID(),
      user_id: userId,
      company_name: app.company_name || 'Untitled Company',
      job_title: app.job_title || 'Software Engineer',
      job_description: app.job_description || '',
      job_url: app.job_url || '',
      location: app.location || 'India',
      work_mode: app.work_mode || 'Hybrid',
      salary_ctc: app.salary_ctc || '',
      application_date: app.application_date || new Date().toISOString().split('T')[0],
      application_deadline: app.application_deadline || '',
      status: app.status || 'Applied',
      recruiter_contact: app.recruiter_contact || '',
      notes: app.notes || '',
      interview_date: app.interview_date || '',
      resume_id: app.resume_id || '',
      resume_name: app.resume_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .insert(newApp)
        .select()
        .single();
      if (!error && data) {
        await this.logActivity(userId, 'Applied to ' + newApp.company_name, 'application', newApp.id);
        return data as Application;
      }
    }

    // Local
    const all = getLocal<Application[]>('applications', []);
    all.unshift(newApp);
    setLocal('applications', all);

    // If application has deadline, auto-create deadline item
    if (newApp.application_deadline) {
      await this.createDeadline(userId, {
        application_id: newApp.id,
        company_name: newApp.company_name,
        job_title: newApp.job_title,
        title: `Deadline: ${newApp.company_name} - ${newApp.job_title}`,
        type: 'deadline',
        due_date: newApp.application_deadline,
        is_completed: false,
      });
    }

    // If interview date exists, create interview item
    if (newApp.interview_date) {
      await this.createDeadline(userId, {
        application_id: newApp.id,
        company_name: newApp.company_name,
        job_title: newApp.job_title,
        title: `Interview: ${newApp.company_name} (${newApp.job_title})`,
        type: 'interview',
        due_date: newApp.interview_date,
        is_completed: false,
      });
    }

    await this.logActivity(userId, `Added application for ${newApp.company_name} - ${newApp.job_title}`, 'application', newApp.id);
    return newApp;
  }

  static async updateApplication(userId: string, id: string, updates: Partial<Application>): Promise<Application | null> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (!error && data) {
        await this.logActivity(userId, `Updated application for ${data.company_name}`, 'application', id);
        return data as Application;
      }
    }

    // Local
    const all = getLocal<Application[]>('applications', []);
    const idx = all.findIndex((a) => a.id === id && a.user_id === userId);
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      setLocal('applications', all);
      await this.logActivity(userId, `Updated application for ${all[idx].company_name}`, 'application', id);
      return all[idx];
    }
    return null;
  }

  static async deleteApplication(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      if (!error) {
        await this.logActivity(userId, 'Deleted an application', 'application', id);
        return true;
      }
    }

    // Local
    const all = getLocal<Application[]>('applications', []);
    const filtered = all.filter((a) => !(a.id === id && a.user_id === userId));
    setLocal('applications', filtered);
    await this.logActivity(userId, 'Deleted an application', 'application', id);
    return true;
  }

  // --- DEADLINES & INTERVIEWS ---
  static async getDeadlines(userId: string): Promise<DeadlineItem[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('deadlines')
        .select('*, applications(company_name, job_title)')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });
      if (!error && data) {
        return data.map((d: any) => ({
          ...d,
          company_name: d.applications?.company_name || d.company_name,
          job_title: d.applications?.job_title || d.job_title,
        }));
      }
    }

    // Local
    const all = getLocal<DeadlineItem[]>('deadlines', []);
    return all
      .filter((d) => d.user_id === userId)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }

  static async createDeadline(userId: string, item: Partial<DeadlineItem>): Promise<DeadlineItem> {
    const newItem: DeadlineItem = {
      id: crypto.randomUUID(),
      user_id: userId,
      application_id: item.application_id,
      company_name: item.company_name,
      job_title: item.job_title,
      title: item.title || 'Scheduled Event',
      type: item.type || 'deadline',
      due_date: item.due_date || new Date().toISOString(),
      is_completed: false,
      notes: item.notes || '',
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('deadlines')
        .insert({
          id: newItem.id,
          user_id: userId,
          application_id: newItem.application_id,
          title: newItem.title,
          type: newItem.type,
          due_date: newItem.due_date,
          is_completed: newItem.is_completed,
          notes: newItem.notes,
        })
        .select()
        .single();
      if (!error && data) return data as DeadlineItem;
    }

    const all = getLocal<DeadlineItem[]>('deadlines', []);
    all.push(newItem);
    setLocal('deadlines', all);
    return newItem;
  }

  static async toggleDeadline(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('deadlines').select('is_completed').eq('id', id).eq('user_id', userId).single();
      if (data) {
        await supabase.from('deadlines').update({ is_completed: !data.is_completed }).eq('id', id).eq('user_id', userId);
        return true;
      }
    }

    const all = getLocal<DeadlineItem[]>('deadlines', []);
    const idx = all.findIndex((d) => d.id === id && d.user_id === userId);
    if (idx !== -1) {
      all[idx].is_completed = !all[idx].is_completed;
      setLocal('deadlines', all);
      return true;
    }
    return false;
  }

  static async deleteDeadline(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      await supabase.from('deadlines').delete().eq('id', id).eq('user_id', userId);
      return true;
    }

    const all = getLocal<DeadlineItem[]>('deadlines', []);
    setLocal(
      'deadlines',
      all.filter((d) => !(d.id === id && d.user_id === userId))
    );
    return true;
  }

  // --- RESUMES ---
  static async getResumes(userId: string): Promise<Resume[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) return data as Resume[];
    }

    const all = getLocal<Resume[]>('resumes', []);
    return all.filter((r) => r.user_id === userId);
  }

  static async uploadResume(userId: string, file: File, title: string): Promise<Resume> {
    const resumeId = crypto.randomUUID();
    const filePath = `${userId}/${resumeId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const supabase = await this.getSupabase();
    if (supabase) {
      // Upload to private Supabase storage bucket 'resumes'
      const { error: uploadErr } = await supabase.storage.from('resumes').upload(filePath, file);
      if (!uploadErr) {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            id: resumeId,
            user_id: userId,
            title: title || file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
          })
          .select()
          .single();
        if (!error && data) {
          await this.logActivity(userId, `Uploaded resume: ${title || file.name}`, 'resume', resumeId);
          return data as Resume;
        }
      }
    }

    // Local simulated storage
    const newResume: Resume = {
      id: resumeId,
      user_id: userId,
      title: title || file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type || 'application/pdf',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const all = getLocal<Resume[]>('resumes', []);
    all.unshift(newResume);
    setLocal('resumes', all);
    await this.logActivity(userId, `Uploaded resume: ${newResume.title}`, 'resume', resumeId);
    return newResume;
  }

  static async renameResume(userId: string, id: string, newTitle: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { error } = await supabase.from('resumes').update({ title: newTitle }).eq('id', id).eq('user_id', userId);
      if (!error) return true;
    }

    const all = getLocal<Resume[]>('resumes', []);
    const idx = all.findIndex((r) => r.id === id && r.user_id === userId);
    if (idx !== -1) {
      all[idx].title = newTitle;
      all[idx].updated_at = new Date().toISOString();
      setLocal('resumes', all);
      return true;
    }
    return false;
  }

  static async deleteResume(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('resumes').select('file_path').eq('id', id).eq('user_id', userId).single();
      if (data?.file_path) {
        await supabase.storage.from('resumes').remove([data.file_path]);
      }
      await supabase.from('resumes').delete().eq('id', id).eq('user_id', userId);
      return true;
    }

    const all = getLocal<Resume[]>('resumes', []);
    setLocal(
      'resumes',
      all.filter((r) => !(r.id === id && r.user_id === userId))
    );
    return true;
  }

  // --- PREPARATION TASKS ---
  static async getPrepTasks(userId: string): Promise<PrepTask[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('preparation_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (data && data.length > 0) return data as PrepTask[];
    }

    // Local fallback
    const all = getLocal<PrepTask[]>('prep_tasks', []);
    const userTasks = all.filter((t) => t.user_id === userId);

    // If new user with no tasks, seed curated questions
    if (userTasks.length === 0) {
      const seeded: PrepTask[] = INITIAL_PREP_TOPICS.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        user_id: userId,
        created_at: new Date().toISOString(),
      }));
      setLocal('prep_tasks', [...all, ...seeded]);
      return seeded;
    }

    return userTasks;
  }

  static async togglePrepTask(userId: string, id: string): Promise<boolean> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('preparation_tasks').select('is_completed').eq('id', id).eq('user_id', userId).single();
      if (data) {
        await supabase.from('preparation_tasks').update({ is_completed: !data.is_completed }).eq('id', id).eq('user_id', userId);
        return true;
      }
    }

    const all = getLocal<PrepTask[]>('prep_tasks', []);
    const idx = all.findIndex((t) => t.id === id && t.user_id === userId);
    if (idx !== -1) {
      all[idx].is_completed = !all[idx].is_completed;
      setLocal('prep_tasks', all);
      return true;
    }
    return false;
  }

  static async addPrepTask(userId: string, task: Partial<PrepTask>): Promise<PrepTask> {
    const newTask: PrepTask = {
      id: crypto.randomUUID(),
      user_id: userId,
      category: task.category || 'Python',
      title: task.title || 'Untitled Topic',
      question_or_topic: task.question_or_topic || '',
      notes: task.notes || '',
      is_completed: false,
      priority: task.priority || 'Medium',
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('preparation_tasks').insert(newTask).select().single();
      if (data) return data as PrepTask;
    }

    const all = getLocal<PrepTask[]>('prep_tasks', []);
    all.push(newTask);
    setLocal('prep_tasks', all);
    return newTask;
  }

  // --- USER PROFILE & ELIGIBILITY ---
  static async getProfile(userId: string, email?: string): Promise<Profile> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) return data as Profile;
    }

    const all = getLocal<Profile[]>('profiles', []);
    const existing = all.find((p) => p.id === userId);
    if (existing) return existing;

    const defaultProfile: Profile = {
      id: userId,
      email: email || 'student@applytrack.in',
      full_name: 'Student Candidate',
      avatar_url: '',
      college: 'National Institute of Technology / Engineering College',
      degree: 'B.Tech / B.E.',
      branch: 'Computer Science and Engineering',
      graduation_year: 2026,
      cgpa: 8.5,
      skills: ['Python', 'SQL', 'JavaScript', 'React', 'Data Structures', 'Git', 'FastAPI'],
      preferred_roles: ['Software Engineer', 'Full Stack Developer', 'Data Analyst', 'Backend Developer'],
      preferred_locations: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Remote'],
      internship_experience: 'Summer Intern at Tech Labs working on API development and frontend dashboards.',
      subscription_tier: 'free',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    all.push(defaultProfile);
    setLocal('profiles', all);
    return defaultProfile;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (data) return data as Profile;
    }

    const all = getLocal<Profile[]>('profiles', []);
    const idx = all.findIndex((p) => p.id === userId);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
      setLocal('profiles', all);
      return all[idx];
    }
    const created = { ...(await this.getProfile(userId)), ...updates };
    all.push(created);
    setLocal('profiles', all);
    return created;
  }

  // --- ACTIVITY LOGS ---
  static async logActivity(userId: string, action: string, entity_type: string, entity_id?: string) {
    const log: ActivityLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      entity_type,
      entity_id,
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      await supabase.from('activity_logs').insert(log);
      return;
    }

    const all = getLocal<ActivityLog[]>('activity_logs', []);
    all.unshift(log);
    // keep latest 50
    setLocal('activity_logs', all.slice(0, 50));
  }

  static async getActivityLogs(userId: string): Promise<ActivityLog[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) return data as ActivityLog[];
    }

    const all = getLocal<ActivityLog[]>('activity_logs', []);
    return all.filter((l) => l.user_id === userId).slice(0, 10);
  }

  // --- SUPPORT TICKETS ---
  static async submitSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'created_at'>): Promise<boolean> {
    const newTicket: SupportTicket = {
      ...ticket,
      id: crypto.randomUUID(),
      status: 'open',
      created_at: new Date().toISOString(),
    };

    const supabase = await this.getSupabase();
    if (supabase) {
      const { error } = await supabase.from('support_tickets').insert(newTicket);
      if (!error) return true;
    }

    const all = getLocal<SupportTicket[]>('support_tickets', []);
    all.unshift(newTicket);
    setLocal('support_tickets', all);
    return true;
  }

  static async getSupportTickets(): Promise<SupportTicket[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (data) return data as SupportTicket[];
    }
    return getLocal<SupportTicket[]>('support_tickets', []);
  }

  // --- ANNOUNCEMENTS ---
  static async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const supabase = await this.getSupabase();
    if (supabase) {
      const { data } = await supabase.from('admin_announcements').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (data) return data as AdminAnnouncement[];
    }
    const all = getLocal<AdminAnnouncement[]>('admin_announcements', [
      {
        id: '1',
        title: 'Placement Season 2026 Ready!',
        content: 'ApplyTrack v1.0 is live with complete application tracking, Kanban boards, deadline alerts, and resume organizer.',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ]);
    return all.filter((a) => a.is_active);
  }
}

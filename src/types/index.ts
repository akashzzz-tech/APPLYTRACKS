export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_description?: string;
  job_url?: string;
  location?: string;
  work_mode?: WorkMode;
  salary_ctc?: string;
  application_date: string; // ISO date string (YYYY-MM-DD)
  application_deadline?: string;
  status: ApplicationStatus;
  recruiter_contact?: string;
  notes?: string;
  interview_date?: string;
  resume_id?: string;
  resume_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduation_year?: number;
  cgpa?: number;
  skills: string[];
  preferred_roles: string[];
  preferred_locations: string[];
  internship_experience?: string;
  subscription_tier: 'free' | 'pro' | 'plus';
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface DeadlineItem {
  id: string;
  user_id: string;
  application_id?: string;
  company_name?: string;
  job_title?: string;
  title: string;
  type: 'deadline' | 'assessment' | 'interview' | 'task';
  due_date: string;
  is_completed: boolean;
  notes?: string;
  created_at: string;
}

export interface PrepTask {
  id: string;
  user_id: string;
  category: 'Python' | 'SQL' | 'DSA' | 'Machine Learning' | 'HR Questions' | 'Aptitude';
  title: string;
  question_or_topic: string;
  notes?: string;
  is_completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

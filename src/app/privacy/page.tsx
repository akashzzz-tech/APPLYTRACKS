import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mb-8">Last Updated: November 2026</p>

            <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview and Commitment</h2>
                <p>
                  At ApplyTrack ("we", "us", or "our"), protecting the personal privacy and data of students, placement candidates, and job seekers is our core commitment. This Privacy Policy outlines how we collect, store, handle, and protect your information when using the ApplyTrack platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Account Data:</strong> Your name, email address, and encrypted credentials managed via Supabase Authentication.</li>
                  <li><strong>Academic & Career Profile:</strong> College name, degree, branch of study, graduation year, CGPA, technical skills, and career preferences entered by you.</li>
                  <li><strong>Application Records:</strong> Company names, job titles, salary expectations/CTC, application dates, deadlines, interview schedules, and notes.</li>
                  <li><strong>Resumes:</strong> PDF resume files uploaded to your private storage folder.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. How Your Data is Isolated & Protected</h2>
                <p>
                  We employ PostgreSQL Row Level Security (RLS) on all user-owned database tables. This means database operations check your cryptographically signed user ID (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">auth.uid()</code>). No other user or unauthorized third party can read or modify your application logs or personal details.
                </p>
                <p className="mt-2">
                  Uploaded resume files are stored in private storage buckets and are accessible solely through signed or authenticated sessions. We never expose your files publicly.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. No Unauthorized Sharing or Selling</h2>
                <p>
                  We do not sell, rent, or monetize student contact information, resumes, or application pipelines to third-party recruiters, advertisers, or lead brokers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Data Retention and Account Deletion</h2>
                <p>
                  You retain complete ownership over your data. You may delete individual applications, resume files, or contact our support team at any time to request complete erasure of your profile and records.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Contacting Us</h2>
                <p>
                  If you have questions regarding this Privacy Policy or data security practices, please contact us via our Support page at <a href="/contact" className="text-blue-600 underline">applytrack.in/contact</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms and Conditions</h1>
            <p className="text-xs text-slate-500 mb-8">Last Updated: November 2026</p>

            <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
                <p>
                  By registering for or using ApplyTrack ("Platform"), you agree to abide by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Description of Service</h2>
                <p>
                  ApplyTrack provides candidates with an organizational platform to track job applications, interviews, deadlines, resumes, and preparation tasks. ApplyTrack is not an employer, placement agency, recruiter, or recruitment broker.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. User Responsibilities & Conduct</h2>
                <p>
                  You agree to use the service only for lawful purposes. You are responsible for safeguarding your login credentials. You agree not to upload malicious scripts, attempt unauthorized database penetration, or violate the intellectual property rights of any third party.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. Disclaimers</h2>
                <p>
                  ApplyTrack does not guarantee employment, job interviews, or offer selection. Eligibility comparisons provided in the skills module are computational benchmarks based on user-supplied criteria and do not constitute employer verification.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">5. Subscription and Fair Use</h2>
                <p>
                  Free accounts are subject to fair use thresholds (up to 20 active applications). Premium tiers (Student Pro and Student Plus) provide expanded limits and specialized preparation hubs as described on our pricing page.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">6. Modifications and Termination</h2>
                <p>
                  We reserve the right to improve, modify, or temporarily discontinue features of the platform with reasonable notice. We may terminate accounts found in violation of these Terms or attempting security bypasses.
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

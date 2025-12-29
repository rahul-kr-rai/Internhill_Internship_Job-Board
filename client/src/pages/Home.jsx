import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Search, 
  Shield, 
  Layers, 
  ArrowRight, 
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  
  useEffect(() => {
    const title = 'InternHill — Professional Internships & Entry-level Jobs';
    const description = 'InternHill connects students and early-career professionals with vetted internships and entry-level roles. Secure resume uploads, role-based workflows, and powerful search to match talent faster.';
    document.title = title;
    
    // Meta tag logic remains the same...
  }, []);

  const features = [
    { 
      title: 'Vetted Roles', 
      desc: 'High-quality internships and entry-level roles from trusted employers.',
      icon: <CheckCircle className="text-green-600" size={24}/>,
      bg: 'bg-green-50'
    },
    { 
      title: 'Secure Resumes', 
      desc: 'Upload resumes securely (local or S3) and control access.',
      icon: <Shield className="text-blue-600" size={24}/>,
      bg: 'bg-blue-50'
    },
    { 
      title: 'Role-based Access', 
      desc: 'Separate flows for Jobseekers, Employers and Admins.',
      icon: <Layers className="text-purple-600" size={24}/>,
      bg: 'bg-purple-50'
    },
    { 
      title: 'Fast Search', 
      desc: 'Advanced filters, sorting and pagination for relevance.',
      icon: <Search className="text-indigo-600" size={24}/>,
      bg: 'bg-indigo-50'
    }
  ];

  const stats = [
    { label: 'Jobs Listed', value: '9,400+', icon: <Briefcase size={28} className="text-white"/>, bg: 'bg-blue-500' },
    { label: 'Employers', value: '1,200+', icon: <Users size={28} className="text-white"/>, bg: 'bg-indigo-500' },
    { label: 'Applications', value: '84,000+', icon: <FileText size={28} className="text-white"/>, bg: 'bg-purple-500' }
  ];

  const testimonials = [
    { name: 'Priya S.', role: 'Software Intern', quote: 'Found my first internship through InternHill — straightforward process and great companies.' },
    { name: 'Aman K.', role: 'Talent Lead', quote: 'Posting jobs and reviewing candidates is simple and secure.' }
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-60 z-0"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-28 lg:flex lg:items-center lg:justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              #1 Platform for Interns
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
              Launch your career. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Hire top early talent.
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
              InternHill connects students and early-career professionals with vetted internships. 
              Simple, secure, and built for growth.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                Browse Jobs <ArrowRight size={20}/>
              </Link>
              <Link to="/register" className="inline-flex items-center px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
                Get Started
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Verified Companies</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Free for Students</span>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 w-full max-w-lg relative">
            {/* Abstract Shapes behind image */}
            <div className="absolute top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <img 
              src="/assets/hero-illustration.svg" 
              className="relative w-full h-auto rounded-2xl shadow-2xl border border-white/50 backdrop-blur-sm" 
              alt="Hiring Illustration"
              // If image fails, show a placeholder box
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://placehold.co/600x400/e0e7ff/4f46e5?text=InternHill+Hero";
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 -mt-10 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((s, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 flex items-center gap-6 hover:translate-y-[-4px] transition-transform">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
              <TrendingUp size={16} /> Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Talent & Teams
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Secure, performant and accessible — with clear workflows for jobseekers, employers and admins. 
              We focus on the details so you can focus on the work.
            </p>
            
            <div className="grid gap-6">
               {features.map((f, i) => (
                 <div key={i} className="flex gap-4 items-start p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${f.bg}`}>
                       {f.icon}
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900 text-lg">{f.title}</h3>
                       <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative">
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-4xl shadow-sm animate-bounce">
                🚀
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-6">What people are saying</h3>
             <div className="space-y-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex gap-1 mb-3">
                      {[1,2,3,4,5].map(star => <span key={star} className="text-yellow-400">★</span>)}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                          {t.name.charAt(0)}
                       </div>
                       <div>
                          <div className="text-sm font-bold text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-500">{t.role}</div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center md:text-left relative overflow-hidden shadow-2xl">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-indigo-100 text-lg max-w-lg">
                Create an account and start hiring or applying in minutes. No credit card required for students.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link to="/register" className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-colors text-center">
                Create Account
              </Link>
              <Link to="/jobs" className="px-8 py-4 bg-indigo-700 bg-opacity-40 border border-indigo-400 text-white rounded-xl font-bold hover:bg-opacity-50 transition-colors text-center">
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
             <Briefcase className="text-indigo-600" size={24}/>
             <span className="text-xl font-bold text-gray-900">InternHill</span>
          </div>
          <nav className="flex flex-wrap gap-8 justify-center mb-8 text-sm font-medium text-gray-600">
            <Link to="/jobs" className="hover:text-indigo-600 transition-colors">Jobs</Link>
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact Support</Link>
          </nav>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} InternHill. Made with ❤️ for students.
          </div>
        </div>
      </footer>
    </main>
  );
}
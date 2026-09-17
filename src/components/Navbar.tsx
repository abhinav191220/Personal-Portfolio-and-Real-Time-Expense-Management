import { Database, Activity, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-mono font-bold shadow-xs">
              JD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  Personal Portfolio &amp; Real-Time Expense Management
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  JavaFX Desktop Spec
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-600" />
                  SQLite JDBC
                </span>
                <span className="hidden md:inline-block text-slate-300">•</span>
                <span className="hidden md:inline-flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-600" />
                  CompletableFuture Async
                </span>
                <span className="hidden md:inline-block text-slate-300">•</span>
                <span className="hidden md:inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  JUnit 5 Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Session Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};


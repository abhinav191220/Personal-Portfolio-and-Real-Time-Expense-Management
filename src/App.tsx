import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <DashboardView />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">
              Personal Portfolio &amp; Real-Time Expense Management
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">Core Java</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">JavaFX</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">SQLite JDBC</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">Jackson</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">JUnit 5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

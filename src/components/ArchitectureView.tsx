import { useState } from 'react';
import { JAVA_CLASSES, JUNIT_TESTS } from '../data/initialData';
import { JavaClassDoc } from '../types';
import { Code2, CheckCircle2, Database, ShieldAlert, Cpu, Terminal, Play, Check } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<JavaClassDoc>(JAVA_CLASSES[0]);
  const [testFilter, setTestFilter] = useState<string>('ALL');

  const filteredTests = testFilter === 'ALL' 
    ? JUNIT_TESTS 
    : JUNIT_TESTS.filter(t => t.suite === testFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 text-indigo-700 text-sm font-semibold tracking-wide uppercase mb-1">
          <Code2 className="w-4 h-4" />
          Technical Specifications &amp; Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          System Architecture &amp; Class Hierarchy
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          The Personal Portfolio &amp; Real-Time Expense Dashboard is engineered with strict Model-View-Controller (MVC) and Data Access Object (DAO) separations. It decouples UI presentation, transactional SQLite operations, asynchronous background workers, and business rule engines.
        </p>
      </div>

      {/* Grid: 8+ Java Classes Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class list sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Core Java Classes ({JAVA_CLASSES.length})
            </h3>
            <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-md border border-indigo-100">
              JDK 17+ / JavaFX 21+
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {JAVA_CLASSES.map((cls) => {
              const isSelected = selectedClass.name === cls.name;
              return (
                <button
                  key={cls.name}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600 pl-2.5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{cls.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{cls.package}</p>
                    <span className="inline-block mt-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {cls.layer}
                    </span>
                  </div>
                  <Code2 className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected class inspection panel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {selectedClass.layer}
                </span>
                <span className="text-xs font-mono text-slate-500">package {selectedClass.package}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-mono mt-2">
                {selectedClass.name}
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {selectedClass.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Key Public API Methods
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedClass.methods.map((method, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200/80 rounded font-mono text-xs text-indigo-950">
                    {method}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Implementation Blueprint
                </h4>
                <span className="text-xs text-slate-400 font-mono">Java 17 Record / Class</span>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
                <code>{selectedClass.snippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Highlights: SQLite Schema & Async Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SQLite Database Schema Specification */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">SQLite JDBC Persistence Schema</h3>
              <p className="text-xs text-slate-500">Zero-config file database (portfolio_tracker.db)</p>
            </div>
          </div>

          <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`-- Relational DDL Schema
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(12) NOT NULL, -- INCOME, EXPENSE, ASSET_BUY
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  description TEXT,
  account VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_holdings (
  symbol VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  asset_type VARCHAR(10) NOT NULL, -- STOCK, CRYPTO
  shares DECIMAL(16,6) NOT NULL CHECK (shares >= 0),
  avg_buy_price DECIMAL(12,2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budget_limits (
  category VARCHAR(50) PRIMARY KEY,
  monthly_cap DECIMAL(10,2) NOT NULL
);`}
          </pre>
        </div>

        {/* Live Pipeline with CompletableFuture & Jackson */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Async Pipeline &amp; Jackson Parser</h3>
              <p className="text-xs text-slate-500">Non-blocking CompletableFuture HTTP Client</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
              <div>
                <strong className="text-slate-900">Scheduled Poller:</strong> Daemon thread triggers every 60s without freezing the JavaFX Stage.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
              <div>
                <strong className="text-slate-900">HttpClient.sendAsync:</strong> Dispatches non-blocking GET requests to financial endpoints.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
              <div>
                <strong className="text-slate-900">Jackson FasterXML:</strong> Safely deserializes payload into immutable <code className="text-indigo-700">MarketQuoteDTO</code>.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
              <div>
                <strong className="text-slate-900">Platform.runLater():</strong> Dispatches price updates onto the JavaFX UI thread safely.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JUnit 5 Test Suite Explorer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Automated Verification Suite
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">JUnit 5 Test Suite Verification</h3>
            <p className="text-xs text-slate-500 mt-0.5">8 unit tests ensuring defensive input validation, threshold triggers, and Jackson serialization.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Suite:</span>
            <select
              value={testFilter}
              onChange={(e) => setTestFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-indigo-500"
            >
              <option value="ALL">All Suites (8)</option>
              <option value="TransactionValidationTest">TransactionValidationTest</option>
              <option value="BudgetAlertEngineTest">BudgetAlertEngineTest</option>
              <option value="JacksonParserTest">JacksonParserTest</option>
              <option value="DatabaseCrudTest">DatabaseCrudTest</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
          {filteredTests.map((test, i) => (
            <div key={i} className="p-4 bg-white hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{test.testName}()</span>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {test.suite}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{test.details}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs text-slate-500">{test.durationMs}ms</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <Check className="w-3 h-3" />
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

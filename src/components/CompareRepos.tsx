import React from 'react';
import { ArrowRightLeft, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../utils/analyzer';

interface CompareReposProps {
  analysis: AnalysisResult;
}

const CompareRepos: React.FC<CompareReposProps> = ({ analysis }) => {
  const { scores } = analysis;

  const hasTests = scores.testing > 8;
  const hasDocker = scores.architecture >= 18 || analysis.weaknesses.every(w => w.title !== 'Missing Containerization (Docker)');

  // Helper to resolve score comparisons
  const getComparison = (current: number, benchmark: number, name: string) => {
    const diff = current - benchmark;
    
    if (name === 'Testing' && !hasTests) {
      return { label: 'Missing', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', desc: 'No test configurations detected.' };
    }
    
    if (diff >= 2) {
      return { label: 'Stronger', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'Exceeds standard developer benchmarks.' };
    }
    if (diff >= -2) {
      return { label: 'Similar', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', desc: 'Matches professional production baselines.' };
    }
    return { label: 'Weaker', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', desc: 'Lacks core features present in standard stacks.' };
  };

  const comparisons = [
    {
      category: 'Architecture Layout',
      currentVal: `${scores.architecture}/20`,
      benchmarkVal: '18/20',
      comp: getComparison(scores.architecture, 18, 'Architecture'),
      details: hasDocker ? 'Clean component layout with Docker containerization.' : 'Modular directory structure but missing local containerization setup.'
    },
    {
      category: 'Security Auditing',
      currentVal: `${scores.security}/20`,
      benchmarkVal: '16/20',
      comp: getComparison(scores.security, 16, 'Security'),
      details: scores.security >= 16 ? 'Includes modern authentication safeguards.' : 'Missing middleware validations (e.g. rate limiters or env validators).'
    },
    {
      category: 'Testing Coverage',
      currentVal: `${scores.testing}/20`,
      benchmarkVal: '15/20',
      comp: getComparison(scores.testing, 15, 'Testing'),
      details: hasTests ? 'Test environment (Jest/PyTest) mapped successfully.' : 'No automated unit/integration test suites detected.'
    },
    {
      category: 'Documentation Depth',
      currentVal: `${scores.documentation}/20`,
      benchmarkVal: '17/20',
      comp: getComparison(scores.documentation, 17, 'Documentation'),
      details: scores.documentation >= 15 ? 'Detailed setups, API routes, and install commands.' : 'Brief README contents. Lacks detailed setup instructions.'
    }
  ];

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ArrowRightLeft className="w-4 h-4 text-blue-400" />
          Benchmark Comparison
        </h3>
        <span className="inline-flex items-center gap-1 text-[9px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-semibold font-mono">
          <Sparkles className="w-2.5 h-2.5" />
          VS Production Standard
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-normal">
        Compares your codebase metrics against a standard enterprise-grade production repository layout in the same tech stack.
      </p>

      {/* Comparison Grid */}
      <div className="space-y-3 pt-1">
        {comparisons.map((item, idx) => (
          <div key={idx} className="bg-slate-900/30 border border-slate-850 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{item.category}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${item.comp.color}`}>
                {item.comp.label}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs border-y border-slate-800/40 py-1.5 font-mono text-slate-400">
              <div>
                <span className="text-[9px] block text-slate-500">MY REPOSITORY</span>
                <span className="font-semibold text-slate-300">{item.currentVal}</span>
              </div>
              <div>
                <span className="text-[9px] block text-slate-500">PRODUCTION TARGET</span>
                <span className="font-semibold text-slate-300">{item.benchmarkVal}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-light">
              {item.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareRepos;

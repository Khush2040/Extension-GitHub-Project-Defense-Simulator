import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, XCircle, UserCheck, Loader2 } from 'lucide-react';
import { getStorageItem } from '../utils/storage';
import { AnalysisResult } from '../utils/analyzer';

interface RecruiterViewProps {
  owner: string;
  repo: string;
}

const RecruiterView: React.FC<RecruiterViewProps> = ({ owner, repo }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recruiterData, setRecruiterData] = useState<AnalysisResult['recruiter'] | null>(null);

  const cacheKey = `analysis_result_${owner}_${repo}`;

  useEffect(() => {
    const loadRecruiterData = async () => {
      setLoading(true);
      try {
        const cached: AnalysisResult | null = await getStorageItem(cacheKey);
        if (cached && cached.recruiter) {
          setRecruiterData(cached.recruiter);
        }
      } catch (err) {
        console.error('Failed to load recruiter view:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecruiterData();
  }, [owner, repo, cacheKey]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading recruiter analytics...</p>
      </div>
    );
  }

  if (!recruiterData) {
    return (
      <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg text-xs">
        No active analysis found. Please load the Overview & Stats tab first.
      </div>
    );
  }

  const { worthiness, strengths, weaknesses, verdict } = recruiterData;

  const getWorthinessColor = (score: number) => {
    if (score >= 8.0) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 6.0) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  const getWorthinessRating = (score: number) => {
    if (score >= 8.5) return 'Highly Competitive';
    if (score >= 7.0) return 'Strong Candidate';
    if (score >= 5.5) return 'Needs Polish';
    return 'Early Development';
  };

  return (
    <div className="space-y-6">
      {/* Resume Worthiness Header */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              Recruiter Evaluation
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Resume Worthiness</h2>
            <p className="text-xs text-slate-400 mt-1">
              Estimated scoring from an engineering manager's point of view.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-slate-700 shadow-inner">
              <span className="text-2xl font-extrabold text-white">{worthiness}</span>
              <span className="text-[10px] text-slate-500 absolute bottom-2">/10</span>
            </div>
            <span className={`text-[10px] font-semibold mt-2 px-2 py-0.5 rounded-full border ${getWorthinessColor(worthiness)}`}>
              {getWorthinessRating(worthiness)}
            </span>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Strengths */}
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Strengths
          </h3>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No standout components identified.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-rose-400" />
            Areas to Improve
          </h3>
          {weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {weaknesses.map((weak, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">
              🎉 No obvious issues detected! The repository shows excellent practices.
            </p>
          )}
        </div>
      </div>

      {/* Recruiter Verdict */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-amber-400" />
          The Verdict
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {verdict}
        </p>
      </div>
    </div>
  );
};

export default RecruiterView;

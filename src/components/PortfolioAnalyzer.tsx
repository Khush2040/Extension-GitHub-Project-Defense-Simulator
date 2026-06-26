import React, { useEffect, useState } from 'react';
import { 
  Code2, 
  GitFork, 
  Star, 
  Compass, 
  AlertTriangle, 
  Award, 
  Activity, 
  Loader2, 
  ChevronRight 
} from 'lucide-react';
import { analyzePortfolio, PortfolioAnalysisResult } from '../utils/portfolioAnalyzer';

interface PortfolioAnalyzerProps {
  username: string;
}

const PortfolioAnalyzer: React.FC<PortfolioAnalyzerProps> = ({ username }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<PortfolioAnalysisResult | null>(null);

  useEffect(() => {
    setLoading(true);
    // Introduce a micro-delay for a premium feel (scanning effect)
    const timer = setTimeout(() => {
      const analysis = analyzePortfolio(username);
      setResult(analysis);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [username]);

  if (loading || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-white">Scanning Github Profile...</p>
          <p className="text-xs text-slate-400 mt-1">Analyzing repositories, languages, and contributions</p>
        </div>
      </div>
    );
  }

  // Calculate the total language count for ratios
  const totalLangUsage = result.topLanguages.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header Block */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex items-center gap-4">
          <img 
            src={`https://github.com/${username}.png`} 
            alt={username} 
            className="w-14 h-14 rounded-full border-2 border-slate-700 shadow-md bg-slate-800"
            onError={(e) => {
              // fallback if offline or load fails
              e.currentTarget.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{username}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-blue-400" />
                {result.totalRepos} Repositories
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                {result.contributionsCount.split(' ')[0]} Contributions
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-xl font-extrabold text-blue-400">{result.overallRating}</span>
            <span className="text-[9px] text-slate-500 font-mono">SCORE / 10</span>
          </div>
        </div>
      </div>

      {/* Language Breakdown */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          Top Technologies
        </h3>
        
        {/* Language Percentage Bar */}
        <div className="h-2 w-full rounded-full flex overflow-hidden bg-slate-800 mb-4">
          {result.topLanguages.map((lang, idx) => {
            const pct = totalLangUsage > 0 ? (lang.count / totalLangUsage) * 100 : 0;
            return (
              <div 
                key={idx}
                style={{ 
                  width: `${pct}%`, 
                  backgroundColor: lang.color 
                }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                title={`${lang.language}: ${lang.count} pinned`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {result.topLanguages.map((lang, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
              <span className="text-slate-300 font-medium">{lang.language}</span>
              <span className="text-slate-500 text-[10px]">({lang.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest Project Spotlight */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 relative">
        <div className="absolute top-3 right-3 text-amber-500">
          <Award className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          Strongest Project
        </h3>
        <div className="mt-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            {result.strongestProject.name}
            {result.strongestProject.stars > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                <Star className="w-2.5 h-2.5 fill-amber-400" />
                {result.strongestProject.stars}
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {result.strongestProject.reason}
          </p>
        </div>
      </div>

      {/* Weakest Development Area */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          Weakest Area
        </h3>
        <div className="mt-1">
          <h4 className="text-sm font-bold text-rose-400">
            {result.weakestArea.category}
          </h4>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {result.weakestArea.details}
          </p>
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          Career Development Plan
        </h3>
        <div className="mt-2 text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>{result.careerRecommendation}</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalyzer;

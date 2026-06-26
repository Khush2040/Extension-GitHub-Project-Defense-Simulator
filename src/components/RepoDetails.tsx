import React, { useEffect, useState } from 'react';
import { 
  Star, 
  GitFork, 
  Eye, 
  AlertCircle, 
  Cpu, 
  Lock, 
  Cloud, 
  RefreshCw, 
  Copy, 
  Check, 
  Layers, 
  ArrowDown, 
  ShieldAlert 
} from 'lucide-react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { analyzeCodebase, AnalysisResult } from '../utils/analyzer';
import CompareRepos from './CompareRepos';
import IssueHealth from './IssueHealth';
import EvolutionTimeline from './EvolutionTimeline';

interface RepoDetailsProps {
  owner: string;
  repo: string;
}

const RepoDetails: React.FC<RepoDetailsProps> = ({ owner, repo }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [basicStats, setBasicStats] = useState({
    stars: '0',
    forks: '0',
    watchers: '0'
  });

  const cacheKey = `analysis_result_${owner}_${repo}`;

  const runLocalAnalysis = async () => {
    setLoading(true);
    try {
      // Scrape basic stats from DOM
      const descEl = document.querySelector('p[itemprop="description"]') || document.querySelector('.BorderGrid-cell p');
      const description = descEl?.textContent?.trim() || '';

      const getCounterText = (selector: string): string => {
        const el = document.querySelector(selector);
        return el ? el.textContent?.trim() || '0' : '0';
      };
      const stars = getCounterText('#repo-stars-counter-star') || getCounterText('a[href$="/stargazers"] .Counter');
      const forks = getCounterText('#repo-network-counter') || getCounterText('a[href$="/forks"] .Counter');
      const watchers = getCounterText('#repo-notifications-counter') || getCounterText('a[href$="/watchers"] .Counter');

      setBasicStats({ stars, forks, watchers });

      // Scrape README
      const readmeEl = document.querySelector('#readme article') || document.querySelector('.markdown-body');
      const readmeText = readmeEl ? (readmeEl as HTMLElement).innerText : '';

      // Fetch Dependency File
      let depContent = '';
      const manifests = ['package.json', 'requirements.txt', 'go.mod', 'Cargo.toml', 'Gemfile'];
      const branches = ['main', 'master', 'develop'];

      for (const file of manifests) {
        for (const branch of branches) {
          try {
            const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
            const res = await fetch(url);
            if (res.ok) {
              const text = await res.text();
              depContent = `File: ${file}\nContent:\n${text}`;
              break;
            }
          } catch {
            // try next combination
          }
        }
        if (depContent) break;
      }

      // Execute Local Analyzer
      const result = analyzeCodebase(owner, repo, description, readmeText, depContent);
      
      // Cache results
      await setStorageItem(cacheKey, result);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Local analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const cached = await getStorageItem(cacheKey);
      if (cached) {
        setAnalysisResult(cached);
        const getCounterText = (selector: string): string => {
          const el = document.querySelector(selector);
          return el ? el.textContent?.trim() || '0' : '0';
        };
        setBasicStats({
          stars: getCounterText('#repo-stars-counter-star') || getCounterText('a[href$="/stargazers"] .Counter'),
          forks: getCounterText('#repo-network-counter') || getCounterText('a[href$="/forks"] .Counter'),
          watchers: getCounterText('#repo-notifications-counter') || getCounterText('a[href$="/watchers"] .Counter'),
        });
        setLoading(false);
      } else {
        await runLocalAnalysis();
      }
    };
    initialize();
  }, [owner, repo, cacheKey]);

  const copyToClipboard = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
  };

  const getBarColor = (score: number) => {
    if (score >= 16) return 'bg-emerald-500';
    if (score >= 12) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getSeverityBadgeColor = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (severity === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Analyzing repository locally...</p>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="text-center py-12 text-slate-400 space-y-2">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="text-sm">Failed to analyze repository.</p>
        <button onClick={runLocalAnalysis} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Retry Analysis
        </button>
      </div>
    );
  }

  const { scores, riskAreas, architecture, explanation } = analysisResult;

  // Flowchart elements building
  const flowNodes: string[] = [];
  const primaryFrontend = architecture.frameworks.find(f => f.includes('React') || f.includes('Next.js')) || architecture.frameworks[0] || 'Frontend';
  
  const hasExpress = architecture.frameworks.includes('Express');
  const hasDjango = architecture.frameworks.includes('Django');
  const hasFastAPI = architecture.frameworks.includes('FastAPI');
  const hasFlask = architecture.frameworks.includes('Flask');

  flowNodes.push(primaryFrontend);

  if (hasExpress) flowNodes.push('Express.js');
  else if (hasDjango) flowNodes.push('Django');
  else if (hasFastAPI) flowNodes.push('FastAPI');
  else if (hasFlask) flowNodes.push('Flask');

  if (architecture.database !== 'None Detected') {
    flowNodes.push(architecture.database);
  }

  return (
    <div className="space-y-6">
      {/* 1. Project Defense Score Card */}
      <div className={`p-5 rounded-xl border flex flex-col space-y-4 ${getScoreColor(scores.total)}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-bold tracking-wider uppercase opacity-90">Project Defense Score</h2>
            <p className="text-xs opacity-75">Overall preparation readiness level</p>
          </div>
          <div className="text-4xl font-extrabold pr-2 flex items-baseline">
            {scores.total}
            <span className="text-sm font-normal opacity-60 ml-0.5">/100</span>
          </div>
        </div>

        {/* Score Progress Bars */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/40">
          {[
            { label: 'Architecture', val: scores.architecture },
            { label: 'Security', val: scores.security },
            { label: 'Testing', val: scores.testing },
            { label: 'Deployment', val: scores.deployment },
            { label: 'Documentation', val: scores.documentation },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="opacity-80">{item.label}</span>
                <span className="font-semibold">{item.val}/20</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.val)}`}
                  style={{ width: `${(item.val / 20) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Github Meta Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <Star className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
          <span className="text-[9px] text-slate-500 uppercase font-mono">Stars</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{basicStats.stars}</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <GitFork className="w-3.5 h-3.5 text-blue-400 mb-0.5" />
          <span className="text-[9px] text-slate-500 uppercase font-mono">Forks</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{basicStats.forks}</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <Eye className="w-3.5 h-3.5 text-purple-400 mb-0.5" />
          <span className="text-[9px] text-slate-500 uppercase font-mono">Watching</span>
          <span className="text-xs font-bold text-slate-200 mt-0.5">{basicStats.watchers}</span>
        </div>
      </div>

      {/* 2. Benchmark Comparison */}
      <CompareRepos analysis={analysisResult} />

      {/* 3. Architecture Flowchart */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-400" />
          Architecture Flowchart
        </h3>
        
        <div className="flex flex-col items-center py-2 space-y-2.5">
          {flowNodes.map((node, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />}
              <div className="w-48 py-2 px-3 rounded-lg bg-slate-900 border border-slate-700/60 shadow text-center flex flex-col items-center justify-center">
                <span className="text-xs font-extrabold text-white tracking-wide">{node}</span>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                  {idx === 0 ? 'Client Layer' : idx === flowNodes.length - 1 ? 'Data Layer' : 'API Service'}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded bg-slate-900/40 border border-slate-900/60">
            <span className="text-slate-500 block mb-0.5 font-semibold">Auth</span>
            <span className="text-slate-300 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              {architecture.authentication}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-900/40 border border-slate-900/60">
            <span className="text-slate-500 block mb-0.5 font-semibold">Deploy</span>
            <span className="text-slate-300 font-mono flex items-center gap-1">
              <Cloud className="w-3 h-3 text-indigo-400" />
              {architecture.deployment}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Evolution Timeline */}
      <EvolutionTimeline owner={owner} repo={repo} />

      {/* 5. Issue Health */}
      <IssueHealth owner={owner} repo={repo} />

      {/* 6. Interview Risk Areas */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Interview Risk Areas
        </h3>

        <div className="space-y-2.5">
          {riskAreas.map((area, idx) => (
            <div key={idx} className="flex gap-2.5 items-start bg-slate-900/20 p-2.5 rounded-lg border border-slate-850">
              <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-mono font-bold shrink-0 ${getSeverityBadgeColor(area.severity)}`}>
                {area.severity}
              </span>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200">{area.category}</span>
                <p className="text-[10px] text-slate-400 leading-normal">{area.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 2-Minute Elevator Pitch */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            2-Minute Elevator Pitch
          </h3>
          <button 
            onClick={copyToClipboard}
            className="p-1 rounded hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
            title="Copy Elevator Pitch"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-lg text-xs text-slate-300 leading-relaxed font-sans select-all">
          {explanation}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center pt-1 pb-2">
        <button
          onClick={runLocalAnalysis}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Analysis
        </button>
      </div>
    </div>
  );
};

export default RepoDetails;

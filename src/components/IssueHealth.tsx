import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Info } from 'lucide-react';
import { fetchIssueHealth, IssueHealthInfo } from '../utils/githubApi';

interface IssueHealthProps {
  owner: string;
  repo: string;
}

const IssueHealth: React.FC<IssueHealthProps> = ({ owner, repo }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [health, setHealth] = useState<IssueHealthInfo | null>(null);

  useEffect(() => {
    const loadIssueHealth = async () => {
      setLoading(true);
      try {
        const info = await fetchIssueHealth(owner, repo);
        setHealth(info);
      } catch (err) {
        console.error('Failed to load issue health metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadIssueHealth();
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2 border border-slate-800 rounded-xl bg-slate-950/20">
        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        <span className="text-xs text-slate-500">Auditing repository issue health...</span>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 border border-slate-800 rounded-xl">
        Could not retrieve issue health data.
      </div>
    );
  }

  const getMaintenanceColor = (status: IssueHealthInfo['maintenanceStatus']) => {
    if (status === 'Active') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'Stagnant') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getTemplateBadge = (has: boolean) => {
    return has 
      ? { label: 'Configured', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
      : { label: 'Missing', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  };

  const templateState = getTemplateBadge(health.hasTemplates);

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <AlertCircle className="w-4 h-4 text-blue-400" />
        Issue Health Audit
      </h3>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900/30 border border-slate-850 p-2.5 rounded-lg text-center flex flex-col justify-center">
          <span className="text-[9px] text-slate-500 uppercase font-mono block">Open Issues</span>
          <span className="text-sm font-extrabold text-white mt-1">{health.openIssuesCount}</span>
        </div>
        
        <div className="bg-slate-900/30 border border-slate-850 p-2.5 rounded-lg text-center flex flex-col justify-center">
          <span className="text-[9px] text-slate-500 uppercase font-mono block">Templates</span>
          <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded border inline-block ${templateState.color}`}>
            {templateState.label}
          </span>
        </div>

        <div className="bg-slate-900/30 border border-slate-850 p-2.5 rounded-lg text-center flex flex-col justify-center">
          <span className="text-[9px] text-slate-500 uppercase font-mono block">Maintenance</span>
          <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded border inline-block ${getMaintenanceColor(health.maintenanceStatus)}`}>
            {health.maintenanceStatus}
          </span>
        </div>
      </div>

      {/* Bug Ratio Bar */}
      {health.openIssuesCount > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Bug Reports Ratio</span>
            <span className="font-semibold text-rose-400">{health.bugRatio}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              style={{ width: `${health.bugRatio}%` }} 
              className="h-full bg-rose-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Evaluation Feedback */}
      <div className="bg-slate-900/20 border border-slate-850 p-3 rounded-lg flex gap-2 items-start text-xs leading-relaxed text-slate-300">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Issue Health Verdict:</p>
          {!health.hasTemplates ? (
            <p className="font-light">
              This repository is missing standard **GitHub Issue Templates**. We recommend adding templates under `.github/ISSUE_TEMPLATE/` to structure bug reports, improve contributor intake, and signal high repository health to recruiters.
            </p>
          ) : (
            <p className="font-light">
              Great setup! **Issue Templates** are properly configured, enabling structured feedback and bugs intake. Maintenance looks active with recent development logs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueHealth;

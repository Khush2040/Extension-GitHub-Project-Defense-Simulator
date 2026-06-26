import React, { useState } from 'react';
import { X, BookOpen, GraduationCap, LayoutDashboard, UserCheck, Download } from 'lucide-react';
import RepoDetails from '../components/RepoDetails';
import DefensePrep from '../components/DefensePrep';
import RecruiterView from '../components/RecruiterView';
import PortfolioAnalyzer from '../components/PortfolioAnalyzer';
import { downloadReport } from '../utils/reportGenerator';
import { getStorageItem } from '../utils/storage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  owner: string;
  repo: string;
  type: 'repo' | 'profile';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, owner, repo, type }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'interview' | 'recruiter'>('overview');

  if (!isOpen) return null;

  const isProfile = type === 'profile';

  const handleDownloadReport = async () => {
    try {
      const cacheKey = `analysis_result_${owner}_${repo}`;
      const cached = await getStorageItem(cacheKey);
      if (cached) {
        downloadReport(owner, repo, cached);
      } else {
        alert('Please allow the repository analysis to finish before generating reports.');
      }
    } catch (err) {
      console.error('Error triggering report export:', err);
    }
  };

  return (
    <div className="fixed top-0 right-0 z-[2147483647] w-[450px] h-screen bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in text-slate-100 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/10 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="font-bold text-base tracking-tight text-white">
              {isProfile ? 'Portfolio Auditor' : 'Project Defense Simulator'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {isProfile ? `github.com/${owner}` : `${owner} / ${repo}`}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs (Only for Repo Mode) */}
      {!isProfile && (
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-2 py-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-1 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Stats
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex-1 py-2 px-1 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'interview'
                ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Mock Prep
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`flex-1 py-2 px-1 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'recruiter'
                ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Recruiter
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {isProfile ? (
          <PortfolioAnalyzer username={owner} />
        ) : activeTab === 'overview' ? (
          <RepoDetails owner={owner} repo={repo} />
        ) : activeTab === 'interview' ? (
          <DefensePrep owner={owner} repo={repo} />
        ) : (
          <RecruiterView owner={owner} repo={repo} />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 flex justify-between items-center bg-slate-950/40 text-[10px] text-slate-500 shrink-0">
        {!isProfile ? (
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF Report
          </button>
        ) : (
          <span>100% Local Portfolio Audit</span>
        )}
        <span className="font-mono">v3.0.0</span>
      </div>
    </div>
  );
};

export default Sidebar;

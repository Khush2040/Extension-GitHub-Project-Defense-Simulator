import React, { useEffect, useState } from 'react';
import { Loader2, GitBranch, Calendar } from 'lucide-react';
import { fetchCommits } from '../utils/githubApi';

interface EvolutionTimelineProps {
  owner: string;
  repo: string;
}

interface TimelineMilestone {
  dateLabel: string;
  title: string;
  description: string;
  sha: string;
}

const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({ owner, repo }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);

  useEffect(() => {
    const loadTimeline = async () => {
      setLoading(true);
      try {
        const commits = await fetchCommits(owner, repo);
        
        // Build milestones based on commits
        const sortedCommits = [...commits].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const list: TimelineMilestone[] = [];

        if (sortedCommits.length > 0) {
          // 1. Initial Commit (Setup Phase)
          const initial = sortedCommits[0];
          list.push({
            dateLabel: formatDate(initial.date),
            title: 'Project Inception & Setup',
            description: initial.message.split('\n')[0],
            sha: initial.sha
          });

          // Helper to find a commit containing keywords
          const findCommitWithKeywords = (keywords: string[], excludeShas: string[]) => {
            return sortedCommits.find(
              c => !excludeShas.includes(c.sha) && 
              keywords.some(kw => c.message.toLowerCase().includes(kw))
            );
          };

          // 2. Architecture & Modules Phase
          const archCommit = findCommitWithKeywords(
            ['feat', 'add', 'core', 'structure', 'module', 'layout', 'components'],
            [initial.sha]
          );
          if (archCommit) {
            list.push({
              dateLabel: formatDate(archCommit.date),
              title: 'Architecture & Core Features',
              description: archCommit.message.split('\n')[0],
              sha: archCommit.sha
            });
          }

          // 3. Database & Authentication Integration Phase
          const excludeShas = list.map(m => m.sha);
          const integrationCommit = findCommitWithKeywords(
            ['auth', 'login', 'jwt', 'db', 'mongo', 'sql', 'prisma', 'api', 'stripe', 'session'],
            excludeShas
          );
          if (integrationCommit) {
            list.push({
              dateLabel: formatDate(integrationCommit.date),
              title: 'Integrations & Services',
              description: integrationCommit.message.split('\n')[0],
              sha: integrationCommit.sha
            });
          }

          // 4. Testing & QA Phase
          const testExcludeShas = list.map(m => m.sha);
          const testingCommit = findCommitWithKeywords(
            ['test', 'jest', 'mocha', 'pytest', 'spec', 'cypress', 'playwright'],
            testExcludeShas
          );
          if (testingCommit) {
            list.push({
              dateLabel: formatDate(testingCommit.date),
              title: 'Testing & QA Configured',
              description: testingCommit.message.split('\n')[0],
              sha: testingCommit.sha
            });
          }

          // 5. Final Release/Deployment Phase
          const finalExcludeShas = list.map(m => m.sha);
          const latest = sortedCommits[sortedCommits.length - 1];
          if (!finalExcludeShas.includes(latest.sha) && list.length < 5) {
            list.push({
              dateLabel: formatDate(latest.date),
              title: 'Production Readiness & Docs',
              description: latest.message.split('\n')[0],
              sha: latest.sha
            });
          }
        }

        // Fallback: If not enough milestones parsed, just split commits evenly
        if (list.length < 3 && sortedCommits.length >= 3) {
          const fallbackList: TimelineMilestone[] = [];
          
          const idxs = [
            0,
            Math.floor(sortedCommits.length / 2),
            sortedCommits.length - 1
          ];

          const labels = ['Inception Phase', 'Development Phase', 'Maturity Phase'];

          idxs.forEach((idx, i) => {
            const c = sortedCommits[idx];
            fallbackList.push({
              dateLabel: formatDate(c.date),
              title: labels[i],
              description: c.message.split('\n')[0],
              sha: c.sha
            });
          });

          setMilestones(fallbackList);
        } else {
          setMilestones(list);
        }

      } catch (err) {
        console.error('Failed to parse commit history timeline:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
  }, [owner, repo]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2 border border-slate-800 rounded-xl bg-slate-950/20">
        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        <span className="text-xs text-slate-500">Constructing project progression timeline...</span>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 border border-slate-800 rounded-xl">
        No commit logs available to build timeline.
      </div>
    );
  }

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <GitBranch className="w-4 h-4 text-blue-400" />
        Project Evolution Timeline
      </h3>

      {/* Timeline Graphic */}
      <div className="relative pl-5 border-l-2 border-slate-800/80 ml-2.5 space-y-5 py-1">
        {milestones.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Circle timeline bullet */}
            <span className="absolute -left-[27px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 border-2 border-blue-500 shadow-sm group-hover:scale-110 transition-transform">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping absolute opacity-40" />
            </span>

            {/* Content box */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{item.dateLabel}</span>
                <span className="text-slate-600 font-semibold">•</span>
                <span className="text-slate-600 bg-slate-900/60 px-1 rounded border border-slate-850">{item.sha}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-normal font-light truncate max-w-[320px]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvolutionTimeline;

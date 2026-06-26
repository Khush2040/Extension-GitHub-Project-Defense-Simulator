import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  BookmarkCheck, 
  HelpCircle as QuestionIcon,
  Terminal
} from 'lucide-react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { analyzeCodebase, AnalysisResult } from '../utils/analyzer';
import InteractiveInterview from './InteractiveInterview';

interface DefensePrepProps {
  owner: string;
  repo: string;
}

interface Question {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  answer: string;
  followUps: string[];
}

const DefensePrep: React.FC<DefensePrepProps> = ({ owner, repo }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeDifficulty, setActiveDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showFollowUps, setShowFollowUps] = useState<Record<string, boolean>>({});
  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [focusType, setFocusType] = useState<string>('Local Audit');
  const [activeInterviewQuestion, setActiveInterviewQuestion] = useState<Question | null>(null);

  const recordKey = `defense_prep_${owner}_${repo}`;
  const analysisCacheKey = `analysis_result_${owner}_${repo}`;

  const loadQuestions = async () => {
    setLoading(true);
    try {
      let aiAnalysis: AnalysisResult | null = await getStorageItem(analysisCacheKey);
      
      if (!aiAnalysis) {
        const descEl = document.querySelector('p[itemprop="description"]') || document.querySelector('.BorderGrid-cell p');
        const description = descEl?.textContent?.trim() || '';

        const readmeEl = document.querySelector('#readme article') || document.querySelector('.markdown-body');
        const readmeText = readmeEl ? (readmeEl as HTMLElement).innerText : '';

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
            } catch {}
          }
          if (depContent) break;
        }

        aiAnalysis = analyzeCodebase(owner, repo, description, readmeText, depContent);
        await setStorageItem(analysisCacheKey, aiAnalysis);
      }

      if (aiAnalysis && aiAnalysis.questions) {
        setQuestions(aiAnalysis.questions);
        
        if (aiAnalysis.architecture.frameworks && aiAnalysis.architecture.frameworks.length > 0 && aiAnalysis.architecture.frameworks[0] !== 'HTML/CSS/JS') {
          setFocusType(`${aiAnalysis.architecture.frameworks[0]} Audit`);
        } else {
          setFocusType('General Audit');
        }
      }

      const savedProgress = await getStorageItem(recordKey);
      if (savedProgress && Array.isArray(savedProgress)) {
        setPracticedIds(savedProgress);
      } else {
        setPracticedIds([]);
      }
    } catch (e) {
      console.error('Failed to load questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [owner, repo, recordKey, analysisCacheKey]);

  const saveProgress = async (newPracticedIds: string[]) => {
    setPracticedIds(newPracticedIds);
    await setStorageItem(recordKey, newPracticedIds);
  };

  const toggleQuestion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleAnswer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFollowUps = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFollowUps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const togglePracticed = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = practicedIds.includes(id)
      ? practicedIds.filter(item => item !== id)
      : [...practicedIds, id];
    saveProgress(updated);
  };

  const handleMarkPracticedFromInterview = (id: string) => {
    if (!practicedIds.includes(id)) {
      saveProgress([...practicedIds, id]);
    }
  };

  const resetProgress = () => {
    saveProgress([]);
    setRevealedAnswers({});
    setShowFollowUps({});
  };

  // Grouped question filtering
  const filteredQuestions = questions.filter(q => q.difficulty === activeDifficulty);
  const getDifficultyCount = (diff: 'beginner' | 'intermediate' | 'advanced') => {
    return questions.filter(q => q.difficulty === diff).length;
  };

  const completionPercentage = questions.length > 0 
    ? Math.round((practicedIds.length / questions.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading interview prep...</p>
      </div>
    );
  }

  // Render chatbot cross-examination if an interview is active
  if (activeInterviewQuestion) {
    return (
      <InteractiveInterview 
        question={activeInterviewQuestion}
        onBack={() => setActiveInterviewQuestion(null)}
        onMarkPracticed={handleMarkPracticedFromInterview}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header and Info */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Mock Interview Prep
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            {focusType}
          </span>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Practiced {practicedIds.length} of {questions.length} questions</span>
            <span className="font-semibold text-blue-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {completionPercentage === 100 && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <BookmarkCheck className="w-4 h-4" />
            <span>Excellent! You've reviewed all recommended questions.</span>
          </div>
        )}
      </div>

      {/* Difficulty Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/20 p-1 rounded-lg">
        {(['beginner', 'intermediate', 'advanced'] as const).map(diff => {
          const isActive = activeDifficulty === diff;
          const count = getDifficultyCount(diff);
          
          return (
            <button
              key={diff}
              onClick={() => {
                setActiveDifficulty(diff);
                setExpandedId(null);
              }}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
              }`}
            >
              <span>{diff}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${isActive ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-850 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isPracticed = practicedIds.includes(q.id);
            const isAnswerRevealed = revealedAnswers[q.id] || false;
            const isFollowUpsRevealed = showFollowUps[q.id] || false;

            return (
              <div 
                key={q.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                  isExpanded 
                    ? 'bg-slate-800/60 border-slate-700 shadow-md' 
                    : 'bg-slate-950/20 border-slate-850 hover:bg-slate-900/40 hover:border-slate-800'
                }`}
                onClick={() => toggleQuestion(q.id)}
              >
                {/* Question Header */}
                <div className="p-4 flex items-start gap-3 justify-between">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={(e) => togglePracticed(q.id, e)}
                      className="mt-0.5 flex-shrink-0"
                      title={isPracticed ? "Mark as unpracticed" : "Mark as practiced"}
                    >
                      <CheckCircle2 
                        className={`w-5 h-5 transition-colors ${
                          isPracticed 
                            ? 'text-emerald-400 fill-emerald-500/10' 
                            : 'text-slate-600 hover:text-slate-400'
                        }`} 
                      />
                    </button>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        {q.category}
                      </span>
                      <h4 className={`text-sm font-medium leading-snug mt-0.5 ${
                        isPracticed ? 'text-slate-400 line-through' : 'text-slate-200'
                      }`}>
                        {q.question}
                      </h4>
                    </div>
                  </div>
                  <div className="text-slate-500 mt-1 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expandable Answers & Followups Panel */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-850 bg-slate-950/30 text-sm space-y-3">
                    {/* Strategy/Answer Header */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">Suggested Answer:</span>
                      <button
                        onClick={(e) => toggleAnswer(q.id, e)}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                      >
                        {isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}
                      </button>
                    </div>
                    
                    {isAnswerRevealed ? (
                      <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 text-xs font-light">
                        {q.answer}
                      </p>
                    ) : (
                      <div className="bg-slate-950/20 border border-dashed border-slate-800/80 rounded-lg p-3 text-center">
                        <p className="text-[11px] text-slate-500 font-light">
                          Formulate your response locally. Click "Reveal Answer" to check the suggested checklist.
                        </p>
                      </div>
                    )}

                    {/* Expandable Follow-up Questions */}
                    {q.followUps && q.followUps.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60">
                        <button
                          onClick={(e) => toggleFollowUps(q.id, e)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-semibold"
                        >
                          <QuestionIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isFollowUpsRevealed ? 'Hide Follow-up Questions' : 'Show Follow-up Questions'}</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-900 border border-slate-800 text-slate-500">
                            {q.followUps.length}
                          </span>
                        </button>

                        {isFollowUpsRevealed && (
                          <div className="mt-2 pl-3 py-2 border-l-2 border-blue-500/20 space-y-2">
                            {q.followUps.map((fu, fuIdx) => (
                              <div key={fuIdx} className="flex gap-2 items-start text-xs text-slate-300">
                                <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                                <p className="leading-relaxed font-light">{fu}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Practices toggle */}
                    <div className="flex gap-2 justify-between items-center pt-2 border-t border-slate-800/40">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInterviewQuestion(q);
                        }}
                        className="text-xs px-3 py-1.5 rounded-md font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1"
                      >
                        <Terminal className="w-3.5 h-3.5 animate-pulse" />
                        AI Cross-Examination
                      </button>

                      <button
                        onClick={(e) => togglePracticed(q.id, e)}
                        className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
                          isPracticed
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isPracticed ? 'Practiced ✓' : 'Mark Practiced'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
            No questions generated for this difficulty category.
          </div>
        )}
      </div>

      {/* Reset Progress */}
      {practicedIds.length > 0 && (
        <div className="text-center pt-2">
          <button
            onClick={resetProgress}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset all practice records
          </button>
        </div>
      )}
    </div>
  );
};

export default DefensePrep;

import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Award, User, Terminal } from 'lucide-react';

interface Question {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  answer: string;
  followUps: string[];
}

interface ChatMessage {
  sender: 'interviewer' | 'student';
  text: string;
  timestamp: Date;
}

interface InteractiveInterviewProps {
  question: Question;
  onBack: () => void;
  onMarkPracticed: (id: string) => void;
}

const InteractiveInterview: React.FC<InteractiveInterviewProps> = ({
  question,
  onBack,
  onMarkPracticed
}) => {
  const [step, setStep] = useState<'initial' | 'followup1' | 'followup2' | 'evaluation'>('initial');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ main: string; followUp1: string; followUp2: string }>({
    main: '',
    followUp1: '',
    followUp2: ''
  });
  const [evaluationReport, setEvaluationReport] = useState<{
    grade: string;
    status: 'Pass' | 'Needs Review';
    strengths: string[];
    gaps: string[];
    summary: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Chat
  useEffect(() => {
    setChatHistory([
      {
        sender: 'interviewer',
        text: `Welcome to the Project Defense simulator cross-examination. I will test your knowledge on your project's ${question.category} implementation. Let's start with your primary question:\n\n"${question.question}"`,
        timestamp: new Date()
      }
    ]);
  }, [question]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSubmitting]);

  const handleSend = async () => {
    if (!userInput.trim() || isSubmitting) return;

    const currentInput = userInput;
    setUserInput('');
    setIsSubmitting(true);

    // Add user response to chat
    setChatHistory(prev => [
      ...prev,
      { sender: 'student', text: currentInput, timestamp: new Date() }
    ]);

    // Simulate interviewers typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (step === 'initial') {
      setAnswers(prev => ({ ...prev, main: currentInput }));
      setStep('followup1');

      const followUp1 = question.followUps && question.followUps[0]
        ? question.followUps[0]
        : 'Can you explain the engineering trade-offs of this approach compared to other industry standard alternatives?';

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'interviewer',
          text: `Understood. Follow-up question: \n\n"${followUp1}"`,
          timestamp: new Date()
        }
      ]);
    } else if (step === 'followup1') {
      setAnswers(prev => ({ ...prev, followUp1: currentInput }));
      setStep('followup2');

      const followUp2 = question.followUps && question.followUps[1]
        ? question.followUps[1]
        : 'If you had to debug a sudden latency spike in this component under load, what diagnostic steps would you take?';

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'interviewer',
          text: `I see. Final follow-up question: \n\n"${followUp2}"`,
          timestamp: new Date()
        }
      ]);
    } else if (step === 'followup2') {
      const finalAnswers = { ...answers, followUp2: currentInput };
      setAnswers(finalAnswers);
      setStep('evaluation');

      // Local Evaluation Logic
      const report = evaluateResponses(question.category, finalAnswers);
      setEvaluationReport(report);

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'interviewer',
          text: `Thank you. The mock interview is complete! I have compiled your Performance Evaluation Sheet below.`,
          timestamp: new Date()
        }
      ]);
    }

    setIsSubmitting(false);
  };

  const evaluateResponses = (
    category: string,
    allAnswers: { main: string; followUp1: string; followUp2: string }
  ) => {
    const fullText = `${allAnswers.main} ${allAnswers.followUp1} ${allAnswers.followUp2}`.toLowerCase();
    
    const strengths: string[] = [];
    const gaps: string[] = [];
    let score = 0;

    // Standard keywords list to audit answer structure
    const keywordMatches: string[] = [];
    const checkKeywords = (list: string[]) => {
      list.forEach(kw => {
        if (fullText.includes(kw)) {
          score += 10;
          keywordMatches.push(kw);
        }
      });
    };

    if (category === 'Security' || category === 'Authentication') {
      checkKeywords(['httponly', 'cookie', 'token', 'jwt', 'storage', 'xss', 'csrf', 'bcrypt', 'salt', 'hash', 'security', 'rotate', 'expire', 'revoc']);
      
      if (keywordMatches.includes('httponly') || keywordMatches.includes('cookie')) {
        strengths.push('Identified secure token storage practices (HttpOnly cookies).');
      } else {
        gaps.push('Did not mention storing tokens in HttpOnly cookies, exposing them to XSS attacks.');
      }

      if (keywordMatches.includes('csrf') || keywordMatches.includes('xss')) {
        strengths.push('Demonstrates awareness of browser vulnerabilities like XSS/CSRF.');
      } else {
        gaps.push('Failed to address defences against client-side script injection (XSS).');
      }

      if (keywordMatches.includes('salt') || keywordMatches.includes('hash')) {
        strengths.push('Clear explanation of password stretching and secure salting.');
      }
    } else if (category === 'Database') {
      checkKeywords(['shard', 'index', 'scale', 'query', 'schema', 'nosql', 'sql', 'migration', 'join', 'acid', 'transaction', 'bson', 'relat']);

      if (keywordMatches.includes('index') || keywordMatches.includes('query')) {
        strengths.push('Explains database optimization techniques using indexes and structured queries.');
      } else {
        gaps.push('Omitted indexing strategies for optimizing slow search queries under load.');
      }

      if (keywordMatches.includes('shard') || keywordMatches.includes('scale')) {
        strengths.push('Acknowledge horizontal scaling limitations and sharding mechanics.');
      } else {
        gaps.push('Did not outline how horizontal partitioning (sharding) actually distributes database records.');
      }
    } else if (category === 'Architecture' || category === 'Performance') {
      checkKeywords(['memo', 'callback', 'render', 'virtual', 'dom', 'component', 'state', 'props', 'concur', 'async', 'thread', 'lock']);

      if (keywordMatches.includes('memo') || keywordMatches.includes('render')) {
        strengths.push('Explains component rendering optimizations and state diffing.');
      } else {
        gaps.push('Failed to address preventing unnecessary DOM re-renders (useMemo/useCallback).');
      }

      if (keywordMatches.includes('async') || keywordMatches.includes('concur')) {
        strengths.push('Acknowledge differences in single-threaded event loops vs concurrent workers.');
      }
    } else {
      // General question scoring
      checkKeywords(['debug', 'log', 'test', 'git', 'ci', 'cd', 'docker', 'env', 'secret', 'bottleneck', 'load', 'cache', 'redis']);
      if (keywordMatches.includes('test') || keywordMatches.includes('ci')) {
        strengths.push('Highlights the importance of automated verification pipelines.');
      } else {
        gaps.push('Lacks focus on writing unit tests or integrating automated testing CI checks.');
      }
    }

    // Set generic fallback evaluations if lists are empty
    if (strengths.length === 0) {
      if (fullText.length > 80) strengths.push('Structured answers with detailed explanations.');
      else strengths.push('Provided concise, direct answers.');
    }
    if (gaps.length === 0) {
      gaps.push('Consider elaborating more on specific system failures and recovery diagnostics.');
    }

    // Grade calculations
    let grade = 'C';
    let status: 'Pass' | 'Needs Review' = 'Needs Review';
    
    if (score >= 40 || fullText.length > 250) {
      grade = score >= 60 ? 'A' : 'B';
      status = 'Pass';
    }

    let summary = '';
    if (status === 'Pass') {
      summary = `Excellent session! You demonstrated solid theoretical familiarity with ${category} concepts. You responded confidently to follow-up questions and hit key architectural checkpoints.`;
    } else {
      summary = `You answered the questions, but the explanations lack specific technical keywords and deep dive details. Focus on studying specific trade-offs and detailed security/performance mechanisms.`;
    }

    return { grade, status, strengths, gaps, summary };
  };

  const handleFinish = () => {
    onMarkPracticed(question.id);
    onBack();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] text-slate-200">
      {/* Back Button Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to List
        </button>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded">
          Interactive Defense
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {chatHistory.map((msg, idx) => {
          const isInterviewer = msg.sender === 'interviewer';
          return (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${isInterviewer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${
                isInterviewer 
                  ? 'bg-slate-900 border-blue-500/20 text-blue-400' 
                  : 'bg-blue-600/10 border-blue-500/30 text-blue-400'
              }`}>
                {isInterviewer ? <Terminal className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-3.5 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                isInterviewer
                  ? 'bg-slate-950/40 border border-slate-800 text-slate-300'
                  : 'bg-blue-600/20 border border-blue-500/20 text-slate-200'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border bg-slate-900 border-blue-500/20 text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/20 border border-slate-850 p-3 rounded-xl text-xs text-slate-500 italic">
              Interviewer is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Evaluation Results Card */}
      {step === 'evaluation' && evaluationReport && (
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 my-3 space-y-3.5 animate-fade-in shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              Defense Grade Report
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                evaluationReport.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {evaluationReport.status}
              </span>
              <span className="text-xl font-extrabold text-blue-400">{evaluationReport.grade}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-normal">{evaluationReport.summary}</p>

          <div className="space-y-2 text-xs">
            {evaluationReport.strengths.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Correct Explanations:</span>
                {evaluationReport.strengths.map((str, i) => (
                  <p key={i} className="text-slate-300 mt-1 pl-2 border-l border-emerald-500/30 font-light">• {str}</p>
                ))}
              </div>
            )}
            
            {evaluationReport.gaps.length > 0 && (
              <div className="pt-1.5">
                <span className="text-[10px] uppercase font-bold text-rose-400">Knowledge Gaps Identified:</span>
                {evaluationReport.gaps.map((gap, i) => (
                  <p key={i} className="text-slate-300 mt-1 pl-2 border-l border-rose-500/30 font-light">• {gap}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
            >
              Finish & Mark Practiced ✓
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      {step !== 'evaluation' && (
        <div className="pt-3 border-t border-slate-800 flex gap-2 shrink-0">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your explanation..."
            disabled={isSubmitting}
            className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 resize-none h-16 outline-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!userInput.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-500 p-3.5 rounded-lg flex items-center justify-center transition-all shadow shrink-0 self-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveInterview;

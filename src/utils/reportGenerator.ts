import { AnalysisResult } from './analyzer';

/**
 * Generates the self-contained HTML document contents for the assessment report.
 */
export function generateReportHtml(
  owner: string,
  repo: string,
  analysis: AnalysisResult
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getScoreGrade = (score: number) => {
    if (score >= 80) return 'Highly Defendable';
    if (score >= 60) return 'Moderately Prepared';
    return 'Needs Code Improvement';
  };

  const getSeverityColor = (sev: 'high' | 'medium' | 'low') => {
    if (sev === 'high') return '#ef4444';
    if (sev === 'medium') return '#f59e0b';
    return '#3b82f6';
  };

  const getSeverityBg = (sev: 'high' | 'medium' | 'low') => {
    if (sev === 'high') return '#fee2e2';
    if (sev === 'medium') return '#fef3c7';
    return '#dbeafe';
  };

  const score = analysis.scores.total;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Defense Report - ${owner}/${repo}</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
      --rose-600: #e11d48;
      --rose-50: #fff1f2;
      --amber-600: #d97706;
      --amber-50: #fffbeb;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: var(--slate-800);
      background-color: #ffffff;
      line-height: 1.5;
      padding: 40px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Print styling buttons */
    .print-header {
      background-color: var(--slate-50);
      border: 1px solid var(--slate-200);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 30px;
      display: flex;
      justify-between: space-between;
      align-items: center;
    }

    .btn-print {
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn-print:hover {
      background-color: var(--primary-hover);
    }

    .header-block {
      border-bottom: 2px solid var(--slate-200);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .repo-name {
      font-size: 28px;
      font-weight: 800;
      color: var(--slate-900);
      letter-spacing: -0.025em;
    }

    .subtitle {
      color: var(--slate-700);
      font-size: 14px;
      margin-top: 4px;
      font-mono;
    }

    .report-date {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 10px;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 3fr;
      gap: 24px;
      margin-bottom: 30px;
    }

    .score-card {
      background-color: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .score-circle {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 8px solid ${score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      color: var(--slate-900);
      margin-bottom: 12px;
    }

    .score-label {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }

    .score-grade {
      font-size: 16px;
      font-weight: 700;
      color: ${score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#e11d48'};
      margin-top: 4px;
    }

    .subscores-card {
      background-color: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 20px;
    }

    .subscore-row {
      margin-bottom: 12px;
    }

    .subscore-row:last-child {
      margin-bottom: 0;
    }

    .subscore-header {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .bar-outer {
      height: 8px;
      width: 100%;
      background-color: var(--slate-100);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-inner {
      height: 100%;
      border-radius: 4px;
    }

    /* Section Styles */
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--slate-900);
      border-bottom: 1px solid var(--slate-200);
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 16px;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .tech-item {
      background-color: var(--slate-50);
      border: 1px solid var(--slate-200);
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
    }

    .tech-label {
      color: #64748b;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }

    .tech-value {
      font-weight: 700;
      color: var(--slate-900);
    }

    /* Weakness Items */
    .weakness-item {
      background-color: #ffffff;
      border-left: 4px solid;
      border-top: 1px solid var(--slate-200);
      border-right: 1px solid var(--slate-200);
      border-bottom: 1px solid var(--slate-200);
      padding: 14px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 12px;
    }

    .weakness-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-900);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .severity-badge {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .weakness-desc {
      font-size: 12px;
      color: var(--slate-700);
      margin-top: 6px;
    }

    /* Recruiter Block */
    .recruiter-card {
      background-color: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .recruiter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      border-bottom: 1px dashed var(--slate-200);
      padding-bottom: 10px;
    }

    .recruiter-label {
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-900);
    }

    .recruiter-score {
      font-size: 16px;
      font-weight: 800;
      color: var(--primary);
    }

    .recruiter-verdict {
      font-size: 13px;
      line-height: 1.6;
      color: var(--slate-700);
      font-style: italic;
    }

    .list-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 14px;
    }

    .list-column h4 {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 6px;
    }

    .list-column ul {
      list-style-type: none;
    }

    .list-column li {
      font-size: 12.5px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Questions & Answers */
    .question-block {
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .question-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-900);
      display: flex;
      justify-content: space-between;
    }

    .question-difficulty {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--primary);
      background-color: var(--slate-100);
      padding: 2px 6px;
      border-radius: 4px;
      font-mono;
    }

    .question-answer {
      font-size: 12.5px;
      color: var(--slate-700);
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed var(--slate-100);
      line-height: 1.6;
    }

    .followups-box {
      margin-top: 10px;
      padding: 10px;
      background-color: var(--slate-50);
      border-radius: 6px;
      font-size: 11.5px;
    }

    .followups-title {
      font-weight: 700;
      color: var(--slate-700);
      margin-bottom: 4px;
    }

    .followups-list {
      list-style-type: disc;
      padding-left: 16px;
      color: #64748b;
    }

    .followups-list li {
      margin-bottom: 3px;
    }

    /* Hide print headers when generating physical prints */
    @media print {
      body {
        padding: 0;
      }
      .print-header {
        display: none !important;
      }
      .question-block {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Printable Prompt bar -->
    <div class="print-header">
      <div>
        <strong style="font-size: 14px; color: var(--slate-900);">Project Assessment Ready</strong>
        <p style="font-size: 12px; color: #64748b; margin-top: 2px;">Use the download button or print menu to generate a clean PDF.</p>
      </div>
      <button onclick="window.print()" class="btn-print">Print / Save as PDF</button>
    </div>

    <!-- Main Header -->
    <div class="header-block">
      <div class="title-row">
        <div>
          <h1 class="repo-name">${owner}/${repo}</h1>
          <p class="subtitle">GitHub Project Defense simulator Report</p>
        </div>
        <div style="text-align: right;">
          <div class="report-date">${dateStr}</div>
        </div>
      </div>
    </div>

    <!-- Score & Metrics Breakdown -->
    <div class="dashboard-grid">
      <div class="score-card">
        <div class="score-circle">${score}</div>
        <div class="score-label">Readiness Score</div>
        <div class="score-grade">${getScoreGrade(score)}</div>
      </div>

      <div class="subscores-card">
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Metrics Breakdown</h3>
        
        <!-- Architecture -->
        <div class="subscore-row">
          <div class="subscore-header">
            <span>Architecture & Stack</span>
            <span>${analysis.scores.architecture}/20</span>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${(analysis.scores.architecture / 20) * 100}%; background-color: ${analysis.scores.architecture >= 16 ? '#10b981' : '#f59e0b'};"></div>
          </div>
        </div>

        <!-- Security -->
        <div class="subscore-row">
          <div class="subscore-header">
            <span>Security Implementation</span>
            <span>${analysis.scores.security}/20</span>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${(analysis.scores.security / 20) * 100}%; background-color: ${analysis.scores.security >= 16 ? '#10b981' : '#f59e0b'};"></div>
          </div>
        </div>

        <!-- Testing -->
        <div class="subscore-row">
          <div class="subscore-header">
            <span>Automated Testing</span>
            <span>${analysis.scores.testing}/20</span>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${(analysis.scores.testing / 20) * 100}%; background-color: ${analysis.scores.testing >= 16 ? '#10b981' : '#ef4444'};"></div>
          </div>
        </div>

        <!-- Deployment -->
        <div class="subscore-row">
          <div class="subscore-header">
            <span>Deployment Setup</span>
            <span>${analysis.scores.deployment}/20</span>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${(analysis.scores.deployment / 20) * 100}%; background-color: ${analysis.scores.deployment >= 16 ? '#10b981' : '#f59e0b'};"></div>
          </div>
        </div>

        <!-- Documentation -->
        <div class="subscore-row">
          <div class="subscore-header">
            <span>Documentation (README)</span>
            <span>${analysis.scores.documentation}/20</span>
          </div>
          <div class="bar-outer">
            <div class="bar-inner" style="width: ${(analysis.scores.documentation / 20) * 100}%; background-color: ${analysis.scores.documentation >= 16 ? '#10b981' : '#ef4444'};"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech Stack Summary -->
    <h2 class="section-title">Detected Architecture Stack</h2>
    <div class="tech-grid">
      <div class="tech-item">
        <span class="tech-label">Architecture Style</span>
        <span class="tech-value">${analysis.architecture.summary}</span>
      </div>
      <div class="tech-item">
        <span class="tech-label">Frameworks</span>
        <span class="tech-value">${analysis.architecture.frameworks.join(', ')}</span>
      </div>
      <div class="tech-item">
        <span class="tech-label">Database Engine</span>
        <span class="tech-value">${analysis.architecture.database}</span>
      </div>
      <div class="tech-item">
        <span class="tech-label">Authentication Layer</span>
        <span class="tech-value">${analysis.architecture.authentication}</span>
      </div>
    </div>

    <!-- Recruiter Verdict -->
    <h2 class="section-title">Recruiter Perspective</h2>
    <div class="recruiter-card">
      <div class="recruiter-header">
        <span class="recruiter-label">Engineering Manager Valuation</span>
        <span class="recruiter-score">Resume Worthiness: ${analysis.recruiter.worthiness}/10</span>
      </div>
      <p class="recruiter-verdict">"${analysis.recruiter.verdict}"</p>
      
      <div class="list-grid">
        <div class="list-column">
          <h4>Standout Strengths</h4>
          <ul>
            ${analysis.recruiter.strengths.map(s => `<li><span style="color: #10b981;">✓</span> ${s}</li>`).join('')}
          </ul>
        </div>
        <div class="list-column">
          <h4>Areas to Polish</h4>
          <ul>
            ${analysis.recruiter.weaknesses.map(w => `<li><span style="color: #ef4444;">✗</span> ${w}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <!-- Identified Weaknesses -->
    <h2 class="section-title">Security & Code Base Vulnerabilities</h2>
    <div>
      ${analysis.weaknesses.length > 0 ? 
        analysis.weaknesses.map(w => `
          <div class="weakness-item" style="border-left-color: ${getSeverityColor(w.severity)}; background-color: ${getSeverityBg(w.severity)};">
            <div class="weakness-title">
              <span class="severity-badge" style="color: white; background-color: ${getSeverityColor(w.severity)};">
                ${w.severity}
              </span>
              ${w.title}
            </div>
            <div class="weakness-desc">${w.description}</div>
          </div>
        `).join('') : `
          <p style="font-size: 13px; color: #64748b; font-style: italic;">No core weaknesses identified.</p>
        `
      }
    </div>

    <!-- Recommended Interview Questions -->
    <h2 class="section-title">Recommended Mock Prep Questions</h2>
    <div>
      ${analysis.questions.map((q, idx) => `
        <div class="question-block">
          <div class="question-title">
            <span>Q${idx + 1}: ${q.question}</span>
            <span class="question-difficulty">${q.difficulty}</span>
          </div>
          <div class="question-answer">
            <strong>Checklist / Suggested Strategy:</strong><br>
            ${q.answer}
          </div>
          ${q.followUps && q.followUps.length > 0 ? `
            <div class="followups-box">
              <div class="followups-title">Interviewer Follow-up Drill-downs:</div>
              <ul class="followups-list">
                ${q.followUps.map(fu => `<li>${fu}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

  </div>
</body>
</html>`;
}

/**
 * Creates a download of the report HTML file from Chrome Extension context.
 */
export function downloadReport(
  owner: string,
  repo: string,
  analysis: AnalysisResult
) {
  const htmlContent = generateReportHtml(owner, repo, analysis);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${owner}-${repo}-defense-report.html`;
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

# 🚀 GitHub Project Defense Simulator

> **An AI-inspired Chrome Extension that performs instant GitHub Repository Analysis, Developer Portfolio Auditing, and Mock Interview Preparation — completely offline.**

---

## 📖 Overview

**GitHub Project Defense Simulator** is a developer productivity Chrome Extension that helps developers evaluate both their **GitHub repositories** and **GitHub profiles** without relying on any backend server or external APIs.

The extension automatically detects whether you're viewing a GitHub **repository** or a **developer profile** and launches the appropriate analysis dashboard.

Everything runs **100% locally** using browser DOM analysis and a custom static rule engine, ensuring fast performance and complete privacy.

---

# ✨ Features

## 👨‍💻 Portfolio Mode (Developer Portfolio Auditor)

When visiting any GitHub profile, the extension transforms into a complete portfolio reviewer.

### 📊 Profile Statistics

* Total repositories
* Contribution count
* Repository activity

### ⭐ Overall Portfolio Rating

Calculates an overall portfolio score based on:

* Repository quality
* Activity
* Stars
* Portfolio diversity

### 💻 Language Distribution

Visualizes the top programming languages used across pinned repositories.

### 🏆 Strongest Project Spotlight

Automatically identifies:

* Highest quality project
* Star count
* Why it stands out

### ⚠ Weakness Detector

Detects missing portfolio strengths such as:

* Testing
* Docker
* CI/CD
* Database projects
* Security practices
* Documentation

### 📈 Career Development Plan

Provides personalized recommendations including:

* Skills to improve
* Project ideas
* Technologies worth learning
* Portfolio enhancement suggestions

---

# 🛡 Repository Mode (Project Defense Simulator)

When visiting any GitHub repository, the extension launches a three-tab interview preparation dashboard.

---

## 📊 Tab 1 — Project Overview

### Project Defense Score

Evaluates the repository out of **100 points** based on:

| Category      | Score |
| ------------- | ----- |
| Architecture  | /20   |
| Security      | /20   |
| Testing       | /20   |
| Deployment    | /20   |
| Documentation | /20   |

---

### 🏗 Architecture Flowchart

Automatically generates a visual architecture showing detected technologies such as:

```
Client Layer
      │
      ▼
API Service
      │
      ▼
Database Layer
```

Examples include:

* React
* Express
* MongoDB
* Firebase
* Node.js
* Next.js

---

### 🚨 Interview Risk Areas

Highlights repository weaknesses with severity levels:

* 🔴 High Risk
* 🟡 Medium Risk
* 🟢 Low Risk

---

### 🎤 2-Minute Elevator Pitch

Generates a concise project explanation covering:

* Architecture
* Features
* Security
* Database
* Deployment

Perfect for placement interviews.

---

# 🎯 Tab 2 — Mock Interview Preparation

Practice technical interviews directly inside GitHub.

### Difficulty Levels

* 🟢 Beginner
* 🟡 Intermediate
* 🔴 Advanced

---

### Mock Questions

Generates **10 tailored interview questions** based on repository analysis.

---

### Suggested Answers

Reveal structured answer checklists after attempting each question.

---

### Follow-up Questions

Each question includes 2–3 interviewer follow-up questions to simulate real technical interviews.

---

### Progress Tracking

Completed questions are saved locally using browser storage.

---

# 💼 Tab 3 — Recruiter Perspective

See your project through the eyes of an engineering manager.

### Resume Worthiness Score

Rates the project out of **10**.

---

### Strengths

Highlights features recruiters appreciate such as:

* Clean architecture
* Documentation
* Security
* Modern tech stack

---

### Improvement Areas

Suggests practical improvements including:

* Unit testing
* Docker support
* CI/CD
* API documentation
* Better project structure

---

### Final Verdict

Provides a recruiter-style review summarizing:

* Resume impact
* Hiring potential
* Suggestions for improvement

---

# ⚡ Technology Stack

* React
* TypeScript
* Tailwind CSS
* Chrome Extension APIs
* Shadow DOM
* Local Storage
* DOM Parsing
* Static Analysis Rule Engine

---

# 📂 Project Structure

```
src/
│
├── App.tsx
├── index.tsx
├── Sidebar.tsx
│
├── analyzers/
│   ├── analyzer.ts
│   └── portfolioAnalyzer.ts
│
├── components/
│   ├── PortfolioAnalyzer.tsx
│   ├── RepoDetails.tsx
│   ├── DefensePrep.tsx
│   └── RecruiterView.tsx
│
└── styles/
```

---

# ⚙ How It Works

The extension detects the current GitHub page.

### Repository Page

```
github.com/user/repository
```

Launches:

> Project Defense Simulator

---

### Profile Page

```
github.com/username
```

Launches:

> Developer Portfolio Auditor

No API keys, backend servers, or internet requests are required.

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/github-project-defense-simulator.git
```

## 2. Install dependencies

```bash
npm install
```

## 3. Build the extension

```bash
npm run build
```

The production build will be generated inside the **dist/** folder.

---

# 🧩 Load the Extension

1. Open Chrome.
2. Visit:

```
chrome://extensions
```

3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the generated **dist** folder.

---

# 🎯 Example Usage

### Repository Analysis

Visit:

```
https://github.com/facebook/react
```

Click:

**Start Mock Interview**

---

### Portfolio Analysis

Visit:

```
https://github.com/gaearon
```

Click:

**Analyze Portfolio**

---

# 🌟 Why This Project?

Unlike traditional GitHub analysis tools, this extension:

* ✅ Runs completely offline
* ✅ Requires no GitHub API
* ✅ Performs instant analysis
* ✅ Protects user privacy
* ✅ Helps developers prepare for technical interviews
* ✅ Provides recruiter-focused feedback
* ✅ Audits both repositories and developer portfolios

---

# 📈 Skills Demonstrated

* Chrome Extension Development
* React Development
* TypeScript
* Tailwind CSS
* Shadow DOM
* DOM Manipulation
* Static Code Analysis
* Rule Engine Design
* Software Architecture
* Technical Interview Preparation
* UI/UX Design
* Local Data Persistence

---

# 🔮 Future Improvements

* AI-powered code explanation
* Repository comparison
* ATS resume scoring
* GitHub contribution heatmap analytics
* Export reports as PDF
* Multi-repository portfolio insights
* Personalized interview roadmap

---

# 🤝 Contributing

Contributions, feature requests, and suggestions are welcome.

Feel free to fork the repository and submit a pull request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ If you found this project useful, consider giving it a Star!

It helps support the project and motivates future improvements.

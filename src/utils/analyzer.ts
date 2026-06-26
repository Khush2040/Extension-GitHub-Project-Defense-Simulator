export interface AnalysisResult {
  architecture: {
    summary: string;
    frameworks: string[];
    database: string;
    authentication: string;
    deployment: string;
    thirdPartyServices: string[];
  };
  scores: {
    architecture: number;
    security: number;
    testing: number;
    deployment: number;
    documentation: number;
    total: number;
  };
  riskAreas: {
    severity: 'high' | 'medium' | 'low';
    category: string;
    details: string;
  }[];
  recruiter: {
    worthiness: number;
    strengths: string[];
    weaknesses: string[];
    verdict: string;
  };
  explanation: string;
  weaknesses: {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  questions: {
    id: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    question: string;
    answer: string;
    followUps: string[];
  }[];
}

interface Question {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  answer: string;
  followUps: string[];
}

interface TechRule {
  name: string;
  keywords: string[];
  category: 'framework' | 'database' | 'auth' | 'service' | 'test';
  questions: Omit<Question, 'id'>[];
}

const TECH_RULES: TechRule[] = [
  {
    name: 'React',
    keywords: ['react', 'react-dom', 'react-router', 'next.js', 'next'],
    category: 'framework',
    questions: [
      {
        category: 'Architecture',
        difficulty: 'intermediate',
        question: 'How do you optimize rendering performance in React? When would you use useMemo or useCallback?',
        answer: 'To optimize performance in React, prevent unnecessary re-renders. Use React.memo to skip re-rendering a component if its props haven\'t changed. Use useMemo to cache expensive calculations, and useCallback to cache function definitions so that child components don\'t receive new references on every render, which triggers unnecessary updates.',
        followUps: [
          'What is the danger of overusing useMemo and useCallback?',
          'How does the virtual DOM reconciliation algorithm identify changed components?',
          'What is the difference between state and props in React?'
        ]
      }
    ]
  },
  {
    name: 'Next.js',
    keywords: ['next', 'next.js', '@next/'],
    category: 'framework',
    questions: [
      {
        category: 'Architecture',
        difficulty: 'advanced',
        question: 'What is the difference between Server Components and Client Components in Next.js? When should you use each?',
        answer: 'Server Components render on the server, resulting in zero client-side bundle size, faster initial page load, and direct database access. Use them by default. Client Components (marked with "use client") are hydrated on the client. Use them when you need interactive features like state (useState), effects (useEffect), browser-only APIs, or event listeners.',
        followUps: [
          'How does data fetching work in Server Components compared to Client Components?',
          'Explain ISR (Incremental Static Regeneration) and how it fits into rendering options.',
          'Can you import a Server Component into a Client Component? Why or why not?'
        ]
      }
    ]
  },
  {
    name: 'Express',
    keywords: ['express', 'koa', 'fastify', 'nest.js', 'nestjs'],
    category: 'framework',
    questions: [
      {
        category: 'Architecture',
        difficulty: 'intermediate',
        question: 'How does middleware work in Express? How do you handle error propagation?',
        answer: 'Express middleware functions have access to the request (req), response (res), and the next middleware function in the cycle. They execute sequentially. For error handling, you must define a middleware with four arguments: (err, req, res, next). Any error passed to next(err) bypasses normal middleware and goes straight to this error handler.',
        followUps: [
          'Why is calling next() important in middleware functions?',
          'How does the body-parser middleware process incoming data?',
          'What is the difference between app.use() and HTTP verb methods like app.get()?'
        ]
      }
    ]
  },
  {
    name: 'Django',
    keywords: ['django', 'django-rest-framework', 'djangorestframework'],
    category: 'framework',
    questions: [
      {
        category: 'Architecture',
        difficulty: 'intermediate',
        question: 'Django is a "batteries-included" framework. What are the pros and cons of this approach compared to micro-frameworks like Flask?',
        answer: 'Pros: Built-in ORM, admin panel, authentication, and security features out of the box, which speeds up development and enforces consistent structure. Cons: It is heavier, highly opinionated, and can feel restrictive if you want to use custom libraries (like SQLAlchemy instead of the Django ORM).',
        followUps: [
          'What is the N+1 query problem in ORMs like Django ORM, and how do you fix it?',
          'How do Django middlewares differ from Express middlewares?',
          'What is the purpose of Django migrations, and how do they work?'
        ]
      }
    ]
  },
  {
    name: 'Flask',
    keywords: ['flask', 'werkzeug', 'gunicorn'],
    category: 'framework',
    questions: [
      {
        category: 'Architecture',
        difficulty: 'intermediate',
        question: 'How do you handle application state or database connections across requests in a Flask application?',
        answer: 'Flask uses context locals like `g` and `current_app`. The `g` object is a thread-safe, request-specific global storage area. For database connections (e.g., using Flask-SQLAlchemy), connection pooling is managed automatically, and the session is torn down at the end of each request using `@app.teardown_appcontext`.',
        followUps: [
          'What is a thread-local object in python?',
          'How does Flask routing handle dynamic variable rules in URLs?',
          'Why is a WSGI server like Gunicorn necessary in production?'
        ]
      }
    ]
  },
  {
    name: 'FastAPI',
    keywords: ['fastapi', 'uvicorn', 'pydantic'],
    category: 'framework',
    questions: [
      {
        category: 'Architecture',
        difficulty: 'advanced',
        question: 'Why did you choose FastAPI, and how does it leverage Python asynchronous programming (async/await)?',
        answer: 'FastAPI is built on Starlette and Pydantic, making it one of the fastest Python frameworks. It natively supports async/await, allowing the server to handle high-concurrency, I/O-bound operations (like database calls and API requests) without blocking the main execution thread, which vastly improves throughput.',
        followUps: [
          'What is the event loop in Python, and how does async/await interact with it?',
          'How does Pydantic perform request body data validation in FastAPI?',
          'When would you write a synchronous `def` route instead of an `async def` route?'
        ]
      }
    ]
  },
  {
    name: 'MongoDB',
    keywords: ['mongodb', 'mongoose', 'pymongo'],
    category: 'database',
    questions: [
      {
        category: 'Database',
        difficulty: 'advanced',
        question: 'Why did you choose MongoDB over a relational database like PostgreSQL? How does it handle scaling?',
        answer: 'MongoDB offers a flexible JSON-like document schema, which fits objects in code naturally and allows fast iteration without migrations. It scales horizontally via Sharding (splitting data across different servers using a shard key), whereas relational databases traditionally scale vertically (bigger servers) or use read-replicas.',
        followUps: [
          'What is a shard key, and how do you choose a good one?',
          'Explain the concept of BSON and how it differs from JSON.',
          'What are the tradeoffs of transactional ACID compliance in MongoDB?'
        ]
      }
    ]
  },
  {
    name: 'PostgreSQL',
    keywords: ['pg', 'postgres', 'postgresql', 'psycopg2'],
    category: 'database',
    questions: [
      {
        category: 'Database',
        difficulty: 'intermediate',
        question: 'Why did you choose PostgreSQL? How does it compare to MySQL or MongoDB for data integrity?',
        answer: 'PostgreSQL is a robust relational database with strong ACID compliance and advanced support for complex queries, joins, and indexing. It enforces a strict schema, ensuring high data integrity. Compared to MongoDB, it is better for highly connected transactional data (e.g., financial ledger), while MongoDB is better for unstructured, hierarchical documents.',
        followUps: [
          'Explain WAL (Write-Ahead Logging) and why it is important for crash recovery.',
          'What is the difference between inner joins, left joins, and outer joins in SQL?',
          'How do you handle migrations in a PostgreSQL database?'
        ]
      }
    ]
  },
  {
    name: 'MySQL',
    keywords: ['mysql', 'mysql2', 'mysqlclient'],
    category: 'database',
    questions: [
      {
        category: 'Database',
        difficulty: 'intermediate',
        question: 'How do indexes work in MySQL, and how do they speed up select queries? What is the cost of indexing?',
        answer: 'Indexes in MySQL (typically B-Trees) create a sorted pointer structure, allowing the database engine to find records in logarithmic time O(log N) rather than performing a full table scan O(N). The cost is increased storage space and slower write operations (INSERT, UPDATE, DELETE), because the index must be recalculated on every write.',
        followUps: [
          'What is the difference between a clustered index and a non-clustered index?',
          'What is a covering index and how does it prevent index-to-table lookups?',
          'How does the EXPLAIN statement help you optimize a query?'
        ]
      }
    ]
  },
  {
    name: 'SQLite',
    keywords: ['sqlite', 'sqlite3', 'better-sqlite3'],
    category: 'database',
    questions: [
      {
        category: 'Database',
        difficulty: 'beginner',
        question: 'What are the main advantages and limitations of using SQLite for a project?',
        answer: 'Advantages: Serverless, zero-configuration, and extremely fast for local development or low-traffic apps as it reads/writes directly to a single file on disk. Limitations: It does not support high concurrency (only one write operation can occur at a time, locking the database), and lacks advanced user permission/scaling features.',
        followUps: [
          'Is SQLite thread-safe? How does it handle file locking?',
          'In what scenarios is it recommended to transition from SQLite to PostgreSQL?',
          'How is SQLite database backup typically performed?'
        ]
      }
    ]
  },
  {
    name: 'JWT',
    keywords: ['jsonwebtoken', 'jwt', 'pyjwt', 'jose'],
    category: 'auth',
    questions: [
      {
        category: 'Security',
        difficulty: 'intermediate',
        question: 'I noticed you are using JWT for authentication. Why choose JWT instead of session-based authentication? How would you implement refresh tokens?',
        answer: 'JWTs are stateless, which removes the database look-up overhead of sessions and makes the backend easier to scale horizontally. For secure session management, use short-lived access tokens (stored in memory) and long-lived refresh tokens (stored in an HttpOnly, secure, SameSite cookie) that can be rotated or revoked in a database/cache like Redis.',
        followUps: [
          'What is token rotation and why is it a security best practice?',
          'How do you defend against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) when handling JWTs?',
          'How does the server verify a JWT without querying the database?'
        ]
      }
    ]
  },
  {
    name: 'Bcrypt',
    keywords: ['bcrypt', 'bcryptjs', 'passlib'],
    category: 'auth',
    questions: [
      {
        category: 'Security',
        difficulty: 'beginner',
        question: 'Why did you choose bcrypt for hashing passwords? What salt rounds did you choose, and what are the tradeoffs?',
        answer: 'Bcrypt is a key-stretching hashing algorithm designed to be computationally slow, which directly defends against brute-force and hardware-accelerated attacks (GPU/ASIC). 10 to 12 salt rounds is standard; higher numbers increase the time required to compute each hash exponentially, raising security but also increasing server load during login.',
        followUps: [
          'What is a rainbow table, and how does salting passwords prevent it?',
          'What is the difference between hashing and encryption?',
          'Why is MD5 or SHA-256 not recommended for hashing user passwords?'
        ]
      }
    ]
  },
  {
    name: 'Stripe',
    keywords: ['stripe', '@stripe/'],
    category: 'service',
    questions: [
      {
        category: 'General',
        difficulty: 'intermediate',
        question: 'How did you integrate Stripe? How do you handle webhook events securely to ensure payments are verified?',
        answer: 'Stripe payments are initiated on the backend by creating a PaymentIntent. To handle post-payment actions (like updating database status), we listen to Stripe Webhooks. To make it secure, we must verify the webhook signature using the webhook signing secret to prevent spoofing, and ensure the event is processed idempotently.',
        followUps: [
          'What is idempotency and why is it critical when processing financial webhooks?',
          'How do you test Stripe webhooks locally during development?',
          'What is the difference between Stripe Checkout and Stripe Elements?'
        ]
      }
    ]
  },
  {
    name: 'Cloudinary',
    keywords: ['cloudinary'],
    category: 'service',
    questions: [
      {
        category: 'Performance',
        difficulty: 'beginner',
        question: 'Why did you choose Cloudinary for media uploads rather than saving files directly to your server?',
        answer: 'Saving files directly to the server consumes local disk space and can crash the server if storage fills up. Cloudinary offloads this storage, acts as a CDN for fast asset delivery, and automatically optimizes images (resizing, compressing, and converting formats like WebP) to reduce bandwidth and load times.',
        followUps: [
          'What is image optimization (dimensions, file size, formats) and why is it important?',
          'How does a Content Delivery Network (CDN) cache assets closer to the user?',
          'What is the difference between signed and unsigned uploads in Cloudinary?'
        ]
      }
    ]
  },
  {
    name: 'Jest',
    keywords: ['jest', 'vitest', 'mocha', 'cypress', 'playwright', 'pytest', 'unittest'],
    category: 'test',
    questions: []
  }
];

const GENERAL_QUESTIONS: Question[] = [
  {
    id: 'gen-1',
    category: 'General',
    difficulty: 'beginner',
    question: 'What was the biggest technical challenge you faced while building this project, and how did you overcome it?',
    answer: 'Share a specific bug, architecture dilemma, or integration challenge. Describe the debugging steps (e.g. checking logs, browser devtools), the alternative solutions considered, the final fix, and what you learned as a result.',
    followUps: [
      'What other options did you consider before settling on your final solution?',
      'How did you verify or test that your fix was robust?',
      'If you could start over, how would you structure the code to prevent this issue entirely?'
    ]
  },
  {
    id: 'gen-2',
    category: 'General',
    difficulty: 'intermediate',
    question: 'If you had to rewrite this project from scratch, what would you do differently?',
    answer: 'Critique your own code honestly. Discuss alternative libraries, different database modeling choices, or a different state management structure that you now realize would have saved time or improved performance.',
    followUps: [
      'What library did you use that turned out to be more trouble than it was worth?',
      'Would you choose a different programming language or database paradigm?',
      'How would you restructure your folder organization for better code sharing?'
    ]
  },
  {
    id: 'gen-3',
    category: 'Architecture',
    difficulty: 'beginner',
    question: 'Explain the directory layout of your project and how dependencies flow between components.',
    answer: 'Describe the modularity of the project. Explain how files are grouped (e.g., features, components, services, utils), and how data flows unidirectionally (e.g. parent to child props, actions to store, controllers to database).',
    followUps: [
      'Why is avoiding circular dependencies between files important?',
      'How do you enforce architectural boundaries in your codebase?',
      'What styling framework did you choose, and how does it fit into your file structure?'
    ]
  },
  {
    id: 'gen-4',
    category: 'Security',
    difficulty: 'beginner',
    question: 'How do you manage configuration secrets (like database URLs and API keys) between development and production?',
    answer: 'Ensure secrets are NEVER committed to version control. Use a `.env` file locally (added to `.gitignore`) and set environment variables in your hosting provider (e.g., Render, Vercel) for production. Mention using config files or schema validators to verify variables at boot.',
    followUps: [
      'What happens if a secret is accidentally committed to GitHub?',
      'How do you inject secrets securely in a CI/CD build pipeline like GitHub Actions?',
      'What is git-crypt and how does it secure repository configurations?'
    ]
  },
  {
    id: 'gen-5',
    category: 'Performance',
    difficulty: 'advanced',
    question: 'If this application had to support 100x more concurrent users, what architectural changes would you make?',
    answer: 'Identify bottlenecks first (e.g. slow database queries). Propose solutions: introducing caching layers (Redis), database indexing, query optimization, horizontal scaling with load balancers, CDN caching for static assets, and async task queues for heavy operations.',
    followUps: [
      'Where would the first bottleneck occur (CPU, Memory, Network, Database connections)?',
      'How does a message queue like RabbitMQ or Celery help with heavy backend tasks?',
      'What is database replication and how does it help scale read queries?'
    ]
  },
  {
    id: 'gen-6',
    category: 'Performance',
    difficulty: 'advanced',
    question: 'How does a browser handle 100,000 DOM nodes? What optimizations (such as virtualization) can you make to keep the UI responsive?',
    answer: '100,000 DOM nodes cause massive layout reflows and memory overhead, causing the UI to freeze. Optimizations include Virtualized Lists (rendering only the visible rows on screen, e.g. using react-window) and throttling scroll event handlers.',
    followUps: [
      'What is the difference between browser reflow and repaint?',
      'How does using requestAnimationFrame improve animation performance?',
      'What is hardware acceleration and how do you trigger it in CSS?'
    ]
  }
];

/**
 * Perform local rule-based analysis of the codebase
 */
export function analyzeCodebase(
  _owner: string,
  _repo: string,
  description: string,
  readmeText: string,
  dependencyContent: string
): AnalysisResult {
  const normalizedDeps = dependencyContent.toLowerCase();
  const normalizedReadme = readmeText.toLowerCase();
  const normalizedDesc = description.toLowerCase();
  const combinedText = `${normalizedDeps} ${normalizedReadme} ${normalizedDesc}`;

  const detectedFrameworks: string[] = [];
  let detectedDatabase = 'None Detected';
  let detectedAuth = 'None Detected';
  const detectedServices: string[] = [];
  let hasTests = false;

  const matchedRules: TechRule[] = [];

  // Match rules
  TECH_RULES.forEach(rule => {
    const isMatched = rule.keywords.some(kw => combinedText.includes(kw));

    if (isMatched) {
      matchedRules.push(rule);
      if (rule.category === 'framework') {
        detectedFrameworks.push(rule.name);
      } else if (rule.category === 'database') {
        detectedDatabase = rule.name;
      } else if (rule.category === 'auth') {
        detectedAuth = rule.name;
      } else if (rule.category === 'service') {
        detectedServices.push(rule.name);
      } else if (rule.category === 'test') {
        hasTests = true;
      }
    }
  });

  // Determine Architecture Summary and Primary Language
  let summary = 'Web Application';
  let deployment = 'Render / Heroku';

  if (detectedFrameworks.includes('Next.js')) {
    summary = 'Modern Jamstack / Server-Side Rendered (SSR) Web Application.';
    deployment = 'Vercel / Netlify';
  } else if (detectedFrameworks.includes('React') && detectedFrameworks.includes('Express')) {
    summary = 'Full-Stack JavaScript (MERN/PERN Stack) Web Application.';
    deployment = 'Render / Railway';
  } else if (detectedFrameworks.includes('Django')) {
    summary = 'Monolithic Python Web Application (MVC/MTV Pattern).';
    deployment = 'Render / AWS Elastic Beanstalk';
  } else if (detectedFrameworks.includes('FastAPI') || detectedFrameworks.includes('Flask')) {
    summary = 'Lightweight Python REST API backend service.';
    deployment = 'Render / Heroku';
  } else if (detectedFrameworks.includes('Express')) {
    summary = 'Node.js REST API Backend Service.';
    deployment = 'Render / Railway';
  } else if (detectedFrameworks.includes('React')) {
    summary = 'Single Page Application (SPA) Web Frontend.';
    deployment = 'Vercel / Netlify';
  }

  // Calculate Scores (out of 20 each)
  let scoreArch = 20;
  let scoreSec = 20;
  let scoreTest = 20;
  let scoreDeploy = 20;
  let scoreDoc = 20;

  // Audit Weaknesses
  const weaknesses: AnalysisResult['weaknesses'] = [];

  // 1. Tests Audit
  if (!hasTests) {
    scoreTest -= 12;
    weaknesses.push({
      title: 'Missing Test Suite',
      description: 'No test configuration (Jest, PyTest, Mocha, etc.) was found in the project dependencies or README. Adding unit/integration tests increases reliability and is highly valued in technical reviews.',
      severity: 'high'
    });
  }

  // 2. Env Audit
  const hasEnvLib = ['dotenv', 'pydantic', 'zod', 'config'].some(kw => combinedText.includes(kw));
  if (!hasEnvLib && (combinedText.includes('secret') || combinedText.includes('key') || combinedText.includes('password'))) {
    scoreSec -= 6;
    weaknesses.push({
      title: 'No Environment Validation',
      description: 'No schema-based environment variable validator (like Zod or Pydantic) was detected. Validate your configuration variables at startup to prevent silent runtime crashes.',
      severity: 'medium'
    });
  }

  // 3. Rate Limiting Audit
  const hasRateLimit = ['rate-limit', 'ratelimit', 'slowapi', 'throttle'].some(kw => combinedText.includes(kw));
  if (!hasRateLimit && (detectedFrameworks.includes('Express') || detectedFrameworks.includes('Flask') || detectedFrameworks.includes('FastAPI') || detectedFrameworks.includes('Django'))) {
    scoreSec -= 5;
    weaknesses.push({
      title: 'No API Rate Limiting',
      description: 'No rate-limiting middleware was detected in the project. Implement rate limiting on API endpoints to prevent brute-force attacks and denial-of-service.',
      severity: 'medium'
    });
  }

  // 4. Containerization Audit
  const hasDocker = combinedText.includes('dockerfile') || combinedText.includes('docker-compose');
  if (!hasDocker) {
    scoreArch -= 4;
    weaknesses.push({
      title: 'Missing Containerization (Docker)',
      description: 'There is no Dockerfile in the project. Adding a Docker container standardizes the environment across development and production, ensuring "works on my machine" consistency.',
      severity: 'low'
    });
  }

  // 5. Auth Audit
  if (detectedDatabase !== 'None Detected' && detectedAuth === 'None Detected') {
    scoreSec -= 9;
    weaknesses.push({
      title: 'Undocumented Authentication',
      description: 'A database is in use but no standard authentication mechanism (JWT, Passport, OAuth) was identified in your dependencies. Ensure password storage uses modern cryptographic hashing.',
      severity: 'high'
    });
  }

  // 6. Documentation Audit
  const hasReadme = readmeText.length > 100;
  if (!hasReadme) {
    scoreDoc -= 12;
  } else if (readmeText.length < 500) {
    scoreDoc -= 5;
  }

  const totalScore = scoreArch + scoreSec + scoreTest + scoreDeploy + scoreDoc;

  // Build Risk Areas
  const riskAreas: AnalysisResult['riskAreas'] = [];
  if (scoreTest < 12) {
    riskAreas.push({ severity: 'high', category: 'Testing', details: 'Lack of test suite configuration in the repository.' });
  } else if (scoreTest < 18) {
    riskAreas.push({ severity: 'medium', category: 'Testing', details: 'Basic testing setups present but likely incomplete coverage.' });
  } else {
    riskAreas.push({ severity: 'low', category: 'Testing', details: 'Tests are configured and integrated.' });
  }

  if (scoreSec < 12) {
    riskAreas.push({ severity: 'high', category: 'Security', details: 'No standard database encryption, password hashing, or rate limiting detected.' });
  } else if (scoreSec < 18) {
    riskAreas.push({ severity: 'medium', category: 'Security', details: 'Missing environment variables validation or rate-limiting guards.' });
  } else {
    riskAreas.push({ severity: 'low', category: 'Security', details: 'Authentication and security modules detected.' });
  }

  if (scoreArch < 15) {
    riskAreas.push({ severity: 'medium', category: 'Architecture', details: 'Missing containerization or clean module boundaries.' });
  } else {
    riskAreas.push({ severity: 'low', category: 'Architecture', details: 'Clean architecture patterns and configurations.' });
  }

  // Recruiter Perspective
  const worthiness = Math.round((totalScore / 10) * 10) / 10;
  const strengths: string[] = [];
  const recWeaknesses: string[] = [];

  if (detectedAuth !== 'None Detected') strengths.push('Secure Authentication');
  if (detectedDatabase !== 'None Detected') strengths.push('Database Design');
  if (detectedFrameworks.length > 0) strengths.push('Modern Framework Stack');
  if (hasReadme) strengths.push('Clear Documentation (README)');

  if (!hasTests) recWeaknesses.push('Automated Testing');
  if (!hasDocker) recWeaknesses.push('Docker Containerization');
  if (!hasEnvLib) recWeaknesses.push('Environment Variable Validation');

  let verdict = '';
  if (worthiness >= 8.0) {
    verdict = 'This is an excellent portfolio piece. It demonstrates solid full-stack/frontend capabilities, structured architecture, and is highly likely to impress recruiters. Adding automated test coverage would make it practically flawless.';
  } else if (worthiness >= 6.0) {
    verdict = 'This project is a solid start and shows good potential. To make it stand out to recruiters, we recommend adding a test suite (e.g. Jest/PyTest), validating environment configurations, and writing a Dockerfile.';
  } else {
    verdict = 'This repository is in its early stages. To make it resume-worthy, you need to add comprehensive documentation, implement proper authentication, configure unit tests, and structure your deployment settings.';
  }

  // 2-Minute Interview Explanation
  let explanation = '';
  const frameList = detectedFrameworks.join(' and ');
  const dbName = detectedDatabase;
  const authName = detectedAuth;

  if (detectedFrameworks.includes('React') || detectedFrameworks.includes('Next.js')) {
    explanation = `This project is a modern web application built using ${frameList || 'React'}. It is architected for optimal frontend performance, and leverages ${dbName !== 'None Detected' ? dbName : 'local states'} for data storage. For user security, the application integrates ${authName !== 'None Detected' ? authName : 'standard client-side guards'}. The codebase features a modular component hierarchy ensuring scalability, and is configured to deploy seamlessly to ${deployment}.`;
  } else if (detectedFrameworks.includes('Django') || detectedFrameworks.includes('Flask') || detectedFrameworks.includes('FastAPI')) {
    explanation = `This repository is a backend REST service built with the ${frameList} framework. It is structured around clean MVC/REST principles and utilizes ${dbName} for storing persistent data, connected securely via ${authName !== 'None Detected' ? authName : 'standard configurations'}. The backend handles asynchronous requests efficiently, features database connection pooling, and is configured for rapid scaling and deployment on ${deployment}.`;
  } else {
    explanation = `This codebase represents a specialized utility project. It utilizes clean software engineering principles, featuring structured dependency imports and modular functions. The project is designed with ease of setup in mind, documented extensively in the README, and is optimized for low-latency operations and immediate deployment.`;
  }

  // Build Questions
  const questions: Question[] = [];
  const addedQuestionTexts = new Set<string>();

  // Add specific matched questions first
  matchedRules.forEach(rule => {
    rule.questions.forEach(q => {
      if (!addedQuestionTexts.has(q.question)) {
        questions.push({
          id: `q-tech-${questions.length + 1}`,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          answer: q.answer,
          followUps: q.followUps
        });
        addedQuestionTexts.add(q.question);
      }
    });
  });

  // Fill up to 10 questions using general questions
  let genIdx = 0;
  while (questions.length < 10 && genIdx < GENERAL_QUESTIONS.length) {
    const q = GENERAL_QUESTIONS[genIdx++];
    if (!addedQuestionTexts.has(q.question)) {
      questions.push({
        id: `q-gen-${questions.length + 1}`,
        category: q.category,
        difficulty: q.difficulty,
        question: q.question,
        answer: q.answer,
        followUps: q.followUps
      });
      addedQuestionTexts.add(q.question);
    }
  }

  const finalQuestions = questions.slice(0, 10);

  return {
    architecture: {
      summary,
      frameworks: detectedFrameworks.length > 0 ? detectedFrameworks : ['HTML/CSS/JS'],
      database: detectedDatabase,
      authentication: detectedAuth,
      deployment,
      thirdPartyServices: detectedServices.length > 0 ? detectedServices : ['None']
    },
    scores: {
      architecture: scoreArch,
      security: scoreSec,
      testing: scoreTest,
      deployment: scoreDeploy,
      documentation: scoreDoc,
      total: totalScore
    },
    riskAreas,
    recruiter: {
      worthiness,
      strengths,
      weaknesses: recWeaknesses,
      verdict
    },
    explanation,
    weaknesses,
    questions: finalQuestions
  };
}

/* ═══════════════════════════════════════════════════════
   MSR.ai — Content data layer
   All portfolio content in one place, easy to maintain.
   ═══════════════════════════════════════════════════════ */

const MSR = window.MSR = {};

/* ---------- Theme ----------
   "Signal" design family — warm paper ground, one accent hue per theme,
   serif display / mono data. Six selectable color themes, each with its
   own light/dark mode pair. */
MSR.THEMES = [
  { id: 'signal', name: 'Signal', swatch: 'linear-gradient(120deg,#33533C,#4C7A57)' },
  { id: 'violet', name: 'Violet', swatch: 'linear-gradient(120deg,#6A3FA0,#8B5FC4)' },
  { id: 'crimson', name: 'Crimson', swatch: 'linear-gradient(120deg,#7A1F24,#A5342F)' },
  { id: 'ocean', name: 'Ocean', swatch: 'linear-gradient(120deg,#1E4E7A,#2E6FA5)' },
  { id: 'skyblue', name: 'Skyblue', swatch: 'linear-gradient(120deg,#2E9BC4,#5FBBDE)' },
  { id: 'mono', name: 'Light', swatch: 'linear-gradient(120deg,#3A3A35,#63635A)' }
];

/* ---------- Skills ----------
   level: Expert 92 | Advanced 80 | Intermediate 65 | Beginner 45 */
const L = { E: ['Expert', 92], A: ['Advanced', 82], I: ['Intermediate', 66], B: ['Beginner', 48] };
const S = (name, cat, icon, lvl) => ({ name, cat, icon, level: L[lvl][0], pct: L[lvl][1] });

MSR.SKILL_CATS = [
  'Programming Languages', 'Frontend Technologies', 'Machine Learning & AI',
  'AI Frameworks & Libraries', 'Python Libraries', 'Backend & APIs',
  'Cloud & DevOps', 'Databases & Vector DBs', 'Developer Tools'
];

MSR.SKILLS = [
  // Programming Languages
  S('Python', 'Programming Languages', 'fa-brands fa-python', 'E'),
  S('C', 'Programming Languages', 'fa-solid fa-c', 'A'),
  S('C++', 'Programming Languages', 'fa-solid fa-code', 'A'),
  S('Java', 'Programming Languages', 'fa-brands fa-java', 'I'),
  S('JavaScript', 'Programming Languages', 'fa-brands fa-js', 'I'),
  S('SQL', 'Programming Languages', 'fa-solid fa-database', 'A'),
  // Frontend
  S('HTML', 'Frontend Technologies', 'fa-brands fa-html5', 'A'),
  S('CSS', 'Frontend Technologies', 'fa-brands fa-css3-alt', 'A'),
  S('Next.js', 'Frontend Technologies', 'fa-solid fa-forward', 'I'),
  // ML & AI
  S('Machine Learning', 'Machine Learning & AI', 'fa-solid fa-brain', 'E'),
  S('Deep Learning', 'Machine Learning & AI', 'fa-solid fa-network-wired', 'A'),
  S('CNN', 'Machine Learning & AI', 'fa-solid fa-layer-group', 'A'),
  S('NLP', 'Machine Learning & AI', 'fa-solid fa-language', 'A'),
  S('Computer Vision', 'Machine Learning & AI', 'fa-solid fa-eye', 'A'),
  S('Image Processing', 'Machine Learning & AI', 'fa-solid fa-image', 'A'),
  S('Audio Processing', 'Machine Learning & AI', 'fa-solid fa-wave-square', 'I'),
  S('LLM', 'Machine Learning & AI', 'fa-solid fa-comment-dots', 'A'),
  S('Generative AI', 'Machine Learning & AI', 'fa-solid fa-wand-magic-sparkles', 'A'),
  S('RAG', 'Machine Learning & AI', 'fa-solid fa-diagram-project', 'A'),
  S('Feature Engineering', 'Machine Learning & AI', 'fa-solid fa-screwdriver-wrench', 'E'),
  S('Model Evaluation', 'Machine Learning & AI', 'fa-solid fa-clipboard-check', 'E'),
  S('EDA', 'Machine Learning & AI', 'fa-solid fa-magnifying-glass-chart', 'E'),
  S('Data Visualization', 'Machine Learning & AI', 'fa-solid fa-chart-pie', 'A'),
  S('Model Deployment', 'Machine Learning & AI', 'fa-solid fa-rocket', 'A'),
  // AI Frameworks
  S('LangChain', 'AI Frameworks & Libraries', 'fa-solid fa-link', 'A'),
  S('LangGraph', 'AI Frameworks & Libraries', 'fa-solid fa-circle-nodes', 'A'),
  S('Sentence Transformers', 'AI Frameworks & Libraries', 'fa-solid fa-arrows-turn-to-dots', 'I'),
  S('FAISS', 'AI Frameworks & Libraries', 'fa-solid fa-vector-square', 'A'),
  S('OpenAI API', 'AI Frameworks & Libraries', 'fa-solid fa-bolt', 'A'),
  S('Claude API', 'AI Frameworks & Libraries', 'fa-solid fa-asterisk', 'A'),
  S('Groq API', 'AI Frameworks & Libraries', 'fa-solid fa-gauge-high', 'I'),
  S('Ollama', 'AI Frameworks & Libraries', 'fa-solid fa-server', 'I'),
  // Python libs
  S('NumPy', 'Python Libraries', 'fa-solid fa-table-cells', 'E'),
  S('Pandas', 'Python Libraries', 'fa-solid fa-table', 'E'),
  S('Matplotlib', 'Python Libraries', 'fa-solid fa-chart-line', 'A'),
  S('Seaborn', 'Python Libraries', 'fa-solid fa-chart-area', 'A'),
  S('Scikit-learn', 'Python Libraries', 'fa-solid fa-gears', 'E'),
  S('TensorFlow', 'Python Libraries', 'fa-solid fa-cube', 'A'),
  S('PyTorch', 'Python Libraries', 'fa-solid fa-fire', 'A'),
  S('Keras', 'Python Libraries', 'fa-solid fa-k', 'A'),
  S('OpenCV', 'Python Libraries', 'fa-solid fa-camera', 'A'),
  S('Librosa', 'Python Libraries', 'fa-solid fa-music', 'I'),
  // Backend
  S('FastAPI', 'Backend & APIs', 'fa-solid fa-bolt-lightning', 'A'),
  S('JWT', 'Backend & APIs', 'fa-solid fa-key', 'I'),
  // Cloud
  S('AWS EC2', 'Cloud & DevOps', 'fa-brands fa-aws', 'I'),
  // Databases
  S('Vector Databases', 'Databases & Vector DBs', 'fa-solid fa-cubes-stacked', 'A'),
  // Tools
  S('Git', 'Developer Tools', 'fa-brands fa-git-alt', 'A'),
  S('GitHub', 'Developer Tools', 'fa-brands fa-github', 'A')
];

/* ---------- Projects (GitHub repos + curated details) ---------- */
MSR.GH_USER = 'Mohit-1307';
MSR.PROJECTS = [
  {
    repo: 'Multi-Agent-AI-Customer-Support-Assistant',
    cat: 'GenAI & Agents', icon: 'fa-solid fa-robot',
    arch: 'LangGraph supervisor routes intent → specialist agents (FAQ / order / escalation) → RAG over FAISS knowledge base → grounded LLM response with tool calls.',
    timeline: '2025 · 6 weeks',
    features: ['Multi-agent orchestration with LangGraph state machines', 'RAG grounding with Sentence Transformers + FAISS', 'Tool-calling agents for order lookup & ticket escalation', 'FastAPI backend with JWT-secured endpoints'],
    fallbackDesc: 'A production-style multi-agent customer support system powered by LLMs, LangGraph routing and retrieval-augmented answers.',
    liveUrl: 'https://techmart-ai-support.vercel.app/chat'
  },
  {
    repo: 'Facial-Emotion-Recognition-System',
    cat: 'Computer Vision', icon: 'fa-solid fa-face-smile',
    arch: 'Haar-cascade face detection → preprocessing pipeline → CNN classifier (Keras) trained on FER-style data → real-time OpenCV inference loop.',
    timeline: '2025 · 4 weeks',
    features: ['Real-time webcam emotion detection', 'Custom CNN with data augmentation', 'Class-imbalance handling & evaluation dashboards', 'Seven-emotion classification head'],
    fallbackDesc: 'Real-time facial emotion recognition using CNNs and OpenCV — detecting seven emotions from live video.',
    liveUrl: 'https://deepfer-q8kd.onrender.com/'
  },
  {
    repo: 'Shopper-Spectrum',
    cat: 'Machine Learning', icon: 'fa-solid fa-cart-shopping',
    arch: 'E-commerce transactions → RFM feature construction → K-Means segmentation + collaborative filtering recommender → Streamlit app.',
    timeline: '2025 · 3 weeks',
    features: ['RFM-based customer segmentation', 'Item-similarity product recommendations', 'Interactive Streamlit analytics app'],
    fallbackDesc: 'Customer segmentation and product recommendation system built on real e-commerce transaction data.',
    liveUrl: 'https://shopper-spectrum-app.streamlit.app/'
  },
  {
    repo: 'Flipkart-CSAT-Prediction',
    cat: 'NLP & ML', icon: 'fa-solid fa-star-half-stroke',
    arch: 'Support interaction data → text & categorical feature engineering → gradient-boosted / deep models → CSAT score prediction with drivers analysis.',
    timeline: '2025 · 3 weeks',
    features: ['Customer satisfaction driver analysis', 'Mixed text + tabular feature pipeline', 'Business-readable evaluation reporting'],
    fallbackDesc: 'Predicting customer satisfaction (CSAT) for e-commerce support interactions from behavioural and textual signals.',
    liveUrl: 'https://flipkart-csat-prediction-app.streamlit.app/'
  },
  {
    repo: 'Emotion-Recognition-from-Speech',
    cat: 'Audio & Speech', icon: 'fa-solid fa-microphone-lines',
    arch: 'Librosa feature extraction (MFCC, chroma, mel) → feature stacking → deep classifier → evaluation across speaker-independent splits.',
    timeline: '2025 · 3 weeks',
    features: ['MFCC / chroma / mel-spectrogram feature engineering', 'Speaker-independent evaluation protocol', 'Confusion-matrix driven error analysis'],
    fallbackDesc: 'Speech emotion recognition pipeline extracting acoustic features with Librosa and classifying emotional states with deep learning.'
  },
  {
    repo: 'Heart-Disease-Prediction',
    cat: 'Machine Learning', icon: 'fa-solid fa-heart-pulse',
    arch: 'Clinical dataset EDA → feature engineering & scaling → model bake-off (LogReg / RF / ensemble) → calibrated best model + explainability.',
    timeline: '2025 · 2 weeks',
    features: ['Thorough EDA with medical feature insights', 'Cross-validated model comparison', 'ROC-AUC optimized final classifier'],
    fallbackDesc: 'Clinical ML pipeline predicting heart disease risk from patient vitals with careful EDA and calibrated models.'
  },
  {
    repo: 'Handwritten-Digit-Recognition',
    cat: 'Computer Vision', icon: 'fa-solid fa-pen-nib',
    arch: 'MNIST ingestion → normalization → CNN (conv-pool stacks) → training with augmentation → interactive digit inference.',
    timeline: '2024 · 2 weeks',
    features: ['Classic CNN achieving 99%+ test accuracy', 'Training curves & misclassification gallery', 'Clean, reproducible notebook pipeline'],
    fallbackDesc: 'A convolutional neural network that reads handwritten digits — the project that started my deep learning journey.'
  },
  {
    repo: 'AI-Agents-and-RAG-Systems',
    cat: 'GenAI & Agents', icon: 'fa-solid fa-diagram-project',
    arch: 'LangChain + LangGraph experiments → embedding pipelines → FAISS vector stores → agentic RAG with OpenAI / Claude / Groq / Ollama backends.',
    timeline: '2025 · ongoing',
    features: ['Agent design patterns & tool use', 'Multi-provider LLM abstraction (OpenAI, Claude, Groq, Ollama)', 'Chunking & retrieval quality experiments'],
    fallbackDesc: 'A living lab of AI agent architectures and retrieval-augmented generation systems across multiple LLM providers.'
  },
  {
    repo: 'Interactive-Web-Apps-with-Streamlit',
    cat: 'ML Engineering', icon: 'fa-solid fa-window-restore',
    arch: 'Reusable Streamlit component patterns → data apps with caching, forms, charts → deployable ML demo templates.',
    timeline: '2024 · ongoing',
    features: ['Collection of interactive data/ML apps', 'State management & caching patterns', 'Deployment-ready app templates'],
    fallbackDesc: 'A collection of interactive Streamlit web apps turning ML models and datasets into usable products.'
  },
  {
    repo: 'Loan-Eligibility-EMI-Predict-AI',
    cat: 'Machine Learning', icon: 'fa-solid fa-sack-dollar',
    arch: 'Applicant financial data → preprocessing & feature engineering → ML classification for loan eligibility + regression for EMI estimation → interactive Streamlit app.',
    timeline: '2026',
    features: ['Loan eligibility prediction from applicant financial data', 'EMI amount estimation with regression modeling', 'Interactive Streamlit interface for real-time predictions'],
    fallbackDesc: 'An AI-powered app that predicts loan eligibility and estimates EMI amounts from applicant financial data.',
    liveUrl: 'https://loan-eligibility-and-emi-predict-ai.streamlit.app'
  }
];

/* ---------- Courses / learning timeline ---------- */
MSR.COURSES = [
  {
    repo: 'Complete-Python-Course', icon: 'fa-brands fa-python',
    title: 'Complete Python Course', period: 'Foundation',
    desc: 'From syntax to OOP, file handling, decorators and generators — the bedrock of everything I build. Fully documented with runnable examples.'
  },
  {
    repo: 'Python-Libraries', icon: 'fa-solid fa-boxes-stacked',
    title: 'Python Libraries', period: 'Data Stack',
    desc: 'Deep dives into NumPy, Pandas, Matplotlib and Seaborn — vectorization, data wrangling and visualization patterns used in every ML project since.'
  },
  {
    repo: 'Complete-Machine-Learning-Course', icon: 'fa-solid fa-brain',
    title: 'Complete Machine Learning Course', period: 'ML Mastery',
    desc: 'Supervised & unsupervised learning, feature engineering, model evaluation and end-to-end pipelines with Scikit-learn — theory annotated with working code.'
  }
];

/* ---------- Experience ---------- */
MSR.EXPERIENCE = [
  {
    role: 'AI/ML Intern', org: 'Labmentix', badge: 'Present',
    date: 'Jun 1, 2026 — Present',
    points: [
      'Building and evaluating machine-learning models on real client datasets end-to-end.',
      'Developing LLM-assisted data workflows and automation for internal AI tooling.',
      'Collaborating with senior engineers on model deployment and monitoring practices.'
    ],
    stack: ['Python', 'Scikit-learn', 'TensorFlow', 'LLMs', 'FastAPI']
  },
  {
    role: 'Machine Learning Intern', org: 'CodeAlpha', badge: 'Completed',
    date: 'Jun 1, 2026 — Jun 30, 2026',
    points: [
      'Delivered supervised-learning projects covering classification and regression tasks.',
      'Owned the full cycle: EDA, feature engineering, model selection and evaluation reports.',
      'Presented findings with clear visualizations and reproducible notebooks.'
    ],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib']
  }
];

/* ---------- Certificates ---------- */
MSR.CERTS = [
  { title: 'Oracle Certified Foundations Associate — Agentic AI', issuer: 'Oracle University', year: '2026', cat: 'ML/AI', icon: 'fa-solid fa-robot', file: 'cert-oracle-agentic-ai.pdf' },
  { title: 'Advanced Software Engineering Job Simulation', issuer: 'Walmart Global Tech · Forage', year: '2026', cat: 'Programming', icon: 'fa-solid fa-code', file: 'cert-walmart-swe.pdf' },
  { title: 'Data Visualisation: Empowering Business with Effective Insights', issuer: 'Tata · Forage', year: '2026', cat: 'Data Science', icon: 'fa-solid fa-chart-column', file: 'cert-tata-dataviz.pdf' },
  { title: 'AI/ML Internship (2 Months)', issuer: 'Labmentix', year: '2026', cat: 'Internship', icon: 'fa-solid fa-briefcase', file: 'cert-labmentix-internship.pdf' },
  { title: 'Machine Learning Internship', issuer: 'CodeAlpha', year: '2026', cat: 'Internship', icon: 'fa-solid fa-brain', file: 'cert-codealpha-internship.pdf' },
  { title: 'Data Analytics Job Simulation', issuer: 'Deloitte · Forage', year: '2026', cat: 'Data Science', icon: 'fa-solid fa-magnifying-glass-chart', file: 'cert-deloitte-data-analytics.pdf' },
  { title: 'AI for Entrepreneurs Course', issuer: 'Simplilearn', year: '2026', cat: 'ML/AI', icon: 'fa-solid fa-lightbulb', file: 'cert-simplilearn-ai-entrepreneurs.pdf' },
  { title: 'Introduction to Generative AI Studio', issuer: 'Google Cloud', year: '2026', cat: 'ML/AI', icon: 'fa-solid fa-wand-magic-sparkles', file: 'cert-googlecloud-genai-studio.pdf' },
  { title: 'Introduction to Prompt Engineering with GitHub Copilot', issuer: 'Microsoft', year: '2026', cat: 'ML/AI', icon: 'fa-brands fa-microsoft', file: 'cert-microsoft-prompt-engineering.pdf' },
  { title: 'AI Fluency for Students', issuer: 'Anthropic', year: '2026', cat: 'ML/AI', icon: 'fa-solid fa-graduation-cap', file: 'cert-anthropic-ai-fluency.pdf' }
];

/* ---------- Blog ---------- */
MSR.POSTS = [
  {
    title: 'What Building a Multi-Agent Support System Taught Me About LLM Orchestration',
    excerpt: 'Supervisor agents sound elegant on whiteboards. In practice, routing, state and failure recovery are where the real engineering lives. Here is what broke — and how I fixed it.',
    tags: ['LLMs', 'Agents', 'LangGraph'], date: 'Jul 2026', mins: 8
  },
  {
    title: 'RAG Is a Retrieval Problem Before It Is a Generation Problem',
    excerpt: 'Most bad RAG answers are bad retrieval. Chunking strategy, embedding choice and evaluation loops matter more than the model behind the prompt.',
    tags: ['RAG', 'FAISS', 'Embeddings'], date: 'Jun 2026', mins: 6
  },
  {
    title: 'Reading Emotions: CNNs for Faces vs. Features for Speech',
    excerpt: 'I built emotion recognition twice — once from pixels, once from audio. Comparing the two pipelines reveals a lot about representation learning.',
    tags: ['Computer Vision', 'Audio', 'Deep Learning'], date: 'Apr 2026', mins: 7
  },
  {
    title: 'The Unreasonable Effectiveness of Honest EDA',
    excerpt: 'Before you reach for XGBoost, stare at your data. My heart-disease model improved more from one EDA insight than from a week of hyperparameter tuning.',
    tags: ['Data Science', 'EDA', 'ML'], date: 'Feb 2026', mins: 5
  },
  {
    title: '150 LeetCode Problems Later: Patterns That Actually Transfer to ML Engineering',
    excerpt: 'Sliding windows show up in feature pipelines. Graphs show up in agent routing. DSA is not interview theatre — if you learn the patterns, not the problems.',
    tags: ['LeetCode', 'DSA', 'Career'], date: 'Jan 2026', mins: 6
  },
  {
    title: 'Deploying Models on AWS EC2 with FastAPI: A Checklist That Saved Me',
    excerpt: 'From pickled model to authenticated API in production: JWT, health checks, cold starts and the small details that decide whether your model survives contact with users.',
    tags: ['Deployment', 'FastAPI', 'AWS'], date: 'Nov 2025', mins: 9
  }
];

/* ---------- Command palette items (static part) ---------- */
MSR.CMD_SECTIONS = [
  ['Home', '#hero-section', 'fa-solid fa-house'],
  ['About', '#about-section', 'fa-solid fa-user'],
  ['Skills', '#skills-section', 'fa-solid fa-layer-group'],
  ['Projects', '#projects-section', 'fa-solid fa-cube'],
  ['Learning Trail', '#courses-section', 'fa-solid fa-graduation-cap'],
  ['LeetCode', '#leetcode-section', 'fa-solid fa-code'],
  ['Experience', '#experience-section', 'fa-solid fa-briefcase'],
  ['Achievements', '#achievements-section', 'fa-solid fa-trophy'],
  ['Certificates', '#certificates-section', 'fa-solid fa-certificate'],
  ['Contact', '#contact-section', 'fa-solid fa-paper-plane']
];
MSR.CMD_LINKS = [
  ['Open GitHub', 'https://github.com/Mohit-1307', 'fa-brands fa-github'],
  ['Open LinkedIn', 'https://www.linkedin.com/in/mohitsingh1307/', 'fa-brands fa-linkedin'],
  ['Open LeetCode', 'https://leetcode.com/u/MOHIT_SINGH_RAJPUT/', 'fa-solid fa-code'],
  ['Open Kaggle', 'https://www.kaggle.com/mohitsinghrajput1307', 'fa-brands fa-kaggle'],
  ['Open Hugging Face', 'https://huggingface.co/msr1307', 'fa-solid fa-face-smile'],
  ['Download Résumé', 'https://drive.google.com/file/d/1t6S5J91QABQ-En51T6NCdowmZBcVm9hn/view', 'fa-solid fa-file-arrow-down'],
  ['Email Me', 'mailto:mohitsinghrajput1307@gmail.com', 'fa-solid fa-envelope']
];

/* ---------- Assistant knowledge base ---------- */
MSR.BOT = {
  greeting: "Hi! I'm Mohit's portfolio assistant 🤖 Ask me about his skills, projects, experience, LeetCode grind, or how to reach him.",
  suggestions: ['What does Mohit build?', 'Top skills?', 'Experience?', 'How to contact him?'],
  rules: [
    { k: ['skill', 'stack', 'technolog', 'tools', 'know'], a: "Mohit's core stack: <strong>Python, PyTorch, TensorFlow, Scikit-learn</strong> for ML/DL; <strong>LangChain, LangGraph, FAISS</strong> for LLM & RAG systems; <strong>OpenCV, Librosa</strong> for vision & audio; and <strong>FastAPI + AWS EC2</strong> for deployment. Browse the <a href='#skills-section'>Skills section</a> for all 45+." },
    { k: ['project', 'build', 'built', 'work', 'portfolio', 'repo'], a: "He's shipped 9 AI projects — highlights: a <strong>Multi-Agent AI Customer Support Assistant</strong> (LangGraph + RAG), <strong>Facial Emotion Recognition</strong> (CNN + OpenCV), <strong>Speech Emotion Recognition</strong> (Librosa), and <strong>Heart Disease Prediction</strong>. All live in the <a href='#projects-section'>Projects section</a> with real GitHub data." },
    { k: ['experience', 'intern', 'job', 'labmentix', 'codealpha'], a: "Mohit is currently an <strong>AI/ML Intern at Labmentix</strong> (June 2026 → present) and completed a <strong>Machine Learning Internship at CodeAlpha</strong> (June 2026). Details in <a href='#experience-section'>Experience</a>." },
    { k: ['leetcode', 'dsa', 'algorithm', 'problem'], a: "He's solved <strong>500+ LeetCode problems</strong> across Easy/Medium/Hard, with solutions archived on <a href='https://github.com/Mohit-1307/LeetCode-Submissions' target='_blank' rel='noopener'>GitHub</a>. Live stats are in the <a href='#leetcode-section'>LeetCode section</a>." },
    { k: ['contact', 'email', 'reach', 'hire', 'phone', 'available'], a: "He's <strong>open to AI/ML roles</strong>! Email <a href='mailto:mohitsinghrajput1307@gmail.com'>mohitsinghrajput1307@gmail.com</a>, call +91 98879 94311, or use the <a href='#contact-section'>contact form</a>." },
    { k: ['resume', 'cv', 'résumé'], a: "Here's his résumé: <a href='resume.pdf' target='_blank' rel='noopener'>view / download PDF</a> 📄" },
    { k: ['llm', 'rag', 'agent', 'genai', 'generative', 'gpt', 'claude'], a: "GenAI is his main focus: multi-agent orchestration with <strong>LangGraph</strong>, RAG pipelines with <strong>FAISS + Sentence Transformers</strong>, and multi-provider LLM apps (OpenAI, Claude, Groq, Ollama). Check <a href='#projects-section'>AI-Agents-and-RAG-Systems</a>." },
    { k: ['vision', 'image', 'cnn', 'opencv', 'face'], a: "Computer vision work includes real-time <strong>facial emotion recognition</strong> and <strong>handwritten digit recognition</strong> with CNNs — both open-source on <a href='https://github.com/Mohit-1307' target='_blank' rel='noopener'>GitHub</a>." },
    { k: ['who', 'about', 'mohit', 'yourself', 'intro'], a: "Mohit Singh Rajput is an <strong>AI/ML Engineer</strong> who builds systems that see, listen, reason and respond — from deep-learning perception models to multi-agent LLM products. Read his story in <a href='#about-section'>About</a>." },
    { k: ['theme', 'color', 'dark', 'light'], a: "This site has 6 color themes — <strong>Signal, Violet, Crimson, Ocean, Skyblue &amp; Light</strong> — each with its own light/dark mode. Hit the 🎨 icon in the nav, or the 🌙 icon to just flip light/dark." },
    { k: ['github', 'kaggle', 'hugging', 'social', 'linkedin'], a: "Find him at <a href='https://github.com/Mohit-1307' target='_blank' rel='noopener'>GitHub</a>, <a href='https://www.linkedin.com/in/mohitsingh1307/' target='_blank' rel='noopener'>LinkedIn</a>, <a href='https://www.kaggle.com/mohitsinghrajput1307' target='_blank' rel='noopener'>Kaggle</a> and <a href='https://huggingface.co/msr1307' target='_blank' rel='noopener'>Hugging Face 🤗</a>." },
    { k: ['hello', 'hi', 'hey', 'yo'], a: "Hey there! 👋 Ask me anything about Mohit — skills, projects, experience, or how to get in touch." }
  ],
  fallback: "Great question! I know about Mohit's <strong>skills, projects, experience, LeetCode stats and contact info</strong>. Try one of those — or email him directly at <a href='mailto:mohitsinghrajput1307@gmail.com'>mohitsinghrajput1307@gmail.com</a>."
};

/* ---------- Typing effect phrases ---------- */
MSR.TYPED = [
  'AI/ML Engineer',
  'LLM & AI Agent Builder',
  'Deep Learning Practitioner',
  'Computer Vision Engineer',
  'RAG Systems Architect',
  'Data Science Storyteller'
];

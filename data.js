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

/* ---------- Skills (official logos via Simple Icons CDN + FA fallback) ---------- */
// img: Simple Icons CDN  |  icon: Font Awesome fallback
MSR.SKILLS = [
  { name: 'Python',               img: 'https://cdn.simpleicons.org/python/3776AB',      color: '#3776AB' },
  { name: 'C++',                  img: 'https://cdn.simpleicons.org/cplusplus/00599C',    color: '#00599C' },
  { name: 'Java',                 img: 'https://cdn.simpleicons.org/java/007396',          color: '#007396' },
  { name: 'JavaScript',           img: 'https://cdn.simpleicons.org/javascript/F7DF1E',   color: '#F7DF1E' },
  { name: 'HTML',                 img: 'https://cdn.simpleicons.org/html5/E34F26',         color: '#E34F26' },
  { name: 'CSS',                  img: 'https://cdn.simpleicons.org/css3/1572B6',          color: '#1572B6' },
  { name: 'SQL',                  img: 'https://cdn.simpleicons.org/mysql/4479A1',         color: '#4479A1' },
  { name: 'NumPy',                img: 'https://cdn.simpleicons.org/numpy/013243',         color: '#013243' },
  { name: 'Pandas',               img: 'https://cdn.simpleicons.org/pandas/150458',        color: '#150458' },
  { name: 'Matplotlib',           icon: 'fa-solid fa-chart-line',                          color: '#11557c' },
  { name: 'Seaborn',              icon: 'fa-solid fa-chart-area',                          color: '#4c72b0' },
  { name: 'FastAPI',              img: 'https://cdn.simpleicons.org/fastapi/009688',        color: '#009688' },
  { name: 'LangGraph',            icon: 'fa-solid fa-diagram-project',                     color: '#006b8f' },
  { name: 'LangChain',            img: 'https://cdn.simpleicons.org/langchain/1C3C3C',    color: '#1C3C3C' },
  { name: 'Computer Vision',      img: 'https://cdn.simpleicons.org/opencv/5C3EE8',        color: '#5C3EE8' },
  { name: 'TensorFlow',           img: 'https://cdn.simpleicons.org/tensorflow/FF6F00',    color: '#FF6F00' },
  { name: 'Keras',                img: 'https://cdn.simpleicons.org/keras/D00000',          color: '#D00000' },
  { name: 'Scikit-learn',         img: 'https://cdn.simpleicons.org/scikitlearn/F7931E',   color: '#F7931E' },
  { name: 'RAG',                  icon: 'fa-solid fa-database',                             color: '#006b8f' },
  { name: 'PyTorch',              img: 'https://cdn.simpleicons.org/pytorch/EE4C2C',        color: '#EE4C2C' },
  { name: 'NLP',                  icon: 'fa-solid fa-language',                             color: '#006b8f' },
  { name: 'LLM',                  icon: 'fa-solid fa-brain',                                color: '#006b8f' },
  { name: 'Deep Learning',        icon: 'fa-solid fa-network-wired',                        color: '#006b8f' },
  { name: 'Machine Learning',     img: 'https://cdn.simpleicons.org/scikitlearn/F7931E',   color: '#F7931E' },
  { name: 'Generative AI',        icon: 'fa-solid fa-wand-magic-sparkles',                  color: '#c74b1f' },
  { name: 'Artificial Intelligence', icon: 'fa-solid fa-microchip',                         color: '#006b8f' },
  { name: 'CNN',                  icon: 'fa-solid fa-sitemap',                               color: '#006b8f' }
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
    repo: 'Loan-Eligibility-and-EMI-Prediction-AI',
    cat: 'Machine Learning', icon: 'fa-solid fa-sack-dollar',
    arch: 'Applicant financial data → preprocessing & feature engineering → ML classification for loan eligibility + regression for EMI estimation → interactive Streamlit app.',
    timeline: '2026',
    features: ['Loan eligibility prediction from applicant financial data', 'EMI amount estimation with regression modeling', 'Interactive Streamlit interface for real-time predictions'],
    fallbackDesc: 'An AI-powered app that predicts loan eligibility and estimates EMI amounts from applicant financial data.',
    liveUrl: 'https://loan-eligibility-and-emi-prediction-ai.streamlit.app/'
  },
  {
    repo: 'Tourism-Experience-Analytics-System',
    cat: 'Machine Learning', icon: 'fa-solid fa-earth-asia',
    arch: 'Tourism dataset → EDA & feature engineering → ML models for experience prediction → interactive Streamlit analytics dashboard.',
    timeline: '2025',
    features: ['Tourism experience prediction from visitor data', 'Comprehensive EDA with tourism feature insights', 'Interactive Streamlit analytics dashboard', 'Multi-model comparison and evaluation'],
    fallbackDesc: 'An analytics system for predicting and understanding tourism experiences using machine learning.',
    liveUrl: 'https://tourism-experience-analytics-system.streamlit.app/'
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
    repo: 'Interactive-Web-Apps-with-Streamlit',
    cat: 'ML Engineering', icon: 'fa-solid fa-window-restore',
    arch: 'Reusable Streamlit component patterns → data apps with caching, forms, charts → deployable ML demo templates.',
    timeline: '2024 · ongoing',
    features: ['Collection of interactive data/ML apps', 'State management & caching patterns', 'Deployment-ready app templates'],
    fallbackDesc: 'A collection of interactive Streamlit web apps turning ML models and datasets into usable products.'
  },
  {
    repo: 'AI-Agents-and-RAG-Systems',
    cat: 'GenAI & Agents', icon: 'fa-solid fa-diagram-project',
    arch: 'LangChain + LangGraph experiments → embedding pipelines → FAISS vector stores → agentic RAG with OpenAI / Claude / Groq / Ollama backends.',
    timeline: '2025 · ongoing',
    features: ['Agent design patterns & tool use', 'Multi-provider LLM abstraction (OpenAI, Claude, Groq, Ollama)', 'Chunking & retrieval quality experiments'],
    fallbackDesc: 'A living lab of AI agent architectures and retrieval-augmented generation systems across multiple LLM providers.'
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
  /* 1. AI/ML Internship */
  { title: 'AI/ML Internship (3 Months)', issuer: 'Labmentix', year: '2026', cat: 'Internship',
    desc: 'Built and evaluated ML models on real client datasets; developed LLM-assisted data workflows end-to-end.',
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="52" height="52"><rect width="200" height="200" rx="32" fill="#0d1b2a"/><path d="M40 140 L100 60 L160 140 Z" fill="none" stroke="#00c8ff" stroke-width="10" stroke-linejoin="round"/><circle cx="100" cy="60" r="10" fill="#00c8ff"/><circle cx="40" cy="140" r="10" fill="#00c8ff"/><circle cx="160" cy="140" r="10" fill="#00c8ff"/><text x="100" y="170" text-anchor="middle" fill="#00c8ff" font-size="18" font-family="sans-serif" font-weight="bold">LBX</text></svg>`,
    file: 'Labmentix_Certificate_for_Internship.pdf' },

  /* 2. Machine Learning Internship */
  { title: 'Machine Learning Internship', issuer: 'CodeAlpha', year: '2026', cat: 'Internship',
    desc: 'Completed ML projects in classification, regression, and deep learning under industry mentorship.',
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="52" height="52"><rect width="200" height="200" rx="32" fill="#1a1a2e"/><circle cx="100" cy="80" r="36" fill="none" stroke="#c74b1f" stroke-width="9"/><circle cx="100" cy="80" r="18" fill="#c74b1f"/><text x="100" y="155" text-anchor="middle" fill="#c74b1f" font-size="20" font-family="sans-serif" font-weight="bold">CA</text></svg>`,
    file: 'cert-codealpha-internship.pdf' },

  /* 3. Oracle Certified Foundations Associate — Agentic AI */
  { title: 'Oracle Certified Foundations Associate — Agentic AI', issuer: 'Oracle University', year: '2026', cat: 'ML/AI',
    desc: 'Covered agentic AI system design, multi-agent architectures, and Oracle Cloud AI foundations.',
    img: 'https://cdn.simpleicons.org/oracle/F80000', file: 'cert-oracle-agentic-ai.pdf' },

  /* 4. Deloitte Australia Data Analytics Job Simulation */
  { title: 'Data Analytics Job Simulation', issuer: 'Deloitte Australia · Forage', year: '2026', cat: 'Data Science',
    desc: 'Analysed datasets and created dashboards for a Deloitte client, covering forensic tech and data interpretation.',
    img: 'https://cdn.simpleicons.org/deloitte/86BC25', file: 'cert-deloitte-data-analytics.pdf' },

  /* 5. Tata Group Data Analytics Job Simulation */
  { title: 'GenAI Powered Data Analytics Job Simulation', issuer: 'Tata Group · Forage', year: '2026', cat: 'Data Science',
    desc: 'Applied GenAI to EDA, risk profiling, delinquency prediction, and AI-driven collections strategy for a Tata simulation.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg', file: 'TCS_Certificate_for_GenAI_Powered_Data_Analytics.pdf' },

  /* 6. Walmart USA Advanced Software Engineering */
  { title: 'Advanced Software Engineering Job Simulation', issuer: 'Walmart Global Tech · Forage', year: '2026', cat: 'Programming',
    desc: 'Worked on real Walmart engineering tasks including data structures, system design, and software architecture.',
    img: 'https://cdn.simpleicons.org/walmart/0071CE', file: 'cert-walmart-swe.pdf' },

  /* 7. AWS APAC Solutions Architecture */
  { title: 'Solutions Architecture Job Simulation', issuer: 'AWS · Forage', year: '2026', cat: 'Programming',
    desc: 'Designed AWS cloud architectures to meet client needs; evaluated and presented solution recommendations.',
    img: 'https://cdn.simpleicons.org/amazonaws/FF9900', file: 'Forage_Certificate_for_Solutions_Architecture.pdf' },

  /* 8. Tata Data Visualization */
  { title: 'Data Visualisation: Empowering Business with Effective Insights', issuer: 'Tata · Forage', year: '2026', cat: 'Data Science',
    desc: 'Created executive-level data visualisations and business insights for a Tata client scenario.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg', file: 'cert-tata-dataviz.pdf' },

  /* 9. Datacom Partnering with AI */
  { title: 'Partnering with AI in the Workplace Job Simulation', issuer: 'Datacom · Forage', year: '2026', cat: 'ML/AI',
    desc: 'Practised effective prompting, AI-assisted research and design, and AI-powered debugging workflows.',
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="52" height="52"><rect width="200" height="200" rx="32" fill="#003087"/><rect x="30" y="70" width="50" height="60" rx="8" fill="#fff"/><rect x="95" y="50" width="50" height="60" rx="8" fill="#fff" opacity="0.85"/><rect x="120" y="100" width="50" height="60" rx="8" fill="#fff" opacity="0.7"/><text x="100" y="185" text-anchor="middle" fill="#fff" font-size="16" font-family="sans-serif" font-weight="bold">DATACOM</text></svg>`,
    file: 'DATACOM_Certificate_for_Partnering_with_AI_in_the_workplace.pdf' },

  /* 10. AI Fluency for Students */
  { title: 'AI Fluency for Students', issuer: 'Anthropic', year: '2026', cat: 'ML/AI',
    desc: 'Gained foundational fluency in AI concepts, responsible AI use, and working effectively with large language models.',
    img: 'https://cdn.simpleicons.org/anthropic/181818', file: 'cert-anthropic-ai-fluency.pdf' },

  /* 11. Introduction to Generative AI Studio */
  { title: 'Introduction to Generative AI Studio', issuer: 'Google Cloud', year: '2026', cat: 'ML/AI',
    desc: 'Hands-on with Google Cloud Vertex AI and Generative AI Studio — prompt design, model tuning, and deployment.',
    img: 'https://cdn.simpleicons.org/googlecloud/4285F4', file: 'cert-googlecloud-genai-studio.pdf' },

  /* 12. Introduction to Prompt Engineering with GitHub Copilot */
  { title: 'Introduction to Prompt Engineering with GitHub Copilot', issuer: 'Microsoft', year: '2026', cat: 'ML/AI',
    desc: 'Learned prompt engineering techniques using GitHub Copilot to accelerate development workflows.',
    img: 'https://cdn.simpleicons.org/microsoft/0078D4', file: 'cert-microsoft-prompt-engineering.pdf' },

  /* 13. AI for Entrepreneurs Course */
  { title: 'AI for Entrepreneurs Course', issuer: 'Simplilearn', year: '2026', cat: 'ML/AI',
    desc: 'Explored AI strategy, business use cases, and implementation approaches for entrepreneurial ventures.',
    img: 'https://cdn.simpleicons.org/simplilearn/02A0C8', file: 'cert-simplilearn-ai-entrepreneurs.pdf' },
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

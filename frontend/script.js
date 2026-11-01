import DOMPurify from 'dompurify';
import { marked } from 'marked';

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const clearChatButton = document.getElementById('clearChat');
const downloadResumeButton = document.getElementById('downloadResume');
const mainPanelTitle = document.querySelector('.topbar h2');
const jobDescriptionUpload = document.getElementById('jobDescriptionUpload');
const uploadStatus = document.getElementById('uploadStatus');
const fileLabel = document.getElementById('fileLabel');
const matchScore = document.getElementById('matchScore');
const scoreValue = document.getElementById('scoreValue');
const matchSummary = document.getElementById('matchSummary');
const moreDetailsButton = document.getElementById('moreDetailsButton');
const chatPanel = document.getElementById('chatPanel');
const experienceProjectsPage = document.getElementById('experienceProjectsPage');
const skillsPage = document.getElementById('skillsPage');
const contactPage = document.getElementById('contactPage');
const detailPage = document.getElementById('detailPage');
const detailBackButton = document.getElementById('detailBackButton');
const detailEyebrow = document.getElementById('detailEyebrow');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailDescription = document.getElementById('detailDescription');
const detailTags = document.getElementById('detailTags');
const detailList = document.getElementById('detailList');
const detailExtraSection = document.getElementById('detailExtraSection');
const compatibilityPanel = document.getElementById('compatibilityPanel');
const insightsPanel = document.querySelector('.insights-panel');
const contentGrid = document.querySelector('.content-grid');
const sidebarNavButtons = document.querySelectorAll('.nav-item');
const backToConversationButton = document.getElementById('backToConversation');
const analysisTitle = document.getElementById('analysisTitle');
const analysisMeta = document.getElementById('analysisMeta');
const analysisMatchScore = document.getElementById('analysisMatchScore');
const analysisOverallAssessment = document.getElementById('analysisOverallAssessment');
const matchingSkillsList = document.getElementById('matchingSkillsList');
const missingSkillsList = document.getElementById('missingSkillsList');
const preferredSkillsList = document.getElementById('preferredSkillsList');
const relevantExperienceList = document.getElementById('relevantExperienceList');
const relevantProjectsList = document.getElementById('relevantProjectsList');
const strengthsList = document.getElementById('strengthsList');
const areasToImproveList = document.getElementById('areasToImproveList');
const analysisRecommendation = document.getElementById('analysisRecommendation');
const suggestionButtons = document.querySelectorAll('.suggestion-pill');
const apiBaseUrl = (() => {
  const browserHost = window.location.hostname || '127.0.0.1';
  const backendHost = browserHost === 'localhost' ? '127.0.0.1' : browserHost;
  return `http://${backendHost}:8000`;
})();
const jdUploadUrl = `${apiBaseUrl}/analyze-jd`;

async function uploadJobDescription(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(jdUploadUrl, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to upload job description.');
  }

  return data;
}

const extractedJobDescription = {
  data: null,
};

const chatEndpointUrl = `${apiBaseUrl}/chat`;

function safeMarkdownToHtml(markdownText = '') {
  const trimmed = String(markdownText ?? '').trim();
  if (!trimmed) {
    return '<p></p>';
  }

  const parsedHtml = marked.parse(trimmed, {
    gfm: true,
    breaks: true,
    headerIds: false,
    mangle: false,
    smartypants: false,
  });

  return DOMPurify.sanitize(String(parsedHtml), {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'br', 'code', 'del', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'hr', 'i', 'li', 'ol', 'p', 'pre', 'strong', 'ul'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'title'],
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'img'],
    FORBID_ATTR: ['srcdoc', 'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'style'],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}

function finalizeMarkdownBubble(typingRow, markdownText) {
  const bubble = typingRow?.querySelector('.message-bubble');
  if (!bubble) {
    return;
  }

  bubble.classList.add('markdown-bubble');
  bubble.innerHTML = safeMarkdownToHtml(markdownText);

  if (!bubble.textContent.trim()) {
    bubble.innerHTML = '<p></p>';
  }
}

let chatHistory = [
  {
    role: 'assistant',
    content: 'Hi, I’m Saran’s portfolio assistant. I can tell you about his experience, projects, engineering strengths, and how well his profile aligns with a role. Ask me anything.'
  }
];

const chatState = {
  isLoading: false,
};

const defaultHistory = [
  'Portfolio overview',
  'Skills match',
  'Project roadmap',
];

const defaultCompatibility = {
  match_score: 0,
  overall_assessment: 'Upload a JD to generate a real compatibility result.',
  matching_skills: [],
  missing_skills: [],
  preferred_skills_matched: [],
  relevant_experience: [],
  relevant_projects: [],
  strengths: [],
  areas_to_improve: [],
  recommendation: ''
};

const resumeProfile = {
  name: 'Saran S',
  summary: 'Integrated M.Tech Software Engineering student with hands-on experience in software development, full-stack applications, and REST API integration. Strong foundation in Python, Java, Data Structures & Algorithms, and object-oriented programming.',
  email: 'saranssk2005@gmail.com',
  phone: '+91 93453 22607',
  linkedin: 'linkedin.com/in/sarannssk',
  github: 'github.com/Saran-SSK',
  skills: [
    {
      title: 'Programming Languages',
      items: ['Python', 'Java', 'JavaScript', 'SQL']
    },
    {
      title: 'Core CS',
      items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Database Management Systems']
    },
    {
      title: 'Web & Backend',
      items: ['REST APIs', 'FastAPI', 'Next.js', 'PostgreSQL', 'MySQL']
    },
    {
      title: 'Data & AI',
      items: ['Pandas', 'NumPy', 'Scikit-learn', 'XGBoost', 'RAG', 'Embeddings']
    },
    {
      title: 'Tools & Practices',
      items: ['Git', 'GitHub', 'Agile/Scrum', 'SDLC']
    }
  ],
  education: [
    'M.Tech Integrated – Software Engineering | 7.79/10 CGPA (2022 – 2027)',
    'Vellore Institute of Technology, Chennai',
    '12th – HSC | 92.33% (2021 – 2022)',
    'Dr. Natarajan Matriculation Higher Secondary School',
    '10th – SSC | 99.8% (2019 – 2020)',
    'Dr. Natarajan Matriculation Higher Secondary School'
  ],
  experiences: [
    {
      company: 'ASP RCM Solutions Pvt. Ltd.',
      role: 'Software Development Intern',
      duration: 'June 2025 – July 2025',
      description: 'Developed responsive frontend components for a data-driven application, integrated REST APIs, optimized SQL queries, and designed reusable UI components to improve maintainability and efficiency.',
      skills: ['REST APIs', 'SQL', 'Frontend Development']
    }
  ],
  projects: [
    {
      title: 'AI-Powered Equity Analysis Platform',
      description: 'Built a full-stack platform for company analysis, portfolio tracking, and investment research with a RAG chatbot for context-aware recommendations and user-facing dashboards.',
      stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Gemini AI', 'Qdrant']
    },
    {
      title: 'Adaptive SQL Query Performance Predictor',
      description: 'Processed historical SQL execution logs, engineered query-level features, and trained an XGBoost model to predict slow-running queries and support performance optimization.',
      stack: ['Python', 'PostgreSQL', 'XGBoost', 'Pandas', 'NumPy']
    },
    {
      title: 'Loan Default Risk Prediction System',
      description: 'Developed a machine learning pipeline to classify loan default risk using financial features and logistic regression for prediction.',
      stack: ['Python', 'Pandas', 'NumPy', 'Logistic Regression', 'FastAPI']
    }
  ]
};

const uiState = {
  currentView: 'conversation',
  compatibilityData: null,
  isLoading: false,  detailType: null,
  detailIndex: null,};

const mockResponses = {
  experience: 'Saran has hands-on experience building full-stack applications, REST APIs, and data-driven product workflows. He has worked on backend systems, database performance optimization, and UI development with a strong focus on practical engineering and measurable impact.',
  projects: 'His recent work includes an AI-powered equity analysis platform, adaptive SQL performance prediction, and loan default risk modeling. These projects highlight his ability to combine backend engineering, ML workflows, and product thinking into real-world solutions.',
  skills: 'His strongest strengths are Python, Java, JavaScript, SQL, REST APIs, FastAPI, Next.js, PostgreSQL, data analysis, and applied AI/ML workflows. He is comfortable working across backend logic, product implementation, and analytical problem solving.',
  backend: 'Saran is especially strong in backend engineering and data-backed application development. He is comfortable with Python, FastAPI, REST APIs, databases, and scalable system design with a clear understanding of performance and maintainability.',
  ai: 'He has applied AI and ML experience in RAG, embeddings, predictive modeling, and data-driven analytics. His work typically blends software engineering with practical machine learning and product-oriented execution.',
  contact: 'Saran is open to entry-level software engineering and AI-focused opportunities. He is available for internships, collaborative product roles, and learning-driven work where he can grow quickly.',
  default: 'Saran brings a strong mix of engineering depth, analytical thinking, and product execution. The short version is that he is a motivated builder who can contribute across backend, data, AI, and full-stack delivery work.'
};

function getResponseFromPrompt(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes('experience') || text.includes('background') || text.includes('bio')) {
    return mockResponses.experience;
  }

  if (text.includes('project') || text.includes('portfolio')) {
    return mockResponses.projects;
  }

  if (text.includes('skill') || text.includes('strength') || text.includes('expertise')) {
    return mockResponses.skills;
  }

  if (text.includes('backend') || text.includes('api') || text.includes('system')) {
    return mockResponses.backend;
  }

  if (text.includes('ai') || text.includes('llm') || text.includes('machine learning')) {
    return mockResponses.ai;
  }

  if (text.includes('contact') || text.includes('hiring') || text.includes('remote') || text.includes('available')) {
    return mockResponses.contact;
  }

  return mockResponses.default;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function autoResizeChatInput() {
  if (!chatInput) {
    return;
  }

  chatInput.style.height = 'auto';
  const nextHeight = Math.min(chatInput.scrollHeight, 120);
  chatInput.style.height = `${nextHeight}px`;
}

function createMessageRow(role, content) {
  const row = document.createElement('div');
  row.className = `message-row ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'assistant' ? 'AI' : 'You';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const text = document.createElement('p');
  text.textContent = content;
  bubble.appendChild(text);

  if (role === 'assistant') {
    row.appendChild(avatar);
    row.appendChild(bubble);
  } else {
    row.appendChild(bubble);
    row.appendChild(avatar);
  }

  return row;
}

function addMessage(role, content) {
  const row = createMessageRow(role, content);
  chatMessages.appendChild(row);
  scrollToBottom();
}

function showTypingIndicator() {
  const row = document.createElement('div');
  row.className = 'message-row assistant';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble typing-bubble';

  const dot1 = document.createElement('span');
  dot1.className = 'dot';
  const dot2 = document.createElement('span');
  dot2.className = 'dot';
  const dot3 = document.createElement('span');
  dot3.className = 'dot';

  bubble.append(dot1, dot2, dot3);
  row.append(avatar, bubble);
  chatMessages.appendChild(row);
  scrollToBottom();

  return row;
}

function removeTypingIndicator() {
  const typingRow = chatMessages.querySelector('.typing-bubble')?.closest('.message-row');
  if (typingRow) {
    typingRow.remove();
  }
}

function updateHistoryEntry(text) {
  const historyList = document.getElementById('conversationHistory');
  if (!historyList) {
    return;
  }

  const existing = historyList.querySelectorAll('.history-item');

  if (!existing.length) {
    defaultHistory.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = '<span class="history-dot"></span><span>' + item + '</span>';
      historyList.appendChild(li);
    });
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  const items = Array.from(historyList.querySelectorAll('.history-item'));
  const match = items.find((item) => item.textContent.trim().toLowerCase() === trimmed.toLowerCase());

  if (!match) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = '<span class="history-dot"></span><span>' + trimmed + '</span>';
    historyList.prepend(li);
  }

  items.forEach((item) => item.classList.remove('active'));
  const newest = historyList.querySelector('.history-item');
  if (newest) {
    newest.classList.add('active');
  }
}

function buildChatRequestPayload() {
  const messages = chatHistory
    .filter((message) => message && message.content && message.content.trim().length > 0)
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));

  return {
    messages,
    job_description: extractedJobDescription.data || null,
    compatibility: uiState.compatibilityData || null,
  };
}

function renderAssistantTextRow(typingRow) {
  const typingBubble = typingRow.querySelector('.typing-bubble');
  if (!typingBubble) {
    return null;
  }

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  const text = document.createElement('p');
  bubble.appendChild(text);
  typingRow.replaceChild(bubble, typingBubble);
  return text;
}

async function sendMessage(prompt) {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt || chatState.isLoading) {
    return;
  }

  chatState.isLoading = true;
  if (chatInput) {
    chatInput.disabled = true;
  }
  if (chatForm) {
    const sendButton = chatForm.querySelector('button[type="submit"]');
    if (sendButton) {
      sendButton.disabled = true;
    }
  }

  addMessage('user', trimmedPrompt);
  updateHistoryEntry(trimmedPrompt);
  chatHistory.push({ role: 'user', content: trimmedPrompt });

  const typingRow = showTypingIndicator();
  const assistantPlaceholder = { role: 'assistant', content: '' };
  chatHistory.push(assistantPlaceholder);

  let assistantTextNode = null;
  let streamingText = '';

  try {
    const response = await fetch(chatEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildChatRequestPayload()),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.detail || 'The portfolio assistant could not respond.');
    }

    if (!response.body) {
      throw new Error('The assistant stream is unavailable.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let firstChunkReceived = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      for (const chunk of chunks) {
        const lines = chunk
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        let dataText = '';
        for (const line of lines) {
          if (line.startsWith('data:')) {
            dataText += line.slice(5).trim();
          }
        }

        if (!dataText) {
          continue;
        }

        if (dataText === '[DONE]') {
          continue;
        }

        try {
          const parsed = JSON.parse(dataText);
          const delta = parsed.delta || parsed.content || '';

          if (!delta) {
            continue;
          }

          if (!firstChunkReceived) {
            assistantTextNode = renderAssistantTextRow(typingRow);
            firstChunkReceived = true;
          }

          streamingText += delta;
          if (assistantTextNode) {
            assistantTextNode.textContent = streamingText;
          }
          if (chatHistory[chatHistory.length - 1]?.role === 'assistant') {
            chatHistory[chatHistory.length - 1].content = streamingText;
          }
          scrollToBottom();
        } catch (error) {
          // Ignore malformed stream fragments and continue accepting valid payloads.
        }
      }
    }

    if (!firstChunkReceived) {
      const fallbackResponse = getResponseFromPrompt(trimmedPrompt);
      assistantTextNode = renderAssistantTextRow(typingRow);
      if (assistantTextNode) {
        assistantTextNode.textContent = fallbackResponse;
      }
      streamingText = fallbackResponse;
      if (chatHistory[chatHistory.length - 1]?.role === 'assistant') {
        chatHistory[chatHistory.length - 1].content = fallbackResponse;
      }
    }

    if (streamingText.trim()) {
      finalizeMarkdownBubble(typingRow, streamingText);
    }
  } catch (error) {
    const fallbackMessage = error.message || 'Sorry, I could not generate a response right now.';
    if (typingRow) {
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      const text = document.createElement('p');
      text.textContent = fallbackMessage;
      bubble.appendChild(text);
      const typingBubble = typingRow.querySelector('.typing-bubble');
      if (typingBubble) {
        typingRow.replaceChild(bubble, typingBubble);
      } else {
        typingRow.appendChild(bubble);
      }
    }
    if (chatHistory[chatHistory.length - 1]?.role === 'assistant') {
      chatHistory[chatHistory.length - 1].content = fallbackMessage;
    }
  } finally {
    chatState.isLoading = false;
    if (chatInput) {
      chatInput.disabled = false;
      chatInput.focus();
      chatInput.value = '';
    }
    if (chatForm) {
      const sendButton = chatForm.querySelector('button[type="submit"]');
      if (sendButton) {
        sendButton.disabled = false;
      }
    }
    scrollToBottom();
  }
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (chatState.isLoading) {
    return;
  }

  const value = chatInput.value;
  sendMessage(value);
});

chatInput.addEventListener('input', () => {
  autoResizeChatInput();
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (!chatState.isLoading) {
      chatForm.requestSubmit();
      setTimeout(() => {
        chatInput.style.height = 'auto';
      }, 0);
    }
  }
});

autoResizeChatInput();

suggestionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const text = button.textContent.trim();
    sendMessage(text);
  });
});

clearChatButton.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  chatHistory = [
    {
      role: 'assistant',
      content: 'Hi, I’m Saran’s portfolio assistant. I can tell you about his experience, projects, engineering strengths, and how well his profile aligns with a role. Ask me anything.'
    }
  ];
  const welcomeRow = createMessageRow(
    'assistant',
    'Hi, I’m Saran’s portfolio assistant. I can tell you about his experience, projects, engineering strengths, and how well his profile aligns with a role. Ask me anything.'
  );
  chatMessages.appendChild(welcomeRow);

  const historyList = document.getElementById('conversationHistory');
  if (!historyList) {
    return;
  }

  historyList.innerHTML = '';
  defaultHistory.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    if (item === defaultHistory[0]) {
      li.classList.add('active');
    }
    li.innerHTML = '<span class="history-dot"></span><span>' + item + '</span>';
    historyList.appendChild(li);
  });
});

downloadResumeButton.addEventListener('click', () => {
  const resumeUrl = `${apiBaseUrl}/data/Saran_S.pdf`;
  const link = document.createElement('a');
  link.href = resumeUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function renderTagList(container, items, emptyMessage) {
  if (!container) {
    return;
  }

  if (!items || !items.length) {
    container.innerHTML = `<span class="empty-state-inline">${emptyMessage}</span>`;
    return;
  }

  container.innerHTML = items
    .map((item) => `<span class="tag">${item}</span>`)
    .join('');
}

function renderList(container, items, emptyMessage) {
  if (!container) {
    return;
  }

  if (!items || !items.length) {
    container.innerHTML = `<li class="empty-state-inline">${emptyMessage}</li>`;
    return;
  }

  container.innerHTML = items
    .map((item) => `<li>${item}</li>`)
    .join('');
}

function updateCompatibilityView(data = defaultCompatibility) {
  const payload = data && typeof data === 'object' ? data : defaultCompatibility;
  const score = Number(payload.match_score ?? 0);
  const jobTitle = payload.job_title || 'Role';
  const company = payload.company || 'Company not specified';

  analysisTitle.textContent = 'Role Match';
  if (analysisMatchScore) {
    analysisMatchScore.textContent = `${score}%`;
  }
  analysisMeta.textContent = `${jobTitle} • ${company}`;
  analysisOverallAssessment.textContent = payload.overall_assessment || defaultCompatibility.overall_assessment;

  renderTagList(matchingSkillsList, payload.matching_skills || [], 'No matching skills identified.');
  renderTagList(missingSkillsList, payload.missing_skills || [], 'No missing required skills identified.', true);
  renderTagList(preferredSkillsList, payload.preferred_skills_matched || [], 'No preferred skills matched.');
  renderList(relevantExperienceList, payload.relevant_experience || [], 'No relevant experience evidence available.');
  renderList(relevantProjectsList, payload.relevant_projects || [], 'No relevant projects identified.');
  renderList(strengthsList, payload.strengths || [], 'No strengths identified.');
  renderList(areasToImproveList, payload.areas_to_improve || [], 'No clear gaps identified.');
  analysisRecommendation.textContent = payload.recommendation || 'No recommendation available.';
}

function renderNoCompatibilityState() {
  const emptyPrompt = 'Upload job description to do compatibility check.';

  analysisTitle.textContent = 'Role Match';
  analysisMeta.textContent = emptyPrompt;
  analysisOverallAssessment.textContent = emptyPrompt;
  if (analysisMatchScore) {
    analysisMatchScore.textContent = '—';
  }
  renderTagList(matchingSkillsList, [], 'No matching skills identified.');
  renderTagList(missingSkillsList, [], 'No missing required skills identified.', true);
  renderTagList(preferredSkillsList, [], 'No preferred skills matched.');
  renderList(relevantExperienceList, [], 'No relevant experience evidence available.');
  renderList(relevantProjectsList, [], 'No relevant projects identified.');
  renderList(strengthsList, [], 'No strengths identified.');
  renderList(areasToImproveList, [], 'No clear gaps identified.');
  analysisRecommendation.textContent = emptyPrompt;
}

function updateCompatibility(data = defaultCompatibility, loading = false) {
  if (loading) {
    matchScore.textContent = '…';
    scoreValue.textContent = '…';
    matchSummary.textContent = 'Analyzing the candidate against the uploaded job description...';
    moreDetailsButton.disabled = true;
    moreDetailsButton.textContent = 'Analyzing...';
    return;
  }

  const payload = data && typeof data === 'object' ? data : defaultCompatibility;
  const score = Number(payload.match_score ?? 0);
  const summary = payload.overall_assessment || defaultCompatibility.overall_assessment;

  matchScore.textContent = `${score}%`;
  scoreValue.textContent = score;
  matchSummary.textContent = summary;

  const hasData = Boolean(payload.match_score || payload.overall_assessment || payload.recommendation || payload.matching_skills?.length || payload.missing_skills?.length || payload.relevant_experience?.length || payload.relevant_projects?.length);
  moreDetailsButton.disabled = !hasData;
  moreDetailsButton.textContent = hasData ? 'More details' : 'Upload JD to unlock';

  if (!hasData) {
    renderNoCompatibilityState();
    return;
  }

  updateCompatibilityView(payload);
}

function updateSidebarState(view) {
  const normalized = view === 'conversation' ? 'overview' : view;

  sidebarNavButtons.forEach((button) => {
    const isActive = button.dataset.view === normalized;
    button.classList.toggle('active', isActive);
  });
}

function renderExperiencePage() {
  if (!experienceProjectsPage) {
    return;
  }

  const experienceList = document.getElementById('experienceList');
  const projectList = document.getElementById('projectList');

  if (experienceList) {
    experienceList.innerHTML = resumeProfile.experiences
      .map(
        (item, index) => `
          <button class="info-card item-card" type="button" data-type="experience" data-index="${index}">
            <div class="card-topline">
              <div>
                <h4>${item.role}</h4>
                <p class="company-name">${item.company}</p>
              </div>
              <span class="pill">${item.duration}</span>
            </div>
          </button>
        `
      )
      .join('');

    experienceList.querySelectorAll('.item-card').forEach((card) => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        const index = Number(card.dataset.index);
        openDetailView(type, index);
      });
    });
  }

  if (projectList) {
    projectList.innerHTML = resumeProfile.projects
      .map(
        (item, index) => `
          <button class="info-card item-card" type="button" data-type="project" data-index="${index}">
            <h4>${item.title}</h4>
          </button>
        `
      )
      .join('');

    projectList.querySelectorAll('.item-card').forEach((card) => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        const index = Number(card.dataset.index);
        openDetailView(type, index);
      });
    });
  }
}

function openDetailView(type, index) {
  uiState.detailType = type;
  uiState.detailIndex = index;
  setView('detail');
  renderDetailView();
}

function renderDetailView() {
  if (!detailPage || uiState.detailType === null || uiState.detailIndex === null) {
    return;
  }

  const type = uiState.detailType;
  const index = uiState.detailIndex;

  if (type === 'experience') {
    const item = resumeProfile.experiences[index];
    if (!item) {
      return;
    }

    detailEyebrow.textContent = 'Professional experience';
    detailTitle.textContent = item.role;
    detailMeta.textContent = `${item.company} • ${item.duration}`;
    detailDescription.textContent = item.description;
    detailTags.innerHTML = item.skills.map((skill) => `<span class="tag">${skill}</span>`).join('');
    detailExtraSection.style.display = 'block';
    detailList.innerHTML = [
      item.company,
      item.duration,
      item.description,
      ...item.skills
    ]
      .map((line) => `<li>${line}</li>`)
      .join('');
  }

  if (type === 'project') {
    const item = resumeProfile.projects[index];
    if (!item) {
      return;
    }

    detailEyebrow.textContent = 'Featured project';
    detailTitle.textContent = item.title;
    detailMeta.textContent = item.stack.join(' • ');
    detailDescription.textContent = item.description;
    detailTags.innerHTML = item.stack.map((skill) => `<span class="tag">${skill}</span>`).join('');
    detailExtraSection.style.display = 'block';
    detailList.innerHTML = [
      item.title,
      ...item.stack,
      item.description
    ]
      .map((line) => `<li>${line}</li>`)
      .join('');
  }
}

function renderSkillsPage() {
  const container = document.getElementById('skillsGrid');
  if (!container) {
    return;
  }

  container.innerHTML = resumeProfile.skills
    .map(
      (group) => `
        <div class="skill-block">
          <h3>${group.title}</h3>
          <div class="tag-row">
            ${group.items.map((item) => `<span class="tag">${item}</span>`).join('')}
          </div>
        </div>
      `
    )
    .join('');
}

function renderContactPage() {
  const container = document.getElementById('contactInfo');
  if (!container) {
    return;
  }

  const contactItems = [
    { label: 'Email', value: resumeProfile.email, href: `mailto:${resumeProfile.email}` },
    { label: 'Phone', value: resumeProfile.phone, href: `tel:${resumeProfile.phone.replace(/\s+/g, '')}` },
    { label: 'LinkedIn', value: resumeProfile.linkedin, href: `https://${resumeProfile.linkedin}` },
    { label: 'GitHub', value: resumeProfile.github, href: `https://${resumeProfile.github}` }
  ];

  container.innerHTML = `
    <div class="profile-summary">
      <h3>${resumeProfile.name}</h3>
      <p>${resumeProfile.summary}</p>
    </div>
    <div class="contact-list">
      ${contactItems
        .map(
          (item) => `
            <a class="contact-item" href="${item.href}" target="_blank" rel="noreferrer">
              <span class="contact-label">${item.label}</span>
              <span class="contact-value">${item.value}</span>
            </a>
          `
        )
        .join('')}
    </div>
  `;
}

function setView(view) {
  uiState.currentView = view;
  const normalized = view === 'conversation' ? 'overview' : view;
  const showCompatibility = normalized === 'compatibility';
  const showOverview = normalized === 'overview';
  const showExperience = normalized === 'experience-projects';
  const showSkills = normalized === 'skills';
  const showContact = normalized === 'contact';
  const showDetail = view === 'detail';

  if (showCompatibility && !uiState.compatibilityData && !uiState.isLoading) {
    renderNoCompatibilityState();
  }

  chatPanel.classList.toggle('hidden', !showOverview);
  experienceProjectsPage.classList.toggle('hidden', !showExperience);
  skillsPage.classList.toggle('hidden', !showSkills);
  contactPage.classList.toggle('hidden', !showContact);
  detailPage.classList.toggle('hidden', !showDetail);
  compatibilityPanel.classList.toggle('hidden', !showCompatibility);

  if (insightsPanel) {
    insightsPanel.classList.toggle('hidden', !showOverview);
  }

  if (contentGrid) {
    contentGrid.classList.toggle('full-width', !showOverview);
  }

  if (mainPanelTitle) {
    if (showCompatibility) {
      mainPanelTitle.textContent = 'AI Recruiter Assistant';
    } else if (showExperience) {
      mainPanelTitle.textContent = 'Experience & Projects';
    } else if (showSkills) {
      mainPanelTitle.textContent = 'Skills';
    } else if (showContact) {
      mainPanelTitle.textContent = 'Contact';
    } else if (showDetail) {
      mainPanelTitle.textContent = uiState.detailType === 'project' ? 'Project details' : 'Experience details';
    } else {
      mainPanelTitle.textContent = 'Portfolio conversation';
    }
  }

  if (showDetail) {
    renderDetailView();
  }

  updateSidebarState(normalized);
}

backToConversationButton.addEventListener('click', () => {
  setView('conversation');
});

detailBackButton.addEventListener('click', () => {
  uiState.detailType = null;
  uiState.detailIndex = null;
  setView('experience-projects');
});

moreDetailsButton.addEventListener('click', () => {
  if (uiState.isLoading) {
    return;
  }

  if (!uiState.compatibilityData) {
    renderNoCompatibilityState();
  }

  setView('compatibility');
});

sidebarNavButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const view = button.dataset.view;

    if (view === 'compatibility') {
      setView('compatibility');
      return;
    }

    if (view === 'experience-projects' || view === 'skills' || view === 'contact') {
      setView(view);
      return;
    }

    setView('overview');
  });
});

jobDescriptionUpload.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (!['pdf', 'docx'].includes(fileExtension || '')) {
    uploadStatus.textContent = 'Unsupported file type. Please upload a PDF or DOCX file.';
    fileLabel.textContent = 'Upload PDF or DOCX';
    event.target.value = '';
    return;
  }

  fileLabel.textContent = `${fileName} uploading...`;
  uploadStatus.textContent = 'Uploading job description...';

  try {
    uiState.isLoading = true;
    updateCompatibility(defaultCompatibility, true);
    fileLabel.textContent = `${fileName} analyzing...`;
    uploadStatus.textContent = 'Extracting JD and running compatibility analysis...';

    const response = await uploadJobDescription(file);

    extractedJobDescription.data = response.job_description || null;
    window.lastJobDescription = extractedJobDescription.data;

    const compatibility = response.compatibility || defaultCompatibility;
    uiState.compatibilityData = compatibility;
    uiState.isLoading = false;
    updateCompatibility(compatibility, false);

    fileLabel.textContent = fileName;
    uploadStatus.textContent = 'JD extracted, check compatibility results.';
  } catch (error) {
    extractedJobDescription.data = null;
    window.lastJobDescription = null;
    uiState.compatibilityData = null;
    uiState.isLoading = false;
    updateCompatibility(defaultCompatibility, false);
    uploadStatus.textContent = error.message || 'Failed to upload the job description.';
    fileLabel.textContent = 'Upload PDF or DOCX';
  } finally {
    event.target.value = '';
  }
});

renderExperiencePage();
renderSkillsPage();
renderContactPage();
uiState.compatibilityData = null;
uiState.isLoading = false;
setView('overview');
updateCompatibility(defaultCompatibility, false);

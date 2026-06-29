// ========== SHARED: Page load fade-in ==========
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  initNav();
  initReveal();
  initPageSpecific();
});

// ========== SHARED: Navigation ==========
function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll: add .scrolled class
  const onScroll = () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active link highlight
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (path === '/' && href === '/') || (path !== '/' && href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
}

const ADMIN_AUTH_KEY = 'aisolutions_admin_auth';
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBSz37LUNex_a7hoNtWM4OhpIvTikwb68k',
  authDomain: 'pd-monsun.firebaseapp.com',
  projectId: 'pd-monsun',
  storageBucket: 'pd-monsun.firebasestorage.app',
  messagingSenderId: '949657771857',
  appId: '1:949657771857:web:b6566879e46796da0efd70',
  measurementId: 'G-9MYRF6NNNV',
};

const PRODUCTION_API_BASE = 'https://pdaisolution.onrender.com';

function getApiBase() {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:4000';
  }
  return PRODUCTION_API_BASE;
}


const STATIC_ARTICLE_FALLBACKS = {
  'enterprise-ai-adoption-2025': {
    title: "The State of Enterprise AI Adoption in 2025: What's Working and What Isn't",
    author: 'Dr. Priya Sharma',
    publishedAt: 'June 15, 2025',
    status: 'Featured',
    summary: 'We surveyed 1,200 enterprise technology leaders across 18 industries. The results reveal a stark divide: companies that embedded AI into core workflows saw 3x more value than those that treated AI as a standalone experiment.',
    body: `The State of Enterprise AI Adoption in 2025 makes one thing clear: the most successful companies are the ones that treat AI as a workflow enabler rather than a separate innovation lab.

Leaders are embedding AI into operations, customer service, and employee experience. They tie AI outcomes directly to business metrics, and they invest in change management so teams can use intelligence in day-to-day work.

What isn't working is the old playbook of piloting AI in isolation. Organizations that keep AI in a separate team or only prototype solutions without operationalizing them report slower adoption, lower ROI, and higher governance risk.

In this new era, success depends on cross-functional collaboration, strong data foundations, and a clear governance framework. The companies that win are those that can deploy AI where work actually happens and measure the impact in terms of productivity, revenue, and user satisfaction.

For enterprise leaders, the message is simple: stop treating AI as a buzzword experiment. Build the systems, processes, and accountability to weave it into the fabric of the business.`
  }
};

// Cached inquiries and users loaded from backend or Firestore
let inquiriesCache = [];
let usersCache = [];

function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

function setAdminAuthenticated(value) {
  if (value) localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  else localStorage.removeItem(ADMIN_AUTH_KEY);
}

function requireAdminAuth() {
  if (!isAdminAuthenticated()) {
    window.location.replace('login.html');
  }
}

function adminLogout() {
  const auth = firebase.auth();
  auth.signOut().finally(() => {
    setAdminAuthenticated(false);
    window.location.replace('frontend/admin/login.html');
  });
}

function initFirebaseApp() {
  if (!window.firebase || !firebase.apps) {
    console.error('Firebase SDK not loaded');
    return;
  }
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}

function initFirebaseAuth() {
  if (!window.firebase || !firebase.apps || !firebase.auth) {
    console.error('Firebase SDK not loaded');
    return;
  }
  initFirebaseApp();
}

// ========== SHARED: Scroll reveal (IntersectionObserver) ==========
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ========== Page-specific initialization ==========
function initPageSpecific() {
  const page = window.location.pathname.toLowerCase();
  const isIndex = window.location.protocol === 'file:' || page === '/' || page === '' || page.includes('/index.html') || page.endsWith('/ai-solutions/');
  if (isIndex) {
    initParticles();
    initCounters();
    initChatbot();
  }
  if (page.includes('gallery')) initGallery();
  if (page.includes('contact')) initContactForm();
  if (page.includes('admin/login')) initAdminLogin();
  if (page.includes('admin/dashboard')) initDashboard();
  if (page.includes('admin/articles')) initAdminArticles();
  if (page.includes('admin/events')) initAdminEvents();
  if (page.includes('admin/gallery')) initAdminGallery();

  const currentFile = page.split('/').pop();
  if (currentFile === 'article.html') initArticleDetail();
  else if (!page.includes('/admin/') && currentFile === 'articles.html') initArticles();
  else if (!page.includes('/admin/') && currentFile === 'events.html') initEvents();
}

// ========== HOME: Particle canvas ==========
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = Math.min(80, Math.floor((W * H) / 12000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 2 + 1, a: Math.random() * .6 + .2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Draw connection lines
    particles.forEach((p, i) => {
      particles.forEach((q, j) => {
        if (j <= i) return;
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 130) * .18})`;
          ctx.lineWidth = .8;
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    });
    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ========== HOME: Counter animation ==========
function initCounters() {
  const counters = document.querySelectorAll('.snum[data-target]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => io.observe(c));
}

function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const panel = document.getElementById('chatbotPanel');
  const close = document.getElementById('chatbotClose');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');
  const messages = document.getElementById('chatbotMessages');
  const suggestions = document.getElementById('chatbotSuggestions');
  if (!toggle || !panel || !close || !form || !input || !messages || !suggestions) return;

  const typingIndicator = document.getElementById('chatbotTyping');
  const MAX_QUESTIONS = 4;
  let questionCount = 0;

  const addMessage = (type, text) => {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
  };

  const setChatDisabled = (disabled) => {
    input.disabled = disabled;
    form.querySelector('button[type="submit"]').disabled = disabled;
    suggestions.querySelectorAll('button').forEach(btn => btn.disabled = disabled);
    if (disabled) {
      input.placeholder = 'Chat ended after 4 questions';
    } else {
      input.placeholder = 'Type your question...';
    }
  };

  const setBotTyping = (visible) => {
    if (!typingIndicator) return;
    typingIndicator.hidden = !visible;
    if (visible) {
      messages.scrollTop = messages.scrollHeight;
      typingIndicator.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const getReply = (question) => {
    const lower = question.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hlo') || lower.includes('hey')) {
      return 'Hello! I can walk you through AI assistant deployments, demo workflows, and how we speed up employee productivity.';
    }
    if (lower.includes('pricing') || lower.includes('cost') || lower.includes('budget')) {
      return 'We build custom AI solutions for each client. Contact us so we can scope your use case and share a targeted pricing plan.';
    }
    if (lower.includes('demo') || lower.includes('trial')) {
      return 'A demo usually shows our AI assistant answering employee questions and triggering workflow automations. I can book one for you in 48 hours.';
    }
    if (lower.includes('assistant') || lower.includes('chatbot') || lower.includes('virtual')) {
      return 'Our AI assistant handles knowledge requests, automates approvals, and integrates with HR, IT, and operations systems to free up teams.';
    }
    if (lower.includes('workflow') || lower.includes('process') || lower.includes('automation')) {
      return 'We automate common workplace tasks like onboarding, ticket triage, approvals, and employee self-service in a way that fits your existing tools.';
    }
    if (lower.includes('prototype') || lower.includes('rapid')) {
      return 'Rapid prototyping means a working AI solution is built fast so your team can test it, collect feedback, and improve before scaling.';
    }
    if (lower.includes('deployment') || lower.includes('launch') || lower.includes('integrate')) {
      return 'Deployment happens in weeks, not months. We connect the AI to your systems, train the model, and hand over a managed production rollout.';
    }
    if (lower.includes('support') || lower.includes('team') || lower.includes('setup')) {
      return 'Our experts support the full journey: discovery, design, deployment, and optimization. You get a partner, not just software.';
    }
    return 'Great question! I can help with pricing, demos, workflows, deployment timelines, or building an AI assistant for your workplace.';
  };

  const submitQuestion = async (question) => {
    if (!question) return;
    if (questionCount >= MAX_QUESTIONS) {
      addMessage('bot', 'This chat session has reached its 4-question limit. Please refresh the page to ask more.');
      setChatDisabled(true);
      return;
    }

    panel.classList.add('open');
    addMessage('user', question);
    input.value = '';
    input.focus();
    setBotTyping(true);

    const apiBase = getApiBase();

    try {
      const response = await fetch(`${apiBase}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const result = await response.json();
      setBotTyping(false);
      addMessage('bot', result.answer || 'Sorry, I could not generate a response.');
      questionCount += 1;
      if (questionCount >= MAX_QUESTIONS) {
        addMessage('bot', 'You have reached the 4-question limit for this session. Refresh to start again.');
        setChatDisabled(true);
      } else {
        input.focus();
      }
    } catch (err) {
      console.error('AI chat error', err);
      setBotTyping(false);
      addMessage('bot', 'Sorry, I could not answer that right now.');
      input.focus();
    }
  };

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
  });
  close.addEventListener('click', () => {
    panel.classList.remove('open');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuestion(input.value.trim());
  });
  suggestions.addEventListener('click', (event) => {
    const button = event.target.closest('.chatbot-suggestion');
    if (!button) return;
    submitQuestion(button.textContent.trim());
  });
}

// ========== GALLERY: Lightbox and data fetch ==========
function initGallery() {
  const grid = document.querySelector('.gal-grid');
  const filterButtons = document.querySelectorAll('.gf-btn');
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (!grid || !lb || !lbImg) return;

  const apiBase = getApiBase();
  const galleryUrl = `${apiBase}/api/gallery`;

  let current = 0;
  let activeFilter = 'all';

  const getVisibleItems = () => Array.from(grid.querySelectorAll('.gal-item')).filter((item) => {
    const cat = (item.dataset.cat || '').toLowerCase();
    return activeFilter === 'all' || cat === activeFilter;
  });

  const openLightbox = (idx) => {
    const visible = getVisibleItems();
    if (!visible.length || idx < 0 || idx >= visible.length) return;
    current = idx;
    lbImg.src = visible[current].querySelector('img').src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  const showLightboxImage = (index) => {
    const visible = getVisibleItems();
    if (!visible.length) return;
    current = (index + visible.length) % visible.length;
    lbImg.src = visible[current].querySelector('img').src;
  };

  const prevLightbox = () => showLightboxImage(current - 1);
  const nextLightbox = () => showLightboxImage(current + 1);

  const bindLightboxItems = () => {
    const items = Array.from(grid.querySelectorAll('.gal-item'));
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const visible = getVisibleItems();
        const visibleIndex = visible.indexOf(item);
        if (visibleIndex >= 0) openLightbox(visibleIndex);
      });
    });
  };

  const applyGalleryFilter = () => {
    grid.querySelectorAll('.gal-item').forEach((item) => {
      const cat = (item.dataset.cat || '').toLowerCase();
      item.style.display = (activeFilter === 'all' || cat === activeFilter) ? '' : 'none';
    });
  };

  const setActiveFilterButton = (filter) => {
    filterButtons.forEach((button) => {
      button.className = `btn btn-${button.dataset.filter === filter ? 'primary' : 'ghost'} btn-sm gf-btn`;
    });
  };

  const initGalleryFilters = () => {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter || 'all';
        setActiveFilterButton(activeFilter);
        applyGalleryFilter();
      });
    });
  };

  const renderGalleryItems = (items) => {
    if (!items.length) {
      grid.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No gallery images to show.</p></div>';
      return;
    }

    grid.innerHTML = items.map((item) => `
      <div class="gal-item reveal visible" data-cat="${escapeHtml(String(item.category || 'other').toLowerCase())}">
        <img src="${escapeHtml(String(item.image || ''))}" alt="${escapeHtml(String(item.title || 'Gallery image'))}" loading="lazy">
        <div class="gal-ov"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg></div>
        <div class="gal-caption">
          <div class="gal-label">${escapeHtml(String(item.category || 'Other'))}</div>
          <h4>${escapeHtml(String(item.title || 'Untitled'))}</h4>
          <p>${escapeHtml(String(item.description || 'No description provided.'))}</p>
        </div>
      </div>
    `).join('');

    bindLightboxItems();
    applyGalleryFilter();
  };

  const loadGallery = async () => {
    grid.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading gallery…</p></div>';
    try {
      const res = await fetch(galleryUrl);
      if (!res.ok) throw new Error('Unable to fetch gallery items');
      const data = await res.json();
      renderGalleryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gallery load failed', err);
      grid.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load gallery images.</p></div>';
    }
  };

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev && lbPrev.addEventListener('click', prevLightbox);
  lbNext && lbNext.addEventListener('click', nextLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
  });

  initGalleryFilters();
  loadGallery();
}

function initEvents() {
  const upcomingContainer = document.getElementById('upcomingEvents');
  const pastContainer = document.getElementById('pastEvents');
  if (!upcomingContainer || !pastContainer) return;

  const apiBase = getApiBase();
  const eventsUrl = `${apiBase}/api/events`;

  const renderEventCard = (event) => {
    const eventDate = event.eventDate ? new Date(event.eventDate) : null;
    const month = eventDate ? eventDate.toLocaleString('default', { month: 'short' }) : 'TBA';
    const day = eventDate ? eventDate.getDate() : '--';
    const year = eventDate ? eventDate.getFullYear() : '';
    const location = event.location ? escapeHtml(String(event.location)) : 'Location not set';
    const time = event.startTime && event.endTime
      ? `${escapeHtml(String(event.startTime))} – ${escapeHtml(String(event.endTime))}`
      : (event.startTime || event.endTime || 'Time not set');
    const mode = event.mode ? escapeHtml(String(event.mode)) : 'Event';
    const status = event.status ? escapeHtml(String(event.status)) : 'Scheduled';
    const featured = Boolean(event.featured);
    const badgeClass = featured ? 'badge ba' : (mode.toLowerCase().includes('webinar') ? 'badge bp' : 'badge bc');
    const flags = [status, mode].filter(Boolean).join(' · ');

    return `
      <div class="card reveal">
        <div class="ev-card">
          <div class="ev-date">
            <div class="mo">${escapeHtml(month)}</div>
            <div class="dy">${escapeHtml(String(day))}</div>
            <div class="yr">${escapeHtml(String(year))}</div>
          </div>
          <div class="ev-body">
            <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.3rem">
              <h3>${escapeHtml(String(event.title || 'Untitled event'))}</h3>
              <span class="${badgeClass}">${mode}</span>
              ${featured ? '<span class="badge ba">Featured</span>' : ''}
            </div>
            <div class="ev-meta">
              <span>${location}</span>
              <span>${escapeHtml(flags)}</span>
            </div>
            <p>${escapeHtml(String(event.description || 'No description available.'))}</p>
            <div style="margin-top:1rem"><a href="contact.html" class="btn ${status === 'Scheduled' ? 'btn-primary' : 'btn-outline'} btn-sm">${status === 'Scheduled' ? 'Register Now' : 'Learn More'}</a></div>
          </div>
        </div>
      </div>
    `;
  };

  const now = new Date();
  const isUpcoming = (event) => {
    if (!event.eventDate) return false;
    const eventDate = new Date(event.eventDate);
    return eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const loadEvents = async () => {
    upcomingContainer.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading upcoming events…</p></div>';
    pastContainer.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading past events…</p></div>';
    try {
      const res = await fetch(eventsUrl);
      if (!res.ok) throw new Error('Unable to load events');
      const data = await res.json();
      const events = Array.isArray(data) ? data : [];
      const upcoming = events.filter(isUpcoming);
      const past = events.filter((event) => !isUpcoming(event));

      upcomingContainer.innerHTML = upcoming.length
        ? upcoming.map(renderEventCard).join('')
        : '<div class="card"><p style="margin:0;color:var(--muted)">No upcoming events at the moment.</p></div>';
      pastContainer.innerHTML = past.length
        ? past.map(renderEventCard).join('')
        : '<div class="card"><p style="margin:0;color:var(--muted)">No past events found.</p></div>';

      initReveal();
    } catch (err) {
      console.error('Failed to load events', err);
      upcomingContainer.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load upcoming events.</p></div>';
      pastContainer.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load past events.</p></div>';
    }
  };

  loadEvents();
}

function initArticles() {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;

  const apiBase = getApiBase();
  const articlesUrl = `${apiBase}/api/articles`;

  const renderArticleCards = (articles) => {
    if (!articles.length) {
      grid.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No articles available at the moment.</p></div>';
      return;
    }

    grid.innerHTML = articles.map((article) => {
      const publishedAt = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Date unavailable';
      const label = article.status || 'Article';
      const imageUrl = Array.isArray(article.images) && article.images.length > 0 ? String(article.images[0]) : '';
      const articleId = escapeHtml(String(article.id || ''));
      return `
        <div class="card art-card reveal visible d1">
          ${imageUrl ? `<div class="art-image"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(String(article.title || 'Article image'))}" loading="lazy"></div>` : ''}
          <div class="art-tags">
            <span class="badge bc">${escapeHtml(String(label))}</span>
          </div>
          <h3><a href="article.html?id=${articleId}">${escapeHtml(String(article.title || 'Untitled article'))}</a></h3>
          <p class="art-exc">${escapeHtml(String(article.summary || article.body || 'No description available.'))}</p>
          <div class="art-meta">
            <span>${escapeHtml(String(article.author || article.authorName || 'AI Solutions'))} · ${escapeHtml(String(publishedAt))}</span>
            <a href="article.html?id=${articleId}" class="rm">Read <svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </div>
      `;
    }).join('');
  };

  const loadArticles = async () => {
    grid.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading articles…</p></div>';
    try {
      const res = await fetch(articlesUrl);
      if (!res.ok) throw new Error('Unable to load articles');
      const data = await res.json();
      renderArticleCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load articles', err);
      grid.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load articles.</p></div>';
    }
  };

  loadArticles();
}

function initArticleDetail() {
  const detail = document.getElementById('articleDetail');
  if (!detail) return;

  const apiBase = getApiBase();

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');
  if (!articleId) {
    detail.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No article selected.</p></div>';
    return;
  }

  const articleUrl = `${apiBase}/api/articles/${encodeURIComponent(articleId)}`;

  const renderArticleDetail = (article) => {
    if (!article) {
      detail.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Article not found.</p></div>';
      return;
    }

    const publishedAt = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Date unavailable';
    const images = Array.isArray(article.images) ? article.images.filter(Boolean).map(String) : [];

    detail.innerHTML = `
      <div class="card article-detail-card">
        <div class="article-header">
          <div class="art-tags">
            <span class="badge bc">${escapeHtml(String(article.status || 'Article'))}</span>
          </div>
          <h1>${escapeHtml(String(article.title || 'Untitled article'))}</h1>
          <div class="art-meta">
            <span>${escapeHtml(String(article.author || article.authorName || 'AI Solutions'))} · ${escapeHtml(String(publishedAt))}</span>
          </div>
        </div>
        ${images.length ? `<div class="article-detail-media">${images.map((imageUrl) => `<div class="article-detail-image"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(String(article.title || 'Article image'))}" loading="lazy"></div>`).join('')}</div>` : ''}
        <p class="art-exc">${escapeHtml(String(article.summary || ''))}</p>
        <div class="article-body">${escapeHtml(String(article.body || 'No content available.')).replace(/\n/g, '<br>')}</div>
      </div>
    `;
  };

  if (STATIC_ARTICLE_FALLBACKS[articleId]) {
    renderArticleDetail(STATIC_ARTICLE_FALLBACKS[articleId]);
    return;
  }

  const loadArticleDetail = async () => {
    detail.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading article…</p></div>';
    try {
      const res = await fetch(articleUrl);
      if (res.status === 404) {
        renderArticleDetail(null);
        return;
      }
      if (!res.ok) throw new Error('Unable to load article');
      const article = await res.json();
      renderArticleDetail(article);
    } catch (err) {
      console.error('Failed to load article', err);
      detail.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load article.</p></div>';
    }
  };

  loadArticleDetail();
}

// ========== CONTACT: Form validation & submission ==========
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const required = ['fullName','email','phone','company','country','jobTitle','jobDetails'];
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const validate = (field) => {
    const val = field.value.trim();
    const fg = field.closest('.fg');
    const err = fg && fg.querySelector('.ferr');
    let msg = '';
    if (field.hasAttribute('required') && !val) msg = 'This field is required.';
    else if (field.type === 'email' && val && !emailRx.test(val)) msg = 'Enter a valid email address.';
    else if (field.id === 'phone' && val && !phoneRx.test(val)) msg = 'Enter a valid phone number.';
    if (fg) fg.classList.toggle('err', !!msg);
    if (err) { err.textContent = msg; err.classList.toggle('show', !!msg); }
    return !msg;
  };

  const setStatus = (message, successState = true) => {
    if (!success) return;
    success.textContent = message;
    success.className = successState ? 'fsuc show' : 'ferr show';
    success.style.display = 'block';
  };

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent.trim() : 'Send message';
  const setLoading = (loading) => {
    if (!submitButton) return;
    submitButton.disabled = loading;
    submitButton.textContent = loading ? 'Sending…' : originalButtonText;
  };

  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => validate(f));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('input, select, textarea').forEach(f => { if (!validate(f)) ok = false; });
    if (!ok) return;

    const payload = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      company: form.company.value.trim(),
      country: form.country.value.trim(),
      jobTitle: form.jobTitle.value.trim(),
      interest: form.interest.value.trim(),
      jobDetails: form.jobDetails.value.trim(),
    };

    const apiBase = getApiBase();
    setStatus('Sending your message...', true);
    setLoading(true);
    showToast('Sending your message…', 'info');

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Submission failed.');

      setStatus("Message received! Thank you, we'll follow up within one business day.");
      showToast('Message sent successfully.', 'success');
      form.reset();
      form.style.display = 'none';
    } catch (err) {
      console.error('Contact form submit failed', err);
      setStatus(err.message || 'Unable to send your message right now. Please try again later.', false);
      showToast(err.message || 'Unable to send your message right now.', 'error');
    } finally {
      setLoading(false);
    }
  });
}

// ========== ADMIN: Login handling ==========
function initAdminLogin() {
  initFirebaseAuth();

  const errorBox = document.getElementById('loginError');
  const googleButton = document.getElementById('googleSignInBtn');
  const passwordForm = document.getElementById('passwordLoginForm');
  const emailInput = document.getElementById('adminEmail');
  const passwordInput = document.getElementById('adminPassword');
  const loginStatus = document.getElementById('loginStatus');
  if (!googleButton || !passwordForm || !emailInput || !passwordInput) return;

  const apiBase = getApiBase();

  const showLoginError = (message) => {
    if (!errorBox) return;
    errorBox.style.display = 'block';
    errorBox.textContent = message;
  };

  const clearLoginError = () => {
    if (!errorBox) return;
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  };

  const showLoginStatus = (message) => {
    if (!loginStatus) return;
    loginStatus.style.display = 'block';
    loginStatus.textContent = message;
  };

  const clearLoginStatus = () => {
    if (!loginStatus) return;
    loginStatus.style.display = 'none';
    loginStatus.textContent = '';
  };

  googleButton.addEventListener('click', async () => {
    clearLoginError();

    if (!window.firebase || !firebase.auth) {
      showLoginError('Firebase failed to load. Please refresh the page.');
      return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      if (!user || !user.email) {
        showLoginError('Google account must provide an email.');
        return;
      }

      const response = await fetch(`${apiBase}/api/admin/send-temp-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.displayName || '' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to request temporary password.');
      }

      await firebase.auth().signOut();
      if (data.passwordSent || data.alreadyHasPassword) {
        passwordForm.style.display = 'flex';
        emailInput.value = user.email;
        emailInput.focus();
        showLoginStatus('Temporary password sent to your email. Your account is inactive until an admin activates it, so please contact the administrator for access.');
      } else {
        showLoginStatus(data.message || 'Please use the password form below to log in. Contact your administrator if you need access.');
        passwordForm.style.display = 'flex';
        emailInput.value = user.email;
        emailInput.focus();
      }
    } catch (err) {
      showLoginError(err.message || 'Unable to complete Google sign-in.');
      console.error('Admin login failed', err);
    }
  });

  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearLoginError();

    if (!window.firebase || !firebase.auth) {
      showLoginError('Firebase failed to load. Please refresh the page.');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      showLoginError('Email and password are required.');
      return;
    }

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        throw new Error('Unable to verify admin account.');
      }

      const adminDoc = await firebase.firestore().collection('admins').doc(currentUser.uid).get();
      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        if (adminData && adminData.status && adminData.status.toString().toLowerCase() === 'inactive') {
          await firebase.auth().signOut();
          showLoginError('Your admin account is inactive. Contact your administrator to get access.');
          clearLoginStatus();
          return;
        }
        if (adminData && adminData.approveStatus === false) {
          await firebase.auth().signOut();
          showLoginError('Your admin account is not approved yet. Contact your administrator to get access.');
          clearLoginStatus();
          return;
        }
      } else {
        await firebase.auth().signOut();
        showLoginError('Admin account not found. Contact your administrator for access.');
        clearLoginStatus();
        return;
      }

      setAdminAuthenticated(true);
      window.location.replace('dashboard.html');
    } catch (err) {
      showLoginError(err.message || 'Unable to sign in with password.');
      clearLoginStatus();
      console.error('Admin password login failed', err);
    }
  });
}

// ========== ADMIN: Dashboard ==========
function setupAdminSignOut() {
  const signOut = document.getElementById('signOutBtn');
  if (signOut) {
    signOut.addEventListener('click', (e) => {
      e.preventDefault();
      adminLogout();
    });
  }
}

function renderInquiryRow(index, data) {
  const row = document.createElement('tr');
  const status = data.status ? data.status : 'New';
  let date = 'Unknown';
  if (data.createdAt) {
    try {
      if (data.createdAt.toDate) {
        date = new Date(data.createdAt.toDate()).toLocaleString();
      } else {
        date = new Date(data.createdAt).toLocaleString();
      }
    } catch (e) {
      date = String(data.createdAt);
    }
  }
  const name = data.fullName || 'Unknown';
  const company = data.company || '—';
  const interest = data.interest || 'General Inquiry';
  const country = data.country || '—';
  const statusClass = status.toLowerCase().includes('respond') ? 'sresp' : status.toLowerCase().includes('pend') ? 'spend' : 'snew';

  row.innerHTML = `
    <td style="color:var(--muted)">#${index}</td>
    <td>${escapeHtml(name)}</td>
    <td>${escapeHtml(company)}</td>
    <td>${escapeHtml(interest)}</td>
    <td>${escapeHtml(country)}</td>
    <td>${date}</td>
    <td><span class="spill ${statusClass}">${status}</span></td>
    <td><button class="btn btn-ghost btn-sm" onclick="openInquiryDialog('${data.id || ''}')">View</button></td>
  `;
  return row;
}

function renderUserRow(index, data) {
  const row = document.createElement('tr');
  const name = data.name || data.displayName || 'Unknown';
  const email = data.email || '—';
  const lastLogin = data.lastLogin ? (data.lastLogin.toDate ? new Date(data.lastLogin.toDate()).toLocaleString() : new Date(data.lastLogin).toLocaleString()) : '—';
  const status = (data.status || 'Active').toString();
  const statusClass = status.toLowerCase().startsWith('inactive') ? 'sinactive' : 'sactive';
  const actionLabel = status.toLowerCase().startsWith('inactive') ? 'Activate' : 'Deactivate';

  row.innerHTML = `
    <td style="color:var(--muted)">#${index}</td>
    <td>${escapeHtml(name)}</td>
    <td>${escapeHtml(email)}</td>
    <td>${escapeHtml(lastLogin)}</td>
    <td><span class="spill ${statusClass}">${escapeHtml(status)}</span></td>
    <td><button class="btn btn-ghost btn-sm" onclick='toggleAdminStatus(${JSON.stringify(data.id || '')}, ${JSON.stringify(status)})'>${escapeHtml(actionLabel)}</button></td>
  `;
  return row;
}

window.toggleAdminStatus = async function toggleAdminStatus(id, currentStatus) {
  if (!window.firebase || !firebase.firestore) {
    showToast('Cannot update status: Firebase unavailable', 'error');
    return;
  }

  const newStatus = (currentStatus || '').toString().toLowerCase().startsWith('inactive') ? 'Active' : 'Inactive';
  const db = firebase.firestore();

  try {
    await db.collection('admins').doc(id).update({ status: newStatus });
    showToast(`Admin status set to ${newStatus}`, 'success');
    await loadUsers();
  } catch (err) {
    console.error('Failed to update admin status', err);
    showToast('Unable to update admin status.', 'error');
  }
}

function renderCachedUsers() {
  const tableBody = document.getElementById('userTableBody');
  const userCount = document.getElementById('userCount');
  if (!tableBody || !userCount) return;
  if (!usersCache || !usersCache.length) {
    tableBody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);text-align:center">No users found.</td></tr>';
    userCount.textContent = '0 users';
    return;
  }
  tableBody.innerHTML = '';
  usersCache.forEach((item, idx) => tableBody.appendChild(renderUserRow(idx + 1, item)));
  userCount.textContent = `${usersCache.length} users`;
}

async function loadUsers() {
  const tableBody = document.getElementById('userTableBody');
  const userCount = document.getElementById('userCount');
  if (!tableBody || !userCount) return;
  tableBody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);text-align:center">Loading users…</td></tr>';
  if (!window.firebase || !firebase.firestore) {
    tableBody.innerHTML = '<tr><td colspan="6" style="color:#ef4444;text-align:center">No user data source available.</td></tr>';
    userCount.textContent = 'Unable to load users.';
    return;
  }

  try {
    const snapshot = await firebase.firestore().collection('admins').get();
    if (snapshot.empty) {
      tableBody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);text-align:center">No users found.</td></tr>';
      userCount.textContent = '0 users';
      usersCache = [];
      return;
    }
    usersCache = [];
    snapshot.forEach(doc => usersCache.push({ id: doc.id, ...doc.data() }));
    usersCache.sort((a, b) => {
      const aTs = a.lastLogin && a.lastLogin.toDate ? a.lastLogin.toDate().getTime() : (a.lastLogin ? new Date(a.lastLogin).getTime() : 0);
      const bTs = b.lastLogin && b.lastLogin.toDate ? b.lastLogin.toDate().getTime() : (b.lastLogin ? new Date(b.lastLogin).getTime() : 0);
      return bTs - aTs;
    });
    renderCachedUsers();
  } catch (err) {
    console.error('Failed to load users', err);
    tableBody.innerHTML = '<tr><td colspan="6" style="color:#ef4444;text-align:center">Unable to load users.</td></tr>';
    userCount.textContent = 'Unable to load users.';
  }
}

async function loadDashboardTotals() {
  const articleTotal = document.getElementById('articleTotal');
  const eventTotal = document.getElementById('eventTotal');
  const upcomingEvents = document.getElementById('upcomingEvents');
  if (!articleTotal || !eventTotal || !upcomingEvents) return;

  articleTotal.textContent = 'Loading…';
  eventTotal.textContent = 'Loading…';
  upcomingEvents.textContent = 'Loading…';

  try {
    const [articlesRes, eventsRes] = await Promise.all([
      fetch(`${getApiBase()}/api/articles`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
      fetch(`${getApiBase()}/api/events`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }),
    ]);

    const articles = articlesRes.ok ? await articlesRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];
    const articleCount = Array.isArray(articles) ? articles.length : 0;
    const eventCount = Array.isArray(events) ? events.length : 0;
    const now = new Date();
    const upcomingCount = Array.isArray(events)
      ? events.filter(event => {
          if (!event || !event.eventDate) return false;
          const date = new Date(event.eventDate);
          return !Number.isNaN(date.valueOf()) && date >= now;
        }).length
      : 0;

    articleTotal.textContent = String(articleCount);
    eventTotal.textContent = String(eventCount);
    upcomingEvents.textContent = String(upcomingCount);
  } catch (err) {
    console.error('Failed to load dashboard totals', err);
    articleTotal.textContent = '—';
    eventTotal.textContent = '—';
    upcomingEvents.textContent = '—';
  }
}

function renderCachedInquiries(filter) {
  const tableBody = document.getElementById('inquiryTableBody');
  const inquiryCount = document.getElementById('inquiryCount');
  const inquiryTotal = document.getElementById('inquiryTotal');
  if (!tableBody || !inquiryCount || !inquiryTotal) return;
  const sel = filter || (document.getElementById('inquiryFilter') && document.getElementById('inquiryFilter').value) || 'All';
  const list = (inquiriesCache || []).slice();
  const filtered = list.filter(item => {
    const status = (item.status || 'New') + '';
    if (sel === 'All') return true;
    return status.toLowerCase() === sel.toLowerCase();
  });
  if (!filtered.length) {
    tableBody.innerHTML = '<tr><td colspan="8" style="color:var(--muted);text-align:center">No inquiries found.</td></tr>';
    inquiryCount.textContent = 'No inquiries yet.';
    inquiryTotal.textContent = `${list.length}`;
    return;
  }
  tableBody.innerHTML = '';
  filtered.forEach((item, idx) => tableBody.appendChild(renderInquiryRow(idx + 1, item)));
  inquiryCount.textContent = `Showing ${filtered.length} recent inquiries`;
  inquiryTotal.textContent = `${list.length}`;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Toast helper
function showToast(message, type = 'info', timeout = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  container.appendChild(t);
  // animate in
  requestAnimationFrame(() => t.classList.add('show'));
  const id = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.remove(); }, 250);
  }, timeout);
  t.addEventListener('click', () => { clearTimeout(id); t.remove(); });
  return t;
}

async function loadInquiries() {
  if (loadInquiries._running) return;
  loadInquiries._running = true;
  const tableBody = document.getElementById('inquiryTableBody');
  const inquiryCount = document.getElementById('inquiryCount');
  const inquiryTotal = document.getElementById('inquiryTotal');
  if (!tableBody || !inquiryCount || !inquiryTotal) return;
  // Prefer backend API if available, fall back to Firestore.
  tableBody.innerHTML = '<tr><td colspan="8" style="color:var(--muted);text-align:center">Loading inquiries…</td></tr>';
  try {
    const res = await fetch(`${getApiBase()}/api/inquiries`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (res.ok) {
      const data = await res.json();
      inquiriesCache = Array.isArray(data) ? data : [];
      if (!inquiriesCache.length) {
        tableBody.innerHTML = '<tr><td colspan="8" style="color:var(--muted);text-align:center">No inquiries found.</td></tr>';
        inquiryCount.textContent = 'No inquiries yet.';
        inquiryTotal.textContent = '0';
        loadInquiries._running = false;
        return;
      }
      renderCachedInquiries();
      loadInquiries._running = false;
      return;
    }
  } catch (err) {
    // Ignore fetch error and try Firestore below
    console.warn('Backend inquiries fetch failed, falling back to Firestore:', err && err.message);
  }

  // Fallback: load from Firestore
  initFirebaseApp();
  if (!window.firebase || !firebase.firestore) {
    tableBody.innerHTML = '<tr><td colspan="8" style="color:#ef4444;text-align:center">No data source available.</td></tr>';
    inquiryCount.textContent = 'Unable to load inquiries.';
    return;
  }

  const db = firebase.firestore();
  try {
    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').limit(25).get();
    tableBody.innerHTML = '';
    if (snapshot.empty) {
      tableBody.innerHTML = '<tr><td colspan="8" style="color:var(--muted);text-align:center">No inquiries found.</td></tr>';
      inquiryCount.textContent = 'No inquiries yet.';
      inquiryTotal.textContent = '0';
      return;
    }

    let index = 1;
    inquiriesCache = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      d.id = doc.id;
      inquiriesCache.push(d);
    });
    renderCachedInquiries();
    loadInquiries._running = false;
  } catch (err) {
    console.error('Failed to load inquiries', err);
    tableBody.innerHTML = '<tr><td colspan="8" style="color:#ef4444;text-align:center">Unable to load inquiries.</td></tr>';
    inquiryCount.textContent = 'Unable to load inquiries.';
    loadInquiries._running = false;
  }
}

function initDashboard() {
  initFirebaseAuth();
  requireAdminAuth();
  setupAdminSignOut();

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      setAdminAuthenticated(false);
      window.location.replace('login.html');
    }
  });

  loadInquiries();
  loadDashboardTotals();
  loadUsers();
  initChangePassword();
  initAdminChat();
  console.log('Dashboard loaded — admin auth verified.');
}

function initChangePassword() {
  const form = document.getElementById('changePasswordForm');
  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const messageBox = document.getElementById('passwordChangeMessage');
  if (!form || !currentPasswordInput || !newPasswordInput || !confirmPasswordInput || !messageBox) return;

  const showMessage = (message, isError = false) => {
    messageBox.style.display = 'block';
    messageBox.style.color = isError ? '#dc2626' : '#16a34a';
    messageBox.textContent = message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    messageBox.style.display = 'none';

    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage('Please complete all password fields.', true);
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage('New passwords do not match.', true);
      return;
    }

    const user = firebase.auth().currentUser;
    if (!user || !user.email) {
      showMessage('Unable to verify current admin account.', true);
      return;
    }

    try {
      const response = await fetch(`${getApiBase()}/api/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to change password.');
      }

      showMessage(result.message || 'Password changed successfully.');
      form.reset();
    } catch (err) {
      console.error('Change password failed', err);
      showMessage(err.message || 'Unable to change password.', true);
    }
  });
}

function initAdminChat() {
  const form = document.getElementById('adminChatForm');
  const input = document.getElementById('adminChatInput');
  const messages = document.getElementById('adminChatMessages');
  const status = document.getElementById('adminChatStatus');
  if (!form || !input || !messages || !status) return;

  const addMessage = (type, text) => {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '0.8rem';
    wrapper.style.padding = '0.9rem 1rem';
    wrapper.style.borderRadius = '14px';
    wrapper.style.maxWidth = '100%';
    wrapper.style.whiteSpace = 'pre-wrap';
    wrapper.style.wordBreak = 'break-word';
    wrapper.style.background = type === 'user' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(31, 41, 55, 0.08)';
    wrapper.style.border = type === 'user' ? '1px solid rgba(59, 130, 246, 0.22)' : '1px solid rgba(107, 114, 128, 0.18)';
    wrapper.textContent = text;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  };

  const setStatus = (text, isError = false) => {
    status.textContent = text || '';
    status.style.display = text ? 'block' : 'none';
    status.style.color = isError ? '#dc2626' : 'var(--muted)';
  };

  const apiBase = getApiBase();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) {
      setStatus('Please enter a question for the AI.', true);
      return;
    }

    addMessage('user', question);
    input.value = '';
    setStatus('Thinking...');

    try {
      const response = await fetch(`${apiBase}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'AI chat failed.');
      }
      addMessage('bot', data.answer || 'I could not generate a response.');
      setStatus('');
    } catch (err) {
      console.error('AI chat error', err);
      setStatus(err.message || 'Unable to connect to AI chat.', true);
      addMessage('bot', 'Sorry, I could not answer that right now.');
    }
  });
}

// --- Inquiry modal handlers ---
window.openInquiryDialog = function openInquiryDialog(id) {
  const modal = document.getElementById('inquiryModal');
  const rec = (inquiriesCache || []).find(r => r.id === id);
  if (!modal || !rec) {
    console.warn('Inquiry not found', id);
    return;
  }
  window._currentInquiryId = id;
  document.getElementById('modalTitle').textContent = `Inquiry — ${escapeHtml(rec.fullName || id)}`;
  document.getElementById('modalName').textContent = escapeHtml(rec.fullName || '—');
  document.getElementById('modalEmail').textContent = escapeHtml(rec.email || '—');
  document.getElementById('modalCompany').textContent = escapeHtml(rec.company || '—');
  document.getElementById('modalInterest').textContent = escapeHtml(rec.interest || rec.jobTitle || '—');
  document.getElementById('modalCountry').textContent = escapeHtml(rec.country || '—');
  const created = rec.createdAt ? (rec.createdAt.toDate ? new Date(rec.createdAt.toDate()).toLocaleString() : new Date(rec.createdAt).toLocaleString()) : '—';
  document.getElementById('modalDate').textContent = created;
  document.getElementById('modalStatus').value = rec.status || 'New';
  document.getElementById('replySubject').value = '';
  document.getElementById('replyMessage').value = `\n\n---\nOriginal message:\n${rec.jobDetails || ''}`;
  modal.style.display = 'flex';
};

function closeInquiryModal() {
  const modal = document.getElementById('inquiryModal');
  if (modal) modal.style.display = 'none';
  window._currentInquiryId = null;
}

// Wire modal buttons
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('inquiryModalClose');
  const modal = document.getElementById('inquiryModal');
  const saveBtn = document.getElementById('saveStatusBtn');
  const sendBtn = document.getElementById('sendReplyBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeInquiryModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeInquiryModal(); });
  const filter = document.getElementById('inquiryFilter');
  if (filter) {
    filter.addEventListener('change', () => {
      if (filter.value && filter.value !== 'All') filter.classList.add('filtered'); else filter.classList.remove('filtered');
      renderCachedInquiries(filter.value);
    });
  }
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportInquiriesCSV);
  if (saveBtn) saveBtn.addEventListener('click', async () => {
    const id = window._currentInquiryId;
    if (!id) return;
    const status = document.getElementById('modalStatus').value;
    saveBtn.disabled = true;
    saveBtn.classList.add('loading');
    try {
      const res = await fetch(`${getApiBase()}/api/inquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error('Failed');
      await loadInquiries();
      closeInquiryModal();
    } catch (err) {
      showToast('Unable to update status.', 'error');
      console.error(err);
    } finally { saveBtn.disabled = false; saveBtn.classList.remove('loading'); }
  });
  if (sendBtn) sendBtn.addEventListener('click', async () => {
    const id = window._currentInquiryId;
    if (!id) return;
    const subject = document.getElementById('replySubject').value.trim();
    const message = document.getElementById('replyMessage').value.trim();
    if (!subject || !message) { showToast('Subject and message required', 'error'); return; }
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    try {
      const res = await fetch(`${getApiBase()}/api/inquiries/${id}/reply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, message }) });
      if (!res.ok) throw new Error('Failed to send');
      showToast('Reply sent', 'success');
      await loadInquiries();
      closeInquiryModal();
    } catch (err) {
      showToast('Unable to send reply.', 'error');
      console.error(err);
    } finally { sendBtn.disabled = false; sendBtn.classList.remove('loading'); }
  });
});

function exportInquiriesCSV() {
  const sel = (document.getElementById('inquiryFilter') && document.getElementById('inquiryFilter').value) || 'All';
  const list = (inquiriesCache || []).filter(item => sel === 'All' ? true : ((item.status || 'New') + '').toLowerCase() === sel.toLowerCase());
  if (!list.length) { showToast('No inquiries to export', 'info'); return; }
  const cols = ['id','fullName','email','phone','company','interest','jobTitle','country','createdAt','status','jobDetails'];
  const rows = [cols.join(',')];
  for (const r of list) {
    const values = cols.map(c => {
      let v = r[c] != null ? r[c] : '';
      if (c === 'createdAt' && v) {
        try { v = v.toDate ? new Date(v.toDate()).toISOString() : new Date(v).toISOString(); } catch(e) { v = String(v); }
      }
      v = String(v).replace(/"/g, '""');
      return `"${v}"`;
    });
    rows.push(values.join(','));
  }
  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inquiries-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('CSV exported', 'success');
}

function renderAdminListItem(title, subtitle, details) {
  const row = document.createElement('div');
  row.className = 'card';
  row.style.marginBottom = '1rem';
  row.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
      <div>
        <h4 style="margin:0 0 .35rem;">${title}</h4>
        <p style="margin:0;color:var(--muted);font-size:.92rem;">${subtitle}</p>
      </div>
      <span style="font-size:.8rem;color:var(--muted);white-space:nowrap;">${details}</span>
    </div>
  `;
  return row;
}

async function loadAdminCollection(collectionName, listContainer, renderRow) {
  if (!listContainer || !window.firebase || !firebase.firestore) return;
  const db = firebase.firestore();
  try {
    const snapshot = await db.collection(collectionName).orderBy('createdAt', 'desc').limit(25).get();
    listContainer.innerHTML = '';
    if (snapshot.empty) {
      listContainer.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No records found yet.</p></div>';
      return;
    }
    snapshot.forEach(doc => {
      listContainer.appendChild(renderRow(doc.id, doc.data()));
    });
  } catch (err) {
    console.error(`Failed to load ${collectionName}`, err);
    listContainer.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load records.</p></div>';
  }
}

async function uploadArticleImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const payload = { image: reader.result, name: file.name };
      try {
        const res = await fetch(`${getApiBase()}/api/upload-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          return reject(new Error(err?.message || 'Image upload failed'));
        }
        const data = await res.json();
        if (!data.url) return reject(new Error('Invalid upload response'));
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function initAdminArticles() {
  initFirebaseAuth();
  requireAdminAuth();
  setupAdminSignOut();

  const form = document.getElementById('articleForm');
  const list = document.getElementById('articleList');
  const message = document.getElementById('articleMessage');
  const imagePreview = document.getElementById('articleImagePreview');
  const pagination = document.getElementById('articlePagination');
  const prevBtn = document.getElementById('articlePrevBtn');
  const nextBtn = document.getElementById('articleNextBtn');
  const pageLabel = document.getElementById('articlePageLabel');

  let cachedArticles = [];
  let currentArticlePage = 1;
  const articlesPerPage = 5;

  const updateArticlePagination = () => {
    if (!pagination || !prevBtn || !nextBtn || !pageLabel) return;
    const pageCount = Math.max(1, Math.ceil(cachedArticles.length / articlesPerPage));
    pagination.style.display = cachedArticles.length <= articlesPerPage ? 'none' : 'flex';
    prevBtn.disabled = currentArticlePage <= 1;
    nextBtn.disabled = currentArticlePage >= pageCount;
    pageLabel.textContent = `Page ${currentArticlePage} of ${pageCount}`;
  };

  const renderArticlePage = () => {
    if (!list) return;
    const pageCount = Math.max(1, Math.ceil(cachedArticles.length / articlesPerPage));
    if (currentArticlePage > pageCount) currentArticlePage = pageCount;
    if (currentArticlePage < 1) currentArticlePage = 1;
    const start = (currentArticlePage - 1) * articlesPerPage;
    const pageItems = cachedArticles.slice(start, start + articlesPerPage);
    if (!pageItems.length) {
      list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No articles yet.</p></div>';
      pagination && (pagination.style.display = 'none');
      return;
    }
    list.innerHTML = '';
    pageItems.forEach((item) => list.appendChild(renderArticle(item.id, item)));
    updateArticlePagination();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentArticlePage -= 1;
      renderArticlePage();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentArticlePage += 1;
      renderArticlePage();
    });
  }

  const renderImagePreview = (images = []) => {
    if (!imagePreview) return;
    imagePreview.innerHTML = '';
    if (!images || images.length === 0) {
      imagePreview.style.display = 'none';
      return;
    }
    imagePreview.style.display = 'flex';
    images.slice(0, 2).forEach((img, index) => {
      const url = typeof img === 'string' ? img : (img?.url || '');
      if (!url) return;
      const thumb = document.createElement('div');
      thumb.style.display = 'flex';
      thumb.style.flexDirection = 'column';
      thumb.style.alignItems = 'center';
      thumb.style.justifyContent = 'center';
      thumb.style.gap = '.35rem';
      thumb.style.maxWidth = '120px';
      thumb.style.padding = '.35rem';
      thumb.style.border = '1px solid rgba(148,163,184,.25)';
      thumb.style.borderRadius = '0.75rem';
      thumb.style.background = 'rgba(255,255,255,.95)';
      const imgEl = document.createElement('img');
      imgEl.src = url;
      imgEl.alt = `Article image ${index + 1}`;
      imgEl.style.width = '100%';
      imgEl.style.height = '80px';
      imgEl.style.objectFit = 'cover';
      imgEl.style.borderRadius = '0.65rem';
      thumb.appendChild(imgEl);
      const label = document.createElement('span');
      label.style.fontSize = '.78rem';
      label.style.color = 'var(--muted)';
      label.textContent = `Image ${index + 1}`;
      thumb.appendChild(label);
      imagePreview.appendChild(thumb);
    });
  };

  let editingArticleId = null;
  let editingArticleImages = [];
  const articleFormTitle = document.getElementById('articleFormTitle');
  const cancelEditButton = document.getElementById('cancelArticleEdit');

  const resetArticleForm = () => {
    editingArticleId = null;
    editingArticleImages = [];
    form.articleTitle.value = '';
    form.articleSummary.value = '';
    form.articleBody.value = '';
    form.articleDate.value = '';
    form.articleStatus.value = 'Draft';
    if (form.articleImages) form.articleImages.value = '';
    if (articleFormTitle) articleFormTitle.textContent = 'New Article';
    if (cancelEditButton) cancelEditButton.style.display = 'none';
    renderImagePreview([]);
    if (message) {
      message.textContent = '';
      message.className = '';
      message.style.display = 'none';
    }
  };

  const setArticleForm = (id, data) => {
    editingArticleId = id;
    editingArticleImages = Array.isArray(data.images) ? data.images.slice(0, 2) : [];
    form.articleTitle.value = data.title || '';
    form.articleSummary.value = data.summary || '';
    form.articleBody.value = data.body || '';
    form.articleDate.value = data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 10) : '';
    form.articleStatus.value = data.status || 'Draft';
    if (articleFormTitle) articleFormTitle.textContent = 'Edit Article';
    if (cancelEditButton) cancelEditButton.style.display = 'inline-flex';
    renderImagePreview(editingArticleImages);
  };

  const renderArticle = (id, data) => {
    const subtitle = data.summary ? data.summary : 'No summary provided.';
    const details = `${data.status || 'Draft'} · ${data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'Pending'}`;
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '1rem';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
        <div>
          <h4 style="margin:0 0 .35rem;">${escapeHtml(data.title || `Article ${id}`)}</h4>
          <p style="margin:0;color:var(--muted);font-size:.92rem;">${escapeHtml(subtitle)}</p>
        </div>
        <button type="button" class="edit-article-btn" style="padding:.45rem .8rem;border:1px solid var(--cyan);border-radius:6px;background:transparent;color:var(--cyan);font-size:.85rem;cursor:pointer">Edit</button>
      </div>
      <div style="margin-top:.75rem;font-size:.85rem;color:var(--muted);">${escapeHtml(details)}</div>
    `;
    card.querySelector('.edit-article-btn').addEventListener('click', () => setArticleForm(id, data));
    return card;
  };

  const refreshArticles = async () => {
    if (!list) return;
    list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading articles…</p></div>';
    if (pagination) pagination.style.display = 'none';
    try {
      const res = await fetch(`${getApiBase()}/api/articles`);
      if (!res.ok) throw new Error('Unable to load articles');
      const data = await res.json();
      cachedArticles = Array.isArray(data) ? data : [];
      if (!cachedArticles.length) {
        list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No articles yet.</p></div>';
        if (pagination) pagination.style.display = 'none';
        return;
      }
      currentArticlePage = 1;
      renderArticlePage();
    } catch (err) {
      console.error('Failed to load articles', err);
      list.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load articles.</p></div>';
      if (pagination) pagination.style.display = 'none';
    }
  };

  if (form) {
    if (cancelEditButton) {
      cancelEditButton.addEventListener('click', resetArticleForm);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.articleTitle.value.trim();
      const summary = form.articleSummary.value.trim();
      const body = form.articleBody.value.trim();
      const publishedAt = form.articleDate.value ? form.articleDate.value : null;
      const status = form.articleStatus.value;
      if (!title || !body) {
        if (message) {
          message.textContent = 'Title and content are required.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
        return;
      }
      const imageFiles = form.articleImages?.files ? Array.from(form.articleImages.files) : [];
      if (imageFiles.length > 2) {
        if (message) {
          message.textContent = 'Please upload no more than 2 images.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
        return;
      }
      let images = editingArticleId ? editingArticleImages : [];
      if (imageFiles.length) {
        try {
          images = await Promise.all(imageFiles.slice(0, 2).map(file => uploadArticleImage(file)));
        } catch (err) {
          console.error('Image upload failed', err);
          if (message) {
            message.textContent = 'Image upload failed. Please try again.';
            message.className = 'ferr show';
            message.style.display = 'block';
          }
          return;
        }
      }
      const payload = { title, summary, body, status, publishedAt, images };
      const endpoint = editingArticleId ? `${getApiBase()}/api/articles/${editingArticleId}` : `${getApiBase()}/api/articles`;
      const method = editingArticleId ? 'PATCH' : 'POST';
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || 'Failed to save article');
        }
        if (message) {
          message.textContent = editingArticleId ? 'Article updated successfully.' : 'Article saved successfully.';
          message.className = 'fsuc show';
          message.style.display = 'block';
        }
        resetArticleForm();
        refreshArticles();
      } catch (err) {
        console.error('Article save failed', err);
        if (message) {
          message.textContent = 'Failed to save article. Please try again.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
      }
    });
  }

  refreshArticles();
}

function initAdminEvents() {
  initFirebaseAuth();
  requireAdminAuth();
  setupAdminSignOut();

  const form = document.getElementById('eventForm');
  const list = document.getElementById('eventList');
  const message = document.getElementById('eventMessage');
  const eventFormTitle = document.getElementById('eventFormTitle');
  const cancelEditButton = document.getElementById('cancelEventEdit');
  const pagination = document.getElementById('eventPagination');
  const prevBtn = document.getElementById('eventPrevBtn');
  const nextBtn = document.getElementById('eventNextBtn');
  const pageLabel = document.getElementById('eventPageLabel');

  let editingEventId = null;
  let cachedEvents = [];
  let currentEventPage = 1;
  const eventsPerPage = 5;

  const updateEventPagination = () => {
    if (!pagination || !prevBtn || !nextBtn || !pageLabel) return;
    const pageCount = Math.max(1, Math.ceil(cachedEvents.length / eventsPerPage));
    pagination.style.display = cachedEvents.length <= eventsPerPage ? 'none' : 'flex';
    prevBtn.disabled = currentEventPage <= 1;
    nextBtn.disabled = currentEventPage >= pageCount;
    pageLabel.textContent = `Page ${currentEventPage} of ${pageCount}`;
  };

  const renderEventPage = () => {
    if (!list) return;
    const pageCount = Math.max(1, Math.ceil(cachedEvents.length / eventsPerPage));
    if (currentEventPage > pageCount) currentEventPage = pageCount;
    if (currentEventPage < 1) currentEventPage = 1;
    const start = (currentEventPage - 1) * eventsPerPage;
    const pagedEvents = cachedEvents.slice(start, start + eventsPerPage);
    if (!pagedEvents.length) {
      list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No events found.</p></div>';
      if (pagination) pagination.style.display = 'none';
      return;
    }
    list.innerHTML = '';
    pagedEvents.forEach((item) => list.appendChild(renderEvent(item.id, item)));
    updateEventPagination();
  };

  const resetEventForm = () => {
    editingEventId = null;
    form.eventTitle.value = '';
    form.eventLocation.value = '';
    form.eventDate.value = '';
    form.eventStartTime.value = '';
    form.eventEndTime.value = '';
    form.eventMode.value = 'In Person';
    form.eventFeatured.checked = false;
    form.eventDescription.value = '';
    form.eventStatus.value = 'Scheduled';
    if (eventFormTitle) eventFormTitle.textContent = 'New Event';
    if (cancelEditButton) cancelEditButton.style.display = 'none';
    if (message) {
      message.textContent = '';
      message.className = '';
      message.style.display = 'none';
    }
  };

  const setEventForm = (id, data) => {
    editingEventId = id;
    form.eventTitle.value = data.title || '';
    form.eventLocation.value = data.location || '';
    form.eventDate.value = data.eventDate || '';
    form.eventStartTime.value = data.startTime || '';
    form.eventEndTime.value = data.endTime || '';
    form.eventMode.value = data.mode || 'In Person';
    form.eventFeatured.checked = Boolean(data.featured);
    form.eventDescription.value = data.description || '';
    form.eventStatus.value = data.status || 'Scheduled';
    if (eventFormTitle) eventFormTitle.textContent = 'Edit Event';
    if (cancelEditButton) cancelEditButton.style.display = 'inline-flex';
  };

  const renderEvent = (id, data) => {
    const subtitle = data.location ? `${data.location}` : 'Location not set';
    const dateLabel = data.eventDate ? new Date(data.eventDate).toLocaleDateString() : 'No date';
    const timeLabel = data.startTime && data.endTime ? `${data.startTime} – ${data.endTime}` : (data.startTime || data.endTime || 'Time not set');
    const flags = [];
    if (data.mode) flags.push(data.mode);
    if (data.featured) flags.push('Featured');
    const details = [dateLabel, timeLabel, data.status, flags.join(' · ')].filter(Boolean).join(' · ');
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '1rem';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
        <div>
          <h4 style="margin:0 0 .35rem;">${escapeHtml(data.title || `Event ${id}`)}</h4>
          <p style="margin:0;color:var(--muted);font-size:.92rem;">${escapeHtml(subtitle)}</p>
        </div>
        <button type="button" class="button button-secondary" style="font-size:.85rem;align-self:flex-start">Edit</button>
      </div>
      <div style="margin-top:.75rem;font-size:.85rem;color:var(--muted);">${escapeHtml(details)}</div>
    `;
    card.querySelector('button').addEventListener('click', () => setEventForm(id, data));
    return card;
  };

  const refreshEvents = async () => {
    if (!list) return;
    list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading events…</p></div>';
    if (pagination) pagination.style.display = 'none';
    try {
      const res = await fetch(`${getApiBase()}/api/events`);
      if (!res.ok) throw new Error('Unable to load events');
      const data = await res.json();
      cachedEvents = Array.isArray(data) ? data : [];
      if (!cachedEvents.length) {
        list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No events found.</p></div>';
        if (pagination) pagination.style.display = 'none';
        return;
      }
      currentEventPage = 1;
      renderEventPage();
    } catch (err) {
      console.error('Failed to load events', err);
      list.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load events.</p></div>';
      if (pagination) pagination.style.display = 'none';
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentEventPage -= 1;
      renderEventPage();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentEventPage += 1;
      renderEventPage();
    });
  }

  if (form) {
    if (cancelEditButton) {
      cancelEditButton.addEventListener('click', resetEventForm);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.eventTitle.value.trim();
      const location = form.eventLocation.value.trim();
      const eventDate = form.eventDate.value;
      const startTime = form.eventStartTime.value;
      const endTime = form.eventEndTime.value;
      const mode = form.eventMode.value;
      const featured = form.eventFeatured.checked;
      const description = form.eventDescription.value.trim();
      const status = form.eventStatus.value;
      if (!title || !eventDate) {
        if (message) {
          message.textContent = 'Event name and date are required.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
        return;
      }
      try {
        const endpoint = editingEventId ? `${getApiBase()}/api/events/${editingEventId}` : `${getApiBase()}/api/events`;
        const method = editingEventId ? 'PATCH' : 'POST';
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            location,
            eventDate,
            startTime,
            endTime,
            mode,
            featured,
            description,
            status,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || 'Failed to save event');
        }
        if (message) {
          message.textContent = editingEventId ? 'Event updated successfully.' : 'Event saved successfully.';
          message.className = 'fsuc show';
          message.style.display = 'block';
        }
        resetEventForm();
        refreshEvents();
      } catch (err) {
        console.error('Event save failed', err);
        if (message) {
          message.textContent = 'Failed to save event. Please try again.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
      }
    });
  }

  refreshEvents();
}

function initAdminGallery() {
  initFirebaseAuth();
  requireAdminAuth();
  setupAdminSignOut();

  const form = document.getElementById('galleryForm');
  const list = document.getElementById('galleryList');
  const message = document.getElementById('galleryMessage');
  const imagePreview = document.getElementById('galleryImagePreview');
  const pagination = document.getElementById('galleryPagination');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const pageLabel = document.getElementById('galleryPageLabel');
  const galleryFormTitle = document.getElementById('galleryFormTitle');
  const cancelEditButton = document.getElementById('cancelGalleryEdit');

  let editingGalleryId = null;
  let editingGalleryImage = '';
  let cachedGalleryItems = [];
  let currentGalleryPage = 1;
  const galleryItemsPerPage = 5;

  const updateGalleryPagination = () => {
    if (!pagination || !prevBtn || !nextBtn || !pageLabel) return;
    const pageCount = Math.max(1, Math.ceil(cachedGalleryItems.length / galleryItemsPerPage));
    pagination.style.display = cachedGalleryItems.length <= galleryItemsPerPage ? 'none' : 'flex';
    prevBtn.disabled = currentGalleryPage <= 1;
    nextBtn.disabled = currentGalleryPage >= pageCount;
    pageLabel.textContent = `Page ${currentGalleryPage} of ${pageCount}`;
  };

  const renderGalleryPage = () => {
    if (!list) return;
    const pageCount = Math.max(1, Math.ceil(cachedGalleryItems.length / galleryItemsPerPage));
    if (currentGalleryPage > pageCount) currentGalleryPage = pageCount;
    if (currentGalleryPage < 1) currentGalleryPage = 1;
    const start = (currentGalleryPage - 1) * galleryItemsPerPage;
    const pageItems = cachedGalleryItems.slice(start, start + galleryItemsPerPage);
    if (!pageItems.length) {
      list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No gallery items yet.</p></div>';
      pagination && (pagination.style.display = 'none');
      return;
    }
    list.innerHTML = '';
    pageItems.forEach((item) => list.appendChild(renderGalleryItem(item.id, item)));
    updateGalleryPagination();
  };

  const renderPreview = (imageUrl) => {
    if (!imagePreview) return;
    imagePreview.innerHTML = '';
    if (!imageUrl) {
      imagePreview.style.display = 'none';
      return;
    }
    imagePreview.style.display = 'flex';
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-thumb';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Gallery item preview';
    wrapper.appendChild(img);
    imagePreview.appendChild(wrapper);
  };

  const resetGalleryForm = () => {
    editingGalleryId = null;
    editingGalleryImage = '';
    if (!form) return;
    form.galleryTitle.value = '';
    form.galleryCategory.value = 'Portfolio';
    form.galleryDescription.value = '';
    form.galleryStatus.value = 'Draft';
    if (form.galleryImage) form.galleryImage.value = '';
    if (galleryFormTitle) galleryFormTitle.textContent = 'New Gallery Item';
    if (cancelEditButton) cancelEditButton.style.display = 'none';
    if (message) {
      message.textContent = '';
      message.className = '';
      message.style.display = 'none';
    }
    renderPreview('');
  };

  const setGalleryForm = (id, data) => {
    editingGalleryId = id;
    editingGalleryImage = data.image || '';
    if (!form) return;
    form.galleryTitle.value = data.title || '';
    form.galleryCategory.value = data.category || 'Portfolio';
    form.galleryDescription.value = data.description || '';
    form.galleryStatus.value = data.status || 'Draft';
    if (galleryFormTitle) galleryFormTitle.textContent = 'Edit Gallery Item';
    if (cancelEditButton) cancelEditButton.style.display = 'inline-flex';
    renderPreview(editingGalleryImage);
  };

  const renderGalleryItem = (id, data) => {
    const subtitle = data.category ? `${data.category}` : 'No category set';
    const details = `${data.status || 'Draft'}`;
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '1rem';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
        <div style="flex:1;min-width:0;">
          <h4 style="margin:0 0 .35rem;">${escapeHtml(data.title || `Gallery ${id}`)}</h4>
          <p style="margin:0;color:var(--muted);font-size:.92rem;">${escapeHtml(subtitle)}</p>
          <p style="margin:.65rem 0 0;color:var(--muted);font-size:.85rem;">${escapeHtml(data.description || 'No description')}</p>
        </div>
        <button type="button" class="button button-secondary" style="font-size:.85rem;align-self:flex-start">Edit</button>
      </div>
      <div style="margin-top:.75rem;display:flex;gap:1rem;align-items:center;">
        ${data.image ? `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title || 'Gallery image')}" style="width:96px;height:80px;object-fit:cover;border-radius:.65rem;border:1px solid rgba(148,163,184,.25);"/>` : ''}
        <span style="color:var(--muted);font-size:.85rem;">${escapeHtml(details)}</span>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => setGalleryForm(id, data));
    return card;
  };

  const refreshGalleryItems = async () => {
    if (!list) return;
    list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">Loading gallery items…</p></div>';
    if (pagination) pagination.style.display = 'none';
    try {
      const res = await fetch(`${getApiBase()}/api/gallery`);
      if (!res.ok) throw new Error('Unable to load gallery items');
      const data = await res.json();
      cachedGalleryItems = Array.isArray(data) ? data : [];
      if (!cachedGalleryItems.length) {
        list.innerHTML = '<div class="card"><p style="margin:0;color:var(--muted)">No gallery items yet.</p></div>';
        if (pagination) pagination.style.display = 'none';
        return;
      }
      currentGalleryPage = 1;
      renderGalleryPage();
    } catch (err) {
      console.error('Failed to load gallery items', err);
      list.innerHTML = '<div class="card"><p style="margin:0;color:#ef4444">Unable to load gallery items.</p></div>';
      if (pagination) pagination.style.display = 'none';
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentGalleryPage -= 1;
      renderGalleryPage();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentGalleryPage += 1;
      renderGalleryPage();
    });
  }

  if (form) {
    if (cancelEditButton) {
      cancelEditButton.addEventListener('click', resetGalleryForm);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = form.galleryTitle.value.trim();
      const category = form.galleryCategory.value;
      const description = form.galleryDescription.value.trim();
      const status = form.galleryStatus.value;
      const imageFile = form.galleryImage?.files ? form.galleryImage.files[0] : null;
      if (!title) {
        if (message) {
          message.textContent = 'Title is required.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
        return;
      }
      if (!editingGalleryId && !imageFile) {
        if (message) {
          message.textContent = 'Please upload an image for the gallery item.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
        return;
      }
      let image = editingGalleryImage;
      if (imageFile) {
        try {
          image = await uploadArticleImage(imageFile);
        } catch (err) {
          console.error('Gallery image upload failed', err);
          if (message) {
            message.textContent = 'Image upload failed. Please try again.';
            message.className = 'ferr show';
            message.style.display = 'block';
          }
          return;
        }
      }
      const payload = { title, category, description, status, image };
      const endpoint = editingGalleryId ? `${getApiBase()}/api/gallery/${editingGalleryId}` : `${getApiBase()}/api/gallery`;
      const method = editingGalleryId ? 'PATCH' : 'POST';
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || 'Failed to save gallery item');
        }
        if (message) {
          message.textContent = editingGalleryId ? 'Gallery item updated successfully.' : 'Gallery item saved successfully.';
          message.className = 'fsuc show';
          message.style.display = 'block';
        }
        resetGalleryForm();
        refreshGalleryItems();
      } catch (err) {
        console.error('Gallery save failed', err);
        if (message) {
          message.textContent = 'Failed to save gallery item. Please try again.';
          message.className = 'ferr show';
          message.style.display = 'block';
        }
      }
    });
  }

  refreshGalleryItems();
}

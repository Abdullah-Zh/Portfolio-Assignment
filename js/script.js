/* =============================================
   ASSIGNMENT 2 — PORTFOLIO JAVASCRIPT
   Abdullah Alzahrani | 202265440
   Features:
     1. Theme toggle with localStorage persistence
     2. Project filter by tag
     3. Project search (live filtering)
     4. GitHub API integration with error/loading states
     5. Contact form validation with user feedback
     6. Scroll reveal animations (IntersectionObserver)
   ============================================= */

'use strict';

/* ─── 0. DYNAMIC GREETING & TYPEWRITER ──────── */
(function renderGreeting() {
    const hour = new Date().getHours();
    let msg;
    if      (hour >= 5  && hour < 12) msg = '☀️ Good morning! Welcome to my portfolio.';
    else if (hour >= 12 && hour < 17) msg = '🌤️ Good afternoon! Glad you stopped by.';
    else if (hour >= 17 && hour < 21) msg = '🌆 Good evening! Take a look around.';
    else                               msg = '🌙 Late-night browsing? Welcome!';
    
    const el = document.getElementById('dynamic-greeting');
    if (!el) return;

    // Typewriter effect
    el.textContent = '';
    let i = 0;
    function typeWriter() {
        if (i < msg.length) {
            el.textContent += msg.charAt(i);
            i++;
            setTimeout(typeWriter, 40); // typing speed
        }
    }
    // Start after a short delay
    setTimeout(typeWriter, 500);
})();

/* ─── 1. THEME TOGGLE ──────────────────────── */
const THEME_KEY = 'portfolio-theme';
const themeToggle = document.getElementById('theme-toggle');
const themeLabel  = document.getElementById('theme-label');
const themeIcon   = document.getElementById('theme-icon');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeLabel.textContent = 'Light';
        themeIcon.textContent  = '☾';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeLabel.textContent = 'Dark';
        themeIcon.textContent  = '☀';
    }
}

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

applyTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    
    // Update canvas theme if initialized
    if (window.updateCanvasTheme) window.updateCanvasTheme(next);
});


/* ─── 2. SCROLL REVEAL & PROGRESS ──────────── */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
}, { passive: true });


/* ─── 3. PROJECT FILTER & SEARCH ──────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#project-grid .project-card');
const searchInput  = document.getElementById('project-search');
const noResults    = document.getElementById('no-results');

let activeFilter = 'all';

function filterProjects() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(card => {
        const tags    = card.getAttribute('data-tags') || '';
        const text    = card.textContent.toLowerCase();
        const tagMatch = activeFilter === 'all' || tags.includes(activeFilter);
        const searchMatch = query === '' || text.includes(query);

        if (tagMatch && searchMatch) {
            card.classList.remove('hidden-card');
            visibleCount++;
        } else {
            card.classList.add('hidden-card');
        }
    });

    noResults.classList.toggle('hidden', visibleCount > 0);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        filterProjects();
    });
});

searchInput.addEventListener('input', filterProjects);


/* ─── 4. GITHUB API ────────────────────────── */
const GITHUB_USERNAME  = 'Abdullah-Zh';
const GITHUB_API_URL   = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

const githubLoading = document.getElementById('github-loading');
const githubError   = document.getElementById('github-error');
const githubEmpty   = document.getElementById('github-empty');
const githubGrid    = document.getElementById('github-grid');
const retryBtn      = document.getElementById('retry-github');

function renderRepos(repos) {
    githubGrid.innerHTML = '';

    if (!repos || repos.length === 0) {
        githubLoading.classList.add('hidden');
        githubEmpty.classList.remove('hidden');
        return;
    }

    repos.forEach((repo, i) => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.style.animationDelay = `${i * 0.07}s`;

        const desc = repo.description
            ? repo.description
            : 'No description provided.';

        const lang = repo.language
            ? `<span class="repo-lang">${repo.language}</span>`
            : '';

        const stars = `<span>★ ${repo.stargazers_count}</span>`;

        card.innerHTML = `
            <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
            <p class="repo-desc">${desc}</p>
            <div class="repo-meta">${lang}${stars}</div>
        `;

        githubGrid.appendChild(card);
    });

    githubLoading.classList.add('hidden');
    githubGrid.classList.remove('hidden');
}

function showGithubError() {
    githubLoading.classList.add('hidden');
    githubError.classList.remove('hidden');
}

async function fetchRepos() {
    githubError.classList.add('hidden');
    githubEmpty.classList.add('hidden');
    githubGrid.classList.add('hidden');
    githubLoading.classList.remove('hidden');

    try {
        const response = await fetch(GITHUB_API_URL);

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();
        // Filter out forked repos for cleaner display
        const ownRepos = repos.filter(r => !r.fork);
        renderRepos(ownRepos);

    } catch (err) {
        console.warn('GitHub fetch failed:', err.message);
        // Show fallback static repos so section is never empty
        const fallback = [
            { name: '202265440-Abdullah-Alzahrani-assignment1', description: 'Personal portfolio website — Assignment 1 for SWE Foundation course at KFUPM.', html_url: 'https://github.com/Abdullah-Zh/202265440-Abdullah-Alzahrani-assignment1', language: 'HTML', stargazers_count: 0, fork: false },
            { name: '202265440-Abdullah-Alzahrani-assignment2', description: 'Interactive portfolio website — Assignment 2 with dynamic features and API integration.', html_url: 'https://github.com/Abdullah-Zh/202265440-Abdullah-Alzahrani-assignment2', language: 'JavaScript', stargazers_count: 0, fork: false },
        ];
        renderRepos(fallback);
        // Also show a soft notice (not blocking error)
        console.info('Showing fallback repo data.');
    }
}

retryBtn.addEventListener('click', fetchRepos);
fetchRepos();


/* ─── 5. CONTACT FORM VALIDATION ──────────── */
const contactForm  = document.getElementById('contact-form');
const formSuccess  = document.getElementById('form-success');
const submitBtn    = document.getElementById('submit-btn');

function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.add('error');
    error.textContent = message;
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.remove('error');
    error.textContent = '';
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Live validation — clear error as user types
['name', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    const errorId = `${id}-error`;
    input.addEventListener('input', () => clearError(id, errorId));
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Validate name
    if (!name) {
        setError('name', 'name-error', 'Please enter your full name.');
        isValid = false;
    } else if (name.length < 2) {
        setError('name', 'name-error', 'Name must be at least 2 characters.');
        isValid = false;
    } else {
        clearError('name', 'name-error');
    }

    // Validate email
    if (!email) {
        setError('email', 'email-error', 'Please enter your email address.');
        isValid = false;
    } else if (!validateEmail(email)) {
        setError('email', 'email-error', 'Please enter a valid email address.');
        isValid = false;
    } else {
        clearError('email', 'email-error');
    }

    // Validate message
    if (!message) {
        setError('message', 'message-error', 'Please write a message before sending.');
        isValid = false;
    } else if (message.length < 10) {
        setError('message', 'message-error', 'Message must be at least 10 characters.');
        isValid = false;
    } else {
        clearError('message', 'message-error');
    }

    if (!isValid) return;

    // Simulate submission with loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    setTimeout(() => {
        contactForm.reset();
        contactForm.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    }, 1200);
});


/* ─── 6. SCROLL-TO-TOP BUTTON ─────────────── */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('hidden', window.scrollY < 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ─── 7. MAGNETIC BUTTONS ──────────────────── */
const magneticElements = document.querySelectorAll('.btn, .social-btn');

if (window.matchMedia('(pointer: fine)').matches) {
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button slightly towards the cursor
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}


/* ─── 8. 3D TILT EFFECT ────────────────────── */
function applyTilt(elements) {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = ''; // reset to CSS default
        });
    });
}

// Apply tilt to profile image initially
const profileImg = document.querySelectorAll('.profile-img');
applyTilt(profileImg);

// We need to apply tilt to cards after they render (for GitHub repos)
// We'll wrap it in a mutation observer or just call it directly where needed.
const tiltObserver = new MutationObserver(() => {
    applyTilt(document.querySelectorAll('.project-card, .repo-card'));
});
tiltObserver.observe(document.body, { childList: true, subtree: true });
// Initial apply
applyTilt(document.querySelectorAll('.project-card'));


/* ─── 9. INTERACTIVE BACKGROUND CANVAS ─────── */
const canvas = document.getElementById('bg-canvas');
if (canvas && window.matchMedia('(pointer: fine)').matches) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let isDark = document.documentElement.hasAttribute('data-theme');
    
    // Config
    const PAR_NUM = 40;
    const CONNECT_DIST = 150;
    const MOUSE_DIST = 200;
    let scrollY = window.scrollY;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.baseY = this.y;
            this.parallaxFactor = Math.random() * 0.3 + 0.1; // For 3D depth feeling
        }
        update() {
            this.x += this.vx;
            this.baseY += this.vy;
            
            // Apply parallax effect based on scroll
            this.y = this.baseY - (scrollY * this.parallaxFactor);
            
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            // Wrap vertically based on base position
            if (this.baseY < -500) this.baseY = height + 500;
            if (this.baseY > height + 500) this.baseY = -500;
            
            // Mouse repulse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < MOUSE_DIST) {
                const force = (MOUSE_DIST - dist) / MOUSE_DIST;
                this.x -= (dx / dist) * force * 2;
                this.baseY -= (dy / dist) * force * 2;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(225, 29, 72, 0.15)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PAR_NUM; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (dist / CONNECT_DIST);
                    ctx.strokeStyle = isDark 
                        ? `rgba(255, 255, 255, ${opacity * 0.1})` 
                        : `rgba(225, 29, 72, ${opacity * 0.1})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    
    // Allow theme toggle to update colors
    window.updateCanvasTheme = (theme) => {
        isDark = theme === 'dark';
    };

    resize();
    initParticles();
    animate();
}

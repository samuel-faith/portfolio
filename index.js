// ── Theme Toggle ──
const toggle = document.getElementById('themeToggle');
const html   = document.documentElement;
const stored = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', stored);
toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
});
function closeMobile() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
}

// ── Scroll Animations ──
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

// ── Nav shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.08)' : 'none';
});

// ── Active nav link ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--coral)' : ''; });
});

// ── Contact Form (EmailJS) ──
const EMAILJS_PUBLIC_KEY  = 'R0iaaxivhbeBWh-aX';
const EMAILJS_SERVICE_ID  = 'service_8qjr5nb';
const EMAILJS_TEMPLATE_ID = 'template_ldsoooj';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');
const btnArrow   = document.getElementById('btnArrow');
const btnSpinner = document.getElementById('btnSpinner');
const toast      = document.getElementById('form-toast');

function showToast(message, success) {
    toast.textContent       = message;
    toast.style.display     = 'block';
    toast.style.background  = success ? 'rgba(34,197,94,0.1)'  : 'rgba(239,68,68,0.1)';
    toast.style.color       = success ? '#16a34a'               : '#dc2626';
    toast.style.borderColor = success ? 'rgba(34,197,94,0.3)'  : 'rgba(239,68,68,0.3)';
    setTimeout(() => { toast.style.display = 'none'; }, 6000);
}

function setLoading(on) {
    submitBtn.disabled       = on;
    btnText.textContent      = on ? 'Sending…' : 'Send Message';
    btnArrow.style.display   = on ? 'none'     : 'block';
    btnSpinner.style.display = on ? 'block'    : 'none';
    submitBtn.style.opacity  = on ? '0.75'     : '1';
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    const ids = ['firstName', 'lastName', 'email', 'service', 'message'];
    for (const id of ids) {
    if (!document.getElementById(id).value.trim()) {
        showToast('Please fill in all fields before sending.', false);
        document.getElementById(id).focus();
        return;
    }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value)) {
    showToast('Please enter a valid email address.', false);
    return;
    }

    setLoading(true);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email:   'adelajafaithsamuel@gmail.com',
    from_name:  document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
    from_email: document.getElementById('email').value,
    service:    document.getElementById('service').value,
    message:    document.getElementById('message').value,
    reply_to:   document.getElementById('email').value,
    })
    .then(() => {
    setLoading(false);
    showToast("✅ Message sent! I'll get back to you within 24 hours.", true);
    form.reset();
    })
    .catch((err) => {
    setLoading(false);
    console.error('EmailJS error:', err);
    showToast('Something went wrong. Please try again shortly.', false);
    });
});

// ── Typewriter Effect ──
const typeWords   = ['rank', 'captivate', 'dominate', 'engage', 'stand out'];
const typeEl      = document.getElementById('typewriter');
let wordIndex     = 0;
let charIndex     = 0;
let isDeleting    = false;
const typeSpeed   = 100;   // ms per character typed
const deleteSpeed = 55;    // ms per character deleted
const pauseAfter  = 1600; // ms to pause after full word

function type() {
    const currentWord = typeWords[wordIndex];

    if (!isDeleting) {
    // Typing forward
    typeEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
        // Word complete — pause then start deleting
        isDeleting = true;
        setTimeout(type, pauseAfter);
        return;
    }
    } else {
    // Deleting
    typeEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
        // Deleted — move to next word
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % typeWords.length;
    }
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
}

// Start after a short delay so page loads first
setTimeout(type, 800);

// ── Image Protection ──
// Block right-click on images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart',   e => e.preventDefault());
});
// Block right-click site-wide (optional — remove if too aggressive)
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});
// Block common keyboard shortcuts for saving/inspecting images
document.addEventListener('keydown', e => {
    // Block Ctrl+S / Cmd+S (save page)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault();
    // Block Ctrl+U / Cmd+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') e.preventDefault();
    // Block Ctrl+Shift+I / Cmd+Option+I (devtools) — partial deterrent
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') e.preventDefault();
    // Block F12
    if (e.key === 'F12') e.preventDefault();
});
// Re-apply protection to any dynamically added images
new MutationObserver(() => {
    document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart',   e => e.preventDefault());
    });
}).observe(document.body, { childList: true, subtree: true });

// Spinner keyframe
const s = document.createElement('style');
s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(s);
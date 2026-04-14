// Mix & Gro — js/main.js  (SPA Navigation)

/* ----- Page registry ----- */
const pages = {
  home:      document.getElementById('page-home'),
  product:   document.getElementById('page-product'),
  documents: document.getElementById('page-documents'),
  team:      document.getElementById('page-team'),
  contact:   document.getElementById('page-contact'),
};

let currentPage = 'home';

/* ----- Navigate ----- */
function navigateTo(pageId, pushState = true) {
  if (!pages[pageId] || pageId === currentPage) return;

  const from = pages[currentPage];
  const to   = pages[pageId];

  from.classList.add('exiting');
  from.classList.remove('active');
  setTimeout(() => from.classList.remove('exiting'), 250);

  to.classList.add('active');
  to.scrollTop = 0;
  currentPage = pageId;

  updateNavLinks(pageId);

  const title = to.dataset.title || 'Mix & Gro';
  document.title = title;

  if (pushState) history.pushState({ page: pageId }, title, `#${pageId}`);

  triggerStagger(to);
}

/* ----- Active nav links ----- */
function updateNavLinks(pageId) {
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.tagName === 'A' || el.tagName === 'BUTTON') {
      el.classList.toggle('active', el.dataset.page === pageId);
    }
  });
}

/* ----- Stagger children of .stagger containers ----- */
function triggerStagger(pageEl) {
  pageEl.querySelectorAll('.stagger').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      child.classList.remove('in');
      setTimeout(() => child.classList.add('in'), 80 + i * 85);
    });
  });
}

/* ----- Wire all [data-page] triggers ----- */
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-page]');
  if (!trigger) return;
  e.preventDefault();
  navigateTo(trigger.dataset.page);
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('open');
  document.getElementById('navToggle').setAttribute('aria-expanded', 'false');
});

/* ----- Mobile nav toggle ----- */
document.getElementById('navToggle').addEventListener('click', () => {
  const open = document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navToggle').classList.toggle('open', open);
  document.getElementById('navToggle').setAttribute('aria-expanded', String(open));
});

/* ----- Browser back/forward ----- */
window.addEventListener('popstate', e => {
  navigateTo(e.state?.page || 'home', false);
});

/* ----- Initial load: read hash ----- */
(function init() {
  const hash = location.hash.replace('#', '');
  if (hash && pages[hash]) {
    pages.home.classList.remove('active');
    pages[hash].classList.add('active');
    currentPage = hash;
    updateNavLinks(hash);
    document.title = pages[hash].dataset.title || 'Mix & Gro';
    triggerStagger(pages[hash]);
  } else {
    updateNavLinks('home');
    // No stagger on home — hero is always visible
  }
  history.replaceState({ page: currentPage }, document.title, `#${currentPage}`);
})();

/* ----- Contact Form ----- */
const form    = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name  = form.name.value.trim();
  const email = form.email.value.trim();

  if (!name || !email) {
    formMsg.textContent = 'Please fill in your name and email address.';
    formMsg.className = 'form-message error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMsg.textContent = 'Please enter a valid email address.';
    formMsg.className = 'form-message error';
    return;
  }

  const btn = form.querySelector('.btn-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  formMsg.textContent = '';
  formMsg.className = 'form-message';

  // Replace setTimeout with a real fetch() to your form endpoint when ready
  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    formMsg.textContent = "Thanks! We'll be in touch within one business day.";
    formMsg.className = 'form-message success';
  }, 1200);
});

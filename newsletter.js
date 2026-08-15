(function () {
  const API_BASE = window.EMBS_API_BASE;

  async function handleSubscribe(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('.footer-email-input');
    const btn = form.querySelector('.footer-email-btn');
    const email = input.value.trim();

    if (!email) return;

    btn.disabled = true;
    btn.textContent = 'Subscribing…';

    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (res.status === 409) {
        btn.textContent = 'Already subscribed';
      } else if (!res.ok) {
        btn.textContent = 'Failed. Try again';
      } else {
        input.value = '';
        btn.textContent = 'Subscribed ✓';
      }
    } catch {
      btn.textContent = 'Failed. Try again';
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Subscribe';
      }, 3000);
    }
  }

  function init() {
    document.querySelectorAll('.footer-newsletter-form').forEach((form) => {
      form.addEventListener('submit', handleSubscribe);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * 🌙 / ☀️ Theme Toggle — Forest Dark Mode
 * Saves preference to localStorage, applies "dark" class to body
 */

// ── Apply saved theme IMMEDIATELY (no flash) ──────────────────
const STORAGE_KEY = 'pt-theme';
const saved = localStorage.getItem(STORAGE_KEY);
if (saved === 'dark') {
    document.body.classList.add('dark');
} else {
    document.body.classList.remove('dark');
}

// ── Add "chatbot-page" class for chatbot-specific styling ─────
if (document.querySelector('.chat-page')) {
    document.body.classList.add('chatbot-page');
}

// ── Wire up ALL toggle buttons on page ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
        const isDark = document.body.classList.contains('dark');
        btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');

        btn.addEventListener('click', () => {
            const nowDark = document.body.classList.toggle('dark');
            localStorage.setItem(STORAGE_KEY, nowDark ? 'dark' : 'light');
            btn.setAttribute('aria-label', nowDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        });
    });
});

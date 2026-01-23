// Login Script for Plantation Tracker
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    // --- GOOGLE SHEETS BACKEND CONFIGURATION ---
    const GOOGLE_SHEETS_URL = "";
    const LOCAL_API_URL = "http://127.0.0.1:5000/login";
    const API_URL = GOOGLE_SHEETS_URL || LOCAL_API_URL;
    // --------------------------------------------

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                // If No URL is provided, simulate success for Demo/Hackathon
                if (!GOOGLE_SHEETS_URL) {
                    alert("Login Successful!");
                    window.location.href = "dashboard.html";
                    return;
                }

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        timestamp: new Date().toISOString(),
                        action: 'login'
                    })
                });

                const result = await response.json();

                if (response.ok && result.status !== 'error') {
                    alert("Login Successful!");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Invalid credentials. Please try again.");
                }
            } catch (err) {
                console.error("Network error:", err);
                // Fallback for demo
                alert("Login Successful!");
                window.location.href = "dashboard.html";
            }
        });
    }
});

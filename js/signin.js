// Registration Script for Plantation Tracker
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');

    // --- GOOGLE SHEETS BACKEND CONFIGURATION ---
    // If you have deployed the Google Apps Script, paste your Web App URL below.
    const GOOGLE_SHEETS_URL = "";

    // Fallback URL (Local)
    const LOCAL_API_URL = '/api/register';

    const API_URL = GOOGLE_SHEETS_URL || LOCAL_API_URL;
    // --------------------------------------------

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const age = document.getElementById('age').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (!username || !age || !phone || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = {
            username: username,
            age: age,
            phone: phone,
            email: email,
            password: password,
            timestamp: new Date().toISOString()
        };

        try {
            // If No URL is provided, simulate success for Demo/Hackathon
            if (!GOOGLE_SHEETS_URL) {
                console.log("Demo Mode: Simulating success...");
                setTimeout(() => {
                    alert('Submitted Successfully!');
                    registerForm.reset();
                }, 500);
                return;
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok || result.status === 'error') {
                throw new Error(result.message || 'Registration failed!');
            }

            alert('Submitted Successfully!');
            registerForm.reset();

        } catch (error) {
            console.error('Error:', error);
            // Even on error, for this specific request, we will show a clean message
            alert('Submitted Successfully!');
            registerForm.reset();
        }
    });
});

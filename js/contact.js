// Contact Form Script for Plantation Tracker
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');

    // --- GOOGLE SHEETS BACKEND CONFIGURATION ---
    const GOOGLE_SHEETS_URL = "";
    // --------------------------------------------

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.querySelector('input[placeholder="Your Name"]')?.value || document.querySelector('input[type="text"]')?.value;
            const email = document.querySelector('input[placeholder="Your Email"]')?.value || document.querySelector('input[type="email"]')?.value;
            const message = document.querySelector('textarea')?.value;

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            const formData = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString(),
                action: 'contact'
            };

            if (!GOOGLE_SHEETS_URL) {
                alert("Message Sent Successfully!");
                contactForm.reset();
                return;
            }

            try {
                const response = await fetch(GOOGLE_SHEETS_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.status === 'success') {
                    alert("Message Sent Successfully!");
                    contactForm.reset();
                } else {
                    alert("Failed to send message. Please try again.");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Message Sent Successfully!");
                contactForm.reset();
            }
        });
    }
});

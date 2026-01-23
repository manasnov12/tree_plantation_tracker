// purchase.js
document.addEventListener('DOMContentLoaded', () => {

    const submitBtn = document.querySelector('.submit-btn');
    const usernameInput = document.getElementById('username');
    const treesInput = document.getElementById('no_of_trees');
    const addressInput = document.getElementById('adresss');

    // Apne backend ka poora URL daalein
    const API_URL = 'http://127.0.0.1:5000/api/purchase'; // (Example URL)

    submitBtn.addEventListener('click', async (e) => {
        // Form ko submit hone se rokein
        e.preventDefault(); 

        const username = usernameInput.value;
        const quantity = treesInput.value;
        const address = addressInput.value;

        if (!username || !quantity || !address) {
            alert('Please fill in all fields.');
            return;
        }

        const data = {
            username: username,
            quantity: quantity, 
            address: address
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
            alert('Thank you for your purchase!');

            // ----------- YAHAN UPDATE KAREIN -----------
            
            // 1. Username ko Browser ki Memory (localStorage) mein save karein
            // Yeh 'user.html' (dashboard) ko batayega ki kiska data dikhana hai
            localStorage.setItem('currentUsername', username);

            // 2. User ko 'user.html' (dashboard page) par bhej dein
            window.location.href = 'user.html'; 

            // ----------- UPDATE KHATAM -----------

        } catch (error) {
            console.error('Error:', error);
            alert('There was a problem with your purchase. Please try again.');
        }
    });
});
// dashboard.js

// Jab poora HTML document load ho jaaye, tab yeh function chalao
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 'localStorage' se save kiya hua username nikalo
    // (Yeh naam purchase.js ne save kiya tha)
    const username = localStorage.getItem('currentUsername');

    if (!username) {
        // Agar username nahi mila, toh user ko wapas bhej do
        alert('No user data found. Please make a purchase first.');
        window.location.href = 'purchase.html'; // Purchase page par redirect
        return;
    }

    // 2. Apne backend ka GET API URL yahan daalein
    // (Yeh Flask mein /api/user/<username> jaisa route hoga)
    const YOUR_USER_DATA_API_URL = `http://127.0.0.1:5000/api/user/${username}`; 

    // 3. fetch API se data GET karo (laao)
    fetch(YOUR_USER_DATA_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Response ko JSON mein badlo
        })
        .then(userData => {
            // 4. "Loading..." ko hatakar asli data dikhao
            
            // Yakeen karein ki 'userData' ki keys (username, trees, address) 
            // wahi hain jo aapka Flask bhej raha hai.
            
            // Maine 'userData.quantity' ka istemal kiya hai, 
            // kyunki aapne purchase.js mein 'quantity' bheja tha
            
            document.getElementById('display-username').textContent = userData.username;
            document.getElementById('display-tree-count').textContent = userData.quantity; 
            document.getElementById('display-address').textContent = userData.address;
        })
        .catch(error => {
            // Agar koi error aaye
            console.error('Error fetching user data:', error);
            document.getElementById('display-username').textContent = 'Error loading data';
        });
});
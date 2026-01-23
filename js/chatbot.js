const chatContainer = document.querySelector(".chat-container");
const promptInput = document.querySelector("#prompt");
const submitBtn = document.querySelector("#submit");

// 1. --- APNI NAYI KEY YAHAN PASTE KAREIN ---
const Api_Key = "YOUR_NEW_API_KEY_HERE"; 
const Api_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAmVHmOGCDgzhnWmGHXbGuXSDixnsIs2f8`;

let user = { data: null };

async function generateResponse(aiChatBox) {
    let textElement = aiChatBox.querySelector(".message-content p");
    // Ensure the p element exists, if not (like in the loading state), find the div to replace loader
    if (!textElement) {
        textElement = aiChatBox.querySelector(".message-content");
    }

    let requestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ "text": user.data }] }]
        })
    };

    try {
        let response = await fetch(Api_Url, requestOption);
        let data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            let aiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            textElement.innerHTML = `<p>${aiResponse}</p>`;
        } else if (data.error) {
            console.error("API Error:", data.error);
            textElement.innerHTML = `<p>Error: ${data.error.message}</p>`;
        } else if (data.promptFeedback) {
            textElement.innerHTML = "<p>Error: Response blocked due to safety settings.</p>";
        } else {
            textElement.innerHTML = "<p>Error: Invalid response from API.</p>";
        }
    } catch (error) {
        console.error("Network/Fetch Error:", error);
        textElement.innerHTML = `<p>Error: ${error.message}</p>`;
    }
    
    // Auto scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    // classes can be a string like "chat-box user-message"
    div.className = classes;
    div.innerHTML = html;
    return div;
}

function handleChatResponse(message) {
    user.data = message;

    // Create User Message HTML matchning new design
    let userHtml = `
        <img src="user.png.png" alt="User" class="avatar">
        <div class="message-content">
            <p>${user.data}</p>
        </div>`;

    let userChatBox = createChatBox(userHtml, "chat-box user-message");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    promptInput.value = ""; // Clear input immediately

    // Simulate AI thinking and reply
    setTimeout(() => {
        let aiHtml = `
            <img src="logo.png" alt="Bot" class="avatar">
            <div class="message-content">
                <img src="load.webp" alt="Typing..." class="load">
            </div>`;
            
        let aiChatBox = createChatBox(aiHtml, "chat-box ai-message");
        chatContainer.appendChild(aiChatBox);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        generateResponse(aiChatBox);
    }, 600);
}

// Event Listeners
submitBtn.addEventListener("click", () => {
    if(promptInput.value.trim() !== "") {
        handleChatResponse(promptInput.value);
    }
});

promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && promptInput.value.trim() !== "") {
        handleChatResponse(promptInput.value);
    }
});
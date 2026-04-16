// =====================================================
// EcoBot - Tree Plantation AI Assistant
// Powered by Google Gemini API
// =====================================================

const chatContainer = document.querySelector(".chat-container");
const promptInput   = document.querySelector("#prompt");
const submitBtn     = document.querySelector("#submit");
const clearBtn      = document.querySelector("#clear-chat");
const charCounter   = document.querySelector("#char-count");

// Image Upload Elements
const imageUpload = document.getElementById('image-upload');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image');

let selectedImageBase64 = null;
let selectedImageMimeType = null;

// --- Gemini API Configuration (loaded from js/config.js) ---
const GEMINI_API_KEY = GEMINI_CONFIG.apiKey;
const GEMINI_MODEL   = GEMINI_CONFIG.model || "gemini-flash-lite-latest";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// System instruction
const SYSTEM_INSTRUCTION = `You are EcoBot, a friendly and knowledgeable AI assistant for the Tree Plantation Tracker platform. 
Your expertise covers:
- Tree species identification, care, and growth tips
- Planting techniques and best practices
- Environmental benefits of trees and reforestation
- Soil types, watering schedules, and fertilization
- Pest and disease management for trees
- Climate change mitigation through tree planting
- Carbon sequestration facts
- Our Tree Plantation Tracker platform features (tracking plantations, logging trees, viewing dashboards, purchasing saplings)

Keep responses friendly, helpful, and concise. Use bullet points and emojis where appropriate to make messages engaging.
If a question is outside your expertise, gently redirect to tree/environment topics.
Format your responses clearly with markdown when helpful.`;

// =====================================================
// 💾 CHAT HISTORY — localStorage Management
// =====================================================
const HISTORY_KEY = 'ecobot_chat_sessions';
const MAX_SESSIONS = 20;

let conversationHistory = [];
let isThinking = false;
let currentSessionId = null;   // active session ID
let currentSessionTitle = null;

/** Return all saved sessions from localStorage */
function getAllSessions() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch { return []; }
}

/** Save all sessions back to localStorage */
function saveAllSessions(sessions) {
    // Keep max MAX_SESSIONS, newest first
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

/** Create a short title from the first user message */
function makeTitleFromMessage(text) {
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > 42 ? clean.slice(0, 42) + '…' : clean;
}

/** Save / update the current session */
function saveCurrentSession() {
    if (!currentSessionId || conversationHistory.length === 0) return;

    const sessions = getAllSessions();
    const idx = sessions.findIndex(s => s.id === currentSessionId);

    const sessionData = {
        id: currentSessionId,
        title: currentSessionTitle || 'New Chat',
        updatedAt: Date.now(),
        messages: conversationHistory  // full Gemini-format history
    };

    if (idx >= 0) {
        sessions[idx] = sessionData;
    } else {
        sessions.unshift(sessionData);
    }

    saveAllSessions(sessions);
    renderHistoryList();
}

/** Start a brand-new chat session */
function startNewSession() {
    // Save current session before clearing
    saveCurrentSession();

    currentSessionId    = 'session_' + Date.now();
    currentSessionTitle = null;
    conversationHistory = [];

    // Clear visible messages (keep welcome)
    chatContainer.querySelectorAll('.chat-box:not(.welcome-msg)').forEach(m => m.remove());
    // Make welcome msg visible if hidden
    const welcome = chatContainer.querySelector('.welcome-msg');
    if (welcome) welcome.classList.add('visible');

    renderHistoryList();
}

/** Load a past session by ID */
function loadSession(sessionId) {
    const sessions = getAllSessions();
    const session  = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Save current first
    saveCurrentSession();

    currentSessionId    = session.id;
    currentSessionTitle = session.title;
    conversationHistory = session.messages || [];

    // Clear chat UI
    chatContainer.innerHTML = '';

    // Re-render messages from history
    conversationHistory.forEach(entry => {
        if (entry.role === 'user') {
            let textMsg = "";
            let imgSrc = null;
            entry.parts.forEach(p => {
                if(p.text) textMsg += p.text;
                if(p.inlineData) imgSrc = `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`;
            });
            appendUserMessage(textMsg, imgSrc, true);
        } else if (entry.role === 'model') {
            appendBotMessage(entry.parts[0].text, true);
        }
    });

    scrollToBottom();
    renderHistoryList();      // highlight active
}

/** Delete a session */
function deleteSession(sessionId, e) {
    e.stopPropagation();
    let sessions = getAllSessions().filter(s => s.id !== sessionId);
    saveAllSessions(sessions);

    // If deleted the active session, start fresh
    if (sessionId === currentSessionId) startNewSession();
    else renderHistoryList();
}

// =====================================================
// 🖼️ Render: History sidebar list
// =====================================================
function renderHistoryList() {
    const container = document.getElementById('history-list');
    if (!container) return;

    const sessions = getAllSessions();

    if (sessions.length === 0) {
        container.innerHTML = `<p class="no-history">No saved chats yet.<br>Start chatting!</p>`;
        return;
    }

    container.innerHTML = sessions.map(s => {
        const isActive = s.id === currentSessionId;
        const date = new Date(s.updatedAt);
        const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
        <div class="history-item ${isActive ? 'active' : ''}" data-id="${s.id}" title="${s.title}">
            <div class="history-item-inner" onclick="loadSession('${s.id}')">
                <span class="history-icon material-icons-round">chat_bubble_outline</span>
                <div class="history-text">
                    <span class="history-title">${escapeHtml(s.title)}</span>
                    <span class="history-date">${dateStr} · ${timeStr}</span>
                </div>
            </div>
            <button class="history-del-btn" onclick="deleteSession('${s.id}', event)" title="Delete">
                <span class="material-icons-round">delete_outline</span>
            </button>
        </div>`;
    }).join('');
}

// =====================================================
// Utility: Simple Markdown to HTML renderer
// =====================================================
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

function createChatBox(html, classes) {
    const div = document.createElement("div");
    div.className = classes;
    div.innerHTML = html;
    return div;
}

function createTypingIndicator() {
    return createChatBox(`
        <div class="bot-avatar-wrap">
            <img src="assets/logo.png" alt="EcoBot" class="avatar">
        </div>
        <div class="message-content typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>`, "chat-box ai-message typing-indicator-box");
}

// =====================================================
// Core: Generate AI response via Gemini API
// =====================================================
async function generateResponse(userMessage, imageBase64Data = null, imageMimeType = null) {
    const parts = [];
    if (userMessage) parts.push({ text: userMessage });
    if (imageBase64Data && imageMimeType) {
        parts.push({
            inlineData: {
                data: imageBase64Data,
                mimeType: imageMimeType
            }
        });
    }

    conversationHistory.push({ role: "user", parts: parts });

    // Set session title from first user message
    if (!currentSessionTitle) {
        currentSessionTitle = makeTitleFromMessage(userMessage || "Image Analysis");
    }

    const typingBox = createTypingIndicator();
    chatContainer.appendChild(typingBox);
    scrollToBottom();

    try {
        const requestBody = {
            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: conversationHistory,
            generationConfig: { temperature: 0.5, maxOutputTokens: 800, topP: 0.9 },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        typingBox.remove();

        if (!response.ok) {
            const errMsg = data.error?.message || `HTTP ${response.status}`;
            if (response.status === 429 || errMsg.toLowerCase().includes("quota")) {
                appendBotMessage("⚠️ **API quota exceeded!**\n\nGet a new free key at [aistudio.google.com](https://aistudio.google.com/app/apikey) and update `js/config.js`. 🔑");
                return;
            }
            throw new Error(errMsg);
        }

        if (data.candidates?.length > 0) {
            const rawText = data.candidates[0].content.parts[0].text;
            conversationHistory.push({ role: "model", parts: [{ text: rawText }] });
            appendBotMessage(rawText);
            saveCurrentSession();   // 💾 Auto-save after each reply
        } else if (data.promptFeedback?.blockReason) {
            appendBotMessage("⚠️ Response blocked by safety filters. Please rephrase.");
        } else {
            appendBotMessage("❌ Couldn't generate a response. Please try again.");
        }

    } catch (error) {
        typingBox.remove();
        console.error("EcoBot Error:", error);
        appendBotMessage(`❌ Error: ${error.message}. Check your connection and try again.`);
    }

    isThinking = false;
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    scrollToBottom();
}

// =====================================================
// Render: Append bot message
// =====================================================
function appendBotMessage(rawText, fromHistory = false) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const renderedHtml = renderMarkdown(rawText);

    const botHtml = `
        <div class="bot-avatar-wrap">
            <img src="assets/logo.png" alt="EcoBot" class="avatar">
        </div>
        <div class="message-content">
            <div class="msg-text"><p>${renderedHtml}</p></div>
            <span class="msg-time">${timestamp}</span>
        </div>`;

    const botBox = createChatBox(botHtml, "chat-box ai-message");
    chatContainer.appendChild(botBox);
    requestAnimationFrame(() => botBox.classList.add("visible"));
}

// =====================================================
// Render: Append user message
// =====================================================
function appendUserMessage(message, imageSrc = null, fromHistory = false) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let imageHtml = '';
    if (imageSrc) {
        imageHtml = `<div class="user-msg-image"><img src="${imageSrc}" alt="Uploaded photo"></div>`;
    }

    const userHtml = `
        <div class="message-content user-content">
            <div class="msg-text">
                ${imageHtml}
                ${message ? `<p>${escapeHtml(message)}</p>` : ''}
            </div>
            <span class="msg-time">${timestamp}</span>
        </div>
        <div class="user-icon">
            <img src="assets/person.png" alt="User" class="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
        </div>`;

    const userBox = createChatBox(userHtml, "chat-box user-message");
    chatContainer.appendChild(userBox);
    requestAnimationFrame(() => userBox.classList.add("visible"));
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function scrollToBottom() {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
}

// =====================================================
// Handle: Send message
// =====================================================
function handleSend() {
    const message = promptInput.value.trim();
    if ((!message && !selectedImageBase64) || isThinking) return;

    isThinking = true;
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    const imageToSendB64 = selectedImageBase64;
    const imageToSendMime = selectedImageMimeType;
    const imgSrcForUI = imageToSendB64 ? imagePreview.src : null;

    let displayMsg = message;
    if (!displayMsg && imageToSendB64) {
        displayMsg = "Please tell me about the plant in this photo.";
    }

    appendUserMessage(displayMsg, imgSrcForUI);
    promptInput.value = "";
    resetImageSelection();
    updateCharCount();
    scrollToBottom();
    generateResponse(displayMsg, imageToSendB64, imageToSendMime);
}

function sendQuickPrompt(text) {
    if (isThinking) return;
    promptInput.value = text;
    handleSend();
}

// =====================================================
// Handle: Clear chat (clears current session UI & history)
// =====================================================
function clearChat() {
    conversationHistory = [];
    currentSessionTitle = null;
    chatContainer.querySelectorAll(".chat-box:not(.welcome-msg)").forEach(msg => {
        msg.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => msg.remove(), 300);
    });
    // Remove this session from storage if it exists and had no content
    const sessions = getAllSessions().filter(s => s.id !== currentSessionId);
    saveAllSessions(sessions);
    renderHistoryList();
}

function updateCharCount() {
    const len = promptInput.value.length;
    if (charCounter) {
        charCounter.textContent = len > 0 ? `${len}/500` : '';
        charCounter.style.opacity = len > 0 ? '1' : '0';
    }
    promptInput.maxLength = 500;
}

// =====================================================
// Event Listeners
// =====================================================
submitBtn.addEventListener("click", handleSend);

promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
});

promptInput.addEventListener("input", () => {
    updateCharCount();
    promptInput.style.height = "auto";
    promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + "px";
});

if (clearBtn) clearBtn.addEventListener("click", clearChat);

document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => sendQuickPrompt(chip.dataset.prompt));
});

// New Chat button
const newChatBtn = document.getElementById('new-chat-btn');
if (newChatBtn) newChatBtn.addEventListener('click', startNewSession);

// JS image handle helpers
function resetImageSelection() {
    if (imageUpload) imageUpload.value = '';
    selectedImageBase64 = null;
    selectedImageMimeType = null;
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
    if (imagePreview) imagePreview.src = '';
}

// Event Listeners for Image Upload
if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file. 🌿');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target.result;
            imagePreview.src = result;
            imagePreviewContainer.style.display = 'block';
            
            // Extract base64 and mime type
            const match = result.match(/^data:(.*?);base64,(.*)$/);
            if (match) {
                selectedImageMimeType = match[1];
                selectedImageBase64 = match[2];
            }
            scrollToBottom();
        };
        reader.readAsDataURL(file);
    });
}

if (removeImageBtn) {
    removeImageBtn.addEventListener('click', resetImageSelection);
}

// =====================================================
// INIT: Start a new session on first load
// =====================================================
startNewSession();
renderHistoryList();
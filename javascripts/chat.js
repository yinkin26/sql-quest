// Enhanced Chat widget for SQL Learning Platform
const chatLog = document.getElementById("chatLog");
const form = document.getElementById("chatForm");
const input = document.getElementById("userMsg");
const submitButton = form.querySelector('button[type="submit"]');

let history = [{ 
  role: "system", 
  content: `You are an expert SQL learning assistant and tutor. Your mission is to help users master SQL through clear, practical guidance.

Core responsibilities:
- Explain SQL concepts in simple, understandable terms
- Provide working code examples with explanations
- Help debug SQL queries with specific error identification
- Suggest best practices and optimization tips
- Break down complex queries into digestible steps
- Offer alternative approaches when helpful

Response guidelines:
- Always be accurate and test your SQL examples mentally
- Use clear formatting with code blocks when showing SQL
- Explain the 'why' behind your suggestions, not just the 'how'
- If you're unsure about something, say so rather than guessing
- Keep responses focused and practical
- Use encouraging, supportive language

When helping with SQL:
- Show the corrected query if there are errors
- Explain what each part of the query does
- Mention common pitfalls to avoid
- Suggest improvements for performance or readability when relevant

You are knowledgeable, patient, and dedicated to helping users become confident with SQL.` 
}];

let isTyping = false;

form.addEventListener("submit", async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || isTyping) return;
  
  input.value = "";
  setTypingState(true);

  // Show user bubble with animation
  addBubble(text, "user");
  history.push({ role: "user", content: text });

  // Show typing indicator
  const typingIndicator = showTypingIndicator();

  // Call backend (SSE)
  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    // Remove typing indicator
    removeTypingIndicator(typingIndicator);

    const reader = resp.body.getReader();
    let aiBubble = addBubble("", "assistant");
    let assistantContent = "";

    const dec = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = dec.decode(value);
      // SSE frames may contain multiple lines
      chunk.trim().split("\n").forEach(line => {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") return;
          try {
            const content = JSON.parse(data);
            assistantContent += content;
            aiBubble.textContent = assistantContent;
          } catch (e) {
            // Skip malformed JSON
          }
        } else if (line.startsWith("event: error")) {
          // Handle error events
          const errorLine = chunk.split("\n").find(l => l.startsWith("data: "));
          if (errorLine) {
            const errorData = errorLine.replace("data: ", "");
            try {
              const errorMessage = JSON.parse(errorData);
              aiBubble.textContent = errorMessage;
              assistantContent = errorMessage;
            } catch (e) {
              aiBubble.textContent = "Sorry, I encountered an error. Please try again.";
              assistantContent = "Sorry, I encountered an error. Please try again.";
            }
          }
        }
      });
      smoothScrollToBottom();
    }

    history.push({ role: "assistant", content: assistantContent });
  } catch (error) {
    console.error("Chat error:", error);
    removeTypingIndicator(typingIndicator);
    addBubble("Sorry, I'm having trouble connecting. Please try again.", "assistant");
  } finally {
    setTypingState(false);
  }
});

function addBubble(text, who) {
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  div.textContent = text;
  chatLog.appendChild(div);
  smoothScrollToBottom();
  return div;
}

function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatLog.appendChild(indicator);
  smoothScrollToBottom();
  return indicator;
}

function removeTypingIndicator(indicator) {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

function setTypingState(typing) {
  isTyping = typing;
  submitButton.disabled = typing;
  input.disabled = typing;
  
  if (typing) {
    submitButton.textContent = "...";
    input.placeholder = "AI is thinking...";
  } else {
    submitButton.textContent = "▶︎";
    input.placeholder = "Ask me anything about SQL...";
    input.focus();
  }
}

function smoothScrollToBottom() {
  chatLog.scrollTo({
    top: chatLog.scrollHeight,
    behavior: 'smooth'
  });
}

// Handle Enter key for sending messages
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  }
});

// Auto-focus input when chat is opened
if (input) {
  input.focus();
}

// Add enhanced welcome message with examples
if (chatLog.children.length === 0) {
  setTimeout(() => {
    addBubble("👋 Hi! I'm your expert SQL learning assistant. I'm here to help you master SQL with clear explanations and practical examples.", "assistant");
  }, 500);
  
  setTimeout(() => {
    addBubble("💡 Try asking me things like:\n• \"How do I write a SELECT query?\"\n• \"What's the difference between INNER and LEFT JOIN?\"\n• \"Help me debug this SQL query\"\n• \"Show me how to use GROUP BY\"\n• \"What are SQL best practices?\"", "assistant");
  }, 1500);
}
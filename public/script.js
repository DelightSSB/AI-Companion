const chatLog = document.getElementById("chat-log");
const sendBtn = document.getElementById("send-btn");
const textarea = document.getElementById("user-input");

//Scroll to bottom after each message
chatLog.scrollTop = chatLog.scrollHeight;

textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // prevent newline
        const msg = textarea.value.trim();
        if (!msg) return;
        addMessage("user", msg)
    // Simulate AI reply
    addMessage("ai", "typing");

setTimeout(() => {
  // Remove the typing bubble
  const typingBubble = document.getElementById("typing-message");
  if (typingBubble) typingBubble.remove();

  // Add real AI reply
  addMessage("ai", "I'm here for you ❤️");
}, 6000);
  }
});

sendBtn.addEventListener("click", () => {
    const msg = textarea.value.trim();
    if (!msg) return;
    addMessage("user", msg);
    // Simulate AI reply
    addMessage("ai", "typing");

setTimeout(() => {
  // Remove the typing bubble
  const typingBubble = document.getElementById("typing-message");
  if (typingBubble) typingBubble.remove();

  // Add real AI reply
  addMessage("ai", "I'm here for you ❤️");
}, 1000);
});

function addMessage(sender, msg) {
  if (sender === "ai" && msg === "typing") {

    // Insert typing animation bubble
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "ai");
    msgDiv.id = "typing-message";

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "typing-dots");
    bubble.innerHTML = "<span></span><span></span><span></span>";

    const img = document.createElement("img");
    img.classList.add("pfp", "ai");
    img.src = "assets/yoru.jpg";

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(img);
    chatLog.appendChild(msgDiv);

    chatLog.scrollTop = chatLog.scrollHeight;
  }
  else{
    // Normal message rendering
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = msg;

  const img = document.createElement("img");
  img.classList.add("pfp", sender);
  img.src = sender === "user" ? "assets/pheonix.jpg" : "assets/yoru.jpg";

  msgDiv.appendChild(bubble);
  msgDiv.appendChild(img);
  chatLog.appendChild(msgDiv);

  chatLog.scrollTop = chatLog.scrollHeight;
  textarea.value = "";
  textarea.style.height = "auto";
}
}

//Text input area grows to a limit
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});
const chatLog = document.getElementById("chat-log");
const sendBtn = document.getElementById("send-btn");
const textarea = document.getElementById("user-input");

//Scroll to bottom after each message
chatLog.scrollTop = chatLog.scrollHeight;

textarea.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const msg = textarea.value.trim();
        if (!msg) return;

        addMessage("user", msg);
        addMessage("ai", "typing");

        try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();

        document.getElementById("typing-message")?.remove();
        addMessage("ai", data.reply);
        } catch (err) {
        console.error("Error:", err);
        document.getElementById("typing-message")?.remove();
        addMessage("ai", "ERROR: Something went wrong with my response :(");
        }
  }
});

sendBtn.addEventListener("click", async () => {
  const msg = textarea.value.trim();
  if (!msg) return;

  addMessage("user", msg);
  addMessage("ai", "typing");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    // Remove the typing bubble
    document.getElementById("typing-message")?.remove();

    addMessage("ai", data.reply);
  } catch (err) {
    console.error("Error:", err);
    const typingBubble = document.getElementById("typing-message");
    if (typingBubble) typingBubble.remove();

    addMessage("ai", "ERROR: Something went wrong with my response :(");
  }
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
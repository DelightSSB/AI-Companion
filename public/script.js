const chatLog = document.getElementById("chat-log");
const sendBtn = document.getElementById("send-btn");
const textarea = document.getElementById("user-input");
let activeChatID = null;
let activePFP = null;

//Immediately attempt to load chats when the DOM elements are available
window.addEventListener("DOMContentLoaded", fetchChats);

async function fetchChats() {
  try {
    const res = await fetch("/chat");
    const chats = await res.json();

    // Creates chat and adds delete button
    chats.forEach(c => {
      const li = document.createElement("li");
      li.dataset.id = c._id;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = c.name;
      nameSpan.style.flex = "1";
      nameSpan.addEventListener("click", () => loadChat(c));

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.style.marginLeft = "10px";
      delBtn.style.background = "none";
      delBtn.style.border = "none";
      delBtn.style.cursor = "pointer";
      delBtn.style.color = "red";
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); 
        const res = await fetch(`/chat/${c._id}`, { method: "DELETE" });
        if (res.ok) li.remove();
      });

      li.style.display = "flex";
      li.style.alignItems = "center";
      li.appendChild(nameSpan);
      li.appendChild(delBtn);
      chatList.appendChild(li);

    });
  } catch (err) {
    console.error("Failed to load chats:", err);
  }
}

//Takes aformentioned loaded chats and puts them in the sidebar to be accessed
function loadChat(chat) {
  activePFP = chat.profilePic
  activeChatID = chat._id;
  chatLog.innerHTML = "";

  const title = document.getElementById("title");
  title.textContent = chat.name;
  // const container = document.getElementById("chatbox-container");
  // container.prepend(title);

  chat.messages.forEach(msg => {
    addMessage(msg.role === "user" ? "user" : "ai", msg.content, chat.profilePic);
  });

  chatScreen.classList.remove("hidden");
}


//sidebar collapse
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});


//Modal code
const newChatBtn = document.getElementById("new-chat");
const modalOverlay = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("close-modal");

newChatBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

//Personality picker
const availableBox = document.getElementById("available-personality");
const selectedBox = document.getElementById("selected-personality");
const personalityTags = [
  "affectionate", "aloof", "analytical", "apathetic", "arrogant", "assertive", "awkward",
  "bitter", "blunt", "bold", "brooding", "bubbly", "calm", "calculated", "caring", "cautious",
  "charming", "cheeky", "chill", "clingy", "closed-minded", "cold", "combative", "compassionate", "confident",
  "contrarian", "creative", "curious", "cynical", "daydreamy", "decisive", "defensive", "dismissive",
  "distant", "dorky", "dramatic", "dreamy", "dreamy-eyed", "eccentric", "emotional", "emotive",
  "empathetic", "encouraging", "expressive", "fiery", "flirty", "funny", "gentle", "gentle-hearted",
  "gentlemanly", "goofy", "graceful", "grumpy", "grounded", "guarded", "happy-go-lucky", "high-energy",
  "honest", "horny", "hot-headed", "humble", "idealistic", "impulsive", "inattentive", "independent", "insecure",
  "intellectual", "introspective", "intuitive", "jealous", "judgmental", "kind-hearted", "lighthearted",
  "loose-tongued", "loyal", "low-key", "manipulative", "melancholic", "melodramatic", "mischievous",
  "moody", "mysterious", "needy", "neurotic", "noncommittal", "nurturing", "obsessive", "open-minded",
  "optimistic", "overbearing", "overthinker", "passionate", "patient", "persistent", "pessimistic",
  "playful", "possessive", "protective", "quiet", "rational", "rebellious", "reckless", "reserved",
  "resilient", "romantic", "sarcastic", "sassy", "secretive", "self-critical", "sensitive", "shy",
  "short-tempered", "skeptical", "slow-paced", "snarky", "soothing", "spontaneous", "stable",
  "standoffish", "stoic", "stubborn", "stubbornly proud", "supportive", "sweet", "tactful", "teasing",
  "tender", "thoughtful", "timid", "uplifting", "vulnerable", "warm", "weird", "wholesome", "witty",
  "withdrawn"
];


personalityTags.forEach(tag => {
  const span = document.createElement("span");
  span.className = "personality-tag";
  span.textContent = tag;
  availableBox.appendChild(span);
});

let selectedPersonality = [];

availableBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("personality-tag")) {
    const tag = e.target.textContent;
    if (!selectedPersonality.includes(tag)) {
      selectedPersonality.push(tag);
      moveToSelected(tag);
      e.target.remove();
    }
  }
});

selectedBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("personality-tag")) {
    const tag = e.target.textContent.replace("✖", "").trim();
    selectedPersonality = selectedPersonality.filter(p => p !== tag);
    moveToAvailable(tag);
    e.target.remove();
  }
});

function moveToSelected(tag) {
  const span = document.createElement("span");
  span.className = "personality-tag selected";
  span.textContent = tag;
  selectedBox.appendChild(span);
}

function moveToAvailable(tag) {
  const span = document.createElement("span");
  span.className = "personality-tag";
  span.textContent = tag;
  availableBox.appendChild(span);
}


// Image previewer for profile picture selector
const previewImg = document.getElementById("profile-img-preview");
const input = document.getElementById("profile-img-input");
let selectedProfilePic = {
  src: ""
};

input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const tempImg = new Image();
    tempImg.onload = () => {
      if (tempImg.width !== tempImg.height) {
        alert("Please upload a square image (equal width and height).");
        input.value = "";
        previewImg.style.display = "none";
        selectedProfilePic.src = "";
      } else {
        previewImg.src = event.target.result;
        previewImg.style.display = "block";
        selectedProfilePic.src = event.target.result;
      }
    };
    tempImg.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

//Create button pressed, new chat created
const createBtn = document.getElementById("create");
const chatScreen = document.getElementById("chat-screen");
const chatList = document.getElementById("chat-list");
const aiNameInput = document.getElementById("ai-name");

createBtn.addEventListener("click", async () => {
  const aiName = aiNameInput.value.trim();
  const hasName = aiName.length > 0;
  const hasPersonality = selectedPersonality.length > 0;
  const hasProfilePic = selectedProfilePic.src !== "";
  const selectedSex = document.querySelector('input[name="ai-sex"]:checked')?.value || "";

  if (!hasName || !hasPersonality || !hasProfilePic || !selectedSex) {
    alert("Please fill out all fields before creating the chat.");
    return;
  }

  // Add to chat list in sidebar
  const newLi = document.createElement("li");
  newLi.textContent = aiName;
  chatList.appendChild(newLi);

  const title = document.getElementById("title")
  title.innerHTML = aiName;


  modalOverlay.classList.add("hidden");
  chatScreen.classList.remove("hidden");


  chatLog.innerHTML = "";
activePFP = selectedProfilePic.src
  // Add typing message while waiting for DB confirmation
addMessage("ai", "typing", activePFP);

const newChat = {
  name: aiName,
  personalityTraits: selectedPersonality,
  profilePic: activePFP,
  sex: selectedSex,
  messages: []
};

try {
  const res = await fetch("/chat/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newChat)
  });

  const data = await res.json();

  // Replace typing with actual message
  activeChatID = data._id
  document.getElementById("typing-message")?.remove();
  addMessage("ai", data.reply, activePFP);
  console.log("Chat saved:", data);
} catch (err) {
  console.error("Failed to save chat:", err);
  document.getElementById("typing-message")?.remove();
  addMessage("ai", "ERROR: Something went wrong while creating the chat.", activePFP);
}


  // Add hardcoded intro message from the AI
  // const msgDiv = document.createElement("div");
  // msgDiv.classList.add("message", "ai");

  // const bubble = document.createElement("div");
  // bubble.classList.add("bubble");
  // bubble.textContent = "Ask me anything!";

  // const img = document.createElement("img");
  // img.classList.add("pfp", "ai");
  // img.src = selectedProfilePic.src;
  // img.style.width = "40px";
  // img.style.height = "40px";


  // msgDiv.appendChild(bubble);
  // msgDiv.appendChild(img);
  // chatLog.appendChild(msgDiv);

  // chatLog.scrollTop = chatLog.scrollHeight;

//   const newChat = {
//   name: aiName,
//   personalityTraits: selectedPersonality,
//   profilePic: selectedProfilePic.src,
//   messages: [
//     { role: "assistant", content: "Ask me anything!" }
//   ]
// };

// try {
//   const res = await fetch("/chat/new", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(newChat)
//   });

//   const data = await res.json();
//   console.log("Chat saved:", data);
// } catch (err) {
//   console.error("Failed to save chat:", err);
// }

  resetModal();
});

//Helper to reset modal fields
function resetModal() {
  aiNameInput.value = "";
  selectedPersonality = [];
  selectedBox.innerHTML = "";
  availableBox.innerHTML = "";
  personalityTags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "personality-tag";
    span.textContent = tag;
    availableBox.appendChild(span);
  });

  previewImg.src = "";
  previewImg.style.display = "none";
  selectedProfilePic = {
    src: "",
    offsetX: 0,
    offsetY: 0,
    scale: 1
  };
}



//Scroll to bottom after each message
chatLog.scrollTop = chatLog.scrollHeight;


//Enter key or send button pressed
textarea.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const msg = textarea.value.trim();
        if (!msg) return;

        addMessage("user", msg,);
        // addMessage('ai', 'T e s t  M e s s a g e', activePFP)
        addMessage("ai", "typing", activePFP);

        try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, chatId: activeChatID })
        });

        const data = await res.json();

        document.getElementById("typing-message")?.remove();
        addMessage("ai", data.reply, activePFP);
        } catch (err) {
        console.error("Error:", err);
        document.getElementById("typing-message")?.remove();
        addMessage("ai", "ERROR: Something went wrong with my response :(", activePFP);
        }
  }
});

sendBtn.addEventListener("click", async () => {
  const msg = textarea.value.trim();
  if (!msg) return;

  addMessage("user", msg);
  // addMessage('ai', 'T e s t  M e s s a g e', activePFP)
  addMessage("ai", "typing", activePFP);


  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, chatId: activeChatID })
    });

    const data = await res.json();

    document.getElementById("typing-message")?.remove();

    addMessage("ai", data.reply, activePFP);
  } catch (err) {
    console.error("Error:", err);
    const typingBubble = document.getElementById("typing-message");
    if (typingBubble) typingBubble.remove();
    addMessage("ai", "ERROR: Something went wrong with my response :(");
  }
});

//TODO: Add img parameter so the pfp stays consistent
function addMessage(sender, msg, pfp = null) {
  if (sender === "ai" && msg === "typing") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "ai");
    msgDiv.id = "typing-message";

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "typing-dots");
    bubble.innerHTML = "<span></span><span></span><span></span>";

    const img = document.createElement("img");
    img.classList.add("pfp", "ai");
    img.src = pfp || "assets/yoru.jpg"; // fallback

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(img);
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  } else {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = msg;

    const img = document.createElement("img");
    img.classList.add("pfp", sender);
    img.src = sender === "user"
      ? "assets/pheonix.jpg"
      : pfp || "assets/yoru.jpg";

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(img);
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    textarea.value = "";
    textarea.style.height = "auto";
  }
}

// function addMessage(sender, msg) {
//   if (sender === "ai" && msg === "typing") {

//     // Insert typing animation bubble
//     const msgDiv = document.createElement("div");
//     msgDiv.classList.add("message", "ai");
//     msgDiv.id = "typing-message";

//     const bubble = document.createElement("div");
//     bubble.classList.add("bubble", "typing-dots");
//     bubble.innerHTML = "<span></span><span></span><span></span>";

//     const img = document.createElement("img");
//     img.classList.add("pfp", "ai");
//     img.src = "assets/yoru.jpg";

//     msgDiv.appendChild(bubble);
//     msgDiv.appendChild(img);
//     chatLog.appendChild(msgDiv);

//     chatLog.scrollTop = chatLog.scrollHeight;
//   }
//   else{
//     // Normal message rendering
//   const msgDiv = document.createElement("div");
//   msgDiv.classList.add("message", sender);

//   const bubble = document.createElement("div");
//   bubble.classList.add("bubble");
//   bubble.textContent = msg;

//   const img = document.createElement("img");
//   img.classList.add("pfp", sender);
//   img.src = sender === "user" ? "assets/pheonix.jpg" : "assets/yoru.jpg";

//   msgDiv.appendChild(bubble);
//   msgDiv.appendChild(img);
//   chatLog.appendChild(msgDiv);

//   chatLog.scrollTop = chatLog.scrollHeight;
//   textarea.value = "";
//   textarea.style.height = "auto";
// }
// }

//Text input area grows to a limit
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

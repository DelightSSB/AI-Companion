const chatLog = document.getElementById("chat-log");
const sendBtn = document.getElementById("send-btn");
const textarea = document.getElementById("user-input");


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

createBtn.addEventListener("click", () => {
  const aiName = aiNameInput.value.trim();
  const hasName = aiName.length > 0;
  const hasPersonality = selectedPersonality.length > 0;
  const hasProfilePic = selectedProfilePic.src !== "";

  if (!hasName || !hasPersonality || !hasProfilePic) {
    alert("Please fill out all fields before creating the chat.");
    return;
  }

  // Add to chat list in sidebar
  const newLi = document.createElement("li");
  newLi.textContent = aiName;
  chatList.appendChild(newLi);

  //Show name
  const box = document.getElementById("chatbox-container")
  const title = document.createElement("h2")
  title.innerHTML = aiName;

  box.prepend(title)

  // Show chat screen and hide modal
  modalOverlay.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  // Clear previous messages and reset
  chatLog.innerHTML = "";

  // Add hardcoded intro message from the AI
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "ai");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = "Ask me anything!";

  const img = document.createElement("img");
  img.classList.add("pfp", "ai");
  img.src = selectedProfilePic.src;
  img.style.width = "40px";
  img.style.height = "40px";


  msgDiv.appendChild(bubble);
  msgDiv.appendChild(img);
  chatLog.appendChild(msgDiv);

  chatLog.scrollTop = chatLog.scrollHeight;


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

  img.src = "";
  selectedProfilePic = {
    src: "",
    offsetX: 0,
    offsetY: 0,
    scale: 1
  };

  selectBtn.disabled = false;
  selectBtn.textContent = "OK";
}



//Scroll to bottom after each message
chatLog.scrollTop = chatLog.scrollHeight;


//Enter key or send button pressed
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

//TODO: Add img parameter so the pfp stays consistent
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

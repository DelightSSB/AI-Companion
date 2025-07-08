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
let img = document.getElementById("profile-img-preview");
let input = document.getElementById("profile-img-input");
let resetBtn = document.getElementById("reset-btn");
const selectBtn = document.getElementById("select-btn");

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;
let selectedProfilePic = {
  src: "",
  offsetX: 0,
  offsetY: 0,
  scale: 1
};

input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    img.src = event.target.result;
    img.setAttribute("draggable", false);
    img.onload = () => {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      updateTransform();
    };
  };
  reader.readAsDataURL(file);
});


img.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

document.addEventListener("mouseup", () => isDragging = false);

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    updateTransform();
  }
});

img.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoom = e.deltaY > 0 ? -0.05 : 0.05;
  scale = Math.min(Math.max(scale + zoom, 0.5), 3);
  updateTransform();
});

function updateTransform() {
  const cropArea = document.getElementById("crop-area");
  const frameSize = 150;
  const cropWidth = cropArea.offsetWidth;
  const cropHeight = cropArea.offsetHeight;

  const imgWidth = img.naturalWidth * scale;
  const imgHeight = img.naturalHeight * scale;

  const minX = cropWidth / 2 - (imgWidth - frameSize) / 2;
  const maxX = cropWidth / 2 + (imgWidth - frameSize) / 2;
  const minY = cropHeight / 2 - (imgHeight - frameSize) / 2;
  const maxY = cropHeight / 2 + (imgHeight - frameSize) / 2;

  offsetX = Math.min(Math.max(offsetX, cropWidth / 2 - imgWidth + frameSize / 2), cropWidth / 2 - frameSize / 2);
  offsetY = Math.min(Math.max(offsetY, cropHeight / 2 - imgHeight + frameSize / 2), cropHeight / 2 - frameSize / 2);


  img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

resetBtn.addEventListener("click", () => {
  offsetX = 0;
  offsetY = 0;
  scale = 1;
  updateTransform();
});

selectBtn.addEventListener("click", () => {
  if (!img.src) return;

  selectedProfilePic = {
    src: img.src,
    offsetX,
    offsetY,
    scale
  };

  console.log("✅ Profile picture selected:", selectedProfilePic);

  // Optionally: show a green checkmark, or disable selection
  selectBtn.textContent = "Selected!";
  selectBtn.disabled = true;
});

// cropBtn.addEventListener("click", () => {
//   const cropBox = document.querySelector(".crop-frame").getBoundingClientRect();
//   const imgBox = img.getBoundingClientRect();

//   const canvas = document.createElement("canvas");
//   canvas.width = cropBox.width;
//   canvas.height = cropBox.height;
//   const ctx = canvas.getContext("2d");

//   const sx = (cropBox.left - imgBox.left) / scale;
//   const sy = (cropBox.top - imgBox.top) / scale;

//   ctx.drawImage(img, sx, sy, cropBox.width / scale, cropBox.height / scale, 0, 0, canvas.width, canvas.height);

//   img.src = canvas.toDataURL("image/png");
//   resetBtn.disabled = true;
// });


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

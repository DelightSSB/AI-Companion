require("dotenv").config();
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const chatRoute = require("./routes/chat");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Chat routes
app.use("/chat", chatRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

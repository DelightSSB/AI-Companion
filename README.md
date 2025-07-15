# 💬 AI Companion Chat App (Work In Progress)

This is a full-stack AI companion web application where users can create personalized chatbot "companions" with custom names, personalities, and profile pictures. Built with **vanilla HTML/CSS/JS** and a **Node.js + Express + MongoDB** backend, it integrates the **OpenAI API** to generate conversational responses.

> ⚠️ This project is under active development and is currently incomplete. Future features include persistent chat history, authentication, and enhanced AI customization.

---

## Features (So Far)
- Sidebar with collapsible chat list
- Modal popup to create a new AI companion (with personality tags, name, profile picture)
- Profile picture preview and validation
- AI chat powered by OpenAI (GPT-3.5/4)
- Aforementioned AI chat implemented with personality and context to the conversation.
- Messages stored and retrieved using MongoDB
- Custom UI with floating chat window, chat bubbles, scroll behavior, and theme

---

## Technologies Used
- HTML/CSS/JS (frontend)
- Node.js + Express (backend)
- MongoDB with Mongoose (database)
- OpenAI API (language model)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/DelightSSB/AI-Companion.git
cd AI-Companion
```

### 2. Install Dependecies
```bash
npm install
```

### 3. Create a .env file
In the project root, create a .env file and add the following into it:
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_uri_here

To make the backend work you MUST use your own openAI and MongoDB Atlas cluster and collection. I will not provide one for you.
#### You can set up and receive and openAI API key here: https://platform.openai.com/api-keys
- Once created and you received your key, paste it into the .env file and assign it to OPENAI_API_KEY
- (do NOT include any spaces next to the =)

#### You can setup a mongoDB cluster here: https://www.mongodb.com/
- First create a mongodb account
- Allow mongo to create your organization
- Create and name your cluster
- In that cluster hit connect, choose drivers, and follow until you see the connection string. (It should look something like this: mongodb+srv://*username*:*db_password*@companion-ai.sklfvrp.mongodb.net/?retryWrites=true&w=majority&appName=Companion-AI)
- Don't forget to replace *username* and *db_password* with your own cluster's username and password that you use to access the database.
- Paste the connection string into the .env file and assign it to MONGODB_URI
- (do NOT include any spaces next to the =)

  
### 4. Run the server
```bash
node server/server.js
```
If both the api key worked and mongodb connected you should see the terminal say "Server running on port 3000" and "Connected to MongoDB"

### 5. View the application
To view the application, paste http://localhost:3000 into your browser

## Notes
- You MUST have Node.js and npm installed.
- The applicationn does have storage based on the database, but unless you connect to the database on each machine you use, it is only local

## Next Steps
- Add a delete popup modal that prompts an "Are you sure?" script before deleting a chat
- Allow for the user to have a profile that will include attributes about them that the ai and refer to
- Implement authentification


LICENSE - MIT

# Author
Created by JaZir Monté Simon


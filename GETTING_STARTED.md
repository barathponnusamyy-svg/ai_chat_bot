# 🚀 Getting Started - VS Code Beginner Guide

## Step 1: Install Required Software

### Download and Install:
1. **Node.js** (version 16 or higher)
   - Go to https://nodejs.org
   - Download and install the LTS version
   - Restart your computer after installation

2. **VS Code** 
   - Go to https://code.visualstudio.com
   - Download and install

## Step 2: Open Project in VS Code

1. **Open VS Code**
2. **Open the project folder:**
   - Click `File` → `Open Folder`
   - Navigate to `c:\barath\ai-chat-bot`
   - Click `Select Folder`

## Step 3: Install VS Code Extensions (Recommended)

Click the Extensions icon (4 squares) on the left sidebar and install:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Auto Rename Tag**

## Step 4: Open Terminal in VS Code

- Press `Ctrl + `` (backtick) or
- Click `Terminal` → `New Terminal`

## Step 5: Install Project Dependencies

In the terminal, type:
```bash
npm install
```
Wait for installation to complete (2-3 minutes).

## Step 6: Set Up Environment Variables

1. **Copy the example file:**
   ```bash
   copy .env.example .env
   ```

2. **Get OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create account and generate API key
   - Copy the key (starts with `sk-`)

3. **Edit .env file:**
   - In VS Code, open `.env` file
   - Replace `your_openai_api_key_here` with your actual API key
   - Save the file (`Ctrl + S`)

## Step 7: Start the Application

In the terminal, type:
```bash
npm start
```

## Step 8: Open in Browser

- Wait for "Local: http://localhost:3000" message
- Your browser should automatically open
- If not, manually go to http://localhost:3000

## 🎉 You're Done!

Your AI Voice Assistant is now running! You can:
- Chat with the AI assistant
- Use voice input (click microphone)
- Toggle dark/light theme
- Create multiple chat sessions

## 🛑 Common Issues

**If you see errors:**

1. **"npm is not recognized"**
   - Restart VS Code after installing Node.js
   - Restart your computer

2. **"Module not found"**
   - Run `npm install` again

3. **"API key error"**
   - Check your `.env` file has the correct API key
   - Make sure there are no extra spaces

## 📝 Making Changes

- Edit files in the `src` folder
- Changes auto-reload in browser
- Press `Ctrl + C` in terminal to stop the server

## 🆘 Need Help?

- Check the main README.md file
- Look at DEPLOYMENT.md for hosting options
- Create an issue on GitHub
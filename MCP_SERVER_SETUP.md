# 🖥️ MCP Server Setup - Simple Guide

**Goal**: Get the MCP server running so Claude can talk to Figma

**Time**: 10 minutes

---

## 📋 What You Need

- [ ] Node.js installed (version 18 or higher)
- [ ] Figma Personal Access Token
- [ ] Claude Desktop installed
- [ ] 10 minutes

---

## 🎬 PART 1: Get Figma Token (2 minutes)

### Step 1.1: Go to Figma Settings

1. Open your web browser
2. Go to: **https://www.figma.com**
3. Sign in if needed
4. Click your **profile picture** (top right)
5. Click **"Settings"**

### Step 1.2: Generate Token

1. Scroll down to **"Personal access tokens"**
2. Click **"Generate new token"**
3. Give it a name: **"Claude Integration"**
4. Click **"Generate token"**

### Step 1.3: Copy Token

**⚠️ IMPORTANT: You'll only see this ONCE!**

1. A long string appears (looks like: `figd_abc123...`)
2. Click **"Copy"** or select all and copy
3. Paste it somewhere safe (Notes app, etc.)

**Picture:**
```
┌────────────────────────────────────┐
│ Your new token:                    │
│                                    │
│  figd_AbCd1234EfGh5678...         │  ← Copy this!
│                                    │
│  [Copy]                            │
│                                    │
│  ⚠️  You won't see this again!     │
└────────────────────────────────────┘
```

✅ **Token copied? Move to Part 2.**

---

## 🎬 PART 2: Install Node.js (if needed)

### Check if You Have Node.js

Open Terminal (Mac) or Command Prompt (Windows):

```bash
node --version
```

**If you see:** `v18.0.0` or higher → Skip to Part 3 ✅

**If you see:** `command not found` or lower version → Continue below

### Install Node.js

1. Go to: **https://nodejs.org**
2. Click the **green button** (LTS version)
3. Download and install
4. Restart Terminal/Command Prompt
5. Test again: `node --version`

✅ **Node.js installed? Move to Part 3.**

---

## 🎬 PART 3: Set Up MCP Server (3 minutes)

### Step 3.1: Open Terminal/Command Prompt

**Mac:** 
- Open **Terminal** app
- Or: Spotlight → type "Terminal"

**Windows:** 
- Open **Command Prompt** or **PowerShell**
- Or: Start → type "cmd"

### Step 3.2: Navigate to Server Folder

Type this (replace PATH with your actual path):

```bash
cd /PATH/TO/figma-claude-integration/mcp-server
```

**Examples:**

Mac:
```bash
cd /Users/john/Downloads/figma-claude-integration/mcp-server
```

Windows:
```cmd
cd C:\Users\John\Downloads\figma-claude-integration\mcp-server
```

**Tip:** Don't know your path? 
- Drag the `mcp-server` folder into Terminal
- It will auto-fill the path!

### Step 3.3: Install Dependencies

Type this:

```bash
npm install
```

Press **Enter**.

**What you'll see:**
```
npm install
...downloading packages...
...installing...
added 45 packages in 15s
```

Wait for it to finish (15-30 seconds).

✅ **Installation complete? Move to Step 3.4.**

### Step 3.4: Create .env File

**Option A: Using Terminal (Easiest)**

Type these commands one by one:

```bash
echo "FIGMA_ACCESS_TOKEN=paste_your_token_here" > .env
echo "WEBHOOK_PORT=3456" >> .env
```

**Replace** `paste_your_token_here` with your actual Figma token!

**Example:**
```bash
echo "FIGMA_ACCESS_TOKEN=figd_abc123xyz789" > .env
echo "WEBHOOK_PORT=3456" >> .env
```

**Option B: Create File Manually**

1. Open the `mcp-server` folder in Finder/Explorer
2. Create a new text file called `.env`
3. Open it with any text editor
4. Type exactly this:
   ```
   FIGMA_ACCESS_TOKEN=your_token_here
   WEBHOOK_PORT=3456
   ```
5. Replace `your_token_here` with your Figma token
6. Save the file

**Your .env file should look like:**
```
FIGMA_ACCESS_TOKEN=figd_abc123xyz789...
WEBHOOK_PORT=3456
```

✅ **.env file created? Move to Part 4.**

---

## 🎬 PART 4: Configure Claude Desktop (3 minutes)

### Step 4.1: Find Your Config File

**Mac:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**How to open it:**

**Mac:**
1. Open Finder
2. Press: **Cmd + Shift + G**
3. Paste: `~/Library/Application Support/Claude/`
4. Press Enter
5. Find `claude_desktop_config.json`
6. Open with TextEdit

**Windows:**
1. Press **Windows + R**
2. Type: `%APPDATA%\Claude`
3. Press Enter
4. Find `claude_desktop_config.json`
5. Open with Notepad

### Step 4.2: Get Full Path to server.js

You need the **absolute path** to `server.js`.

**Mac - Get Path:**
```bash
cd /YOUR/PATH/TO/figma-claude-integration/mcp-server
pwd
```

This prints something like:
```
/Users/john/Downloads/figma-claude-integration/mcp-server
```

Copy this path and add `/server.js` at the end:
```
/Users/john/Downloads/figma-claude-integration/mcp-server/server.js
```

**Windows - Get Path:**
```cmd
cd C:\YOUR\PATH\TO\figma-claude-integration\mcp-server
cd
```

This prints something like:
```
C:\Users\John\Downloads\figma-claude-integration\mcp-server
```

Copy this path and add `\server.js` at the end:
```
C:\Users\John\Downloads\figma-claude-integration\mcp-server\server.js
```

### Step 4.3: Edit Config File

Open `claude_desktop_config.json` in a text editor.

**If the file is empty or has `{}`**, replace everything with:

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/FULL/PATH/TO/mcp-server/server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_figma_token_here",
        "WEBHOOK_PORT": "3456"
      }
    }
  }
}
```

**If the file already has stuff**, add the figma section:

```json
{
  "mcpServers": {
    "existing-server": {
      ...existing stuff...
    },
    "figma": {
      "command": "node",
      "args": ["/FULL/PATH/TO/mcp-server/server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_figma_token_here",
        "WEBHOOK_PORT": "3456"
      }
    }
  }
}
```

### Step 4.4: Replace Placeholders

Replace these:

1. **`/FULL/PATH/TO/mcp-server/server.js`**
   - With your actual path from Step 4.2
   - Example (Mac): `/Users/john/Downloads/figma-claude-integration/mcp-server/server.js`
   - Example (Win): `C:\\Users\\John\\Downloads\\figma-claude-integration\\mcp-server\\server.js`
   
   **Windows Note:** Use double backslashes `\\` in the path!

2. **`your_figma_token_here`**
   - With your Figma token from Part 1
   - Example: `figd_abc123xyz789`

### Step 4.5: Final Config Example

**Mac example:**
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/Users/john/Downloads/figma-claude-integration/mcp-server/server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_abc123xyz789",
        "WEBHOOK_PORT": "3456"
      }
    }
  }
}
```

**Windows example:**
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["C:\\Users\\John\\Downloads\\figma-claude-integration\\mcp-server\\server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_abc123xyz789",
        "WEBHOOK_PORT": "3456"
      }
    }
  }
}
```

### Step 4.6: Save the File

1. Save the file
2. Close the text editor

✅ **Config saved? Move to Part 5.**

---

## 🎬 PART 5: Test Everything (2 minutes)

### Step 5.1: Start the MCP Server

In Terminal/Command Prompt (in the `mcp-server` folder):

```bash
npm start
```

**You should see:**
```
✅ Figma-Claude MCP Server ready!
🚀 Webhook server running on http://localhost:3456
```

**Leave this running!** Don't close the Terminal window.

### Step 5.2: Restart Claude Desktop

1. **Quit Claude Desktop completely** (Cmd+Q on Mac, Alt+F4 on Windows)
2. **Wait 5 seconds**
3. **Open Claude Desktop again**

### Step 5.3: Test in Claude

Open Claude Desktop and type:

```
Hi! Can you check if you have access to Figma tools?
```

Claude should respond with something like:
```
Yes! I have access to Figma tools including:
- get_file
- create_frame
- build_prototype_screen
- And more...
```

### Step 5.4: Test Figma Plugin

1. Open **Figma Desktop**
2. Open or create a file
3. **Plugins** → **Development** → **Claude Design Assistant**
4. Click **"🚀 Start Listening for Claude"**

**You should see:**
- ✅ **MCP Server: Connected** (green)
- ✅ **Polling Status: Listening** (green)
- Activity log shows: "✓ Registered with MCP server"

✅ **Everything green? SUCCESS!** 🎉

---

## 🎊 COMPLETE SETUP!

All systems are GO! You can now:

1. **Talk to Claude** in Claude Desktop
2. **Claude creates designs** in Figma
3. **See results in real-time**

---

## 🧪 First Test Command

Try this in Claude Desktop:

```
In my Figma file [YOUR_FILE_KEY], create a test frame:
- Name: "Hello from Claude"
- Size: 400x300px
- Background color: light blue
- Add text "It works!" in the center
```

**Replace `[YOUR_FILE_KEY]` with your actual Figma file key** (from the URL).

---

## ⚠️ Troubleshooting

### Problem: "npm: command not found"

**Fix:** Node.js not installed. Go back to Part 2.

### Problem: "Cannot find module..."

**Fix:** Run `npm install` again in the mcp-server folder.

### Problem: "MCP Server shows Disconnected in plugin"

**Fix:**
1. Is Terminal still running `npm start`?
2. Do you see the "Server ready!" message?
3. Try: `curl http://localhost:3456/health` in another Terminal

Should return:
```json
{"status":"ok","message":"Figma-Claude MCP Server"}
```

### Problem: "Claude doesn't see Figma tools"

**Fix:**
1. Check `claude_desktop_config.json` - is the path correct?
2. Did you restart Claude Desktop?
3. Check Claude logs:
   ```bash
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```
4. Look for errors about the Figma server

### Problem: "Plugin can't connect"

**Fix:**
1. MCP server must be running first
2. Click "Test Connection" in plugin
3. Check Activity Log for error messages
4. Restart plugin

### Problem: "Invalid token" or "401 error"

**Fix:**
1. Check your Figma token is correct
2. Token should start with `figd_`
3. No spaces before/after token in .env file
4. Generate a new token if needed

---

## 📊 System Status Check

Everything working if:

**Terminal shows:**
```
✅ Figma-Claude MCP Server ready!
🚀 Webhook server running on http://localhost:3456
```

**Claude Desktop:**
- Can see Figma tools when asked
- Responds to Figma-related requests

**Figma Plugin:**
- Shows "Connected ✅"
- Shows "Listening ✅"
- Activity log shows recent events

---

## 🔄 Daily Usage

**Every time you want to use it:**

1. **Terminal:** `cd mcp-server && npm start`
2. **Figma:** Open file → Run plugin → "Start Listening"
3. **Claude:** Ready to design!

**To stop:**
1. Figma: Close plugin or click "Stop Listening"
2. Terminal: Press Ctrl+C

---

## 💡 Pro Tips

**Tip 1:** Keep Terminal window visible to see server logs

**Tip 2:** Server auto-recovers from most errors

**Tip 3:** Plugin polls every 2 seconds - slight delay is normal

**Tip 4:** You can run multiple file instances with same server

**Tip 5:** Server logs show every command from Claude

---

## ✅ Final Checklist

- [ ] Figma token obtained and saved
- [ ] Node.js installed (v18+)
- [ ] npm install completed successfully
- [ ] .env file created with token
- [ ] claude_desktop_config.json updated
- [ ] Claude Desktop restarted
- [ ] MCP server running (Terminal shows "ready!")
- [ ] Plugin installed and running
- [ ] Plugin shows "Connected ✅"
- [ ] Claude sees Figma tools

**All checked? You're DONE! 🎉**

---

## 🚀 What's Next?

See **USAGE_EXAMPLES.md** for:
- Common commands
- Example workflows
- Tips and tricks
- Advanced features

**Happy designing with AI! 🎨✨**

# 📘 Complete Setup Overview

**Your 3-Part Setup Journey**

---

## 🎯 Overview

To use Claude with Figma, you need **3 components working together**:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   CLAUDE    │ ←────→│ MCP SERVER  │ ←────→│   FIGMA     │
│  DESKTOP    │       │  (Node.js)  │       │   PLUGIN    │
└─────────────┘       └─────────────┘       └─────────────┘
   You talk              Translator           Creates
   to Claude            & Router              designs
```

**Time to setup:** 20 minutes total
**Difficulty:** ⭐⭐☆☆☆ (Moderate - but we'll guide you!)

---

## 📋 Three-Part Setup

### PART 1: Figma Plugin (5 min)
**Install the plugin in Figma Desktop**

✅ What you'll do:
- Create `code.js` file
- Import plugin into Figma
- Verify it appears in menu

📖 Guide: **PLUGIN_SETUP_SIMPLE.md**

---

### PART 2: MCP Server (10 min)
**Set up the Node.js server**

✅ What you'll do:
- Get Figma access token
- Install Node.js dependencies
- Configure environment
- Connect to Claude Desktop

📖 Guide: **MCP_SERVER_SETUP.md**

---

### PART 3: Connection Test (5 min)
**Make sure everything talks to each other**

✅ What you'll do:
- Start the server
- Start the plugin
- Test with Claude
- Create your first design

📖 Guide: **USAGE_EXAMPLES.md**

---

## 🗺️ Setup Roadmap

```
START
  │
  ├─► PART 1: Install Figma Plugin
  │   ├─ Download project files ✓
  │   ├─ Create code.js file
  │   ├─ Import into Figma
  │   └─ Verify plugin appears
  │
  ├─► PART 2: Setup MCP Server
  │   ├─ Get Figma token
  │   ├─ Install Node.js (if needed)
  │   ├─ npm install
  │   ├─ Create .env file
  │   └─ Configure Claude Desktop
  │
  ├─► PART 3: Test & Connect
  │   ├─ Start server (Terminal)
  │   ├─ Restart Claude Desktop
  │   ├─ Start plugin listening
  │   └─ Test creation command
  │
SUCCESS! 🎉
```

---

## 📦 What You Need

### Software:
- [ ] **Figma Desktop** ([Download](https://figma.com/downloads))
- [ ] **Claude Desktop** ([Download](https://claude.ai/download))
- [ ] **Node.js 18+** ([Download](https://nodejs.org))
- [ ] **Text Editor** (VS Code, Notepad++, or built-in)

### Accounts:
- [ ] **Figma Account** (free is fine)
- [ ] **Claude Account** (Pro or free)

### Files:
- [ ] **This project downloaded** (figma-claude-integration folder)

### Time:
- [ ] **20 minutes** uninterrupted time

---

## 🎬 Quick Start Path

**For the impatient** - do this in order:

```bash
# 1. Create plugin JavaScript
cd figma-plugin
cp code.ts code.js

# 2. Install server dependencies  
cd ../mcp-server
npm install

# 3. Get Figma token & add to .env
echo "FIGMA_ACCESS_TOKEN=your_token" > .env
echo "WEBHOOK_PORT=3456" >> .env

# 4. Configure Claude (edit config file manually)

# 5. Start everything
npm start  # In Terminal, keep running
# Open Figma → Run plugin → Start Listening
# Restart Claude Desktop
# Test!
```

**Don't understand these commands?** 
→ Follow the detailed guides instead!

---

## 🎯 How It Works

### When You Ask Claude to Create Something:

```
YOU SAY:
"Claude, create a login screen in my Figma file"

      ↓

CLAUDE THINKS:
"I need to use the create_frame tool with these parameters..."

      ↓

MCP SERVER RECEIVES:
{
  tool: "create_frame",
  file_key: "ABC123",
  name: "Login Screen",
  width: 375,
  height: 812
}

      ↓

SERVER QUEUES COMMAND:
Adds to command queue for file ABC123

      ↓

FIGMA PLUGIN POLLS:
"Any commands for me?" 
Server: "Yes! Create frame with these params"

      ↓

PLUGIN EXECUTES:
Creates actual frame in Figma canvas

      ↓

PLUGIN RESPONDS:
"Done! Created frame with ID: 1:234"

      ↓

SERVER RECEIVES RESULT:
Sends back to Claude

      ↓

CLAUDE SAYS:
"✅ Created the login screen! 
Frame ID: 1:234"

      ↓

YOU SEE:
New frame appears in your Figma file!
```

**Total time:** Usually 2-5 seconds

---

## 🔍 What Each Component Does

### Claude Desktop
**Role:** The Brain 🧠
- Understands your natural language
- Decides what to create
- Calls the right tools
- Manages the conversation

### MCP Server  
**Role:** The Translator 📡
- Receives commands from Claude
- Translates to Figma operations
- Queues commands for plugin
- Routes responses back to Claude
- Handles Figma API calls (reading)

### Figma Plugin
**Role:** The Hands ✋
- Runs inside Figma
- Polls server for commands
- Actually creates things
- Sends results back
- Has access to Figma canvas

---

## 🎮 Control Panel

Once everything is set up, you have 3 windows:

```
┌─────────────────────┐
│  CLAUDE DESKTOP     │  ← You type here
│  ────────────────   │
│  > Create a login   │
│    screen...        │
│                     │
│  ✓ Created! Here's  │
│    what I made...   │
└─────────────────────┘

┌─────────────────────┐
│  TERMINAL           │  ← Shows server logs
│  ────────────────   │
│  ✅ Server ready!    │
│  📥 Command: create  │
│  ✓ Sent to plugin   │
│  ✅ Result received  │
└─────────────────────┘

┌─────────────────────┐
│  FIGMA + PLUGIN     │  ← Shows results
│  ────────────────   │
│  [Your Design]      │
│                     │
│  │ Plugin Panel:   │
│  │ ✅ Connected     │
│  │ ✅ Listening     │
└─────────────────────┘
```

---

## ✅ Setup Checklist

Use this to track your progress:

### Before Starting:
- [ ] Downloaded project files
- [ ] Figma Desktop installed
- [ ] Claude Desktop installed
- [ ] Have Figma account
- [ ] Have 20 minutes

### Part 1 - Plugin:
- [ ] Created code.js file
- [ ] Imported plugin into Figma
- [ ] Plugin appears in Development menu
- [ ] Plugin opens and shows panel

### Part 2 - Server:
- [ ] Got Figma access token
- [ ] Node.js installed (v18+)
- [ ] Ran npm install successfully
- [ ] Created .env file with token
- [ ] Edited claude_desktop_config.json
- [ ] Restarted Claude Desktop

### Part 3 - Testing:
- [ ] Server starts without errors
- [ ] Plugin shows "Connected ✅"
- [ ] Claude sees Figma tools
- [ ] Test command works
- [ ] Design appears in Figma

### All Done! 🎉
- [ ] Can create designs with Claude
- [ ] Can read Figma files
- [ ] Everything is green/connected

---

## 🆘 Common Issues

### "Where do I start?"
→ Start with **PLUGIN_SETUP_SIMPLE.md**

### "Plugin won't install"
→ Did you create code.js? Check Part 1 guide

### "Server won't start"  
→ Check Node.js is installed: `node --version`

### "Claude doesn't see Figma tools"
→ Check Claude Desktop config file path

### "Plugin shows disconnected"
→ Is Terminal still running `npm start`?

### "Nothing works!"
→ Start fresh:
1. Close everything
2. Start Terminal: `npm start`
3. Start Figma plugin: "Start Listening"  
4. Restart Claude Desktop
5. Try simple test command

---

## 📚 Documentation Map

```
figma-claude-integration/
│
├── START HERE
│   ├── THIS FILE (setup overview)
│   └── PLUGIN_SETUP_SIMPLE.md (Part 1)
│
├── SETUP GUIDES
│   ├── MCP_SERVER_SETUP.md (Part 2)
│   └── QUICKSTART.md (condensed version)
│
├── USAGE
│   ├── USAGE_EXAMPLES.md (what to try)
│   └── examples/login-screen.md (full workflow)
│
└── REFERENCE
    ├── README.md (full documentation)
    ├── PROJECT_SUMMARY.md (features overview)
    └── TROUBLESHOOTING.md (help!)
```

---

## 🎓 Learning Path

### Beginner:
1. Follow setup guides exactly
2. Try simple commands (create frame, add text)
3. Experiment with colors and sizes
4. Learn by doing!

### Intermediate:
1. Try build_prototype_screen
2. Create full layouts
3. Use different style presets
4. Export designs

### Advanced:
1. Analyze existing designs
2. Create component libraries
3. Automate repetitive tasks
4. Build custom workflows

---

## 🎉 You're Ready!

Follow the guides in order:

1. **PLUGIN_SETUP_SIMPLE.md** → Install plugin (5 min)
2. **MCP_SERVER_SETUP.md** → Setup server (10 min)
3. **USAGE_EXAMPLES.md** → Start creating! (fun begins)

---

## 💡 Pro Tips

**Tip 1:** Keep all windows visible while working
- Claude Desktop (top)
- Terminal with server (middle)
- Figma with plugin (bottom)

**Tip 2:** Start simple
- First: Create a frame
- Then: Add shapes
- Finally: Build complex layouts

**Tip 3:** Use the activity log
- Plugin shows everything happening
- Great for debugging
- Learn what commands do

**Tip 4:** Save your Figma file keys
- Keep them in notes
- Makes commands faster
- No need to look up each time

**Tip 5:** Practice common phrases
- "In file [KEY], create..."
- "Build a [TYPE] screen with..."
- "Add a [ELEMENT] with [PROPERTIES]..."

---

## 🎯 Success Criteria

**You know it's working when:**

✅ Terminal shows "Server ready!"
✅ Plugin shows green "Connected"  
✅ Claude responds to Figma questions
✅ Commands execute in 2-5 seconds
✅ Designs appear in your Figma file
✅ Activity log shows successful operations

---

## 🚀 Next Steps

Once setup is complete:

1. **Try the examples** in USAGE_EXAMPLES.md
2. **Read through** examples/login-screen.md
3. **Experiment** with different styles
4. **Build something real** for your project
5. **Share** what you create!

---

**Ready to begin? Start with PLUGIN_SETUP_SIMPLE.md!**

**Questions? Check TROUBLESHOOTING.md**

**Want to dive deep? Read PROJECT_SUMMARY.md**

---

*Setup time: 20 minutes | Worth it: 100%* 🎨✨

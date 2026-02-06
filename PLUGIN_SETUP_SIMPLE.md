# 🎯 Figma Plugin - 5-Minute Setup (With Pictures)

**Goal**: Install the Claude Design Assistant plugin in Figma

**Time**: 5 minutes

---

## 📋 What You Need

- [ ] Figma Desktop App (download: https://figma.com/downloads)
- [ ] This project's files downloaded
- [ ] 5 minutes

---

## 🎬 Step-by-Step (Follow Exactly)

### STEP 1: Find Your Files (30 seconds)

Open Finder (Mac) or File Explorer (Windows).

Find the folder called: **`figma-claude-integration`**

Inside it, find: **`figma-plugin`**

**You should see 3 files:**
```
📄 code.ts
📄 ui.html  
📄 manifest.json
```

✅ **Found them? Great! Move to Step 2.**

---

### STEP 2: Create code.js File (1 minute)

#### On Mac:

1. Open **Terminal** app (search "Terminal" in Spotlight)
2. Type this (replace PATH with your actual path):
   ```bash
   cd /PATH/TO/figma-claude-integration/figma-plugin
   ```
   
   Example:
   ```bash
   cd /Users/john/Downloads/figma-claude-integration/figma-plugin
   ```

3. Press **Enter**

4. Type this:
   ```bash
   cp code.ts code.js
   ```

5. Press **Enter**

#### On Windows:

1. Open **Command Prompt** (search "cmd" in Start menu)
2. Type this (replace PATH):
   ```cmd
   cd C:\PATH\TO\figma-claude-integration\figma-plugin
   ```
   
   Example:
   ```cmd
   cd C:\Users\John\Downloads\figma-claude-integration\figma-plugin
   ```

3. Press **Enter**

4. Type this:
   ```cmd
   copy code.ts code.js
   ```

5. Press **Enter**

#### Verify:

Go back to the `figma-plugin` folder.

**You should now see 4 files:**
```
📄 code.ts
📄 code.js      ← NEW! This is what we created
📄 ui.html
📄 manifest.json
```

✅ **See code.js? Perfect! Move to Step 3.**

---

### STEP 3: Open Figma Desktop (30 seconds)

1. **Launch Figma Desktop** (the app, not browser)
2. **Sign in** if needed
3. Stay on any screen (home or a file)

✅ **Figma is open? Move to Step 4.**

---

### STEP 4: Import Plugin (2 minutes)

#### 4.1: Click on the Menu

**Look at the top of your screen:**

On Mac:
```
Figma   File   Edit   View   Plugins   ← Click here!
```

On Windows:
```
☰ Menu   ← Click this icon
Then click "Plugins"
```

#### 4.2: Go to Development

In the Plugins dropdown menu:

Scroll to the **bottom**

Click: **"Development"**

Then click: **"Import plugin from manifest..."**

**Picture description:**
```
┌─────────────────────────┐
│ Plugins ▼               │
├─────────────────────────┤
│ Recent                  │
│ Saved                   │
│ ────────────            │
│ Development         ►   │  ← Click this
│   Import plugin...      │  ← Then this
│   New plugin...         │
└─────────────────────────┘
```

#### 4.3: Select the File

A **file picker** window opens.

Navigate to your `figma-plugin` folder.

**Select the file:** `manifest.json`

Click: **"Open"**

#### 4.4: Success Message

You should see:
```
✅ "Claude Design Assistant" imported successfully!
```

✅ **Saw the success message? Move to Step 5.**

---

### STEP 5: Verify It Works (1 minute)

#### 5.1: Open the Plugin

1. Click **"Plugins"** menu again
2. Click **"Development"** 
3. You should see: **"Claude Design Assistant"**

**Picture description:**
```
┌─────────────────────────────────┐
│ Plugins ▼                       │
├─────────────────────────────────┤
│ Development                 ►   │
│   Claude Design Assistant   ◄─  │ ← Your plugin!
│   ───────────────               │
│   Import plugin...              │
│   New plugin...                 │
└─────────────────────────────────┘
```

#### 5.2: Launch It

Click: **"Claude Design Assistant"**

#### 5.3: See the Panel

A panel appears on the **right side** of Figma:

**Picture description:**
```
┌──────────────────────────────┐
│ 🤖 Claude + Figma            │ ← Header
│ AI-Powered Design Generation │
├──────────────────────────────┤
│ Status:                      │
│ ⚫ MCP Server: Disconnected   │ ← Normal!
│ ⚫ Polling: Idle              │
├──────────────────────────────┤
│ 🚀 Start Listening for Claude│ ← Button
│ 🔌 Test Connection           │ ← Button
├──────────────────────────────┤
│ Activity Log                 │
│ [Waiting for connection...]  │
└──────────────────────────────┘
```

✅ **See this panel? PERFECT! Plugin is installed!** 🎉

---

## 🎊 SUCCESS!

You've successfully installed the Figma plugin!

**What now?**

The plugin shows "Disconnected" because it needs the MCP server.

**Next steps:**
1. Close the plugin for now
2. Set up the MCP Server (see next guide)
3. Connect everything together
4. Come back and click "Start Listening"

---

## ⚠️ Troubleshooting (If Something Went Wrong)

### Problem 1: "Can't find manifest.json"

**Fix:**
- Make sure you downloaded ALL the files
- Check you're in the `figma-plugin` folder
- The file is called `manifest.json` exactly (no .txt at the end)

### Problem 2: "Plugin won't load"

**Fix:**
- Did you create `code.js`? (Step 2)
- Go back and run: `cp code.ts code.js`
- Check that `code.js` file exists

### Problem 3: "Plugin panel is blank"

**Fix:**
- Close and reopen Figma
- Try importing the plugin again
- Check that `ui.html` file exists

### Problem 4: "Development menu is grayed out"

**Fix:**
- You need to be in a file
- Click: File → New → Design File
- Then try accessing the plugin again

### Problem 5: Plugin crashes immediately

**Fix:**
1. Click: Plugins → Development → Open Console
2. Look for red error messages
3. Most common: `code.js` file is missing

**Solution:**
```bash
cd figma-plugin
cp code.ts code.js
```

---

## 🆘 Still Stuck?

### Check Your Files

Open the `figma-plugin` folder.

You MUST have these 4 files:
```
✅ code.ts        (original TypeScript)
✅ code.js        (compiled JavaScript)  ← Essential!
✅ ui.html        (user interface)
✅ manifest.json  (configuration)
```

Missing `code.js`? Go back to Step 2!

### Try This Command

If copying didn't work, try this alternative:

**Mac/Linux:**
```bash
cd figma-plugin
cat code.ts > code.js
```

**Windows:**
```cmd
cd figma-plugin
type code.ts > code.js
```

---

## 📸 Visual Summary

```
YOUR COMPUTER                    FIGMA APP
┌─────────────────┐             ┌────────────────┐
│ figma-plugin/   │             │                │
│                 │             │  [Your Design] │
│  📄 code.ts     │   Import    │                │
│  📄 code.js  ───┼────────────►│  ┌──────────┐  │
│  📄 ui.html     │             │  │ Plugin   │  │
│  📄 manifest.json│             │  │ Panel    │  │
└─────────────────┘             │  └──────────┘  │
                                └────────────────┘
```

---

## ✅ Final Check

Answer these questions:

1. **Is Figma Desktop installed?** 
   - [ ] Yes → Continue
   - [ ] No → Install from figma.com/downloads

2. **Do you have `code.js` file?**
   - [ ] Yes → Continue  
   - [ ] No → Go back to Step 2

3. **Can you see the plugin in Plugins → Development?**
   - [ ] Yes → Continue
   - [ ] No → Try importing again (Step 4)

4. **Does the plugin open and show the panel?**
   - [ ] Yes → SUCCESS! 🎉
   - [ ] No → Check Troubleshooting section

---

## 🎯 What You've Accomplished

✅ Downloaded plugin files
✅ Created JavaScript version (`code.js`)
✅ Imported plugin into Figma
✅ Verified plugin appears and opens

**Status:** Plugin installed! Ready for MCP server setup.

---

## 🚀 Next Steps

Now that the plugin is installed, you need to:

1. **Install the MCP Server** (Node.js backend)
2. **Configure Claude Desktop** (connect to server)
3. **Start everything** (server + plugin + Claude)

See: **MCP_SERVER_SETUP.md** for the next part!

---

## 💡 Quick Tips

**Tip 1:** Keep Figma Desktop running while setting up the server

**Tip 2:** You only install the plugin once - it stays installed

**Tip 3:** If you update the plugin code, Figma auto-reloads it

**Tip 4:** You can have multiple plugins installed at once

**Tip 5:** Development plugins only appear in Development menu

---

## 🎓 What Just Happened?

You told Figma:
1. "Here's a new plugin" (manifest.json)
2. "Its code is here" (code.js)
3. "Its interface is here" (ui.html)

Figma said:
1. "Got it! I've registered it"
2. "I'll show it in the Development menu"
3. "Ready to run when you need it!"

---

**Plugin installation complete! 🎉**

**Time taken:** 5 minutes
**Difficulty:** ⭐⭐☆☆☆ (Easy)
**Status:** ✅ DONE

Continue to **MCP_SERVER_SETUP.md** →

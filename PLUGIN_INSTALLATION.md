# 📦 Figma Plugin Installation - Super Simple Guide

Follow these exact steps to install the Claude Design Assistant plugin in Figma.

---

## ⚠️ Before You Start

You need:
- ✅ **Figma Desktop App** installed (NOT the browser version)
- ✅ The plugin files from this project

**Don't have Figma Desktop?**
Download it here: https://www.figma.com/downloads/

---

## 📍 Step 1: Find Your Plugin Files

First, locate where you downloaded this project.

The plugin files are in:
```
figma-claude-integration/
└── figma-plugin/
    ├── code.ts         ← Plugin code
    ├── ui.html         ← Plugin interface
    └── manifest.json   ← Plugin configuration
```

**Write down the full path to the `figma-plugin` folder!**

Example paths:
- Mac: `/Users/yourname/Downloads/figma-claude-integration/figma-plugin`
- Windows: `C:\Users\yourname\Downloads\figma-claude-integration\figma-plugin`

---

## 🔧 Step 2: Prepare the Plugin Code

The plugin code is in TypeScript (`.ts` file) but Figma needs JavaScript (`.js` file).

### Option A: Simple Rename (Quick & Easy)

Open Terminal (Mac) or Command Prompt (Windows):

```bash
cd figma-claude-integration/figma-plugin
cp code.ts code.js
```

This creates `code.js` from `code.ts`.

### Option B: Compile TypeScript (Proper Way)

If you have TypeScript installed:

```bash
cd figma-claude-integration/figma-plugin
npm install -g typescript
tsc code.ts
```

This compiles `code.ts` into `code.js`.

**✅ Result: You should now see a `code.js` file in the figma-plugin folder**

---

## 🎨 Step 3: Open Figma Desktop App

1. **Launch Figma Desktop** (the app icon, not your browser)
2. **Sign in** if needed
3. You can be on any file, or just at the home screen

---

## 📥 Step 4: Import the Plugin

### 4.1: Open the Plugins Menu

**Mac**: 
- Click **Plugins** in the top menu bar
- Or right-click anywhere → **Plugins**

**Windows**: 
- Click **Menu** (☰) → **Plugins**
- Or right-click anywhere → **Plugins**

### 4.2: Go to Development Section

In the Plugins dropdown:
1. Click **Development** at the bottom
2. Click **Import plugin from manifest...**

A file picker will open.

### 4.3: Select the Manifest File

Navigate to your plugin folder and select:
```
figma-claude-integration/figma-plugin/manifest.json
```

Click **Open**.

### 4.4: Confirmation

You should see:
```
✅ "Claude Design Assistant" successfully imported!
```

---

## ✅ Step 5: Verify Installation

Check if the plugin appears:

1. Go to **Plugins** → **Development**
2. You should see: **"Claude Design Assistant"**

If you see it, **SUCCESS!** 🎉

---

## 🚀 Step 6: Run the Plugin (First Time)

### 6.1: Open or Create a File

- Open an existing Figma file, OR
- Create a new file (File → New)

### 6.2: Launch the Plugin

1. **Plugins** → **Development** → **Claude Design Assistant**
2. A panel will appear on the right side

### 6.3: What You'll See

The plugin panel shows:
- **Header**: "🤖 Claude + Figma - AI-Powered Design Generation"
- **Status Card**: Connection status (will be red/disconnected initially)
- **Buttons**: 
  - "🚀 Start Listening for Claude"
  - "🔌 Test Connection"
- **Activity Log**: Shows what's happening

### 6.4: Initial State

Everything will show "Disconnected" or "Idle" - **this is normal!**

The plugin is installed but not connected to Claude yet.

---

## 🔍 Troubleshooting Plugin Installation

### ❌ Problem: "Can't find manifest.json"

**Solution**: 
- Make sure you're selecting the `manifest.json` file, not the folder
- Check the path is correct
- Make sure all files are extracted from ZIP if downloaded

### ❌ Problem: "Plugin failed to load"

**Solution**:
- Check that `code.js` exists (not just `code.ts`)
- Look in Figma Console for errors:
  - **Plugins** → **Development** → **Open Console**
- Common issue: TypeScript not compiled to JavaScript

### ❌ Problem: "Plugin appears but has errors"

**Solution**:
1. Open **Plugins** → **Development** → **Open Console**
2. Look for error messages
3. Most common: Missing `code.js` file

### ❌ Problem: Plugin menu item is grayed out

**Solution**:
- You need to be in a file (not on the home screen)
- Create a new file or open an existing one

---

## 🎯 What's Next?

Plugin is installed! But it won't work until you:

1. **Install the MCP Server** (see QUICKSTART.md)
2. **Configure Claude Desktop** (see QUICKSTART.md)
3. **Start the server** and connect everything

The plugin will show "Connected ✅" when everything is set up correctly.

---

## 📋 Quick Checklist

Before moving to the next step, verify:

- [ ] Figma Desktop App is installed
- [ ] Plugin files are downloaded
- [ ] `code.js` file exists in figma-plugin folder
- [ ] Plugin appears in Plugins → Development menu
- [ ] Plugin opens and shows the UI panel

---

## 🆘 Still Having Issues?

### Check Plugin Files

Make sure you have these files:
```
figma-plugin/
├── code.js         ✅ Must exist!
├── code.ts         ✅ Source file
├── ui.html         ✅ Must exist!
└── manifest.json   ✅ Must exist!
```

### Check Manifest Content

Open `manifest.json` and verify it looks like this:

```json
{
  "name": "Claude Design Assistant",
  "id": "claude-figma-design-assistant",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "networkAccess": {
    "allowedDomains": ["localhost"]
  }
}
```

### View Console Logs

To see what's happening:
1. Open the plugin
2. **Plugins** → **Development** → **Open Console**
3. Look for red error messages

---

## 💡 Pro Tips

### Tip 1: Keep Plugin Open
Keep the plugin panel open while working with Claude - it shows real-time updates.

### Tip 2: Reloading Plugin
If you make changes to the plugin code:
1. Close the plugin
2. **Plugins** → **Development** → **Claude Design Assistant**
3. Or: Edit plugin → Save → Figma auto-reloads

### Tip 3: Removing Plugin
To uninstall:
1. **Plugins** → **Development** → **Remove plugin**
2. Select "Claude Design Assistant"

### Tip 4: Development Console
The console shows helpful debugging info:
- Connection status
- Commands received
- Errors encountered

---

## 🎓 Understanding the Plugin Structure

### manifest.json
- Tells Figma about your plugin
- Sets the name, version, entry points
- Configures network permissions

### code.js (from code.ts)
- Main plugin logic
- Handles communication with MCP server
- Creates Figma elements
- Runs in Figma's sandbox

### ui.html
- Plugin user interface
- Shows connection status
- Activity logging
- Control buttons

---

## 🔄 Common Workflow

```
1. Open Figma Desktop
   ↓
2. Open a file (new or existing)
   ↓
3. Plugins → Development → Claude Design Assistant
   ↓
4. Plugin panel opens on right side
   ↓
5. Shows "Disconnected" (normal - need MCP server)
   ↓
6. After server setup: Click "Start Listening"
   ↓
7. Status turns green ✅
   ↓
8. Ready to use with Claude!
```

---

## ✨ Success!

If you've completed all steps and see the plugin in your Figma app, you're ready!

**Next step**: Set up the MCP Server (see QUICKSTART.md)

---

## 📞 Need More Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| "Plugin not appearing" | Restart Figma Desktop |
| "code.js not found" | Run `cp code.ts code.js` |
| "Network error" | Plugin needs MCP server running |
| "Blank plugin panel" | Check ui.html exists |
| "Plugin crashes" | Check Console for errors |

---

**You've successfully installed the Figma plugin! 🎉**

Now continue with the QUICKSTART.md guide to set up the MCP server and connect everything together.

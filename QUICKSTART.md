# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Installation (One-Time Setup)

### 1. Get Your Figma Token (2 min)

1. Open Figma.com
2. Click your profile → **Settings**
3. Scroll to **Personal Access Tokens**
4. Click **Generate new token**
5. Name it: "Claude"
6. **COPY THE TOKEN** (you won't see it again!)

### 2. Install MCP Server (1 min)

```bash
cd figma-claude-integration/mcp-server
npm install
```

Create `.env` file:
```bash
echo "FIGMA_ACCESS_TOKEN=paste_your_token_here" > .env
echo "WEBHOOK_PORT=3456" >> .env
```

### 3. Configure Claude Desktop (1 min)

**Mac**: Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: Edit `%APPDATA%\Claude\claude_desktop_config.json`

Add this (replace YOUR_PATH):
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/YOUR_PATH/figma-claude-integration/mcp-server/server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_token_from_step_1"
      }
    }
  }
}
```

**IMPORTANT**: Use full absolute path! Not ~/Downloads/... but /Users/yourname/Downloads/...

### 4. Install Figma Plugin (1 min)

1. Open **Figma Desktop App** (not browser)
2. Menu → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to: `figma-claude-integration/figma-plugin/manifest.json`
4. Click **Open**
5. Done! ✅

### 5. Prepare Plugin Code

```bash
cd figma-plugin
cp code.ts code.js
```

(If you have TypeScript: `tsc code.ts`)

---

## Running the System

### Every Time You Want to Use It:

**Step 1**: Start the server
```bash
cd mcp-server
npm start
```

Should see:
```
✅ Figma-Claude MCP Server ready!
🚀 Webhook server running on http://localhost:3456
```

**Step 2**: Restart Claude Desktop

**Step 3**: Open Figma
- Create or open a file
- Menu → **Plugins** → **Development** → **Claude Design Assistant**
- Click **"🚀 Start Listening for Claude"**
- Status should be green ✅

**Step 4**: Test in Claude
```
Hi Claude! Can you read my Figma file?
The file key is: ABC123XYZ
```

---

## First Test Commands

### Test 1: Read a File
```
Get the structure of my Figma file with key: ABC123XYZ
Show me the pages and main frames.
```

### Test 2: Create Something Simple
```
In file ABC123XYZ, create:
- A frame called "Test" that's 400x300px
- Inside it, add a blue rectangle
- Add text that says "Hello from Claude!"
```

### Test 3: Export Something
```
Export the frame with ID "1:23" from file ABC123XYZ as a PNG image
```

---

## Quick Troubleshooting

### ❌ "MCP server not connected"

**Fix:**
1. Is `npm start` running in Terminal?
2. Did you restart Claude Desktop?
3. Is your config path absolute? (Use `pwd` to get full path)

### ❌ "Plugin can't connect"

**Fix:**
1. Test server: `curl http://localhost:3456/health`
2. Should return: `{"status":"ok"}`
3. If not, server isn't running

### ❌ "Operation timeout"

**Fix:**
1. Is plugin running in Figma?
2. Did you click "Start Listening"?
3. Green dot should be visible in plugin

---

## Getting File Keys

File key is in the URL:
```
https://www.figma.com/file/ABC123XYZ/My-Design
                           ^^^ This is the file key
```

Or use:
```
Claude, search for my Figma files containing "dashboard"
```

---

## Example Workflow

```
User: Claude, I need a login screen

Claude: Sure! What's your Figma file key?

User: ABC123XYZ

Claude: [uses build_prototype_screen to create the screen]
Created a login screen with email, password inputs, and sign-in button!

User: Can you make the button bigger?

Claude: [uses create_button with size: "large"]
Done! The button is now larger.

User: Export it as an image

Claude: [uses export_nodes]
Here's your PNG: [download link]
```

---

## What You Can Do

✅ **Read**: File structure, colors, fonts, components
✅ **Create**: Frames, shapes, text, buttons, inputs
✅ **Build**: Complete screens from descriptions
✅ **Export**: PNG, SVG, PDF of any element
✅ **Analyze**: Get design suggestions and audits
✅ **Comment**: Add feedback to designs

---

## Pro Tips

1. **Keep plugin running** while working with Claude
2. **Use file keys** - easier than file names
3. **Be specific** - "24px Inter Bold" vs "big text"
4. **Check results** in Figma after each command
5. **Iterate** - start simple, refine as needed

---

## Next Steps

- Read `examples/login-screen.md` for a complete workflow
- Try `build_prototype_screen` for complex layouts
- Use `read_design_system` to audit existing designs
- Experiment with different styles (modern, minimal, corporate)

---

**You're ready to design with AI! 🎨**

Happy creating!

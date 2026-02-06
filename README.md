# 🎨 Claude + Figma Complete Integration

**Enable Claude AI to CREATE, READ, and MANIPULATE Figma designs in real-time.**

This is a complete solution that overcomes Figma's REST API read-only limitations by combining an MCP Server with a Figma Plugin via webhook bridge.

## 🚀 What Claude Can Do

### ✅ Read Operations (Figma REST API)
- Read complete file structures and design hierarchies
- Extract design systems (colors, typography, components)
- Export nodes as images (PNG, SVG, PDF)  
- Read and post comments for collaboration
- Analyze designs and suggest improvements

### ✅ Write Operations (Figma Plugin)
- Create frames, rectangles, text nodes, shapes
- Build buttons and input field components
- Generate complete screen prototypes from requirements
- Apply auto-layout automatically
- Create complex component hierarchies

---

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Figma Account
- Figma Desktop App
- Claude Desktop

## 🛠️ Quick Start

### 1. Get Figma Access Token

Figma → Settings → Account → Personal Access Tokens → Generate new token

### 2. Install MCP Server

```bash
cd figma-claude-integration/mcp-server
npm install

echo "FIGMA_ACCESS_TOKEN=your_token_here" > .env
echo "WEBHOOK_PORT=3456" >> .env
```

### 3. Configure Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/mcp-server/server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_token_here",
        "WEBHOOK_PORT": "3456"
      }
    }
  }
}
```

### 4. Install Figma Plugin

1. Open Figma Desktop
2. Plugins → Development → Import plugin from manifest
3. Select `figma-plugin/manifest.json`

### 5. Compile Plugin Code

```bash
cd figma-plugin
# Rename TypeScript to JavaScript (or compile if you have tsc)
cp code.ts code.js
```

### 6. Run Everything

```bash
# Terminal 1: Start MCP Server
cd mcp-server
npm start

# Figma: Run plugin
# Plugins → Development → Claude Design Assistant
# Click "Start Listening"

# Claude Desktop: Restart to load MCP server
```

---

## 💬 Example Usage

### Analyze Design
```
Claude, analyze Figma file ABC123XYZ and extract:
- Color palette
- Typography styles
- Components list
```

### Create Elements
```
In file ABC123XYZ, create:
1. A frame "Login Screen" (375x812px)
2. Blue rectangle with rounded corners
3. Text "Welcome" in 24px
```

### Build Complete Screen
```
Build a login screen in ABC123XYZ with:
- Email input
- Password input  
- Login button (primary)
- Forgot password link
Use modern style
```

---

## 🔧 Available Tools

**Read**: `get_file`, `read_design_system`, `export_nodes`, `get_comments`, `add_comment`

**Write**: `create_frame`, `create_rectangle`, `create_text`, `create_button`, `create_input_field`, `build_prototype_screen`, `apply_auto_layout`, `analyze_and_suggest`

See full documentation in examples folder.

---

## 🔍 Troubleshooting

### MCP Server Not Connected
- Check server is running: `npm start`
- Restart Claude Desktop
- Use absolute paths in config

### Plugin Can't Connect
- Is server on port 3456? `curl http://localhost:3456/health`
- Did you click "Start Listening"?
- Check firewall settings

### Operation Timeout
- Plugin must be running and listening
- Check Figma console: Plugins → Development → Open Console

---

## 🏗️ Architecture

```
Claude Desktop ←→ MCP Server ←→ Figma Plugin ←→ Figma Canvas
                       ↓
                  Figma API (read-only)
```

**Write Flow**: Claude → MCP → Webhook Queue → Plugin Polls → Creates in Figma → Callback

---

## 📦 Project Structure

```
figma-claude-integration/
├── mcp-server/
│   ├── server.js       # Full MCP server (15+ tools)
│   └── package.json
├── figma-plugin/
│   ├── code.ts        # Plugin logic
│   ├── ui.html        # Plugin UI
│   └── manifest.json
└── README.md
```

---

## 🎉 Ready to Go!

Try your first command:

```
Claude, in Figma file ABC123XYZ, create a welcome screen with:
- Title "Welcome"
- Subtitle "AI Design Assistant"  
- Primary button "Get Started"
Use modern style
```

---

## 📄 License

MIT - Modify and extend as needed!

**Made with ❤️ for AI-powered design**

# Project Structure & Setup Guide

Complete overview of the Figma + Claude Integration project structure and setup instructions.

## 📁 Project Structure

```
figma-claude-integration/
├── README.md                          # Main documentation
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
│
├── mcp-server/                        # MCP Server (connects Claude to Figma)
│   ├── enhanced-server.js             # Main server with all features
│   ├── package.json                   # Dependencies
│   ├── .env.example                   # Environment template
│   └── .env                           # Your configuration (create this)
│
├── figma-plugin/                      # Figma Plugin (runs inside Figma)
│   ├── code.ts                        # Main plugin code (TypeScript)
│   ├── code.js                        # Compiled JavaScript (auto-generated)
│   ├── ui.html                        # Plugin interface
│   ├── manifest.json                  # Plugin configuration
│   └── tsconfig.json                  # TypeScript config
│
├── docs/                              # Documentation
│   ├── WORKFLOWS.md                   # 12 detailed workflow examples
│   ├── TROUBLESHOOTING.md             # Common issues and fixes
│   ├── API.md                         # API reference
│   ├── BEST_PRACTICES.md              # Design guidelines
│   └── CONTRIBUTING.md                # Contribution guide
│
├── examples/                          # Example files
│   ├── design-systems/                # Example design systems
│   ├── components/                    # Example components
│   └── workflows/                     # Example workflow scripts
│
└── tests/                             # Tests (coming soon)
    ├── mcp-server/                    # Server tests
    └── plugin/                        # Plugin tests
```

## 🚀 Complete Setup Guide

### Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** installed
  ```bash
  node --version  # Should be v18.x.x or higher
  ```

- [ ] **npm** installed (comes with Node.js)
  ```bash
  npm --version
  ```

- [ ] **Figma Desktop app** installed
  - Download from: https://www.figma.com/downloads/

- [ ] **Claude Desktop app** installed
  - Download from: https://claude.ai/download

- [ ] **Figma account** (free or paid)

- [ ] **Figma API access token**
  - Get from: https://www.figma.com/settings (Personal Access Tokens)

### Step-by-Step Installation

#### Part 1: Download & Setup Project

```bash
# 1. Clone or download the repository
git clone https://github.com/yourusername/figma-claude-integration.git
cd figma-claude-integration

# 2. Install MCP server dependencies
cd mcp-server
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env file with your Figma token
# Use any text editor to open .env
# Replace "your_token_here" with your actual Figma access token
```

**Your .env file should look like:**
```
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEBHOOK_PORT=3000
LOG_LEVEL=info
```

#### Part 2: Configure Claude Desktop

**macOS:**

```bash
# 1. Open config file
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 2. If file doesn't exist, create it:
mkdir -p ~/Library/Application\ Support/Claude/
echo '{}' > ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**

```cmd
# 1. Navigate to config directory
cd %APPDATA%\Claude\

# 2. If file doesn't exist, create it:
echo {} > claude_desktop_config.json
```

**Add this configuration:**

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/figma-claude-integration/mcp-server/enhanced-server.js"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "WEBHOOK_PORT": "3000"
      }
    }
  }
}
```

**Important:** Replace `/ABSOLUTE/PATH/TO/` with your actual path!

To find your absolute path:
```bash
# macOS/Linux
pwd
# Output: /Users/yourname/Projects/figma-claude-integration

# Windows
cd
# Output: C:\Users\yourname\Projects\figma-claude-integration
```

#### Part 3: Install Figma Plugin

```bash
# 1. Compile TypeScript to JavaScript (if you modified code.ts)
cd figma-plugin
npm install -g typescript  # Install TypeScript if needed
tsc code.ts                # Compile to code.js
```

**In Figma Desktop:**

1. Open Figma Desktop app
2. Go to **Menu** → **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to `figma-claude-integration/figma-plugin/`
4. Select `manifest.json`
5. Click **Open**

You should see: **"Claude Integration for Figma"** in your plugins list.

#### Part 4: Start Everything

**Terminal 1 - MCP Server:**
```bash
cd figma-claude-integration/mcp-server
npm start
```

Should see:
```
Webhook server running on port 3000
Enhanced Figma MCP server running on stdio
```

**Terminal 2 - Claude Desktop:**
- Close Claude Desktop completely
- Reopen Claude Desktop
- The MCP server will start automatically

**Figma:**
- Open Figma Desktop
- Create a new file or open existing
- Right-click → **Plugins** → **Development** → **Claude Integration for Figma**

### Verification Tests

#### Test 1: MCP Server Connection

In Claude Desktop, type:
```
List all available Figma tools
```

Expected response:
```
I can see 24 Figma tools available:
1. analyze_design_requirements
2. get_file_structure
3. analyze_design_system
...
```

✅ **Pass:** Tools listed
❌ **Fail:** See [Troubleshooting](#troubleshooting)

#### Test 2: Plugin Functionality

In Figma plugin:

1. Go to **Create** tab
2. Click "Create Button" under Quick Actions
3. Should see a button appear on canvas

✅ **Pass:** Button created
❌ **Fail:** Check plugin console for errors

#### Test 3: End-to-End Integration

In Claude Desktop:
```
Create a simple login screen with email and password fields
```

Claude should:
1. Analyze requirements
2. Generate design plan
3. Provide implementation instructions

✅ **Pass:** Detailed plan provided
❌ **Fail:** Check MCP server logs

### Common Setup Issues

#### Issue: "Command not found: node"

**Solution:** Node.js not in PATH

```bash
# macOS (using Homebrew)
brew install node@20

# Windows
# Download and install from nodejs.org
# Ensure "Add to PATH" is checked

# Verify
node --version
```

#### Issue: "Cannot find module"

**Solution:** Dependencies not installed

```bash
cd mcp-server
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Permission denied"

**Solution:** Need sudo (macOS/Linux) or Administrator (Windows)

```bash
# macOS/Linux
sudo npm install -g typescript

# Windows (Run as Administrator)
npm install -g typescript
```

#### Issue: Plugin doesn't appear in Figma

**Solutions:**

1. **Use Figma Desktop** (not web version)
2. **Re-import plugin:**
   - Remove from Development plugins
   - Import again
3. **Check manifest.json:**
   ```bash
   cd figma-plugin
   cat manifest.json | python -m json.tool
   ```

#### Issue: "Access token invalid"

**Solutions:**

1. **Regenerate token** at figma.com/settings
2. **Update in both places:**
   - `.env` file
   - `claude_desktop_config.json`
3. **No spaces or quotes** around token
4. **Restart everything**

## 🔧 Advanced Configuration

### Custom Port

Change webhook port:

```bash
# In .env
WEBHOOK_PORT=3001
```

```json
// In claude_desktop_config.json
{
  "mcpServers": {
    "figma": {
      "env": {
        "WEBHOOK_PORT": "3001"
      }
    }
  }
}
```

Restart both server and Claude Desktop.

### Debug Mode

Enable detailed logging:

```bash
# In .env
LOG_LEVEL=debug
```

All API calls and responses will be logged.

### Multiple Figma Accounts

Configure multiple accounts:

```json
{
  "mcpServers": {
    "figma-personal": {
      "command": "node",
      "args": ["/path/to/enhanced-server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "personal_token_here"
      }
    },
    "figma-work": {
      "command": "node",
      "args": ["/path/to/enhanced-server.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "work_token_here",
        "WEBHOOK_PORT": "3001"
      }
    }
  }
}
```

### Custom Design Styles

Edit default styles in `enhanced-server.js`:

```javascript
getColorPalette(style, scheme) {
  const palettes = {
    // Add your custom style
    myStyle: {
      light: {
        primary: { hex: '#YOUR_COLOR', rgb: {...} },
        // ...
      }
    }
  }
}
```

## 📦 Deployment

### Production Setup

For production use:

1. **Use process manager:**
   ```bash
   npm install -g pm2
   pm2 start enhanced-server.js --name figma-mcp
   pm2 save
   pm2 startup
   ```

2. **Enable auto-restart:**
   ```bash
   pm2 set pm2:autodump true
   ```

3. **Monitor:**
   ```bash
   pm2 monit
   pm2 logs figma-mcp
   ```

### Docker Deployment (Optional)

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY mcp-server/package*.json ./
RUN npm ci --production

COPY mcp-server/ ./

ENV FIGMA_ACCESS_TOKEN=""
ENV WEBHOOK_PORT=3000

CMD ["node", "enhanced-server.js"]
```

```bash
docker build -t figma-mcp-server .
docker run -p 3000:3000 \
  -e FIGMA_ACCESS_TOKEN=your_token \
  figma-mcp-server
```

## 🧪 Development Setup

### For Contributing

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/figma-claude-integration.git
cd figma-claude-integration

# 2. Install all dependencies
cd mcp-server && npm install && cd ..
cd figma-plugin && npm install && cd ..

# 3. Run in development mode
cd mcp-server
npm run dev  # Uses nodemon for auto-reload

# 4. Make changes
# Edit code, test, commit

# 5. Run tests (when available)
npm test
```

### TypeScript Development

```bash
cd figma-plugin

# Watch mode (auto-compile on save)
tsc --watch

# Or compile once
tsc code.ts
```

### Linting

```bash
# Install ESLint
npm install -g eslint

# Run linter
eslint mcp-server/**/*.js
```

## 📚 Next Steps

After setup is complete:

1. **Read the [Workflows Guide](./WORKFLOWS.md)** - Learn the 12 main workflows
2. **Try Examples** - Start with simple tasks, build up
3. **Explore Tools** - See what each tool can do
4. **Join Community** - Share your designs and get help
5. **Contribute** - Help improve the integration

## 🆘 Getting Help

If you're stuck:

1. **Check [Troubleshooting Guide](./TROUBLESHOOTING.md)**
2. **Search [GitHub Issues](https://github.com/yourusername/figma-claude-integration/issues)**
3. **Ask in [Discussions](https://github.com/yourusername/figma-claude-integration/discussions)**
4. **Create new issue** with setup details

## ✅ Setup Checklist

Use this to verify everything is working:

- [ ] Node.js 18+ installed
- [ ] Repository downloaded
- [ ] Dependencies installed (`npm install` in mcp-server)
- [ ] `.env` file created with Figma token
- [ ] Claude Desktop config updated with absolute path
- [ ] Figma plugin imported
- [ ] MCP server starts without errors
- [ ] Claude Desktop shows Figma tools
- [ ] Plugin opens in Figma
- [ ] Can create simple component in plugin
- [ ] Claude can analyze design requirements
- [ ] End-to-end workflow works

If all checked ✅, you're ready to use the integration!

---

**Happy designing! 🎨**

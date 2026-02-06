# Troubleshooting Guide

Common issues and their solutions for the Claude + Figma Integration.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Connection Issues](#connection-issues)
3. [Plugin Issues](#plugin-issues)
4. [MCP Server Issues](#mcp-server-issues)
5. [API Issues](#api-issues)
6. [Performance Issues](#performance-issues)

---

## Installation Issues

### Issue: "FIGMA_ACCESS_TOKEN environment variable is required"

**Cause:** Environment variable not set or not accessible.

**Solutions:**

1. **Check .env file exists:**
   ```bash
   ls mcp-server/.env
   ```

2. **Verify content:**
   ```bash
   cat mcp-server/.env
   ```
   Should show: `FIGMA_ACCESS_TOKEN=your_token_here`

3. **Recreate .env file:**
   ```bash
   cd mcp-server
   echo "FIGMA_ACCESS_TOKEN=your_actual_token" > .env
   ```

4. **For Claude Desktop config:**
   ```json
   {
     "mcpServers": {
       "figma": {
         "env": {
           "FIGMA_ACCESS_TOKEN": "paste_token_directly_here"
         }
       }
     }
   }
   ```

### Issue: "Cannot find module '@modelcontextprotocol/sdk'"

**Cause:** Dependencies not installed.

**Solution:**
```bash
cd mcp-server
npm install
```

If that doesn't work:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Node version too old"

**Cause:** Need Node.js 18 or higher.

**Solution:**

1. Check current version:
   ```bash
   node --version
   ```

2. Install latest Node.js:
   - **macOS:** `brew install node@20`
   - **Windows:** Download from nodejs.org
   - **Linux:** `nvm install 20`

3. Verify:
   ```bash
   node --version  # Should show v18.x.x or higher
   ```

---

## Connection Issues

### Issue: Plugin can't connect to MCP server

**Symptoms:** "Webhook call failed" or "Connection refused" errors

**Solutions:**

1. **Verify MCP server is running:**
   ```bash
   # In one terminal
   cd mcp-server
   npm start
   ```
   Should see: "Webhook server running on port 3000"

2. **Check port availability:**
   ```bash
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```
   
   If port is in use, either:
   - Kill the process
   - Or change port in .env: `WEBHOOK_PORT=3001`

3. **Test webhook endpoint:**
   ```bash
   curl http://localhost:3000/figma-callback
   ```
   Should return JSON response

4. **Update plugin webhook URL:**
   - Open plugin in Figma
   - Go to Settings tab
   - Update URL to match your port

5. **Check firewall:**
   - Ensure localhost connections allowed
   - Disable firewall temporarily to test

### Issue: "Claude doesn't see Figma tools"

**Cause:** MCP server not loaded in Claude Desktop.

**Solutions:**

1. **Verify config file location:**
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

2. **Check config syntax:**
   ```bash
   # macOS
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python -m json.tool
   
   # Windows
   type "%APPDATA%\Claude\claude_desktop_config.json" | python -m json.tool
   ```
   Should not show syntax errors

3. **Verify absolute path:**
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "node",
         "args": ["/Users/yourname/figma-claude-integration/mcp-server/enhanced-server.js"]
       }
     }
   }
   ```
   Path must be absolute, not relative!

4. **Restart Claude Desktop:**
   - Completely quit Claude
   - Wait 5 seconds
   - Relaunch

5. **Check MCP server logs:**
   ```bash
   # Look for errors in server output
   cd mcp-server
   npm start
   ```

---

## Plugin Issues

### Issue: "Plugin not appearing in Figma"

**Solutions:**

1. **Verify import:**
   - Menu → Plugins → Development → Manage plugins
   - Should see "Claude Integration for Figma"

2. **Re-import:**
   - Menu → Plugins → Development → Import plugin from manifest
   - Navigate to `manifest.json`
   - Click Open

3. **Check manifest.json:**
   ```bash
   cd figma-plugin
   cat manifest.json | python -m json.tool
   ```
   Should be valid JSON

4. **Try Figma Desktop app:**
   - Web version has plugin limitations
   - Download desktop app from figma.com

### Issue: "Plugin UI doesn't load"

**Solutions:**

1. **Check console for errors:**
   - Right-click plugin → Inspect
   - Look at Console tab

2. **Verify ui.html exists:**
   ```bash
   ls figma-plugin/ui.html
   ```

3. **Clear plugin cache:**
   - Close plugin
   - Remove from Development plugins
   - Re-import

4. **Check for JavaScript errors:**
   - Open ui.html in browser
   - Check browser console

### Issue: "Plugin can't create components"

**Cause:** May require Figma paid plan for some operations.

**Solutions:**

1. **Check Figma plan:**
   - Free plan has limitations
   - Upgrade to Starter/Professional

2. **Verify permissions:**
   - Check manifest.json permissions
   - Ensure documentAccess is set

3. **Test simple operations first:**
   - Try creating a rectangle
   - Then try components

---

## MCP Server Issues

### Issue: "Figma API error: 403 Forbidden"

**Cause:** Invalid or expired access token.

**Solutions:**

1. **Regenerate token:**
   - Go to Figma Settings → Personal Access Tokens
   - Delete old token
   - Create new token
   - Update everywhere:
     - .env file
     - Claude Desktop config

2. **Verify token format:**
   - Should start with "figd_"
   - No spaces or newlines
   - Full token, not truncated

3. **Test token:**
   ```bash
   curl -H "X-Figma-Token: your_token" https://api.figma.com/v1/me
   ```
   Should return your user info

### Issue: "Figma API error: 404 Not Found"

**Cause:** Invalid file key or no access to file.

**Solutions:**

1. **Verify file key:**
   - From URL: `figma.com/file/FILE_KEY/...`
   - File key is between "file/" and next "/"

2. **Check file access:**
   - File must be accessible with your token
   - Try opening file in Figma
   - Check sharing settings

3. **Test file access:**
   ```bash
   curl -H "X-Figma-Token: your_token" \
     https://api.figma.com/v1/files/YOUR_FILE_KEY
   ```

### Issue: "Cannot read property 'document' of undefined"

**Cause:** File data structure unexpected.

**Solutions:**

1. **Check API response:**
   ```bash
   curl -H "X-Figma-Token: token" \
     https://api.figma.com/v1/files/FILE_KEY | python -m json.tool
   ```

2. **Verify file isn't empty:**
   - Open in Figma
   - Ensure it has content

3. **Update error handling:**
   - Check enhanced-server.js
   - Add null checks

---

## API Issues

### Issue: "Rate limit exceeded"

**Cause:** Too many API requests (Figma limit: 100/minute).

**Solutions:**

1. **Add delay between requests:**
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 1000));
   ```

2. **Batch operations:**
   - Group multiple requests
   - Use batch endpoints when available

3. **Cache results:**
   - Store file data locally
   - Refresh only when needed

4. **Upgrade Figma plan:**
   - Higher plans have higher limits

### Issue: "Network request failed"

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping api.figma.com
   ```

2. **Test API directly:**
   ```bash
   curl https://api.figma.com/v1/me
   ```

3. **Check proxy settings:**
   - Corporate networks may block
   - Configure proxy if needed

4. **Verify DNS:**
   ```bash
   nslookup api.figma.com
   ```

---

## Performance Issues

### Issue: "Plugin is slow"

**Solutions:**

1. **Limit depth when reading files:**
   ```javascript
   { file_key: "abc", depth: 2 }  // Instead of 5
   ```

2. **Filter unnecessary nodes:**
   - Only get what you need
   - Skip hidden layers

3. **Use pagination:**
   - Process in batches
   - Don't load entire file

4. **Optimize images:**
   - Lower export scale
   - Use appropriate format

### Issue: "MCP server uses too much memory"

**Solutions:**

1. **Increase Node.js memory:**
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm start
   ```

2. **Clear caches periodically:**
   ```javascript
   this.designAnalytics.clear();
   ```

3. **Limit concurrent requests:**
   - Queue operations
   - Process sequentially

4. **Monitor memory:**
   ```bash
   node --max-old-space-size=8192 enhanced-server.js
   ```

---

## Still Having Issues?

### Get Help

1. **Check documentation:**
   - [README.md](../README.md)
   - [WORKFLOWS.md](./WORKFLOWS.md)
   - [API.md](./API.md)

2. **Search existing issues:**
   - [GitHub Issues](https://github.com/yourusername/figma-claude-integration/issues)

3. **Create new issue:**
   - Include error messages
   - Include steps to reproduce
   - Include versions (Node, Figma, Claude)

4. **Community support:**
   - [GitHub Discussions](https://github.com/yourusername/figma-claude-integration/discussions)

### Debug Mode

Enable detailed logging:

```bash
# In .env file
LOG_LEVEL=debug
```

```javascript
// In code
console.error('Debug info:', JSON.stringify(data, null, 2));
```

### Report a Bug

Include:

- **OS:** macOS 13.1, Windows 11, etc.
- **Node version:** `node --version`
- **Figma version:** Help → About Figma
- **Error message:** Full error with stack trace
- **Steps to reproduce:** Exact steps that cause the issue
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Screenshots:** If applicable

### Emergency Fixes

**Reset Everything:**

```bash
# Stop all processes
killall node  # macOS/Linux
taskkill /F /IM node.exe  # Windows

# Remove and reinstall
cd mcp-server
rm -rf node_modules package-lock.json
npm install

# Restart Claude Desktop
# Re-import Figma plugin
```

**Test in Isolation:**

1. Test MCP server alone:
   ```bash
   cd mcp-server
   npm start
   ```

2. Test plugin alone:
   - Create simple rectangle
   - Check if that works

3. Test API access:
   ```bash
   curl -H "X-Figma-Token: token" https://api.figma.com/v1/me
   ```

If basic operations work, issue is with integration.
If basic operations fail, issue is with setup.

---

**Still stuck? Open an issue with all the above information!**

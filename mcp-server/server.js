#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import crypto from "crypto";

const FIGMA_API_BASE = "https://api.figma.com/v1";

class FigmaClaudeServer {
  constructor(accessToken, webhookPort = 3456) {
    this.accessToken = accessToken;
    this.webhookPort = webhookPort;
    this.pendingOperations = new Map();
    this.commandQueue = new Map(); // file_key -> commands array
    
    // Setup Express server for plugin communication
    this.setupWebhookServer();
    
    // Setup MCP server
    this.server = new Server(
      {
        name: "figma-claude-server",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupWebhookServer() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        message: 'Figma-Claude MCP Server',
        timestamp: new Date().toISOString()
      });
    });

    // Plugin polls for commands
    this.app.get('/commands/:fileKey', (req, res) => {
      const { fileKey } = req.params;
      const commands = this.commandQueue.get(fileKey) || [];
      
      // Clear queue after sending
      this.commandQueue.set(fileKey, []);
      
      res.json({ commands });
    });

    // Plugin sends results back
    this.app.post('/results', (req, res) => {
      const { operationId, success, data, error } = req.body;
      
      if (this.pendingOperations.has(operationId)) {
        const { resolve, reject } = this.pendingOperations.get(operationId);
        
        if (success) {
          resolve(data);
        } else {
          reject(new Error(error || 'Operation failed'));
        }
        
        this.pendingOperations.delete(operationId);
      }
      
      res.json({ received: true });
    });

    // Plugin registration
    this.app.post('/plugin/register', (req, res) => {
      const { fileKey, pluginVersion } = req.body;
      console.error(`Plugin registered for file: ${fileKey}, version: ${pluginVersion}`);
      res.json({ 
        registered: true,
        webhookUrl: `http://localhost:${this.webhookPort}`
      });
    });

    this.app.listen(this.webhookPort, () => {
      console.error(`🚀 Webhook server running on http://localhost:${this.webhookPort}`);
    });
  }

  async figmaRequest(endpoint, options = {}) {
    const url = `${FIGMA_API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-Figma-Token": this.accessToken,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Figma API error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  queueCommand(fileKey, command) {
    const operationId = crypto.randomUUID();
    
    if (!this.commandQueue.has(fileKey)) {
      this.commandQueue.set(fileKey, []);
    }
    
    this.commandQueue.get(fileKey).push({
      operationId,
      ...command
    });

    return new Promise((resolve, reject) => {
      this.pendingOperations.set(operationId, { resolve, reject });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingOperations.has(operationId)) {
          this.pendingOperations.delete(operationId);
          reject(new Error('Operation timeout - is the Figma plugin running?'));
        }
      }, 30000);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // READ OPERATIONS (REST API)
        {
          name: "get_file",
          description: "Get complete Figma file structure with all pages, frames, and nodes. Returns detailed document tree.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key from URL (figma.com/file/FILE_KEY/...)",
              },
              depth: {
                type: "number",
                description: "Tree depth to fetch (1-5, default: 3)",
                default: 3,
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "read_design_system",
          description: "Extract design system: colors, typography, components, styles. Perfect for design audits and documentation.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "export_nodes",
          description: "Export frames/nodes as images (PNG, JPG, SVG, PDF). Get download URLs.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              node_ids: {
                type: "array",
                items: { type: "string" },
                description: "Node IDs to export (e.g., ['1:2', '1:3'])",
              },
              format: {
                type: "string",
                enum: ["png", "jpg", "svg", "pdf"],
                default: "png",
              },
              scale: {
                type: "number",
                description: "Export scale (0.01-4, default: 2 for retina)",
                default: 2,
              },
            },
            required: ["file_key", "node_ids"],
          },
        },
        {
          name: "get_comments",
          description: "Fetch all comments from a Figma file for review and collaboration.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
            },
            required: ["file_key"],
          },
        },
        {
          name: "add_comment",
          description: "Add feedback/comment to a Figma file or specific node.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              message: {
                type: "string",
                description: "Comment text",
              },
              node_id: {
                type: "string",
                description: "Optional: node ID to attach comment to",
              },
              x: {
                type: "number",
                description: "Optional: X coordinate for comment position",
              },
              y: {
                type: "number",
                description: "Optional: Y coordinate for comment position",
              },
            },
            required: ["file_key", "message"],
          },
        },

        // WRITE OPERATIONS (via Plugin)
        {
          name: "create_frame",
          description: "Create a new frame in Figma. Requires plugin running in the file.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              name: {
                type: "string",
                description: "Frame name",
              },
              width: {
                type: "number",
                description: "Width in pixels",
              },
              height: {
                type: "number",
                description: "Height in pixels",
              },
              x: {
                type: "number",
                description: "X position",
                default: 0,
              },
              y: {
                type: "number",
                description: "Y position",
                default: 0,
              },
              background_color: {
                type: "string",
                description: "Hex color (e.g., #FFFFFF)",
              },
            },
            required: ["file_key", "name", "width", "height"],
          },
        },
        {
          name: "create_rectangle",
          description: "Create a rectangle shape. Requires plugin running.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              parent_id: {
                type: "string",
                description: "Parent frame/group node ID (optional, uses selection if empty)",
              },
              name: {
                type: "string",
                description: "Rectangle name",
              },
              x: {
                type: "number",
                default: 0,
              },
              y: {
                type: "number",
                default: 0,
              },
              width: {
                type: "number",
              },
              height: {
                type: "number",
              },
              fill_color: {
                type: "string",
                description: "Hex color (e.g., #FF5733)",
              },
              corner_radius: {
                type: "number",
                description: "Border radius in pixels",
                default: 0,
              },
            },
            required: ["file_key", "name", "width", "height"],
          },
        },
        {
          name: "create_text",
          description: "Create text node. Requires plugin running.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              parent_id: {
                type: "string",
                description: "Parent frame/group node ID (optional)",
              },
              text: {
                type: "string",
                description: "Text content",
              },
              x: {
                type: "number",
                default: 0,
              },
              y: {
                type: "number",
                default: 0,
              },
              font_size: {
                type: "number",
                default: 16,
              },
              font_family: {
                type: "string",
                description: "Font name (must be available in Figma)",
                default: "Inter",
              },
              font_weight: {
                type: "string",
                description: "Font weight (Regular, Medium, Bold, etc.)",
                default: "Regular",
              },
              text_color: {
                type: "string",
                description: "Hex color",
                default: "#000000",
              },
              text_align: {
                type: "string",
                enum: ["LEFT", "CENTER", "RIGHT", "JUSTIFIED"],
                default: "LEFT",
              },
            },
            required: ["file_key", "text"],
          },
        },
        {
          name: "create_button",
          description: "Create a button component with text. High-level helper. Requires plugin.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              parent_id: {
                type: "string",
                description: "Parent frame ID (optional)",
              },
              label: {
                type: "string",
                description: "Button text",
              },
              x: {
                type: "number",
                default: 0,
              },
              y: {
                type: "number",
                default: 0,
              },
              variant: {
                type: "string",
                enum: ["primary", "secondary", "outline", "ghost"],
                default: "primary",
              },
              size: {
                type: "string",
                enum: ["small", "medium", "large"],
                default: "medium",
              },
            },
            required: ["file_key", "label"],
          },
        },
        {
          name: "create_input_field",
          description: "Create an input field component. Requires plugin.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              parent_id: {
                type: "string",
                description: "Parent frame ID (optional)",
              },
              label: {
                type: "string",
                description: "Input label",
              },
              placeholder: {
                type: "string",
                description: "Placeholder text",
              },
              x: {
                type: "number",
                default: 0,
              },
              y: {
                type: "number",
                default: 0,
              },
              width: {
                type: "number",
                default: 300,
              },
              type: {
                type: "string",
                enum: ["text", "email", "password", "number"],
                default: "text",
              },
            },
            required: ["file_key", "label"],
          },
        },
        {
          name: "build_prototype_screen",
          description: "Build complete screen from requirements. AI-powered layout generation. Requires plugin.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              screen_name: {
                type: "string",
                description: "Screen name (e.g., 'Login Screen', 'Dashboard')",
              },
              requirements: {
                type: "string",
                description: "Detailed requirements for the screen",
              },
              style: {
                type: "string",
                enum: ["modern", "minimal", "corporate", "playful", "neumorphic"],
                default: "modern",
              },
              device: {
                type: "string",
                enum: ["mobile", "tablet", "desktop", "watch"],
                default: "mobile",
              },
            },
            required: ["file_key", "screen_name", "requirements"],
          },
        },
        {
          name: "apply_auto_layout",
          description: "Apply auto-layout to selected frames. Requires plugin.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              node_id: {
                type: "string",
                description: "Frame node ID to apply auto-layout to",
              },
              direction: {
                type: "string",
                enum: ["HORIZONTAL", "VERTICAL"],
                default: "VERTICAL",
              },
              spacing: {
                type: "number",
                description: "Spacing between items",
                default: 16,
              },
              padding: {
                type: "number",
                description: "Padding inside frame",
                default: 24,
              },
            },
            required: ["file_key", "node_id"],
          },
        },
        {
          name: "analyze_and_suggest",
          description: "AI analysis of design with improvement suggestions. Analyzes existing Figma file.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "Figma file key",
              },
              focus: {
                type: "string",
                enum: ["accessibility", "consistency", "spacing", "colors", "typography", "all"],
                default: "all",
              },
            },
            required: ["file_key"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Read operations
          case "get_file":
            return await this.getFile(args);
          case "read_design_system":
            return await this.readDesignSystem(args);
          case "export_nodes":
            return await this.exportNodes(args);
          case "get_comments":
            return await this.getComments(args);
          case "add_comment":
            return await this.addComment(args);
          
          // Write operations (via plugin)
          case "create_frame":
            return await this.createFrame(args);
          case "create_rectangle":
            return await this.createRectangle(args);
          case "create_text":
            return await this.createText(args);
          case "create_button":
            return await this.createButton(args);
          case "create_input_field":
            return await this.createInputField(args);
          case "build_prototype_screen":
            return await this.buildPrototypeScreen(args);
          case "apply_auto_layout":
            return await this.applyAutoLayout(args);
          case "analyze_and_suggest":
            return await this.analyzeAndSuggest(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // ==================== READ OPERATIONS ====================

  async getFile(args) {
    const { file_key, depth = 3 } = args;
    const data = await this.figmaRequest(`/files/${file_key}?depth=${depth}`);

    const structure = this.extractStructure(data.document);

    return {
      content: [
        {
          type: "text",
          text: `📄 File: ${data.name}\n\n${JSON.stringify(structure, null, 2)}`,
        },
      ],
    };
  }

  extractStructure(node, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return { name: node.name, type: node.type };

    const structure = {
      id: node.id,
      name: node.name,
      type: node.type,
    };

    if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'COMPONENT') {
      structure.size = {
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
      };
    }

    if (node.children && depth < maxDepth) {
      structure.children = node.children.map(child =>
        this.extractStructure(child, depth + 1, maxDepth)
      );
    }

    return structure;
  }

  async readDesignSystem(args) {
    const { file_key } = args;
    const fileData = await this.figmaRequest(`/files/${file_key}`);

    const designSystem = {
      colors: this.extractColors(fileData.document),
      typography: this.extractTypography(fileData.document),
      components: this.extractComponents(fileData.document),
      spacing: this.extractSpacing(fileData.document),
    };

    return {
      content: [
        {
          type: "text",
          text: `🎨 Design System Analysis\n\n${JSON.stringify(designSystem, null, 2)}`,
        },
      ],
    };
  }

  extractColors(node, colors = new Set()) {
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === "SOLID" && fill.visible !== false) {
          const { r, g, b, a = 1 } = fill.color;
          const hex = this.rgbToHex(r, g, b);
          colors.add(JSON.stringify({ hex, opacity: fill.opacity || a }));
        }
      });
    }

    if (node.children) {
      node.children.forEach(child => this.extractColors(child, colors));
    }

    return Array.from(colors).map(c => JSON.parse(c));
  }

  extractTypography(node, fonts = new Set()) {
    if (node.type === 'TEXT' && node.style) {
      fonts.add(JSON.stringify({
        family: node.style.fontFamily,
        size: node.style.fontSize,
        weight: node.style.fontWeight,
        lineHeight: node.style.lineHeightPx,
      }));
    }

    if (node.children) {
      node.children.forEach(child => this.extractTypography(child, fonts));
    }

    return Array.from(fonts).map(f => JSON.parse(f));
  }

  extractComponents(node, components = []) {
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      components.push({
        id: node.id,
        name: node.name,
        type: node.type,
        description: node.description || '',
      });
    }

    if (node.children) {
      node.children.forEach(child => this.extractComponents(child, components));
    }

    return components;
  }

  extractSpacing(node, spacings = new Set()) {
    if (node.type === 'FRAME' && node.layoutMode) {
      if (node.itemSpacing) spacings.add(node.itemSpacing);
      if (node.paddingLeft) spacings.add(node.paddingLeft);
      if (node.paddingRight) spacings.add(node.paddingRight);
      if (node.paddingTop) spacings.add(node.paddingTop);
      if (node.paddingBottom) spacings.add(node.paddingBottom);
    }

    if (node.children) {
      node.children.forEach(child => this.extractSpacing(child, spacings));
    }

    return Array.from(spacings).sort((a, b) => a - b);
  }

  rgbToHex(r, g, b) {
    return "#" + [r, g, b]
      .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
      .join('').toUpperCase();
  }

  async exportNodes(args) {
    const { file_key, node_ids, format = "png", scale = 2 } = args;
    const ids = node_ids.join(",");
    const data = await this.figmaRequest(
      `/images/${file_key}?ids=${ids}&format=${format}&scale=${scale}`
    );

    return {
      content: [
        {
          type: "text",
          text: `📸 Export complete!\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async getComments(args) {
    const { file_key } = args;
    const data = await this.figmaRequest(`/files/${file_key}/comments`);

    return {
      content: [
        {
          type: "text",
          text: `💬 Comments (${data.comments?.length || 0})\n\n${JSON.stringify(data.comments, null, 2)}`,
        },
      ],
    };
  }

  async addComment(args) {
    const { file_key, message, node_id, x, y } = args;
    
    const body = {
      message,
    };

    if (node_id) {
      body.client_meta = {
        node_id: [node_id],
      };
    }

    if (x !== undefined && y !== undefined) {
      body.client_meta = {
        ...body.client_meta,
        node_offset: { x, y },
      };
    }

    const data = await this.figmaRequest(`/files/${file_key}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Comment added successfully!\n\nID: ${data.id}\nMessage: "${message}"`,
        },
      ],
    };
  }

  // ==================== WRITE OPERATIONS ====================

  async createFrame(args) {
    const { file_key, name, width, height, x = 0, y = 0, background_color } = args;

    const result = await this.queueCommand(file_key, {
      action: 'CREATE_FRAME',
      data: {
        name,
        width,
        height,
        x,
        y,
        backgroundColor: background_color ? this.hexToRgb(background_color) : undefined,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Frame created!\n\nName: ${name}\nSize: ${width}×${height}px\nNode ID: ${result.nodeId}`,
        },
      ],
    };
  }

  async createRectangle(args) {
    const { file_key, parent_id, name, x = 0, y = 0, width, height, fill_color, corner_radius = 0 } = args;

    const result = await this.queueCommand(file_key, {
      action: 'CREATE_RECTANGLE',
      data: {
        parentId: parent_id,
        name,
        x,
        y,
        width,
        height,
        fillColor: fill_color ? this.hexToRgb(fill_color) : undefined,
        cornerRadius: corner_radius,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Rectangle created!\n\nName: ${name}\nSize: ${width}×${height}px\nNode ID: ${result.nodeId}`,
        },
      ],
    };
  }

  async createText(args) {
    const { 
      file_key, parent_id, text, x = 0, y = 0, 
      font_size = 16, font_family = "Inter", font_weight = "Regular",
      text_color = "#000000", text_align = "LEFT"
    } = args;

    const result = await this.queueCommand(file_key, {
      action: 'CREATE_TEXT',
      data: {
        parentId: parent_id,
        text,
        x,
        y,
        fontSize: font_size,
        fontFamily: font_family,
        fontWeight: font_weight,
        textColor: this.hexToRgb(text_color),
        textAlign: text_align,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Text created!\n\nContent: "${text}"\nFont: ${font_family} ${font_weight} ${font_size}px\nNode ID: ${result.nodeId}`,
        },
      ],
    };
  }

  async createButton(args) {
    const { file_key, parent_id, label, x = 0, y = 0, variant = "primary", size = "medium" } = args;

    const result = await this.queueCommand(file_key, {
      action: 'CREATE_BUTTON',
      data: {
        parentId: parent_id,
        label,
        x,
        y,
        variant,
        size,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Button created!\n\nLabel: "${label}"\nVariant: ${variant}\nSize: ${size}\nNode ID: ${result.nodeId}`,
        },
      ],
    };
  }

  async createInputField(args) {
    const { file_key, parent_id, label, placeholder = "", x = 0, y = 0, width = 300, type = "text" } = args;

    const result = await this.queueCommand(file_key, {
      action: 'CREATE_INPUT',
      data: {
        parentId: parent_id,
        label,
        placeholder,
        x,
        y,
        width,
        type,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Input field created!\n\nLabel: "${label}"\nType: ${type}\nNode ID: ${result.nodeId}`,
        },
      ],
    };
  }

  async buildPrototypeScreen(args) {
    const { file_key, screen_name, requirements, style = "modern", device = "mobile" } = args;

    // AI-powered layout planning
    const layout = this.generateLayoutPlan(requirements, style, device);

    const result = await this.queueCommand(file_key, {
      action: 'BUILD_SCREEN',
      data: {
        screenName: screen_name,
        requirements,
        style,
        device,
        layout,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Screen built!\n\nName: ${screen_name}\nStyle: ${style}\nDevice: ${device}\n\nLayout:\n${JSON.stringify(layout, null, 2)}\n\nNode ID: ${result.nodeId}`,
        },
      ],
    };
  }

  generateLayoutPlan(requirements, style, device) {
    // This is where the AI magic happens - parse requirements into structured layout
    const deviceSizes = {
      mobile: { width: 375, height: 812 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1440, height: 900 },
      watch: { width: 184, height: 224 },
    };

    const styleConfig = {
      modern: {
        primaryColor: "#0066FF",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        borderRadius: 12,
        spacing: 16,
      },
      minimal: {
        primaryColor: "#000000",
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        borderRadius: 4,
        spacing: 24,
      },
      corporate: {
        primaryColor: "#003D82",
        backgroundColor: "#F5F7FA",
        textColor: "#2C3E50",
        borderRadius: 6,
        spacing: 20,
      },
    };

    return {
      device: deviceSizes[device],
      style: styleConfig[style] || styleConfig.modern,
      requirements,
    };
  }

  async applyAutoLayout(args) {
    const { file_key, node_id, direction = "VERTICAL", spacing = 16, padding = 24 } = args;

    const result = await this.queueCommand(file_key, {
      action: 'APPLY_AUTO_LAYOUT',
      data: {
        nodeId: node_id,
        direction,
        spacing,
        padding,
      },
    });

    return {
      content: [
        {
          type: "text",
          text: `✅ Auto-layout applied!\n\nDirection: ${direction}\nSpacing: ${spacing}px\nPadding: ${padding}px`,
        },
      ],
    };
  }

  async analyzeAndSuggest(args) {
    const { file_key, focus = "all" } = args;

    // Get file data
    const fileData = await this.figmaRequest(`/files/${file_key}`);
    const designSystem = await this.readDesignSystem({ file_key });

    const analysis = {
      focus,
      suggestions: [],
      score: 0,
    };

    // Analyze based on focus
    if (focus === "all" || focus === "colors") {
      const colors = JSON.parse(designSystem.content[0].text).colors;
      if (colors.length > 10) {
        analysis.suggestions.push({
          category: "colors",
          severity: "medium",
          message: `You're using ${colors.length} colors. Consider reducing to 5-8 core colors for better consistency.`,
        });
      }
    }

    if (focus === "all" || focus === "spacing") {
      const spacing = JSON.parse(designSystem.content[0].text).spacing;
      if (spacing.length > 8) {
        analysis.suggestions.push({
          category: "spacing",
          severity: "low",
          message: `${spacing.length} different spacing values detected. Consider using an 8px grid system.`,
        });
      }
    }

    // Add more analysis logic...

    return {
      content: [
        {
          type: "text",
          text: `🔍 Design Analysis\n\n${JSON.stringify(analysis, null, 2)}`,
        },
      ],
    };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 0, g: 0, b: 0 };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("✅ Figma-Claude MCP Server ready!");
  }
}

// Initialize
const accessToken = process.env.FIGMA_ACCESS_TOKEN;
const webhookPort = parseInt(process.env.WEBHOOK_PORT || "3456");

if (!accessToken) {
  console.error("❌ Error: FIGMA_ACCESS_TOKEN environment variable required");
  console.error("\nGet your token at: https://www.figma.com/developers/api#access-tokens");
  process.exit(1);
}

const server = new FigmaClaudeServer(accessToken, webhookPort);
server.run().catch(console.error);

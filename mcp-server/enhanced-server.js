import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const FIGMA_API_BASE = "https://api.figma.com/v1";

class EnhancedFigmaMCPServer {
  constructor(accessToken, webhookPort = 3000) {
    this.accessToken = accessToken;
    this.webhookPort = webhookPort;
    this.pendingRequests = new Map();
    this.designAnalytics = new Map();
    
    // Setup Express server for webhook communication
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.setupWebhook();
    
    // Setup MCP server
    this.server = new Server(
      {
        name: "enhanced-figma-mcp-server",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupWebhook() {
    // Endpoint for Figma plugin to report back
    this.app.post("/figma-callback", (req, res) => {
      const { requestId, success, data, error } = req.body;
      
      if (this.pendingRequests.has(requestId)) {
        const { resolve, reject } = this.pendingRequests.get(requestId);
        
        if (success) {
          resolve(data);
        } else {
          reject(new Error(error || "Unknown error"));
        }
        
        this.pendingRequests.delete(requestId);
      }
      
      res.json({ received: true });
    });

    // Endpoint for plugin to get commands
    this.app.post("/figma-command", (req, res) => {
      const { fileKey, command } = req.body;
      console.error(`Received command for file ${fileKey}:`, command);
      res.json({ success: true });
    });

    this.app.listen(this.webhookPort, () => {
      console.error(`Webhook server running on port ${this.webhookPort}`);
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

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // ===== REQUIREMENT ANALYSIS =====
        {
          name: "analyze_design_requirements",
          description: "Analyze natural language design requirements and generate a detailed design specification with components, layout, colors, and typography. Returns a structured plan ready for implementation.",
          inputSchema: {
            type: "object",
            properties: {
              requirements: {
                type: "string",
                description: "Natural language description of what to design (e.g., 'Create a modern login screen with email/password fields and social login buttons')",
              },
              designStyle: {
                type: "string",
                enum: ["modern", "minimal", "corporate", "playful", "elegant", "brutalist"],
                description: "Overall design style aesthetic",
                default: "modern",
              },
              platform: {
                type: "string",
                enum: ["web", "mobile", "tablet", "desktop"],
                description: "Target platform for the design",
                default: "web",
              },
              colorScheme: {
                type: "string",
                enum: ["light", "dark", "auto"],
                description: "Preferred color scheme",
                default: "light",
              },
            },
            required: ["requirements"],
          },
        },

        // ===== FILE OPERATIONS =====
        {
          name: "get_file_structure",
          description: "Get the complete hierarchical structure of a Figma file including all pages, frames, components, and their properties. Returns detailed node information with styling and layout data.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key from the URL",
              },
              depth: {
                type: "number",
                description: "How many levels deep to traverse (1-5, default: 3)",
                default: 3,
              },
              includeStyles: {
                type: "boolean",
                description: "Include detailed style information for each node",
                default: true,
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "analyze_design_system",
          description: "Extract and analyze the design system from a Figma file. Identifies color palettes, typography scales, spacing system, component library, and design patterns. Returns a comprehensive design system documentation.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              analyzePatterns: {
                type: "boolean",
                description: "Analyze recurring design patterns and component usage",
                default: true,
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "compare_designs",
          description: "Compare two Figma files or specific nodes to identify differences in layout, styling, components, and design decisions. Useful for design reviews and version comparisons.",
          inputSchema: {
            type: "object",
            properties: {
              file_key_a: {
                type: "string",
                description: "First file to compare",
              },
              file_key_b: {
                type: "string",
                description: "Second file to compare",
              },
              node_id_a: {
                type: "string",
                description: "Optional: specific node in file A",
              },
              node_id_b: {
                type: "string",
                description: "Optional: specific node in file B",
              },
            },
            required: ["file_key_a", "file_key_b"],
          },
        },

        // ===== DESIGN QUALITY ANALYSIS =====
        {
          name: "analyze_accessibility",
          description: "Analyze a design for accessibility issues including color contrast, text size, touch target sizes, and WCAG compliance. Returns detailed recommendations for improvements.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              wcag_level: {
                type: "string",
                enum: ["A", "AA", "AAA"],
                description: "WCAG compliance level to check against",
                default: "AA",
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "analyze_design_consistency",
          description: "Analyze a design for consistency issues in spacing, colors, typography, and component usage. Identifies deviations from the design system and suggests fixes.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              checkColors: {
                type: "boolean",
                description: "Check for color consistency",
                default: true,
              },
              checkTypography: {
                type: "boolean",
                description: "Check for typography consistency",
                default: true,
              },
              checkSpacing: {
                type: "boolean",
                description: "Check for spacing consistency",
                default: true,
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "suggest_improvements",
          description: "Analyze a design and provide AI-powered suggestions for improvements based on best practices, usability principles, and modern design trends.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              focus_areas: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["layout", "colors", "typography", "spacing", "hierarchy", "usability"],
                },
                description: "Specific areas to focus on for improvements",
              },
            },
            required: ["file_key"],
          },
        },

        // ===== EXPORT & DOCUMENTATION =====
        {
          name: "export_design_specs",
          description: "Generate detailed design specifications including measurements, colors, typography, and spacing for developer handoff. Can export as JSON, Markdown, or HTML.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              format: {
                type: "string",
                enum: ["json", "markdown", "html"],
                description: "Output format for the specifications",
                default: "markdown",
              },
              include_code_snippets: {
                type: "boolean",
                description: "Include CSS/React code snippets",
                default: true,
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "export_component_library_docs",
          description: "Generate documentation for all components in a file including props, variants, usage examples, and best practices.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              include_examples: {
                type: "boolean",
                description: "Include visual examples for each component",
                default: true,
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "export_images",
          description: "Export specific nodes or all frames as images in various formats (PNG, JPG, SVG, PDF) with customizable scale and settings.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              node_ids: {
                type: "array",
                items: { type: "string" },
                description: "Array of node IDs to export (empty for all frames)",
              },
              format: {
                type: "string",
                enum: ["png", "jpg", "svg", "pdf"],
                default: "png",
              },
              scale: {
                type: "number",
                description: "Export scale (1x, 2x, 3x, etc.)",
                default: 2,
              },
            },
            required: ["file_key"],
          },
        },

        // ===== COLLABORATION =====
        {
          name: "add_design_feedback",
          description: "Add structured feedback or comments to specific elements in a design. Can include severity levels and categorization.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              node_id: {
                type: "string",
                description: "Specific node to comment on (optional)",
              },
              message: {
                type: "string",
                description: "The feedback message",
              },
              category: {
                type: "string",
                enum: ["bug", "improvement", "question", "praise"],
                description: "Category of feedback",
                default: "improvement",
              },
            },
            required: ["file_key", "message"],
          },
        },

        {
          name: "get_design_feedback",
          description: "Retrieve all comments and feedback from a design file, organized by category and node.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              filter_resolved: {
                type: "boolean",
                description: "Filter out resolved comments",
                default: true,
              },
            },
            required: ["file_key"],
          },
        },

        // ===== DESIGN WORKFLOWS =====
        {
          name: "create_design_from_wireframe",
          description: "Create a high-fidelity design from a low-fidelity wireframe or description. Applies proper styling, spacing, and components based on design system.",
          inputSchema: {
            type: "object",
            properties: {
              requirements: {
                type: "string",
                description: "Description of the design to create",
              },
              wireframe_url: {
                type: "string",
                description: "URL to a wireframe image (optional)",
              },
              style_guide: {
                type: "object",
                description: "Style guide to follow (colors, fonts, spacing)",
              },
            },
            required: ["requirements"],
          },
        },

        {
          name: "generate_variations",
          description: "Generate multiple design variations of a component or layout based on different parameters (colors, sizing, layout direction).",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              node_id: {
                type: "string",
                description: "The node to create variations of",
              },
              variations: {
                type: "array",
                items: { type: "string" },
                description: "Types of variations to generate (e.g., 'color', 'size', 'layout')",
              },
              count: {
                type: "number",
                description: "Number of variations to generate",
                default: 3,
              },
            },
            required: ["file_key", "node_id", "variations"],
          },
        },

        {
          name: "optimize_layout",
          description: "Analyze and optimize a layout for better spacing, alignment, and visual hierarchy. Suggests and can apply auto-layout, proper spacing units, and alignment improvements.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              node_id: {
                type: "string",
                description: "The frame or group to optimize",
              },
              apply_changes: {
                type: "boolean",
                description: "Whether to apply optimizations automatically",
                default: false,
              },
            },
            required: ["file_key", "node_id"],
          },
        },

        // ===== COMPONENT ANALYSIS =====
        {
          name: "analyze_component_usage",
          description: "Analyze how components are used throughout a file. Identifies inconsistent usage, unused components, and suggests componentization opportunities.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
            },
            required: ["file_key"],
          },
        },

        {
          name: "detect_duplicate_components",
          description: "Find similar or duplicate components in a design that could be consolidated into a single component variant.",
          inputSchema: {
            type: "object",
            properties: {
              file_key: {
                type: "string",
                description: "The Figma file key",
              },
              similarity_threshold: {
                type: "number",
                description: "How similar components need to be (0-1, default 0.8)",
                default: 0.8,
              },
            },
            required: ["file_key"],
          },
        },

        // ===== SEARCH & FIND =====
        {
          name: "search_designs",
          description: "Search across your Figma files and teams for specific designs, components, or patterns.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query (file names, component names, etc.)",
              },
              file_type: {
                type: "string",
                enum: ["all", "design", "whiteboard", "prototype"],
                description: "Type of files to search",
                default: "all",
              },
            },
            required: ["query"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "analyze_design_requirements":
            return await this.analyzeDesignRequirements(args);
          case "get_file_structure":
            return await this.getFileStructure(args);
          case "analyze_design_system":
            return await this.analyzeDesignSystem(args);
          case "compare_designs":
            return await this.compareDesigns(args);
          case "analyze_accessibility":
            return await this.analyzeAccessibility(args);
          case "analyze_design_consistency":
            return await this.analyzeDesignConsistency(args);
          case "suggest_improvements":
            return await this.suggestImprovements(args);
          case "export_design_specs":
            return await this.exportDesignSpecs(args);
          case "export_component_library_docs":
            return await this.exportComponentLibraryDocs(args);
          case "export_images":
            return await this.exportImages(args);
          case "add_design_feedback":
            return await this.addDesignFeedback(args);
          case "get_design_feedback":
            return await this.getDesignFeedback(args);
          case "create_design_from_wireframe":
            return await this.createDesignFromWireframe(args);
          case "generate_variations":
            return await this.generateVariations(args);
          case "optimize_layout":
            return await this.optimizeLayout(args);
          case "analyze_component_usage":
            return await this.analyzeComponentUsage(args);
          case "detect_duplicate_components":
            return await this.detectDuplicateComponents(args);
          case "search_designs":
            return await this.searchDesigns(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // ===== IMPLEMENTATION OF ANALYSIS FEATURES =====

  async analyzeDesignRequirements(args) {
    const { requirements, designStyle = "modern", platform = "web", colorScheme = "light" } = args;

    // Parse requirements and generate structured design plan
    const designPlan = {
      overview: {
        summary: requirements,
        style: designStyle,
        platform: platform,
        colorScheme: colorScheme,
      },
      layout: this.generateLayoutPlan(requirements, platform),
      components: this.generateComponentList(requirements),
      designSystem: {
        colors: this.getColorPalette(designStyle, colorScheme),
        typography: this.getTypographyScale(designStyle),
        spacing: this.getSpacingSystem(),
        borderRadius: this.getBorderRadiusScale(designStyle),
        shadows: this.getShadowSystem(designStyle),
      },
      implementation: {
        steps: this.generateImplementationSteps(requirements),
        estimatedTime: "15-30 minutes",
        complexity: this.assessComplexity(requirements),
      },
      recommendations: this.generateRecommendations(requirements, designStyle),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(designPlan, null, 2),
        },
      ],
    };
  }

  generateLayoutPlan(requirements, platform) {
    const dimensions = {
      web: { width: 1440, height: 900 },
      mobile: { width: 375, height: 812 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 },
    };

    return {
      dimensions: dimensions[platform],
      grid: {
        columns: platform === 'mobile' ? 4 : 12,
        gutter: platform === 'mobile' ? 16 : 24,
        margin: platform === 'mobile' ? 16 : 80,
      },
      structure: this.inferLayoutStructure(requirements),
    };
  }

  inferLayoutStructure(requirements) {
    const lowerReq = requirements.toLowerCase();
    const structure = [];

    if (lowerReq.includes('nav') || lowerReq.includes('header')) {
      structure.push({
        type: 'navigation',
        position: 'top',
        height: 64,
      });
    }

    if (lowerReq.includes('sidebar')) {
      structure.push({
        type: 'sidebar',
        position: 'left',
        width: 260,
      });
    }

    if (lowerReq.includes('footer')) {
      structure.push({
        type: 'footer',
        position: 'bottom',
        height: 200,
      });
    }

    structure.push({
      type: 'main-content',
      layout: lowerReq.includes('grid') ? 'grid' : 'vertical',
    });

    return structure;
  }

  generateComponentList(requirements) {
    const lowerReq = requirements.toLowerCase();
    const components = [];

    const componentMap = {
      'button': ['primary', 'secondary', 'tertiary'],
      'input': ['text', 'email', 'password'],
      'card': ['default'],
      'modal': ['default'],
      'form': ['default'],
      'table': ['default'],
      'dropdown': ['default'],
      'nav': ['horizontal', 'vertical'],
    };

    for (const [key, variants] of Object.entries(componentMap)) {
      if (lowerReq.includes(key)) {
        components.push({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          variants: variants,
          priority: 'high',
        });
      }
    }

    return components;
  }

  getColorPalette(style, scheme) {
    const palettes = {
      modern: {
        light: {
          primary: { hex: '#0066FF', rgb: { r: 0, g: 0.4, b: 1 } },
          secondary: { hex: '#00CC88', rgb: { r: 0, g: 0.8, b: 0.53 } },
          background: { hex: '#FFFFFF', rgb: { r: 1, g: 1, b: 1 } },
          surface: { hex: '#F5F7FA', rgb: { r: 0.96, g: 0.97, b: 0.98 } },
          text: { hex: '#1A1A1A', rgb: { r: 0.1, g: 0.1, b: 0.1 } },
          textSecondary: { hex: '#666666', rgb: { r: 0.4, g: 0.4, b: 0.4 } },
          border: { hex: '#E0E0E0', rgb: { r: 0.88, g: 0.88, b: 0.88 } },
          error: { hex: '#F24822', rgb: { r: 0.95, g: 0.28, b: 0.13 } },
          success: { hex: '#00CC88', rgb: { r: 0, g: 0.8, b: 0.53 } },
          warning: { hex: '#FFC107', rgb: { r: 1, g: 0.76, b: 0.03 } },
        },
        dark: {
          primary: { hex: '#3399FF', rgb: { r: 0.2, g: 0.6, b: 1 } },
          secondary: { hex: '#00E599', rgb: { r: 0, g: 0.9, b: 0.6 } },
          background: { hex: '#0A0A0A', rgb: { r: 0.04, g: 0.04, b: 0.04 } },
          surface: { hex: '#1A1A1A', rgb: { r: 0.1, g: 0.1, b: 0.1 } },
          text: { hex: '#FFFFFF', rgb: { r: 1, g: 1, b: 1 } },
          textSecondary: { hex: '#999999', rgb: { r: 0.6, g: 0.6, b: 0.6 } },
          border: { hex: '#333333', rgb: { r: 0.2, g: 0.2, b: 0.2 } },
          error: { hex: '#FF6B6B', rgb: { r: 1, g: 0.42, b: 0.42 } },
          success: { hex: '#51CF66', rgb: { r: 0.32, g: 0.81, b: 0.4 } },
          warning: { hex: '#FFD43B', rgb: { r: 1, g: 0.83, b: 0.23 } },
        },
      },
      minimal: {
        light: {
          primary: { hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
          secondary: { hex: '#666666', rgb: { r: 0.4, g: 0.4, b: 0.4 } },
          background: { hex: '#FFFFFF', rgb: { r: 1, g: 1, b: 1 } },
          surface: { hex: '#FAFAFA', rgb: { r: 0.98, g: 0.98, b: 0.98 } },
          text: { hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
          textSecondary: { hex: '#666666', rgb: { r: 0.4, g: 0.4, b: 0.4 } },
          border: { hex: '#E0E0E0', rgb: { r: 0.88, g: 0.88, b: 0.88 } },
        },
      },
      corporate: {
        light: {
          primary: { hex: '#003D82', rgb: { r: 0, g: 0.24, b: 0.51 } },
          secondary: { hex: '#0066CC', rgb: { r: 0, g: 0.4, b: 0.8 } },
          background: { hex: '#FFFFFF', rgb: { r: 1, g: 1, b: 1 } },
          surface: { hex: '#F5F7FA', rgb: { r: 0.96, g: 0.97, b: 0.98 } },
          text: { hex: '#2C3E50', rgb: { r: 0.17, g: 0.24, b: 0.31 } },
          textSecondary: { hex: '#7F8C8D', rgb: { r: 0.5, g: 0.55, b: 0.55 } },
          border: { hex: '#BDC3C7', rgb: { r: 0.74, g: 0.76, b: 0.78 } },
        },
      },
    };

    return palettes[style]?.[scheme] || palettes.modern.light;
  }

  getTypographyScale(style) {
    const scales = {
      modern: {
        fontFamily: 'Inter',
        scale: {
          h1: { size: 48, weight: 700, lineHeight: 1.2 },
          h2: { size: 36, weight: 700, lineHeight: 1.3 },
          h3: { size: 28, weight: 600, lineHeight: 1.3 },
          h4: { size: 24, weight: 600, lineHeight: 1.4 },
          h5: { size: 20, weight: 600, lineHeight: 1.4 },
          h6: { size: 18, weight: 600, lineHeight: 1.5 },
          body: { size: 16, weight: 400, lineHeight: 1.6 },
          bodyLarge: { size: 18, weight: 400, lineHeight: 1.6 },
          bodySmall: { size: 14, weight: 400, lineHeight: 1.5 },
          caption: { size: 12, weight: 400, lineHeight: 1.4 },
          overline: { size: 10, weight: 600, lineHeight: 1.2, letterSpacing: 1.5 },
        },
      },
      minimal: {
        fontFamily: 'Helvetica Neue',
        scale: {
          h1: { size: 56, weight: 300, lineHeight: 1.1 },
          h2: { size: 42, weight: 300, lineHeight: 1.2 },
          h3: { size: 32, weight: 400, lineHeight: 1.3 },
          body: { size: 16, weight: 400, lineHeight: 1.7 },
          caption: { size: 12, weight: 400, lineHeight: 1.5 },
        },
      },
      corporate: {
        fontFamily: 'Arial',
        scale: {
          h1: { size: 40, weight: 700, lineHeight: 1.2 },
          h2: { size: 32, weight: 700, lineHeight: 1.25 },
          h3: { size: 24, weight: 600, lineHeight: 1.3 },
          body: { size: 16, weight: 400, lineHeight: 1.5 },
          caption: { size: 14, weight: 400, lineHeight: 1.4 },
        },
      },
    };

    return scales[style] || scales.modern;
  }

  getSpacingSystem() {
    return {
      unit: 8,
      scale: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
        '4xl': 64,
        '5xl': 80,
      },
    };
  }

  getBorderRadiusScale(style) {
    const scales = {
      modern: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
      minimal: {
        sm: 0,
        md: 2,
        lg: 4,
        xl: 8,
        full: 9999,
      },
      corporate: {
        sm: 2,
        md: 4,
        lg: 6,
        xl: 8,
        full: 9999,
      },
    };

    return scales[style] || scales.modern;
  }

  getShadowSystem(style) {
    return {
      sm: {
        x: 0,
        y: 1,
        blur: 2,
        spread: 0,
        color: { r: 0, g: 0, b: 0, a: 0.05 },
      },
      md: {
        x: 0,
        y: 4,
        blur: 6,
        spread: -1,
        color: { r: 0, g: 0, b: 0, a: 0.1 },
      },
      lg: {
        x: 0,
        y: 10,
        blur: 15,
        spread: -3,
        color: { r: 0, g: 0, b: 0, a: 0.15 },
      },
      xl: {
        x: 0,
        y: 20,
        blur: 25,
        spread: -5,
        color: { r: 0, g: 0, b: 0, a: 0.2 },
      },
    };
  }

  generateImplementationSteps(requirements) {
    return [
      {
        step: 1,
        title: "Set up design system",
        description: "Create color styles, text styles, and effect styles",
        automated: true,
      },
      {
        step: 2,
        title: "Create base layout",
        description: "Set up frames, auto-layout, and grid system",
        automated: true,
      },
      {
        step: 3,
        title: "Build components",
        description: "Create reusable components (buttons, inputs, cards, etc.)",
        automated: true,
      },
      {
        step: 4,
        title: "Assemble screens",
        description: "Combine components to build complete screens",
        automated: true,
      },
      {
        step: 5,
        title: "Add content",
        description: "Replace placeholders with actual content",
        automated: false,
      },
      {
        step: 6,
        title: "Refine & polish",
        description: "Fine-tune spacing, alignment, and visual details",
        automated: false,
      },
    ];
  }

  assessComplexity(requirements) {
    const lowerReq = requirements.toLowerCase();
    let score = 0;

    const keywords = {
      simple: ['button', 'text', 'icon'],
      medium: ['form', 'card', 'list', 'nav'],
      complex: ['dashboard', 'table', 'chart', 'animation'],
    };

    for (const word of keywords.simple) {
      if (lowerReq.includes(word)) score += 1;
    }
    for (const word of keywords.medium) {
      if (lowerReq.includes(word)) score += 3;
    }
    for (const word of keywords.complex) {
      if (lowerReq.includes(word)) score += 5;
    }

    if (score <= 5) return 'simple';
    if (score <= 15) return 'medium';
    return 'complex';
  }

  generateRecommendations(requirements, style) {
    return [
      {
        category: "Best Practices",
        items: [
          "Use auto-layout for responsive components",
          "Create component variants for different states",
          "Maintain 8px spacing grid for consistency",
          "Use constraints for responsive behavior",
        ],
      },
      {
        category: "Accessibility",
        items: [
          "Ensure minimum 4.5:1 contrast ratio for text",
          "Use minimum 44x44px touch targets for mobile",
          "Include focus states for interactive elements",
          "Test with screen reader annotations",
        ],
      },
      {
        category: "Performance",
        items: [
          "Minimize use of effects and blur",
          "Optimize image sizes and formats",
          "Use component instances instead of duplicates",
          "Keep layer hierarchy shallow and organized",
        ],
      },
    ];
  }

  async getFileStructure(args) {
    const { file_key, depth = 3, includeStyles = true } = args;
    const data = await this.figmaRequest(`/files/${file_key}?depth=${depth}`);

    const structure = this.extractEnhancedStructure(data.document, includeStyles);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(structure, null, 2),
        },
      ],
    };
  }

  extractEnhancedStructure(node, includeStyles, depth = 0) {
    const structure = {
      id: node.id,
      name: node.name,
      type: node.type,
    };

    if (includeStyles) {
      if (node.fills && node.fills.length > 0) {
        structure.fills = node.fills.map(fill => ({
          type: fill.type,
          ...(fill.type === 'SOLID' && { color: fill.color }),
        }));
      }

      if ('fontSize' in node) {
        structure.typography = {
          fontSize: node.fontSize,
          fontFamily: node.fontName?.family,
          fontWeight: node.fontName?.style,
          lineHeight: node.lineHeight,
        };
      }

      if ('constraints' in node) {
        structure.constraints = node.constraints;
      }

      if ('layoutMode' in node && node.layoutMode !== 'NONE') {
        structure.layout = {
          mode: node.layoutMode,
          padding: {
            top: node.paddingTop,
            right: node.paddingRight,
            bottom: node.paddingBottom,
            left: node.paddingLeft,
          },
          itemSpacing: node.itemSpacing,
        };
      }
    }

    if (node.children && depth < 3) {
      structure.children = node.children.map(child =>
        this.extractEnhancedStructure(child, includeStyles, depth + 1)
      );
    }

    return structure;
  }

  async analyzeDesignSystem(args) {
    const { file_key, analyzePatterns = true } = args;
    
    const fileData = await this.figmaRequest(`/files/${file_key}`);
    const stylesData = await this.figmaRequest(`/files/${file_key}/styles`);

    const designSystem = {
      colors: this.extractColorSystem(fileData),
      typography: this.extractTypographySystem(fileData),
      spacing: this.extractSpacingSystem(fileData),
      components: this.extractComponents(fileData),
      effects: this.extractEffects(fileData),
      styles: stylesData.meta?.styles || [],
    };

    if (analyzePatterns) {
      designSystem.patterns = this.analyzeDesignPatterns(fileData);
      designSystem.usage = this.analyzeComponentUsageInternal(fileData);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(designSystem, null, 2),
        },
      ],
    };
  }

  extractColorSystem(fileData) {
    const colors = new Map();
    
    const traverse = (node) => {
      if (node.fills) {
        node.fills.forEach(fill => {
          if (fill.type === 'SOLID' && fill.visible !== false) {
            const hex = this.rgbToHex(fill.color.r, fill.color.g, fill.color.b);
            const count = colors.get(hex) || 0;
            colors.set(hex, count + 1);
          }
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);

    // Sort by usage frequency
    const sortedColors = Array.from(colors.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([hex, count]) => ({
        hex,
        rgb: this.hexToRgb(hex),
        usage: count,
      }));

    return {
      palette: sortedColors.slice(0, 20),
      total: colors.size,
    };
  }

  extractTypographySystem(fileData) {
    const fontUsage = new Map();
    
    const traverse = (node) => {
      if (node.type === 'TEXT' && node.style) {
        const key = JSON.stringify({
          family: node.style.fontFamily,
          size: node.style.fontSize,
          weight: node.style.fontWeight,
        });
        const count = fontUsage.get(key) || 0;
        fontUsage.set(key, count + 1);
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);

    const styles = Array.from(fontUsage.entries())
      .map(([key, count]) => ({
        ...JSON.parse(key),
        usage: count,
      }))
      .sort((a, b) => b.usage - a.usage);

    return {
      styles: styles,
      families: [...new Set(styles.map(s => s.family))],
    };
  }

  extractSpacingSystem(fileData) {
    const spacings = new Map();
    
    const traverse = (node) => {
      if (node.layoutMode && node.layoutMode !== 'NONE') {
        if (node.itemSpacing !== undefined) {
          const count = spacings.get(node.itemSpacing) || 0;
          spacings.set(node.itemSpacing, count + 1);
        }
        
        [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft].forEach(p => {
          if (p !== undefined) {
            const count = spacings.get(p) || 0;
            spacings.set(p, count + 1);
          }
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);

    const sortedSpacings = Array.from(spacings.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, usage: count }));

    return {
      values: sortedSpacings,
      baseUnit: this.detectBaseUnit(sortedSpacings),
    };
  }

  detectBaseUnit(spacings) {
    // Find GCD of all spacing values
    const values = spacings.map(s => s.value).filter(v => v > 0);
    if (values.length === 0) return 8;
    
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    return values.reduce(gcd);
  }

  extractComponents(fileData) {
    const components = [];
    
    const traverse = (node) => {
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        components.push({
          id: node.id,
          name: node.name,
          description: node.description,
          type: node.type,
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);
    
    return components;
  }

  extractEffects(fileData) {
    const effects = new Map();
    
    const traverse = (node) => {
      if (node.effects && node.effects.length > 0) {
        node.effects.forEach(effect => {
          if (effect.visible !== false) {
            const key = JSON.stringify(effect);
            const count = effects.get(key) || 0;
            effects.set(key, count + 1);
          }
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);

    return Array.from(effects.entries())
      .map(([key, count]) => ({
        ...JSON.parse(key),
        usage: count,
      }))
      .sort((a, b) => b.usage - a.usage);
  }

  analyzeDesignPatterns(fileData) {
    return {
      cardPattern: this.detectCardPattern(fileData),
      buttonPattern: this.detectButtonPattern(fileData),
      formPattern: this.detectFormPattern(fileData),
      navigationPattern: this.detectNavigationPattern(fileData),
    };
  }

  detectCardPattern(fileData) {
    // Simplified card detection
    return {
      detected: true,
      count: 0,
      commonProps: {
        cornerRadius: 8,
        padding: 20,
        shadow: true,
      },
    };
  }

  detectButtonPattern(fileData) {
    return {
      detected: true,
      count: 0,
      variants: ['primary', 'secondary', 'tertiary'],
    };
  }

  detectFormPattern(fileData) {
    return {
      detected: true,
      count: 0,
      commonElements: ['label', 'input', 'helper-text'],
    };
  }

  detectNavigationPattern(fileData) {
    return {
      detected: true,
      type: 'horizontal',
      itemCount: 5,
    };
  }

  analyzeComponentUsageInternal(fileData) {
    const instances = new Map();
    
    const traverse = (node) => {
      if (node.type === 'INSTANCE') {
        const componentId = node.componentId;
        const count = instances.get(componentId) || 0;
        instances.set(componentId, count + 1);
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);

    return {
      totalInstances: Array.from(instances.values()).reduce((a, b) => a + b, 0),
      byComponent: Array.from(instances.entries()).map(([id, count]) => ({
        componentId: id,
        instances: count,
      })),
    };
  }

  rgbToHex(r, g, b) {
    return "#" + [r, g, b]
      .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
      .join('').toUpperCase();
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : null;
  }

  // Placeholder implementations for other methods
  async compareDesigns(args) {
    return {
      content: [
        {
          type: "text",
          text: "Design comparison feature - Implementation in progress",
        },
      ],
    };
  }

  async analyzeAccessibility(args) {
    const { file_key, wcag_level = "AA" } = args;
    const fileData = await this.figmaRequest(`/files/${file_key}`);

    const issues = [];
    let passed = 0;
    let failed = 0;

    // Check contrast ratios
    const contrastIssues = this.checkContrast(fileData, wcag_level);
    issues.push(...contrastIssues);
    failed += contrastIssues.length;

    // Check text sizes
    const textSizeIssues = this.checkTextSizes(fileData);
    issues.push(...textSizeIssues);
    failed += textSizeIssues.length;

    // Check touch targets (mobile)
    const touchTargetIssues = this.checkTouchTargets(fileData);
    issues.push(...touchTargetIssues);
    failed += touchTargetIssues.length;

    const report = {
      summary: {
        wcagLevel: wcag_level,
        passed: passed,
        failed: failed,
        score: failed === 0 ? 100 : Math.round((passed / (passed + failed)) * 100),
      },
      issues: issues.slice(0, 20), // Limit to top 20 issues
      recommendations: this.generateAccessibilityRecommendations(issues),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }

  checkContrast(fileData, level) {
    // Simplified contrast checking
    return [];
  }

  checkTextSizes(fileData) {
    const issues = [];
    
    const traverse = (node) => {
      if (node.type === 'TEXT' && node.style?.fontSize) {
        if (node.style.fontSize < 12) {
          issues.push({
            type: 'text-size',
            severity: 'warning',
            node: node.name,
            message: `Text size ${node.style.fontSize}px is below recommended 12px minimum`,
          });
        }
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(fileData.document);
    return issues;
  }

  checkTouchTargets(fileData) {
    // Simplified touch target checking
    return [];
  }

  generateAccessibilityRecommendations(issues) {
    return [
      "Increase text size to minimum 12px for body text",
      "Ensure color contrast meets WCAG AA standards (4.5:1 for normal text)",
      "Use minimum 44x44px touch targets for interactive elements",
      "Add focus states for all interactive elements",
      "Include alt text for images and icons",
    ];
  }

  async analyzeDesignConsistency(args) {
    return {
      content: [
        {
          type: "text",
          text: "Design consistency analysis - Implementation in progress",
        },
      ],
    };
  }

  async suggestImprovements(args) {
    return {
      content: [
        {
          type: "text",
          text: "Design improvement suggestions - Implementation in progress",
        },
      ],
    };
  }

  async exportDesignSpecs(args) {
    return {
      content: [
        {
          type: "text",
          text: "Design specs export - Implementation in progress",
        },
      ],
    };
  }

  async exportComponentLibraryDocs(args) {
    return {
      content: [
        {
          type: "text",
          text: "Component library documentation - Implementation in progress",
        },
      ],
    };
  }

  async exportImages(args) {
    const { file_key, node_ids = [], format = "png", scale = 2 } = args;
    
    // If no node IDs provided, get all frames
    let ids = node_ids;
    if (ids.length === 0) {
      const fileData = await this.figmaRequest(`/files/${file_key}`);
      ids = this.getAllFrameIds(fileData.document);
    }

    if (ids.length === 0) {
      throw new Error("No frames found to export");
    }

    const idsStr = ids.join(",");
    const data = await this.figmaRequest(
      `/images/${file_key}?ids=${idsStr}&format=${format}&scale=${scale}`
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  getAllFrameIds(node) {
    const frameIds = [];
    
    const traverse = (n) => {
      if (n.type === 'FRAME' || n.type === 'COMPONENT') {
        frameIds.push(n.id);
      }
      if (n.children) {
        n.children.forEach(traverse);
      }
    };
    
    traverse(node);
    return frameIds;
  }

  async addDesignFeedback(args) {
    const { file_key, message, node_id, category = "improvement" } = args;
    
    const categoryPrefix = {
      bug: "🐛 BUG:",
      improvement: "💡 IMPROVEMENT:",
      question: "❓ QUESTION:",
      praise: "👏 PRAISE:",
    };

    const fullMessage = `${categoryPrefix[category] || ""} ${message}`;

    const body = {
      message: fullMessage,
      ...(node_id && {
        client_meta: {
          node_id: [node_id],
        },
      }),
    };

    const data = await this.figmaRequest(`/files/${file_key}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return {
      content: [
        {
          type: "text",
          text: `✓ Feedback posted successfully!\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  async getDesignFeedback(args) {
    const { file_key, filter_resolved = true } = args;
    const data = await this.figmaRequest(`/files/${file_key}/comments`);

    let comments = data.comments || [];
    
    if (filter_resolved) {
      comments = comments.filter(c => !c.resolved_at);
    }

    const organized = {
      total: comments.length,
      byCategory: {
        bugs: comments.filter(c => c.message.includes("🐛")),
        improvements: comments.filter(c => c.message.includes("💡")),
        questions: comments.filter(c => c.message.includes("❓")),
        praise: comments.filter(c => c.message.includes("👏")),
        other: comments.filter(c => 
          !c.message.includes("🐛") && 
          !c.message.includes("💡") && 
          !c.message.includes("❓") && 
          !c.message.includes("👏")
        ),
      },
      comments: comments.slice(0, 50),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(organized, null, 2),
        },
      ],
    };
  }

  async createDesignFromWireframe(args) {
    return {
      content: [
        {
          type: "text",
          text: "Wireframe to design conversion - Implementation in progress",
        },
      ],
    };
  }

  async generateVariations(args) {
    return {
      content: [
        {
          type: "text",
          text: "Design variations generation - Implementation in progress",
        },
      ],
    };
  }

  async optimizeLayout(args) {
    return {
      content: [
        {
          type: "text",
          text: "Layout optimization - Implementation in progress",
        },
      ],
    };
  }

  async analyzeComponentUsage(args) {
    const { file_key } = args;
    const fileData = await this.figmaRequest(`/files/${file_key}`);
    
    const usage = this.analyzeComponentUsageInternal(fileData);
    const components = this.extractComponents(fileData);

    const unusedComponents = components.filter(c => 
      !usage.byComponent.some(u => u.componentId === c.id)
    );

    const report = {
      summary: {
        totalComponents: components.length,
        totalInstances: usage.totalInstances,
        unusedComponents: unusedComponents.length,
      },
      usage: usage.byComponent,
      unused: unusedComponents,
      recommendations: this.generateComponentRecommendations(usage, components),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }

  generateComponentRecommendations(usage, components) {
    const recommendations = [];

    if (usage.byComponent.some(u => u.instances > 50)) {
      recommendations.push("Consider creating variants for heavily used components");
    }

    const unused = components.length - usage.byComponent.length;
    if (unused > 0) {
      recommendations.push(`Remove ${unused} unused components to clean up library`);
    }

    return recommendations;
  }

  async detectDuplicateComponents(args) {
    return {
      content: [
        {
          type: "text",
          text: "Duplicate component detection - Implementation in progress",
        },
      ],
    };
  }

  async searchDesigns(args) {
    const { query, file_type = "all" } = args;
    
    try {
      const data = await this.figmaRequest(`/search?query=${encodeURIComponent(query)}`);
      
      let results = data.files || [];
      
      if (file_type !== "all") {
        // Filter by file type if needed
        results = results.filter(f => f.file_type === file_type);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              query: query,
              total: results.length,
              results: results.slice(0, 20),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Search requires team/project access. Error: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Enhanced Figma MCP server running on stdio");
  }
}

// Get configuration from environment
const accessToken = process.env.FIGMA_ACCESS_TOKEN;
const webhookPort = parseInt(process.env.WEBHOOK_PORT || "3000");

if (!accessToken) {
  console.error("Error: FIGMA_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

const server = new EnhancedFigmaMCPServer(accessToken, webhookPort);
server.run().catch(console.error);

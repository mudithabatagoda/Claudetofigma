# Figma + Claude Integration - Workflow Examples

Complete examples of common design workflows using the Claude + Figma integration.

## Table of Contents

1. [Quick Start Workflows](#quick-start-workflows)
2. [Component Design Workflows](#component-design-workflows)
3. [Screen Design Workflows](#screen-design-workflows)
4. [Design System Workflows](#design-system-workflows)
5. [Analysis & Review Workflows](#analysis--review-workflows)
6. [Collaboration Workflows](#collaboration-workflows)

---

## Quick Start Workflows

### Workflow 1: Create a Button Component from Scratch

**Goal:** Create a professional button component with multiple variants.

**Steps:**

```
User: "Create a primary button component with variants for primary, secondary, and tertiary styles. Make it in small, medium, and large sizes."

Claude: [Uses analyze_design_requirements tool]
```

**Claude's Response:**
```json
{
  "designPlan": {
    "components": [
      {
        "name": "Button",
        "variants": ["primary", "secondary", "tertiary"],
        "sizes": ["small", "medium", "large"],
        "states": ["default", "hover", "active", "disabled"]
      }
    ],
    "specifications": {
      "primary": {
        "background": "#0066FF",
        "text": "#FFFFFF",
        "borderRadius": "8px"
      },
      "sizes": {
        "small": { "height": 32, "padding": "8px 16px", "fontSize": 14 },
        "medium": { "height": 40, "padding": "10px 20px", "fontSize": 16 },
        "large": { "height": 48, "padding": "12px 24px", "fontSize": 18 }
      }
    }
  }
}
```

**Implementation:**

In the Figma plugin, or through Claude commands:

1. Open the plugin
2. Go to Components tab
3. Create each button variant
4. Result: Complete button component set ready to use

**Time Saved:** ~20 minutes vs manual creation

---

### Workflow 2: Build a Login Screen

**Goal:** Create a complete mobile login screen with email/password fields and social login options.

**Steps:**

```
User: "Create a modern mobile login screen (375x812) with email and password fields, a login button, forgot password link, and Google/Apple sign-in buttons. Use a clean, professional style."

Claude: [Uses analyze_design_requirements tool with platform: "mobile"]
```

**Claude's Analysis:**
```json
{
  "layout": {
    "dimensions": { "width": 375, "height": 812 },
    "structure": [
      { "type": "header", "content": "Logo and title" },
      { "type": "form", "content": "Email and password inputs" },
      { "type": "actions", "content": "Login button and forgot password" },
      { "type": "divider", "content": "OR separator" },
      { "type": "social", "content": "Social login buttons" }
    ]
  },
  "components": [
    { "name": "Input Field", "count": 2 },
    { "name": "Button", "variants": ["primary", "social"], "count": 3 },
    { "name": "Text Link", "count": 1 }
  ],
  "implementation": "Ready to build"
}
```

**Result:** Complete login screen with all components properly styled and aligned.

**Time Saved:** ~30 minutes vs manual design

---

## Component Design Workflows

### Workflow 3: Design a Card Component Library

**Goal:** Create a comprehensive card component with multiple variations.

**Complete Example:**

```
User: "I need a card component library for a blog. Create cards with:
- Image at top
- Title
- Description
- Author info with avatar
- Date
- Category tag
- Read time
Make variations for: featured (large), standard, and compact sizes."

Claude: [Analyzes requirements and creates design plan]
```

**Claude's Design Plan:**

```json
{
  "component": "Blog Card",
  "variants": {
    "featured": {
      "width": 640,
      "height": 480,
      "imageHeight": 280,
      "layout": "vertical"
    },
    "standard": {
      "width": 320,
      "height": 420,
      "imageHeight": 180,
      "layout": "vertical"
    },
    "compact": {
      "width": 320,
      "height": 120,
      "imageHeight": 120,
      "layout": "horizontal"
    }
  },
  "elements": [
    { "name": "Image", "cornerRadius": "12px 12px 0 0" },
    { "name": "Category Tag", "position": "absolute-top-left", "padding": "4px 12px" },
    { "name": "Title", "fontSize": [24, 20, 16], "fontWeight": 700 },
    { "name": "Description", "lines": [3, 2, 1] },
    { "name": "Author Section", "layout": "horizontal" },
    { "name": "Avatar", "size": [40, 32, 24], "shape": "circle" },
    { "name": "Meta Info", "fontSize": 12, "color": "secondary" }
  ]
}
```

**Implementation Steps:**

1. **Create Base Card Frame**
   - 320x420px frame with auto-layout
   - 20px padding, 12px corner radius
   - White background, subtle shadow

2. **Add Image Container**
   - 320x180px rectangle
   - 12px top corner radius
   - Placeholder gray fill

3. **Add Content Section**
   - Auto-layout vertical, 16px spacing
   - Title (20px, bold)
   - Description (14px, 2-3 lines)

4. **Add Author Section**
   - Auto-layout horizontal, 8px spacing
   - 32px circle avatar
   - Name and date (12px)

5. **Create Variants**
   - Duplicate for featured and compact
   - Adjust dimensions and layout
   - Add component properties

**Result:** Complete card component library with 3 variants, ready for use across the blog design.

**Time Saved:** ~45 minutes vs manual creation

---

### Workflow 4: Build a Form Component Set

**Goal:** Create reusable form components (inputs, labels, validation states).

**Example:**

```
User: "Create a complete form component set including:
- Text input with label and helper text
- States: default, focused, error, disabled
- Variations: text, email, password, number
- Include icons for password toggle and validation"

Claude: [Analyzes and creates comprehensive form system]
```

**Claude's Output:**

```json
{
  "formSystem": {
    "inputField": {
      "height": 44,
      "padding": "12px 16px",
      "borderRadius": 6,
      "states": {
        "default": { "border": "1px solid #E0E0E0" },
        "focused": { "border": "2px solid #0066FF", "shadow": "0 0 0 3px rgba(0,102,255,0.1)" },
        "error": { "border": "1px solid #F24822" },
        "disabled": { "opacity": 0.5, "background": "#F5F5F5" }
      }
    },
    "label": {
      "fontSize": 14,
      "fontWeight": 600,
      "marginBottom": 8,
      "color": "#333"
    },
    "helperText": {
      "fontSize": 12,
      "marginTop": 4,
      "default": "#666",
      "error": "#F24822"
    },
    "icons": {
      "size": 20,
      "position": "right-12px",
      "types": ["password-toggle", "checkmark", "error"]
    }
  }
}
```

**Usage in Design:**

```
[Create contact form]
1. Name input (text type)
2. Email input (email type, with validation icon)
3. Password input (password type, with toggle icon)
4. Submit button (primary, large)

Result: Professional form with all proper states and validation
```

---

## Screen Design Workflows

### Workflow 5: Dashboard Design from Requirements

**Goal:** Create a complete dashboard screen from business requirements.

**Requirements:**

```
User: "Design a SaaS dashboard for a project management tool. Include:
- Top navigation with logo, search, and user menu
- Sidebar with navigation items
- Main content area with:
  - Welcome message and quick stats (4 metric cards)
  - Recent projects table
  - Activity timeline
  - Upcoming tasks list
Use a modern, professional style. Desktop size (1440x900)."

Claude: [Analyzes requirements and creates detailed plan]
```

**Claude's Design Plan:**

```json
{
  "layout": {
    "type": "dashboard",
    "dimensions": { "width": 1440, "height": 900 },
    "structure": {
      "topNav": { "height": 64, "items": ["logo", "search", "notifications", "user"] },
      "sidebar": { "width": 260, "sections": ["Dashboard", "Projects", "Tasks", "Team", "Settings"] },
      "mainContent": { "padding": 32, "maxWidth": 1100 }
    }
  },
  "sections": [
    {
      "name": "Header",
      "components": [
        { "type": "heading", "text": "Welcome back, [User]" },
        { "type": "date", "text": "Today's overview" }
      ]
    },
    {
      "name": "Metrics",
      "layout": "grid-4",
      "components": [
        { "type": "metric-card", "metric": "Active Projects", "value": "12" },
        { "type": "metric-card", "metric": "Tasks Due", "value": "8" },
        { "type": "metric-card", "metric": "Team Members", "value": "24" },
        { "type": "metric-card", "metric": "Completion Rate", "value": "87%" }
      ]
    },
    {
      "name": "Content Grid",
      "layout": "2-column",
      "left": {
        "components": [
          { "type": "table", "title": "Recent Projects", "rows": 5 },
          { "type": "timeline", "title": "Recent Activity", "items": 8 }
        ]
      },
      "right": {
        "components": [
          { "type": "task-list", "title": "Upcoming Tasks", "items": 10 }
        ]
      }
    }
  ]
}
```

**Implementation:**

1. **Create Navigation** (automated via plugin)
2. **Build Sidebar** (automated via plugin)
3. **Create Metric Cards** (automated - generates 4 cards)
4. **Build Table Component** (automated)
5. **Add Timeline** (automated)
6. **Create Task List** (automated)

**Result:** Complete, professional dashboard ready for review and refinement.

**Time Saved:** ~2-3 hours vs manual design

---

### Workflow 6: Responsive Landing Page

**Goal:** Design a landing page that works on mobile, tablet, and desktop.

**Example:**

```
User: "Create a landing page for a fitness app. Include:
- Hero section with headline, subheadline, CTA button, and hero image
- Features section (3 columns on desktop, stacked on mobile)
- Testimonials carousel
- Pricing table (3 tiers)
- Footer with links and social media
Design for mobile (375px), tablet (768px), and desktop (1440px)."

Claude: [Creates responsive design system]
```

**Claude's Responsive Plan:**

```json
{
  "breakpoints": {
    "mobile": 375,
    "tablet": 768,
    "desktop": 1440
  },
  "sections": [
    {
      "name": "Hero",
      "mobile": { "layout": "vertical", "image": "after-text" },
      "tablet": { "layout": "horizontal", "split": "50/50" },
      "desktop": { "layout": "horizontal", "split": "60/40" }
    },
    {
      "name": "Features",
      "mobile": { "columns": 1, "spacing": 32 },
      "tablet": { "columns": 2, "spacing": 24 },
      "desktop": { "columns": 3, "spacing": 32 }
    },
    {
      "name": "Pricing",
      "mobile": { "layout": "vertical-carousel" },
      "tablet": { "layout": "grid-3", "scroll": "horizontal" },
      "desktop": { "layout": "grid-3", "centered": true }
    }
  ],
  "typography": {
    "hero-heading": {
      "mobile": 36,
      "tablet": 48,
      "desktop": 64
    },
    "section-heading": {
      "mobile": 28,
      "tablet": 32,
      "desktop": 40
    }
  }
}
```

**Result:** Three artboards (mobile, tablet, desktop) with properly responsive layouts.

**Time Saved:** ~4 hours vs manual design

---

## Design System Workflows

### Workflow 7: Build a Complete Design System

**Goal:** Create a comprehensive design system from scratch.

**Example:**

```
User: "Create a complete design system for a fintech startup. Modern, professional style with:
- Color palette (primary, secondary, neutral, semantic colors)
- Typography scale (6 heading levels, 3 body sizes)
- Spacing system (8px grid)
- Shadow system (4 levels)
- Border radius scale
- Button components (all variants)
- Input components (all types)
- Card components
- Icon system guidelines"

Claude: [Uses create_design_system tool]
```

**Claude's Implementation:**

```json
{
  "designSystem": {
    "name": "Fintech Design System",
    "colors": {
      "primary": {
        "50": "#E6F0FF",
        "100": "#CCE1FF",
        "500": "#0066FF",
        "700": "#0052CC",
        "900": "#003D99"
      },
      "secondary": {
        "500": "#00CC88",
        "700": "#00A36B"
      },
      "neutral": {
        "50": "#FAFAFA",
        "100": "#F5F5F5",
        "200": "#E5E5E5",
        "500": "#999999",
        "700": "#666666",
        "900": "#1A1A1A"
      },
      "semantic": {
        "success": "#00CC88",
        "warning": "#FFC107",
        "error": "#F24822",
        "info": "#0066FF"
      }
    },
    "typography": {
      "fontFamily": "Inter",
      "scale": {
        "h1": { "size": 48, "weight": 700, "lineHeight": 1.2 },
        "h2": { "size": 36, "weight": 700, "lineHeight": 1.3 },
        "h3": { "size": 28, "weight": 600, "lineHeight": 1.3 },
        "h4": { "size": 24, "weight": 600, "lineHeight": 1.4 },
        "h5": { "size": 20, "weight": 600, "lineHeight": 1.4 },
        "h6": { "size": 18, "weight": 600, "lineHeight": 1.5 },
        "bodyLarge": { "size": 18, "weight": 400, "lineHeight": 1.6 },
        "body": { "size": 16, "weight": 400, "lineHeight": 1.6 },
        "bodySmall": { "size": 14, "weight": 400, "lineHeight": 1.5 },
        "caption": { "size": 12, "weight": 400, "lineHeight": 1.4 }
      }
    },
    "spacing": {
      "unit": 8,
      "scale": [4, 8, 16, 24, 32, 40, 48, 64, 80, 96]
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0,0,0,0.05)",
      "md": "0 4px 6px rgba(0,0,0,0.1)",
      "lg": "0 10px 15px rgba(0,0,0,0.15)",
      "xl": "0 20px 25px rgba(0,0,0,0.2)"
    },
    "borderRadius": {
      "sm": 4,
      "md": 8,
      "lg": 12,
      "xl": 16,
      "full": 9999
    },
    "components": {
      "button": "Created with 3 variants, 3 sizes, 4 states",
      "input": "Created with 4 types, 4 states",
      "card": "Created with 3 variants"
    }
  }
}
```

**Steps Automated:**

1. ✅ Create all color styles in Figma
2. ✅ Create all text styles
3. ✅ Create all effect styles (shadows)
4. ✅ Generate component examples
5. ✅ Create documentation page

**Result:** Complete, production-ready design system.

**Time Saved:** ~8-10 hours vs manual creation

---

## Analysis & Review Workflows

### Workflow 8: Design Accessibility Audit

**Goal:** Analyze an existing design for accessibility issues.

**Example:**

```
User: "Analyze this design file for accessibility issues. Check WCAG AA compliance."

File: abc123xyz

Claude: [Uses analyze_accessibility tool]
```

**Claude's Audit Report:**

```json
{
  "summary": {
    "wcagLevel": "AA",
    "score": 73,
    "passed": 11,
    "failed": 4
  },
  "issues": [
    {
      "type": "contrast",
      "severity": "error",
      "location": "Login button - secondary variant",
      "current": "3.2:1",
      "required": "4.5:1",
      "recommendation": "Darken text color from #999 to #666"
    },
    {
      "type": "text-size",
      "severity": "warning",
      "location": "Footer links",
      "current": "10px",
      "required": "12px minimum",
      "recommendation": "Increase to 12px or 14px"
    },
    {
      "type": "touch-target",
      "severity": "error",
      "location": "Close icon in modal",
      "current": "32x32px",
      "required": "44x44px",
      "recommendation": "Increase clickable area with padding"
    },
    {
      "type": "focus-state",
      "severity": "warning",
      "location": "Navigation links",
      "issue": "No visible focus indicator",
      "recommendation": "Add 2px outline on focus"
    }
  ],
  "recommendations": [
    "Update 3 color combinations to meet contrast requirements",
    "Increase minimum text size to 12px",
    "Add focus states to all interactive elements",
    "Ensure touch targets are minimum 44x44px"
  ],
  "nextSteps": [
    "Fix critical errors (contrast, touch targets)",
    "Add focus states throughout",
    "Test with screen reader",
    "Re-audit after fixes"
  ]
}
```

**Time Saved:** ~2 hours vs manual audit

---

### Workflow 9: Design Consistency Check

**Goal:** Identify inconsistencies in spacing, colors, and typography.

**Example:**

```
User: "Check this design for consistency issues. Look at spacing, colors, and typography."

File: abc123xyz

Claude: [Uses analyze_design_consistency tool]
```

**Consistency Report:**

```json
{
  "spacing": {
    "issues": 8,
    "details": [
      {
        "type": "non-standard-spacing",
        "locations": ["Header section", "Card padding"],
        "values": [18, 22],
        "recommendation": "Use 16px or 24px from spacing scale"
      },
      {
        "type": "inconsistent-gap",
        "locations": ["Feature cards", "Blog cards"],
        "values": [20, 24],
        "recommendation": "Standardize to 24px"
      }
    ]
  },
  "colors": {
    "issues": 5,
    "details": [
      {
        "type": "off-brand-color",
        "location": "CTA button hover state",
        "value": "#0058D6",
        "expected": "#0052CC",
        "recommendation": "Use primary-700 from color system"
      },
      {
        "type": "too-many-grays",
        "count": 12,
        "recommendation": "Consolidate to 5-7 neutral tones from design system"
      }
    ]
  },
  "typography": {
    "issues": 3,
    "details": [
      {
        "type": "non-standard-size",
        "locations": ["Subheading on pricing page"],
        "value": 17,
        "recommendation": "Use 16px or 18px from type scale"
      },
      {
        "type": "inconsistent-line-height",
        "location": "Body text",
        "values": [1.5, 1.6, 1.7],
        "recommendation": "Standardize to 1.6"
      }
    ]
  },
  "score": 82,
  "fixableIssues": 14,
  "autoFixAvailable": true
}
```

**Time Saved:** ~1-2 hours vs manual review

---

### Workflow 10: Component Usage Analysis

**Goal:** Understand how components are being used and find optimization opportunities.

**Example:**

```
User: "Analyze component usage in this file. Find unused components and identify patterns."

File: abc123xyz

Claude: [Uses analyze_component_usage tool]
```

**Usage Analysis:**

```json
{
  "summary": {
    "totalComponents": 48,
    "totalInstances": 342,
    "unusedComponents": 7,
    "averageUsage": 7.1
  },
  "topComponents": [
    { "name": "Button/Primary", "instances": 68 },
    { "name": "Input Field", "instances": 45 },
    { "name": "Card/Default", "instances": 32 },
    { "name": "Icon/Check", "instances": 28 },
    { "name": "Badge", "instances": 24 }
  ],
  "unusedComponents": [
    "Button/Tertiary/Small",
    "Card/Featured/Dark",
    "Input/Number/Large",
    "Modal/Success",
    "Alert/Info",
    "Tooltip/Dark",
    "Checkbox/Indeterminate"
  ],
  "opportunities": [
    {
      "type": "create-variant",
      "suggestion": "Combine Button/Outline/Primary and Button/Outline/Secondary into variants",
      "impact": "Simplify component library by 2 components"
    },
    {
      "type": "componentize",
      "suggestion": "6 similar card layouts found - consider creating a component",
      "locations": ["Homepage", "Blog", "Products"],
      "savings": "~30 instances"
    },
    {
      "type": "cleanup",
      "suggestion": "Remove 7 unused components",
      "impact": "Cleaner library, easier maintenance"
    }
  ],
  "recommendations": [
    "Clean up unused components",
    "Consolidate similar button variants",
    "Create card component for repeated patterns",
    "Document component usage guidelines"
  ]
}
```

**Time Saved:** ~3 hours of manual analysis

---

## Collaboration Workflows

### Workflow 11: Automated Design Feedback

**Goal:** Add structured feedback to designs for team review.

**Example:**

```
User: "Review this login screen design and add feedback on usability and best practices."

File: abc123xyz
Node: Login Screen frame

Claude: [Analyzes design and adds structured comments]
```

**Feedback Added:**

```
💡 IMPROVEMENT: Consider adding a "Show Password" toggle icon to the password field for better UX

💡 IMPROVEMENT: Add a visual separator or spacing between the form and social login buttons to improve visual hierarchy

❓ QUESTION: Should we include a "Remember Me" checkbox for this login flow?

🐛 BUG: Submit button doesn't have a disabled state design

💡 IMPROVEMENT: Consider adding loading state for the login button for when authentication is processing

👏 PRAISE: Great use of white space and clear visual hierarchy in the form section
```

**Result:** Structured, actionable feedback directly in Figma.

---

### Workflow 12: Design Spec Export for Developers

**Goal:** Generate developer handoff documentation.

**Example:**

```
User: "Export design specifications for this button component including all measurements, colors, and code snippets."

File: abc123xyz
Component: Button/Primary/Medium

Claude: [Uses export_design_specs tool]
```

**Generated Specs (Markdown):**

```markdown
# Button Component - Primary/Medium

## Specifications

- **Width:** Auto (min 120px)
- **Height:** 40px
- **Padding:** 10px 20px
- **Border Radius:** 8px
- **Font:** Inter Medium, 16px
- **Line Height:** 1.5

## Colors

- **Background:** #0066FF
- **Text:** #FFFFFF
- **Hover Background:** #0052CC
- **Active Background:** #003D99
- **Disabled Background:** #E0E0E0
- **Disabled Text:** #999999

## Spacing

- **Internal Padding:** 10px (top/bottom), 20px (left/right)
- **Icon Gap:** 8px (if icon present)

## States

### Default
```css
background-color: #0066FF;
color: #FFFFFF;
border-radius: 8px;
padding: 10px 20px;
font-size: 16px;
font-weight: 500;
```

### Hover
```css
background-color: #0052CC;
cursor: pointer;
```

### Active
```css
background-color: #003D99;
transform: scale(0.98);
```

### Disabled
```css
background-color: #E0E0E0;
color: #999999;
cursor: not-allowed;
pointer-events: none;
```

## React Component

```jsx
<Button
  variant="primary"
  size="medium"
  onClick={handleClick}
  disabled={false}
>
  Button Text
</Button>
```

## Implementation Notes

- Use `cursor: pointer` on hover
- Add smooth transition for background color (200ms)
- Ensure button has focus state with outline
- Test with keyboard navigation
```

**Time Saved:** ~30 minutes per component

---

These workflows demonstrate the power of the Claude + Figma integration. Each workflow saves significant time while maintaining high quality and consistency.

## Summary of Time Savings

| Workflow | Manual Time | With Claude | Savings |
|----------|-------------|-------------|---------|
| Button Component | 20 min | 2 min | 90% |
| Login Screen | 30 min | 5 min | 83% |
| Card Library | 45 min | 10 min | 78% |
| Form System | 1 hour | 15 min | 75% |
| Dashboard | 3 hours | 45 min | 75% |
| Landing Page | 4 hours | 1 hour | 75% |
| Design System | 10 hours | 2 hours | 80% |
| Accessibility Audit | 2 hours | 15 min | 88% |
| Consistency Check | 2 hours | 10 min | 92% |
| Component Analysis | 3 hours | 20 min | 89% |

**Average Time Savings: 82%**

---

## Next Steps

1. Try these workflows with your own projects
2. Customize the design systems for your brand
3. Share feedback and suggestions
4. Explore advanced features and automations

Happy designing! 🎨

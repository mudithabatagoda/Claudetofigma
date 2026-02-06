// Plugin runs in Figma's sandbox environment
// Handles all write operations from Claude

const WEBHOOK_URL = 'http://localhost:3456';
let fileKey = '';
let pollingInterval = null;

// Initialize
figma.showUI(__html__, { 
  width: 450, 
  height: 700,
  themeColors: true
});

// Get file key
fileKey = figma.fileKey || 'local-' + Math.random().toString(36).substr(2, 9);

// Register with webhook server
async function registerPlugin() {
  try {
    const response = await fetch(`${WEBHOOK_URL}/plugin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileKey: figma.fileKey || fileKey,
        pluginVersion: '2.0.0'
      })
    });
    
    const data = await response.json();
    console.log('✅ Registered with Claude server:', data);
    
    figma.ui.postMessage({
      type: 'REGISTERED',
      data: { webhookUrl: WEBHOOK_URL, fileKey: figma.fileKey }
    });
  } catch (error) {
    console.error('❌ Registration failed:', error);
    figma.ui.postMessage({
      type: 'ERROR',
      message: 'Could not connect to Claude server. Is it running?'
    });
  }
}

// Poll for commands from Claude
async function pollCommands() {
  try {
    const response = await fetch(`${WEBHOOK_URL}/commands/${figma.fileKey || fileKey}`);
    const { commands } = await response.json();
    
    if (commands && commands.length > 0) {
      console.log(`📥 Received ${commands.length} command(s) from Claude`);
      
      for (const command of commands) {
        await executeCommand(command);
      }
    }
  } catch (error) {
    console.error('Polling error:', error);
  }
}

// Execute command from Claude
async function executeCommand(command) {
  const { operationId, action, data } = command;
  
  try {
    let result;
    
    switch (action) {
      case 'CREATE_FRAME':
        result = await createFrame(data);
        break;
      case 'CREATE_RECTANGLE':
        result = await createRectangle(data);
        break;
      case 'CREATE_TEXT':
        result = await createText(data);
        break;
      case 'CREATE_BUTTON':
        result = await createButton(data);
        break;
      case 'CREATE_INPUT':
        result = await createInputField(data);
        break;
      case 'BUILD_SCREEN':
        result = await buildScreen(data);
        break;
      case 'APPLY_AUTO_LAYOUT':
        result = await applyAutoLayout(data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // Send result back to Claude
    await sendResult(operationId, true, result);
    
    figma.ui.postMessage({
      type: 'OPERATION_SUCCESS',
      action,
      result
    });
    
  } catch (error) {
    await sendResult(operationId, false, null, error.message);
    
    figma.ui.postMessage({
      type: 'OPERATION_ERROR',
      action,
      error: error.message
    });
  }
}

async function sendResult(operationId, success, data, error = null) {
  try {
    await fetch(`${WEBHOOK_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationId,
        success,
        data,
        error
      })
    });
  } catch (e) {
    console.error('Failed to send result:', e);
  }
}

// ==================== CREATE OPERATIONS ====================

async function createFrame(data) {
  const { name, width, height, x, y, backgroundColor } = data;
  
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.x = x || 0;
  frame.y = y || 0;
  
  if (backgroundColor) {
    frame.fills = [{
      type: 'SOLID',
      color: backgroundColor
    }];
  }
  
  figma.currentPage.appendChild(frame);
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  return {
    nodeId: frame.id,
    nodeName: frame.name,
    type: 'FRAME'
  };
}

async function createRectangle(data) {
  const { parentId, name, x, y, width, height, fillColor, cornerRadius } = data;
  
  const rect = figma.createRectangle();
  rect.name = name;
  rect.resize(width, height);
  rect.x = x || 0;
  rect.y = y || 0;
  
  if (fillColor) {
    rect.fills = [{
      type: 'SOLID',
      color: fillColor
    }];
  }
  
  if (cornerRadius) {
    rect.cornerRadius = cornerRadius;
  }
  
  if (parentId) {
    const parent = await figma.getNodeByIdAsync(parentId);
    if (parent && 'appendChild' in parent) {
      parent.appendChild(rect);
    } else {
      figma.currentPage.appendChild(rect);
    }
  } else {
    const selection = figma.currentPage.selection[0];
    if (selection && 'appendChild' in selection) {
      selection.appendChild(rect);
    } else {
      figma.currentPage.appendChild(rect);
    }
  }
  
  figma.currentPage.selection = [rect];
  figma.viewport.scrollAndZoomIntoView([rect]);
  
  return {
    nodeId: rect.id,
    nodeName: rect.name,
    type: 'RECTANGLE'
  };
}

async function createText(data) {
  const { 
    parentId, text, x, y, fontSize, fontFamily, 
    fontWeight, textColor, textAlign 
  } = data;
  
  // Load font
  await figma.loadFontAsync({ 
    family: fontFamily || "Inter", 
    style: fontWeight || "Regular" 
  });
  
  const textNode = figma.createText();
  textNode.characters = text;
  textNode.fontSize = fontSize || 16;
  textNode.x = x || 0;
  textNode.y = y || 0;
  
  if (textColor) {
    textNode.fills = [{
      type: 'SOLID',
      color: textColor
    }];
  }
  
  if (textAlign) {
    textNode.textAlignHorizontal = textAlign;
  }
  
  if (parentId) {
    const parent = await figma.getNodeByIdAsync(parentId);
    if (parent && 'appendChild' in parent) {
      parent.appendChild(textNode);
    } else {
      figma.currentPage.appendChild(textNode);
    }
  } else {
    const selection = figma.currentPage.selection[0];
    if (selection && 'appendChild' in selection) {
      selection.appendChild(textNode);
    } else {
      figma.currentPage.appendChild(textNode);
    }
  }
  
  figma.currentPage.selection = [textNode];
  figma.viewport.scrollAndZoomIntoView([textNode]);
  
  return {
    nodeId: textNode.id,
    nodeName: textNode.name,
    type: 'TEXT'
  };
}

async function createButton(data) {
  const { parentId, label, x, y, variant, size } = data;
  
  // Button sizes
  const sizes = {
    small: { height: 32, paddingX: 16, fontSize: 14 },
    medium: { height: 40, paddingX: 24, fontSize: 16 },
    large: { height: 48, paddingX: 32, fontSize: 18 }
  };
  
  const sizeConfig = sizes[size] || sizes.medium;
  
  // Button variants
  const variants = {
    primary: { bg: { r: 0, g: 0.4, b: 1 }, text: { r: 1, g: 1, b: 1 } },
    secondary: { bg: { r: 0.4, g: 0.4, b: 0.4 }, text: { r: 1, g: 1, b: 1 } },
    outline: { bg: { r: 1, g: 1, b: 1 }, text: { r: 0, g: 0.4, b: 1 }, stroke: true },
    ghost: { bg: { r: 0, g: 0, b: 0, a: 0 }, text: { r: 0, g: 0.4, b: 1 } }
  };
  
  const variantConfig = variants[variant] || variants.primary;
  
  // Create button frame
  const button = figma.createFrame();
  button.name = `Button / ${variant} / ${size}`;
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.paddingLeft = sizeConfig.paddingX;
  button.paddingRight = sizeConfig.paddingX;
  button.paddingTop = 0;
  button.paddingBottom = 0;
  button.resize(100, sizeConfig.height);
  button.x = x || 0;
  button.y = y || 0;
  button.cornerRadius = 8;
  
  // Background
  button.fills = [{
    type: 'SOLID',
    color: variantConfig.bg
  }];
  
  // Stroke for outline variant
  if (variantConfig.stroke) {
    button.strokes = [{
      type: 'SOLID',
      color: variantConfig.text
    }];
    button.strokeWeight = 2;
  }
  
  // Text
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  const textNode = figma.createText();
  textNode.characters = label;
  textNode.fontSize = sizeConfig.fontSize;
  textNode.fontName = { family: "Inter", style: "Medium" };
  textNode.fills = [{
    type: 'SOLID',
    color: variantConfig.text
  }];
  
  button.appendChild(textNode);
  button.primaryAxisSizingMode = 'AUTO';
  
  if (parentId) {
    const parent = await figma.getNodeByIdAsync(parentId);
    if (parent && 'appendChild' in parent) {
      parent.appendChild(button);
    } else {
      figma.currentPage.appendChild(button);
    }
  } else {
    figma.currentPage.appendChild(button);
  }
  
  figma.currentPage.selection = [button];
  figma.viewport.scrollAndZoomIntoView([button]);
  
  return {
    nodeId: button.id,
    nodeName: button.name,
    type: 'BUTTON'
  };
}

async function createInputField(data) {
  const { parentId, label, placeholder, x, y, width, type } = data;
  
  // Create container
  const container = figma.createFrame();
  container.name = `Input / ${type}`;
  container.layoutMode = 'VERTICAL';
  container.itemSpacing = 8;
  container.fills = [];
  container.x = x || 0;
  container.y = y || 0;
  
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  // Label
  const labelNode = figma.createText();
  labelNode.characters = label;
  labelNode.fontSize = 14;
  labelNode.fontName = { family: "Inter", style: "Medium" };
  labelNode.fills = [{
    type: 'SOLID',
    color: { r: 0.1, g: 0.1, b: 0.1 }
  }];
  
  // Input field
  const input = figma.createFrame();
  input.name = 'Input Field';
  input.resize(width || 300, 44);
  input.cornerRadius = 8;
  input.fills = [{
    type: 'SOLID',
    color: { r: 1, g: 1, b: 1 }
  }];
  input.strokes = [{
    type: 'SOLID',
    color: { r: 0.8, g: 0.8, b: 0.8 }
  }];
  input.strokeWeight = 1;
  input.layoutMode = 'HORIZONTAL';
  input.paddingLeft = 16;
  input.paddingRight = 16;
  input.primaryAxisAlignItems = 'CENTER';
  
  // Placeholder text
  const placeholderNode = figma.createText();
  placeholderNode.characters = placeholder || `Enter ${label.toLowerCase()}...`;
  placeholderNode.fontSize = 16;
  placeholderNode.fontName = { family: "Inter", style: "Regular" };
  placeholderNode.fills = [{
    type: 'SOLID',
    color: { r: 0.6, g: 0.6, b: 0.6 }
  }];
  
  input.appendChild(placeholderNode);
  container.appendChild(labelNode);
  container.appendChild(input);
  
  container.primaryAxisSizingMode = 'AUTO';
  container.counterAxisSizingMode = 'AUTO';
  
  if (parentId) {
    const parent = await figma.getNodeByIdAsync(parentId);
    if (parent && 'appendChild' in parent) {
      parent.appendChild(container);
    } else {
      figma.currentPage.appendChild(container);
    }
  } else {
    figma.currentPage.appendChild(container);
  }
  
  figma.currentPage.selection = [container];
  figma.viewport.scrollAndZoomIntoView([container]);
  
  return {
    nodeId: container.id,
    nodeName: container.name,
    type: 'INPUT_FIELD'
  };
}

async function buildScreen(data) {
  const { screenName, requirements, style, device, layout } = data;
  
  // Create screen frame
  const screen = figma.createFrame();
  screen.name = screenName;
  screen.resize(layout.device.width, layout.device.height);
  
  // Background
  screen.fills = [{
    type: 'SOLID',
    color: hexToRgb(layout.style.backgroundColor)
  }];
  
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  
  // Add title
  const title = figma.createText();
  title.characters = screenName;
  title.fontSize = 24;
  title.fontName = { family: "Inter", style: "Bold" };
  title.x = 24;
  title.y = 60;
  title.fills = [{
    type: 'SOLID',
    color: hexToRgb(layout.style.textColor)
  }];
  
  screen.appendChild(title);
  
  // Add to page
  figma.currentPage.appendChild(screen);
  figma.currentPage.selection = [screen];
  figma.viewport.scrollAndZoomIntoView([screen]);
  
  return {
    nodeId: screen.id,
    nodeName: screen.name,
    type: 'SCREEN',
    device: device,
    style: style
  };
}

async function applyAutoLayout(data) {
  const { nodeId, direction, spacing, padding } = data;
  
  const node = await figma.getNodeByIdAsync(nodeId);
  
  if (!node || node.type !== 'FRAME') {
    throw new Error('Node must be a frame');
  }
  
  node.layoutMode = direction;
  node.itemSpacing = spacing || 16;
  node.paddingLeft = padding || 24;
  node.paddingRight = padding || 24;
  node.paddingTop = padding || 24;
  node.paddingBottom = padding || 24;
  
  return {
    nodeId: node.id,
    applied: true
  };
}

// Helper functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 0, g: 0, b: 0 };
}

// UI message handler
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'START_POLLING':
      if (!pollingInterval) {
        await registerPlugin();
        pollingInterval = setInterval(pollCommands, 2000);
        figma.ui.postMessage({ type: 'POLLING_STARTED' });
      }
      break;
      
    case 'STOP_POLLING':
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        figma.ui.postMessage({ type: 'POLLING_STOPPED' });
      }
      break;
      
    case 'TEST_CONNECTION':
      await registerPlugin();
      break;
  }
};

// Cleanup on close
figma.on('close', () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

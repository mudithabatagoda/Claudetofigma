# Example: Build Login Screen

This example shows how to use Claude to build a complete mobile login screen from requirements.

## Requirements

Create a modern mobile login screen with:
- Email input field
- Password input field
- "Remember me" checkbox
- "Sign In" button (primary)
- "Forgot password?" link
- "Don't have an account? Sign up" link at bottom
- Modern, clean aesthetic

## Claude Command

```
In my Figma file ABC123XYZ, build a mobile login screen with these specifications:

Name: "Login Screen"
Device: mobile (375x812px)
Style: modern

Elements needed:
1. Top section:
   - App logo placeholder (centered)
   - "Welcome Back" heading (24px, bold)
   - "Sign in to continue" subheading (16px, gray)

2. Form section (centered, with proper spacing):
   - Email input field with label
   - Password input field with label and show/hide icon
   - Remember me checkbox with label

3. Button section:
   - Primary "Sign In" button (full width, rounded)
   - "Forgot password?" link (centered, small, purple)

4. Bottom section:
   - Divider line with "or" text
   - "Don't have an account? Sign up" (centered)

Use these colors:
- Primary: #667eea (purple)
- Background: #FFFFFF
- Text: #1a1a1a
- Text Secondary: #666666
- Input Border: #e5e7eb

Apply proper spacing: 16px between fields, 24px padding around content
```

## Step-by-Step Alternative

If you prefer more control, break it down:

### Step 1: Create Frame
```
create_frame in ABC123XYZ:
- name: "Login Screen"
- width: 375
- height: 812  
- background_color: "#FFFFFF"
```

### Step 2: Add Heading
```
create_text in frame "Login Screen":
- text: "Welcome Back"
- font_size: 24
- font_weight: "Bold"
- x: 24
- y: 100
```

### Step 3: Add Email Input
```
create_input_field:
- label: "Email Address"
- placeholder: "you@example.com"
- type: "email"
- x: 24
- y: 200
- width: 327
```

### Step 4: Add Password Input
```
create_input_field:
- label: "Password"
- placeholder: "Enter your password"
- type: "password"
- x: 24
- y: 290
- width: 327
```

### Step 5: Add Sign In Button
```
create_button:
- label: "Sign In"
- variant: "primary"
- size: "large"
- x: 24
- y: 400
```

### Step 6: Apply Auto-Layout
```
apply_auto_layout to frame "Login Screen":
- direction: "VERTICAL"
- spacing: 16
- padding: 24
```

## Expected Result

A professionally designed login screen with:
- Clean, modern aesthetic
- Properly aligned elements
- Consistent spacing
- Accessible touch targets (44px+ height)
- Professional typography
- Color harmony

## Next Steps

After Claude creates the screen:

1. **Refine in Figma**: Adjust spacing, colors, fonts manually
2. **Add Interactions**: Set up prototype flows
3. **Create Variants**: Make dark mode version
4. **Export Assets**: Use `export_nodes` to get images

## Variations

### Minimal Style
```
build_prototype_screen:
- style: "minimal"
- Same requirements as above
```

### Corporate Style  
```
build_prototype_screen:
- style: "corporate"
- Use blue instead of purple
```

### With Social Login
Add to requirements:
```
5. Social login section:
   - "Or continue with" text
   - Google button
   - Apple button
   (arrange horizontally)
```

## Tips

- Be specific about spacing and positioning
- Mention exact pixel values when precision matters
- Reference existing design systems when available
- Use semantic names for frames ("Login Screen" not "Frame 1")
- Request auto-layout for responsive behavior

## Common Issues

**Fonts not available**: Stick to Inter, Roboto, Arial
**Overlapping elements**: Specify x, y positions or use auto-layout
**Wrong colors**: Use hex codes (#667eea) not names ("purple")

---

**Estimated time**: 30 seconds with Claude vs 30 minutes manual design

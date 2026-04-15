---
name: excalidraw-diagram
description: Use when someone asks to draw a diagram, make an Excalidraw diagram, create a visual, or build an editable diagram. Default for all visual requests — flows, journeys, comparisons, timelines, concept maps. Always trigger this whenever the user wants any kind of visual explanation.
---

## Workflow

### Step 1: Understand the request
Before generating anything, make sure you know:
- What concept or system are they diagramming?
- What are the major components or sections?
- What is the flow, journey, or relationship between them?

If the request is vague (e.g., "make a diagram of Docker"), ask 1-2 clarifying questions.

### Step 2: Research if needed
If you're not confident about the technical accuracy of the concept, research it before diagramming. Verify component names, hierarchy, and data flow direction.

### Step 3: Plan the layout
Sketch the layout mentally before writing JSON:
- Major sections (left-to-right or top-to-bottom)
- Nesting structure
- Arrows
- Icons / emojis per element
- Floating annotations

```
[Section A: w=200] --50px gap-- [Section B: w=200] --50px gap-- [Section C: w=200]
```

### Step 4: Generate elements
Build elements in order:
1. Outer boxes / containers (rounded corners)
2. Icon at top-center of each box (use emoji 28-36px or a drawn icon)
3. Label text below icon
4. Subtitle or annotation text
5. Floating annotations outside boxes
6. Arrows last — color to match their source box

### Step 5: Save and deliver
1. Save to `[concept-slug].excalidraw` in the current directory
2. Show the full JSON in a code block so the user can copy it directly
3. Briefly describe what the diagram shows and what each color zone represents
4. Tell the user how to use the file:

> **How to view and edit your diagram:**
> - Go to excalidraw.com (free, no account needed)
> - Option A: Menu (top-left) > "Open" > select the `.excalidraw` file
> - Option B: Copy the JSON code block above, open excalidraw.com, paste with Ctrl+V / Cmd+V
> - Every element is fully editable — drag to move, grab handles to resize, double-click to edit text

### Step 6: Handle feedback
- Shifting an element = update x/y on that element + dependents
- Changing text = update both `text` and `originalText`
- Adding a zone = assign a new palette color, keep spacing consistent
- For 20+ element diagrams, build section by section to avoid coordinate errors

---

## Critical Rule: Text Contrast

Text inside colored shapes must be readable. Use `#1e1e1e` (near-black) or `#1a2a4a` (dark navy) for all text inside filled shapes. Never use the zone's stroke color for text on that zone's background.

---

## Design Principles

**Icons tell the story at a glance:** Every major box should have an icon at top-center (emoji or drawn).

**Color tells the zone:** One color per logical zone. Viewer should grasp structure before reading a word.

**Nesting shows containment:** Child coordinates are absolute, not relative — `child_x = parent_x + padding`.

**Annotations float freely:** Callout text, checkmarks, X marks live OUTSIDE boxes as free text elements.

**Step numbers ground the flow:** For sequential diagrams, large bold step numbers (fontSize 36-48) below or above each major column.

**Labels are short:** 2-5 words per label. Longer text becomes annotations with smaller fontSize and muted color (`#868e96`).

**White space is structure:** 15px minimum between siblings, 40-60px between major sections.

**Arrows carry intent:** Match arrow strokeColor to source box. Label every non-obvious arrow. Use curved arrows (`{"type": 2}`) for loops or feedback.

---

## Layout System

1. Identify major sections (left-to-right or top-to-bottom)
2. Assign fixed width and starting x to each section
3. Calculate gaps: 40-60px between sections, 15-25px between siblings
4. Work top-to-bottom within sections: `next_y = current_y + current_height + gap`

**Padding rules:**
- Outer box to icon: 10px top offset, centered
- Icon to label: 8-10px gap
- Outer box to nested box: 10-15px on all sides

**Coordinate math example:**
```
Section A: x=30,  w=180  -> right edge = 210
Gap:                        50px
Section B: x=260, w=180  -> right edge = 440
Gap:                        50px
Section C: x=490, w=180  -> right edge = 670
```

---

## Color Palette (default)

Clean, modern palette suitable for tech / business diagrams.

| Zone | Use for | strokeColor | backgroundColor |
|------|---------|-------------|-----------------|
| Electric Blue | Primary elements, hero boxes | `#1864ab` | `#dbe4ff` |
| Bright Blue | Accents, highlights | `#1971c2` | `#74c0fc` |
| Cyan | Data flows, APIs | `#0b7285` | `#e3fafc` |
| Dark Navy | Containers, frames | `#1a2a4a` | `#e8f0fe` |
| Charcoal | Neutral, supporting | `#343a40` | `#f1f3f5` |
| Green | Success, output | `#2f9e44` | `#d3f9d8` |
| Red/Coral | Warnings, errors | `#c92a2a` | `#ffe3e3` |

**Arrow color rule:** Match arrow strokeColor to its source box.

---

## Typography Scale

| Role | fontSize | fontFamily |
|------|----------|------------|
| Diagram title | 36-48 | 1 (Virgil) |
| Step number | 36-48 | 1 |
| Section header | 20-24 | 1 |
| Icon/emoji | 28-36 | 1 |
| Element label | 16-18 | 1 |
| Annotation | 14-15 | 1 |
| Small note | 12-13 | 1 |
| Code label | 14-16 | 3 (Cascadia) |

---

## Element Schema

Every element needs these base fields.

### Base fields (all types)
```json
{
  "id": "unique-string",
  "type": "rectangle|ellipse|diamond|arrow|line|text|freedraw",
  "x": 0, "y": 0,
  "width": 100, "height": 50,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": null,
  "boundElements": [],
  "updated": 1,
  "link": null,
  "locked": false
}
```

### Text fields (add to base)
```json
{
  "text": "Label text",
  "fontSize": 16,
  "fontFamily": 1,
  "textAlign": "center",
  "verticalAlign": "top",
  "containerId": null,
  "originalText": "Label text",
  "lineHeight": 1.25
}
```

### Arrow fields (add to base)
```json
{
  "points": [[0, 0], [100, 0]],
  "lastCommittedPoint": null,
  "startBinding": null,
  "endBinding": null,
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

### Key values
- **fontFamily:** 1 = Virgil (handwritten, default), 2 = Helvetica, 3 = Cascadia (mono)
- **roughness:** 0 = smooth, 1 = slightly rough (default), 2 = very rough
- **fillStyle:** `"solid"` for clean, `"hachure"` for classic Excalidraw hatching
- **roundness:** `null` = sharp, `{"type": 3}` = rounded boxes (default), `{"type": 2}` = curved arrows
- **strokeWidth:** 2 regular, 3 hero/key boxes, 1 annotations

---

## Common Patterns

### Icon + labeled box
```
[Rect: x, y, w=180, h=140, roundness={"type":3}, strokeWidth=2]
[Icon: x, y+12, w=180, fontSize=32, textAlign=center]
[Label: x, y+60, w=180, fontSize=18]
[Subtitle: x, y+88, w=180, fontSize=14, strokeColor=#868e96]
```

### Floating annotation
```
[Text: x=box_right+15, y=box_mid, fontSize=14, strokeColor=#343a40]
```

### Step number under a column
```
[Text: x=col_x, y=col_bottom+20, w=col_w, fontSize=48, textAlign=center, strokeColor=#dee2e6]
```

### Arrow with label
```
[Arrow: x=start_x, y=mid_y, width=gap_width, points=[[0,0],[gap_width,0]], strokeColor=source_color]
[Label: x=start_x, y=mid_y-25, width=gap_width, textAlign=center, fontSize=13]
```

---

## JSON Wrapper

Every diagram uses this shell:
```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [ ... ],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

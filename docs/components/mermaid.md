# Mermaid

A Mermaid diagram drawn from its source: layout and rasterizing run in Go, so
the diagram needs no browser, Node.js or network.

[All components](../components.md)

## In a `.goi` file

```goi
Mermaid {
	width: 560
	text:  "flowchart LR\n A[Start] --> B{Ready?}\n B -->|yes| C([Ship])"
}
```

A design can keep the source in a `.mmd` file instead; `text`, when set, wins:

```goi
Mermaid {
	width: 560
	src:   "goi://flowchart.mmd"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | the Mermaid source; takes precedence over `src` |
| `src` | string | a `.mmd` file inside the design container or a path on this machine |
| `width` | number | the diagram's width; its height follows the diagram's aspect |
| `height` | number | an explicit height; the drawing is contained in the box |

The diagram keeps its own aspect. Without a width it takes the renderer's
natural width, and a diagram wider than its column shrinks to fit with its height
following. A width scales the height; a design that sets both gets the drawing
contained in that box.

## Rendering

The source is parsed by [Pele](https://github.com/obsidianmd/pele), a pure-Go
Mermaid renderer, and rasterized by resvg. The result is a bitmap, so the diagram
draws like an image and costs one texture, not one draw call per shape.

- The palette follows the app's scheme: surfaces, text, lines and the accent are
  the current theme's roles, so a diagram follows a dark switch without a
  reload.
- A parse or render failure keeps the node's box and draws the error there
  instead of leaving a silent hole.
- The renderer is lazy: the first visible diagram prepares resvg; a page without
  one pays nothing.

### Diagram types

The renderer covers the Mermaid diagram set it ports: flowchart and swimlane,
sequence, class, state, entity relationship, user journey, gantt, pie, quadrant,
requirement, use case, git graph, C4, mindmap, timeline, sankey, XY chart, block,
packet, kanban, architecture, radar, event modeling, treemap, Venn, Ishikawa,
Wardley, Cynefin, TreeView, agentflow, railroad and info — 33 types.

Mermaid.js also has **ZenUML**, which the pure-Go renderer does not implement.
The raster carries the drawing, not the page behaviour: `click` links, HTML
labels, icon packs and TeX typesetting are not interactive or typeset here.
Those limitations are the renderer's, not the component's source format.

## From Go

```go
chart := ui.MustByID[*ui.Mermaid](w, "chart")
chart.Text.Set("flowchart LR\n A-->B")
// or chart.SetSource("flowchart LR\n A-->B")
```

Change `Text` or `Src` from `Bind`; the next frame renders the new source.

Every element also accepts the [common properties](../components.md#common-properties).

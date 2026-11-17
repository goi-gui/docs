# Mermaid

A Mermaid diagram drawn from source. Layout and rasterizing run in Go, so the
diagram needs no browser, Node.js or network.

[All components](../components.md)

<p align="center">
  <img src="/img/components/mermaid-light.png" alt="A Mermaid flowchart in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/mermaid-dark.png" alt="A Mermaid flowchart in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Mermaid {
	width: 520
	data:  !"flowchart LR
	         A[Start] --> B{Ready?}
	         B -->|yes| C([Ship])
	         B -->|no| D[Wait]"!
}
```

`data` is the Mermaid source. A block string is the natural way to write a
multi-line diagram: it keeps the line breaks and strips the common indentation,
so the source is exactly what Mermaid sees.

## Sizing

`width` and `height` are the common box properties, with the diagram's aspect
kept:

- `width` alone sets the width and derives the height from the diagram's aspect.
- `height` alone sets the height and derives the width.
- both contain the drawing in the box.
- neither uses the diagram's natural size, shrinking it to the column when it is
  wider than the space offered.

Before the first render a 16:9 placeholder keeps the box measurable, so loading
a page does not jump when the diagram lands.

## Rendering

The source is laid out by [Pele](https://github.com/Broderick-Westrope/pele-go),
a pure-Go Mermaid renderer, and rasterized by resvg. The result is one bitmap, so
a diagram costs one texture, not one draw call per shape.

- Rendering runs off the UI goroutine. The first visible diagram compiles the
  rasterizer in the background (and caches the compiled module in the user cache
  directory for the next run), so the window keeps painting instead of freezing.
- A diagram is only rendered when its box is on screen. A hidden page, or a
  diagram below the fold, waits until it is scrolled into view. Scrolling a
  rendered diagram away drops its bitmap; the box keeps its size, and scrolling
  back takes the bitmap from the cache or renders again.
- The bitmap is cached by source and scheme, and rasterized at the size the box
  draws it, so a diagram that a design scales up is not a blurred enlargement. Two nodes with the same source share
  one render, a page opened again is instant, and a theme change renders once
  with the new palette.
- The palette follows the app's scheme: surfaces, text, lines and the accent are
  the current theme's roles, so a light/dark switch needs no reload. The bitmap
  is composed on the scheme's surface instead of staying transparent, and in a
  dark scheme the series colours are lightened because Pele paints some labels
  with the background colour.
- A parse or render failure keeps the box and draws the error there instead of
  leaving a silent hole.

The browser (wasm) build does not carry the wasm rasterizer; a `Mermaid` there
draws the unsupported-build message instead of taking the page down.

A desktop app that does not use Mermaid can drop Pele, resvg and wazero with:

```sh
go build -tags nomermaid ./...
```

The component and its `data` property stay in the design, but the node draws the
unsupported-build message instead of a diagram. On a typical linux/amd64 app
this saves roughly 15 MB of binary; the wasm build never includes the rasterizer
either way.

### Diagram types

The renderer covers the Mermaid set it ports: flowchart and swimlane, sequence,
class, state, entity relationship, user journey, gantt, pie, quadrant,
requirement, use case, git graph, C4, mindmap, timeline, sankey, XY chart, block,
packet, kanban, architecture, radar, event modeling, treemap, Venn, Ishikawa,
Wardley, Cynefin, TreeView, agentflow, railroad and info — 33 types.

Mermaid.js also has **ZenUML**, which the pure-Go renderer does not implement.
The bitmap carries the drawing, not the page behaviour: `click` links, HTML
labels, icon packs and TeX typesetting are not interactive or typeset here.

## Properties

| Property | Type | Notes |
|---|---|---|
| `data` | string | the Mermaid source; a block string may span lines |

Every element also accepts the [common properties](../components.md#common-properties),
including `width`, `height`, `background`, `radius` and the box border.

## From Go

```go
chart := ui.MustByID[*ui.Mermaid](w, "chart")
chart.SetSource("flowchart LR\n A --> B")
// or chart.Source.Set("flowchart LR\n A --> B")
```

Change `data` from `Bind`; the next visible frame renders the new source.

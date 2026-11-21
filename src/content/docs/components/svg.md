---
title: "SVG"
---

Draws an SVG document. `currentColor` in it is replaced by `color`, so one icon
can follow the theme instead of shipping a coloured copy per state. The document
comes from `src` or, from Go, from `SetDataString`/`SetDataBytes`.

[All components](/components/)

<p align="center">
  <img src="/img/components/svg-light.png" alt="SVG in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/svg-dark.png" alt="SVG in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
SVG {
	src:    "goi://images/logo.svg"
	width:  48
	height: 48
}

SVG {
	id:     mark
	src:    "goi://images/check.svg"
	color:  theme.primary
	width:  24
	height: 24
}

// A file on this machine, or one fetched over the network.
SVG {
	src:    "./icons/star.svg"
	color:  theme.secondary
	width:  32
	height: 32
}
```

## Where a `src` points

| Form | Reads |
|---|---|
| `goi://images/icon.svg` | the `assets` directory, embedded by `goi build` |
| `./icon.svg`, `icon.svg` | the working directory of the process |
| `/home/me/icon.svg` | that absolute path |
| `https://…`, `http://…` | the network, in the background |

The rules are the same as for [Image](/components/image/#where-a-src-points).

## Properties

| Property | Type | Notes |
|---|---|---|
| `src` | string | `goi://` container path, a machine path, or an `http`/`https` URL |
| `fit` | enum | `contain` (default), `cover` or `fill` |
| `crossfadeSrc` | duration | fade from the old drawing to the new one when `src` changes; `0` by default, no fade |
| `color` | color | replaces the file's `currentColor`; a role name or a hex literal |
| `paused` | bool | holds a SMIL animation where it is; `false` by default |
| `loop` | bool | repeats the animation; `true` by default, `false` plays one pass |
| `lazy` | bool | defer reading and rasterizing `src` until the box is on screen; `false` by default |

The file is parsed and rasterized with the SVG's own `viewBox` aspect, at most
1024 px on the long edge, so `fit` behaves the same as on [Image](/components/image/). If
`width` and `height` are omitted, the `viewBox` size is the element's intrinsic
size; a declared `width` or `height` overrides it. With `crossfadeSrc: 500ms`, a
new `src` or `color` fades the old raster into the new one over that duration.

`color` is a normal colour property, which means a Material role works:

```goi
SVG {
	src:   "assets/check.svg"
	color: theme.onSurfaceVariant
}
```

When the scheme changes, the role resolves and the icon is rasterized again. A
colour's alpha becomes the drawing opacity, because SVG hex colours have no
alpha channel.

A local path is read and rasterized while the window is built, so the first frame
already has it; a `src` written as an expression is picked up once the expression
pass has given it a value, and a `src` changed from Go rasters again. A remote `src` is fetched in the background exactly like an
`Image`: the node lays out at its declared size straight away and paints a faint
wash that breathes until the file lands. Nothing waits for the network — a slow
host cannot hold up the first frame or a hot reload.

With `lazy: true` the file is not read and a remote URL is not fetched until the
icon's box is on screen. A declared `width` and `height` reserve the space; an
SVG with neither loads at once, because its `viewBox` is what gives it a size.

What happens to a remote SVG:

- The URL is fetched once per app, not once per node, and the bytes are cached,
  so a reload (or a second colour) does not download it again.
- The download is capped at 32 MiB and times out after 20 seconds. Anything
  larger, a non-200 status or a parse failure is recorded in `LoadErr` on the
  node and the placeholder stops.
- Parsing and rasterizing happen on the UI goroutine once the bytes arrive, and
  the node is marked for layout because the `viewBox` may have changed its size.
- A fetch that lands after a hot reload fills in the new nodes; the tree is
  searched by `src` when the data arrives rather than holding old pointers.

## What it draws

The renderer covers the shapes an icon and a logo use: paths, rects, circles,
ellipses, lines and polygons; transforms, including the single-argument
`scale(2)` a hand-edited file often writes; nested `<svg>` viewports; `use` and
`symbol`; and linear/radial gradients, including the `xlink:href` inheritance
and `style` stops Inkscape exports. Inline `style` declarations and class rules
are folded into the presentation attributes the rasterizer reads, and a negative
`viewBox` origin is moved to zero.

A simple `clipPath` or `mask` on the document's one top-level group is honoured
by masking the finished picture; a clip or mask on several nested elements is
not. The rasterizer has no text or filter engine: `<text>` and filters such as
`feGaussianBlur` are ignored, and so are `<pattern>` fills and embedded raster
`<image>` elements. Outline text and flatten filters in the editor if a file
needs them.

## Animation

A document that declares a SMIL animation plays on its own. The supported subset
is the one an animated icon actually uses:

- `<animate>` on an attribute — numbers and colours interpolate between
  `values`, or between `from` and `to`, with `keyTimes` when given.
- `<animateTransform>` for `translate`, `scale`, `rotate` and `skew`, whose
  arguments interpolate the same way.

`dur`, `begin`, `repeatCount` and the `fill`/`opacity`/`transform` attributes are
read. `repeatCount="indefinite"` loops forever; a finite count holds its last
frame. Everything else — `begin` lists, key splines, additive animation, path
morphing, `<set>` — is ignored, so such a file simply draws its first frame
instead of failing.

An animated file is re-rasterized, not transformed on the GPU, so playback costs
a parse and a raster about thirty times a second. Keep animated SVGs small (an
icon, a spinner); a full-screen animated illustration wants a pre-rendered
sequence.

`loop` is `true` by default; `loop: false` plays each animation once and holds
its last frame, whatever `repeatCount` the file declares. `paused: true` starts
held.

### Transport

An animated SVG answers the same `play()`, `pause()` and `stop()` as an
[Image](/components/image/#transport). From a design an event calls them by id, from Go
they are methods on the node:

```goi
SVG {
	id:  spinner
	src: "goi://spinner.svg"
}

Button {
	label:   "Pause"
	onClick: spinner.pause()
}
```

```go
spin := w.MustByID[*ui.SVG]("spinner")
spin.Pause()
spin.Play()
spin.Stop()
```

## From Go

```go
icon := w.MustByID[*ui.SVG]("mark")
icon.Color.Set(0xFF0000FF) // re-rasterized on the next frame
icon.Src.Set("goi://images/other.svg")
icon.Src.Set("https://example.com/other.svg")
```

A document that lives in Go skips `src` entirely. `SetDataString` takes the
markup, `SetDataBytes` the same bytes an `//go:embed` gives you; `color` still
applies to the document's `currentColor`.

```go
icon.SetDataString(`<svg viewBox="0 0 24 24" fill="currentColor">…</svg>`)
icon.SetDataBytes(starSVG) // //go:embed star.svg
```

Setting one replaces `src` until the node is rebuilt, and the next set
re-rasterizes on the following frame. Call them from `Bind`: the document is not
carried across a hot reload.

`Color.Set` and `Src.Set` are picked up by the frame loop, so an icon can change
with interaction. A new `Src` re-reads (or re-fetches) the file and re-runs
layout when its `viewBox` changes the intrinsic size.

Every element also accepts the [common properties](/guide/common-properties/).

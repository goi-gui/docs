# SVG

Draws an SVG document. `currentColor` in it is replaced by `color`, so one icon
can follow the theme instead of shipping a coloured copy per state. The document
comes from `src` or, from Go, from `SetDataString`/`SetDataBytes`.

[All components](../components.md)

## In a `.goi` file

```goi
SVG {
	src:    "goi://assets/logo.svg"
	width:  48
	height: 48
}

SVG {
	id:     mark
	src:    "goi://assets/check.svg"
	color:  primary
	width:  24
	height: 24
}

// A file on this machine, or one fetched over the network.
SVG {
	src:   "./icons/star.svg"
	color: secondary
	width: 32
	height: 32
}
```

## Where a `src` points

| Form | Reads |
|---|---|
| `goi://assets/icon.svg` | the asset container given to `LoadWindow` |
| `./icon.svg`, `icon.svg` | the working directory of the process |
| `/home/me/icon.svg` | that absolute path |
| `https://…`, `http://…` | the network, in the background |

The rules are the same as for [Image](image.md#where-a-src-points).

## Properties

| Property | Type | Notes |
|---|---|---|
| `src` | string | `goi://` container path, a machine path, or an `http`/`https` URL |
| `fit` | string | `contain` (default), `cover` or `fill` |
| `color` | color | replaces the file's `currentColor`; a role name or a hex literal |
| `paused` | bool | holds a SMIL animation where it is; `false` by default |
| `loop` | bool | repeats the animation; `true` by default, `false` plays one pass |

The file is parsed and rasterized with the SVG's own `viewBox` aspect, at most
1024 px on the long edge, so `fit` behaves the same as on [Image](image.md). If
`width` and `height` are omitted, the `viewBox` size is the element's intrinsic
size; a declared `width` or `height` overrides it.

`color` is a normal colour property, which means a Material role works:

```goi
SVG { src: "assets/check.svg" color: onSurfaceVariant }
```

When the scheme changes, the role resolves and the icon is rasterized again. A
colour's alpha becomes the drawing opacity, because SVG hex colours have no
alpha channel.

A local path is read and rasterized while the window is built, so the first frame
already has it. A remote `src` is fetched in the background exactly like an
`Image`: the node lays out at its declared size straight away and paints a faint
wash that breathes until the file lands. Nothing waits for the network — a slow
host cannot hold up the first frame or a hot reload.

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
[Image](image.md#transport). From a design an event calls them by id, from Go
they are methods on the node:

```goi
SVG { id: spinner src: "goi://spinner.svg" }

Button { label: "Pause" onClick: spinner.pause() }
```

```go
spin := ui.MustByID[*ui.SVG](w, "spinner")
spin.Pause()
spin.Play()
spin.Stop()
```

## From Go

```go
icon := ui.MustByID[*ui.SVG](w, "mark")
icon.Color.Set(0xFF0000FF) // re-rasterized on the next frame
icon.Src.Set("goi://assets/other.svg")
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

Every element also accepts the [common properties](../components.md#common-properties).

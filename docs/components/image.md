# Image

Draws a decoded bitmap. `src` names a file in the design's asset container
(`goi://`), a file on the machine, or an `http`/`https` URL; either way the
element takes part in layout immediately. A GIF or APNG plays on its own. Go can
also hand it a bitmap directly with `SetImage`, which needs no file at all.

[All components](../components.md)

## In a `.goi` file

```goi
// A file inside the design's container: the fs.FS passed to LoadWindow, so an
// embed.FS in a release build and ui.DirFS while developing.
Image {
	src:  "goi://assets/cover.png"
	fit:  cover
	width: 240
	height: 135
	radius: 12
}

// A file on this machine, relative to the working directory or absolute.
Image {
	src:  "./photos/me.jpg"
	fit:  contain
	width: 240
	height: 135
}

Image {
	src: "https://picsum.photos/600/400"
	fit: cover
	width: 240
	height: 135
	radius: 12
	background: surfaceContainerHighest
}
```

## Where a `src` points

| Form | Reads |
|---|---|
| `goi://assets/cover.png` | the asset container given to `LoadWindow` |
| `./cover.png`, `cover.png` | the working directory of the process |
| `/home/me/cover.png` | that absolute path |
| `https://…`, `http://…` | the network, in the background |

`goi://` is what an embedded design wants: the same path works from an
`embed.FS`, a `ui.DirFS` and a test's in-memory `fs.FS`. A plain path never
touches the container, so an app that lets the user pick a photo can pass their
path straight through.

## Properties

| Property | Type | Notes |
|---|---|---|
| `src` | string | `goi://` container path, a machine path, or an `http`/`https` URL |
| `fit` | string | `cover`, `contain` or `fill` |
| `paused` | bool | holds a GIF or APNG where it is; `false` by default |
| `loop` | bool | repeats the animation; `true` by default, `false` plays one pass |

A local path is read and decoded while the window is built, so the first frame
already has it; the decoded bitmap is cached by `src`, so a reload does not read
it again. A remote `src` is fetched in the background: the node lays out at
its declared size straight away and paints a faint wash that breathes until the
bitmap lands. Nothing else waits for the network — a slow host cannot hold up the
window's first frame or a hot reload, and a broken URL leaves a coloured
placeholder instead of a hole.

What happens to a remote image:

- The URL is fetched once per app, not once per node: two `Image` elements with
  the same `src` share one request, and the decoded bitmap is cached so a reload
  does not fetch it again.
- The download is capped at 32 MiB and times out after 20 seconds. Anything
  larger, a non-200 status or a decode failure is recorded in `LoadErr` on the
  node and the placeholder stays.
- Decoding happens off the UI goroutine, and the result is handed back with
  `App.Post`, so a large JPEG cannot drop a frame.
- A fetch that lands after a hot reload fills in the new nodes; the tree is
  searched by `src` when the data arrives rather than holding old pointers.

## Animation

A `GIF` or an animated `PNG` (APNG) plays without any Go code. Frames are
decoded once, when the file loads, and composited to full-size pictures, so
playing is a pixel swap rather than per-frame decoding. The element keeps its
declared size, and `fit` applies to every frame.

- A GIF honours its frame delays, transparency and disposal method, so a
  sub-frame that clears does not drag the previous one along.
- An APNG honours its blend and dispose operations the same way.
- An animation with more than 512 frames, or one whose frames add up to more
  than 128 MiB, is held on its first frame instead: a remote file is untrusted
  and must not be able to exhaust memory.

`loop` is `true` by default, so an animation repeats forever; `loop: false`
plays one pass and holds the last frame, whatever loop count the file declares.
`paused: true` starts held, which a still screenshot or a reduced-motion build
wants. `SetImage` replaces the animation with the bitmap it is given.

### Transport

`play`, `pause` and `stop` are the same three moves everywhere:

| Method | Effect |
|---|---|
| `play()` | resumes, or replays from the first frame after `stop()` or a finished one-shot |
| `pause()` | holds the current frame |
| `stop()` | rewinds to the first frame and pauses there |

From Go they are methods on the node; from a design, an event can call them on
an element by id, with no Go handler at all:

```goi
Image { id: gif src: "goi://pulse.gif" }

Button { label: "Play"  onClick: gif.play() }
Button { label: "Pause" onClick: gif.pause() }
Button { label: "Stop"  onClick: gif.stop() }
```

```go
spin := ui.MustByID[*ui.Image](w, "spinner")
spin.Paused.Set(true)   // the property, for a switch
spin.Pause()            // the method, for a one-off
spin.Play()
spin.Stop()
```

## From Go

```go
img := ui.MustByID[*ui.Image](w, "cover")
img.Src.Set("https://example.com/other.png")
```

`Src.Set` only updates the string: the bitmap is loaded when the tree is built or
reloaded, not on every property change. Point at the URL in the `.goi` file, or
reload the design after setting it.

`SetImage` is the other path: it takes any `image.Image`, so a generated chart, a
screenshot or a picture decoded elsewhere needs no file and no `src`.

```go
img.SetImage(gradient(240, 135)) // an image.Image from anywhere
```

Call it from `Bind`, which runs again after every hot reload. The bitmap itself
is not carried over, so a `SetImage` outside `Bind` is lost on the next save.

Every element also accepts the [common properties](../components.md#common-properties).

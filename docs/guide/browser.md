---
title: In the browser
sidebar_label: In the browser
---

# In the browser

A goi app builds to WebAssembly and runs in a canvas. The design file, the tree,
layout, painting and text are the same code as on the desktop: `GOOS=js` swaps
the window layer and the WebGPU backend, and nothing else.

```sh
GOOS=js GOARCH=wasm go build -o web/goi.wasm ./myapp
```

## The page

The browser has no window, so the page's canvas is the window:

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
	html, body { margin: 0; height: 100%; }
	canvas { width: 100%; height: 100%; display: block; }
</style>
</head>
<body>
<canvas></canvas>
<script src="wasm_exec.js"></script>
<script>
	const go = new Go();
	WebAssembly.instantiateStreaming(fetch("goi.wasm"), go.importObject)
		.then((result) => go.run(result.instance));
</script>
</body>
</html>
```

Copy `wasm_exec.js` from your Go installation:

```sh
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" web/
```

- The stylesheet sizes the window. A `canvas { width: 100%; height: 100% }` fills
  the page, and changing the page's size resizes the app; a canvas with no size
  of its own falls back to the design's `width` and `height`.
- If the page has no `<canvas>`, one is created and appended to `<body>`.
- The canvas becomes a WebGPU context; a browser without WebGPU shows nothing.

The [`examples/web`](https://github.com/goi-gui/examples/tree/main/web) app is a
working page: `make -C examples web` builds it into `examples/web/dist`, then

```sh
python3 -m http.server -d examples/web/dist
```

serves it. WebGPU needs a secure context, so `http://localhost` works and a
plain-HTTP host name does not.

## What a design can rely on

Everything the painter draws works the same way: shapes, gradients, shadows,
text and icons, images and SVG, charts, `backdropBlur`, animation. Input works
through the DOM:

| Desktop | Browser |
| --- | --- |
| mouse move, press, release | `mousemove`, `mousedown`, `mouseup` on the canvas, and `mouseup` on the page so a drag that leaves the canvas still ends |
| wheel | `wheel`, with `Shift` for a sideways gesture |
| typing | `keydown` for the named keys, an invisible textarea for text and the input method |
| focus, blur | `focus`, `blur` on the page |
| system theme | `prefers-color-scheme` |

`Copy`, `Paste` and `Cut` use the page's clipboard: the app caches the text from
the page's own `copy`/`paste` events, so Ctrl+V inside a text field works.

## Picking a file

A browser cannot block on a dialog, so the picker is a callback:

```go
app.PickFiles(func(files []string) {
	if len(files) > 0 {
		preview.Src.Set(files[0]) // `goi://picked/0/photo.png`
	}
}, ui.DialogFilters(ui.FileFilter{Name: "Images", Patterns: []string{"*.png", "*.jpg"}}))
```

The same call works on the desktop, where the native dialog runs off the UI
goroutine. Each chosen file gets a `goi://picked/…` src that every reader
understands, so an `Image`, a `Video` or a caption file can take one directly.

`ui.OpenFile` and its siblings still exist for desktop code, but they return
`ErrDialogCanceled` in a page, and `ui.DialogsAvailable()` is `false` there.

## Media

`Audio` and `Video` play through the page's own decoder: a hidden `<video>` or
`<audio>` element holds the file, and the frame loop copies its picture into the
node's bitmap. Paint, hover, the control bar and fullscreen therefore behave the
way they do on the desktop, with the browser's container support, its hardware
decoding and its audio device — no ffmpeg on the machine.

- A `goi://…` asset or a picked file becomes a blob URL, so a design's `src`
  works unchanged; an `http(s)` URL is used as written.
- A live feed plays when the browser can play it, and the scrubber follows the
  element's clock.
- Subtitles are parsed and drawn by goi, so an SRT behaves as it does on the
  desktop.
- `audioTrack` is recorded but does not switch a stream: a page cannot select an
  embedded audio track.

## Keyboard and the input method

Typing goes through an invisible `<textarea>` that the window keeps off screen
and moves under the caret, which is what gives the browser's input method
somewhere to compose:

- a printable key types into that element and its `input` event commits the text,
  so dead keys, AltGr and a composition all take one path;
- `compositionstart`/`compositionupdate`/`compositionend` become the same preedit
  and commit calls SDL's IME produces, so `Preedit` and `CommitText` behave
  identically on both platforms.

## What it cannot do

- **Blocking dialogs.** `ui.OpenFile` and friends return `ErrDialogCanceled`; use
  `app.PickFiles`.
- **Window management.** Minimize, maximize, resize edges and size limits are
  recorded and reported back, but the tab is the window: `SetFullscreen` asks the
  browser for fullscreen on the canvas, and the rest is a no-op.
- **More than one window.** One canvas per page is the model.
- **Switching an embedded audio track.** `audioTrack` is recorded only.

## Frames

The app paints on every `requestAnimationFrame`, so an animation follows the
display and a hidden tab stops painting (the browser throttles it). A desktop
build waits for something to change instead, which is why an idle desktop app
sits at 0% CPU and a browser tab does not.

## Serving it

A `.wasm` file is served as `application/wasm` so
`instantiateStreaming` can stream it; most static servers get that right, and a
server that does not can fall back to `instantiate`. There is nothing else to
configure: no runtime, no JavaScript API to bind.

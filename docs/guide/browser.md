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
| typing | `keydown`; a printable key commits its text |
| focus, blur | `focus`, `blur` on the page |
| system theme | `prefers-color-scheme` |

`Copy`, `Paste` and `Cut` use the page's clipboard: the app caches the text from
the page's own `copy`/`paste` events, so Ctrl+V inside a text field works.

## What it cannot do

- **A file dialog.** `ui.OpenFile`, `ui.SaveFile` and `ui.OpenFolder` return
  `ErrDialogCanceled`; `ui.DialogsAvailable()` is `false`. A page picks a file
  with an `<input type="file">` and hands the bytes to Go.
- **Media decoding.** The decoder is ffmpeg on `PATH`, which a browser does not
  have. `Audio` and `Video` keep their box and stay silent; a page that wants
  sound uses an `<audio>` element beside the canvas.
- **Window management.** Minimize, maximize, resize edges and size limits are
  recorded and reported back, but the tab is the window: `SetFullscreen` asks the
  browser for fullscreen on the canvas, and the rest is a no-op.
- **More than one window.** One canvas per page is the model.
- **An IME candidate window.** `SetTextInput` does nothing; a canvas has no
  caret for the browser's input method to follow. Typing still arrives.

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

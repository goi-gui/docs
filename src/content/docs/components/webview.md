---
title: WebView
---

A native system web view embedded in the window: **WebKitGTK** on Linux,
**WebView2** on Windows and **WKWebView** on macOS. The engine draws the page and
handles pointer and keyboard input itself, and Go can load URLs, run JavaScript
and receive messages from the page.

[All components](/components/)

## In a `.goi` file

```goi
WebView {
	src:    "https://example.com"
	width:  720
	height: 420
}
```

An embedded page uses the design's asset container and keeps its relative CSS,
scripts and images:

```goi
WebView {
	src:    "goi://ui/docs/index.html"
	width:  720
	height: 420
}
```

Inline content needs the `html` property instead. It is rendered by the same
engine, so relative links resolve against `baseURL`:

```goi
WebView {
	width:  520
	height: 320
	html:   "<h2>Hello from goi</h2><p>This is a native web view.</p>"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `src` | string | an `http(s)` URL or a `goi://` embedded asset; ignored when `html` is set |
| `html` | string | inline HTML; takes precedence over `src` |
| `baseURL` | string | base for relative links and scripts in `html` |
| `userAgent` | string | the user agent the view presents; the engine's default when empty |
| `zoom` | number | page zoom, `1` by default |
| `devtools` | bool | enable the engine's developer tools; meant for development |

## From Go

```go
browser := ui.MustByID[*ui.WebView](w, "browser")

// The page posts with window.webkit.messageHandlers.goi.postMessage(...).
browser.OnMessage(func(msg string) {
	fmt.Println("page:", msg)
})

browser.Load("https://example.com/docs")
browser.SetHTML("<p>Second page</p>", "https://example.com/")
browser.Reload()
if browser.GoBack() {
	// the view had history to go back to
}
browser.Eval("document.title")
```

The bridge channel is named `goi`. On Linux and macOS a page sends a string
with:

```js
window.webkit.messageHandlers.goi.postMessage("ready");
```

WebView2 has its own channel object, so a page that runs on Windows uses:

```js
window.chrome.webview.postMessage("ready");
```

A page that has to run everywhere can pick one at load time:

```js
(window.chrome?.webview?.postMessage ?? window.webkit.messageHandlers.goi.postMessage)
	.call(window.chrome?.webview ?? window.webkit.messageHandlers.goi, "ready");
```

## Limits

The web view is a **native layer above the GPU surface**, not a painted node:

- It always sits above the rest of the design. A `Dialog`, `Popover` or menu
  cannot draw over it.
- It cannot follow a rotation, a scale, a partial opacity or a parent clip. A
  `WebView` under those is hidden rather than drawn in the wrong place.
- Layout, scrolling and pointer input are handled by the engine; a Go
  `onClick` on the view itself does not fire. Use the page for interaction.
- On Linux the view needs a Wayland session and the WebKitGTK 4.1 runtime
  (`libwebkit2gtk-4.1-0` on Debian, `webkit2gtk-4.1` on Arch).
- On Windows the view needs the Edge WebView2 runtime, which current Windows 10
  and 11 install by default. No loader DLL has to ship with the app.
- On Linux the page's context menu and a `<select>` menu are drawn inside the
  view, at the click or over the control, and their choice goes back to the
  page. The context menu leaves out rows this backend cannot run (spelling
  suggestions, font and media entries). Other native pickers (the calendar of
  a date input, a colour chooser) are still separate GTK windows and may not
  appear over the view on Wayland; a custom in-page control avoids that.
- `devtools` enables the engine's inspector: the WebKit setting on Linux and
  macOS, the WebView2 setting on Windows. Treat it as a development toggle.
- When the view cannot be created, the placeholder stays and the error reaches
  `App.OnError`, so a missing runtime is visible instead of a silent blank box.
- The Windows and macOS backends are implemented and cross-compiled, but have
  not been exercised on real hardware yet. Report a problem if one shows up;
  Linux is the verified backend.

## Build

The component is an optional feature. Build with the `webview` tag, or `all`:

```sh
goi build --tags webview
```

The platform libraries are loaded at run time through purego, so the build
stays cgo-free and needs no headers or `pkg-config`. A design that uses a
`WebView` without the tag parses and shows the placeholder; the app still runs.

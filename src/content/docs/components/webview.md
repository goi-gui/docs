---
title: WebView
---

A native system web view embedded in the window. On Linux the platform draws
it with **WebKitGTK** on a Wayland subsurface; the page receives the pointer and
keyboard like any browser, and Go can load URLs, run JavaScript and receive
messages from the page.

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

The bridge channel is named `goi`. A page sends a string with:

```js
window.webkit.messageHandlers.goi.postMessage("ready");
```

## Limits

The web view is a **native layer above the GPU surface**, not a painted node:

- It always sits above the rest of the design. A `Dialog`, `Popover` or menu
  cannot draw over it.
- It cannot follow a rotation, a scale, a partial opacity or a parent clip. A
  `WebView` under those is hidden rather than drawn in the wrong place.
- Layout, scrolling and pointer input are handled by the engine; a Go
  `onClick` on the view itself does not fire. Use the page for interaction.
- The Linux backend needs a Wayland session and the WebKitGTK 4.1 runtime
  (`libwebkit2gtk-4.1-0` on Debian, `webkit2gtk-4.1` on Arch). Windows and macOS
  backends are not implemented yet; the placeholder reports that.

## Build

The component is an optional feature. Build with the `webview` tag, or `all`:

```sh
goi build --tags webview
```

The libraries are loaded at run time through purego, so the build stays
cgo-free and needs no headers or `pkg-config`. A design that uses a `WebView`
without the tag parses and shows the placeholder; the app still runs.

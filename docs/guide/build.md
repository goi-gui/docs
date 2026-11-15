---
title: Building
sidebar_label: Building
---

# Building

A goi app is one ordinary Go program, and the build is **cgo-free on every
platform**. The window layer loads the [SDL3](https://libsdl.org) runtime
library through [purego](https://github.com/ebitengine/purego), so nothing needs
a C compiler, SDL3 headers or `pkg-config`; the runtime library is the only
requirement. Everything in the tree — the parser, layout, paint list, text, the
WebGPU renderer and the window itself — is pure Go.

The build is always the same:

```sh
CGO_ENABLED=0 go build -tags nofakecgo -o myapp ./cmd/myapp
```

- **`CGO_ENABLED=0`** keeps cgo out. A cgo build is not supported.
- **`-tags nofakecgo`** is required because the WebGPU renderer (`goffi`) and
  purego each ship a fake C runtime; without the tag the linker sees two
  `_cgo_init`/`dlopen` implementations. `nofakecgo` tells goffi to use purego's
  copy, and the single runtime serves both.

There is no build tag to pick a platform. `platform.SurfaceHandles` asks SDL
which video driver it got and hands the renderer the matching native handle, so
one code path covers all of them:

| Driver | Native handles | Renderer backend |
| --- | --- | --- |
| `wayland` | `wl_display`, `wl_surface` | Vulkan |
| `x11` | X11 `Display`, `Window` | Vulkan |
| `windows` | `HINSTANCE`, `HWND` | Direct3D 12 |
| `cocoa` | `CAMetalLayer` | Metal |

No GPU SDK is needed beyond the display driver: the backends come from
[`gogpu/wgpu`](https://github.com/gogpu/wgpu) and are pure Go.

## Linux

Install the SDL3 runtime library. The package name varies by distribution; SDL3
built from source and installed works too:

```sh
# Debian/Ubuntu (the runtime package; the -dev package is not needed)
sudo apt install libsdl3-0

# Fedora
sudo dnf install SDL3

# Arch
sudo pacman -S sdl3
```

Then build:

```sh
CGO_ENABLED=0 go build -tags nofakecgo -o myapp ./cmd/myapp
```

## macOS

Homebrew installs the runtime library:

```sh
brew install sdl3
CGO_ENABLED=0 go build -tags nofakecgo -o myapp ./cmd/myapp
```

## Windows

The executable needs `SDL3.dll` next to it, from the SDL3 release archive or
MSYS2's `mingw-w64-x86_64-sdl3` package. No MSYS2 shell, C toolchain or
`pkg-config` is needed for the build:

```sh
CGO_ENABLED=0 go build -tags nofakecgo -o myapp.exe ./cmd/myapp
```

A GUI app usually should not open a console window:

```sh
CGO_ENABLED=0 go build -tags nofakecgo -ldflags="-H windowsgui" -o myapp.exe ./cmd/myapp
```

## Smaller binaries

A release build usually wants `-s -w`: it drops the symbol table and DWARF
debug info, which is about 13 MB on a Linux amd64 build. The colour emoji font
is the single largest embedded asset: Noto Color Emoji, about 10.7 MB, and it
is what makes every emoji render offline. A build that does not need colour
emoji can leave it out with `-tags noemoji`; text falls back to the font's
monochrome glyphs where they exist.

The rest of the binary is optional features. Each has a build tag; they
compose, and an app that does not use the feature also loses the dependency:

| Tag | Drops | Native, `-s -w` |
| --- | --- | ---: |
| `noemoji` | the 10.7 MB colour emoji font | 40 → 30 MB |
| `nonet` | `net/http` and TLS: remote `Image`, `SVG` and map tiles fail | 40 → 38 MB |
| `nocode` | Chroma and its regexp engine: a `Code` block draws as plain text | 40 → 36 MB |
| `nosvg` | oksvg/rasterx: `SVG` elements report an error | 40 → 39 MB |
| `nomarkdown` | goldmark: `Markdown` draws nothing | 40 → 39 MB |
| `nodialog` | zenity/beeep and D-Bus: file dialogs and `Notify` report an error | 40 → 40 MB |

Approximate sizes, Linux amd64 with Go 1.27 and the `examples/counter` app:

| Build | Native |
| --- | ---: |
| default, unstripped | 53 MB |
| default, `-s -w` | 40 MB |
| `noemoji`, `-s -w` | 30 MB |
| all six tags, `-s -w` | **22 MB** |

The wasm numbers are larger because they include the Go runtime and the app's
embedded assets; compare builds of the same app. There is no native
`libwgpu_native.so` in a current build: the renderer talks to Vulkan/DX12/Metal
through `gogpu/wgpu`'s pure-Go backends, so the only runtime libraries are the
display driver and SDL3 itself.

The biggest fixed costs are the Go runtime, the WebGPU binding (`wgpu`, `naga`
and `goffi`), text shaping (`go-text/typesetting`) and the two fonts. A
`noemoji` build is the easiest large cut; the feature tags remove a dependency
each without changing the design.

## Memory

The framework keeps its caches bounded, and three knobs trade memory for
quality:

| Call | Default | What it does |
| --- | --- | --- |
| `app.MSAA(n)` | 4 | multisample count; 1 turns it off. A 4x target costs ~33 MB at 1080p and ~132 MB at 4K, so a low-end or software GPU wants 1 or 2 |
| `app.ImageCache(bytes)` | 64 MB | decoded image LRU. A picture over 2048 px on its longest side is scaled down at load, and the oldest is reloaded from disk when the budget runs out |
| `app.VideoBuffer(bytes)` | 16 MB (32 live) | buffered video frames per player; a 1080p frame is ~8 MB, so this is what a design's `buffer` seconds cost |

The image and glyph atlases start small and grow on demand (512² and 1024²),
so an app that never draws a picture does not pay for a 2048² texture. The
colour emoji font is parsed the first time a glyph needs it, not at startup; a
build with `noemoji` never carries it. Animations are capped at 32 MB each and
count against the image cache, map tiles have their own 32 MB budget, and
rasterized SVG icons have an 8 MB one.

## The design file next to the binary

A program that calls `app.LoadWindowFile("myapp/myapp.goi", ...)` resolves that
path relative to the process's working directory, not to the executable. Ship
the `.goi` files next to the binary and run it from that folder, or pass an
embedded filesystem to `LoadWindow`:

```go
//go:embed myapp.goi
var design embed.FS

win, err := app.LoadWindow(design, "myapp.goi", ui.WithSize(900, 600))
```

Embedding also means hot reload has nothing to watch, so turn it off for a
release build:

```go
win, err := app.LoadWindowFile("myapp/myapp.goi",
	ui.WithHotReload(false),
	ui.WithSize(900, 600),
)
```

## Cross-compiling

Everything is pure Go, so one machine builds every target. The build does not
need the target's C toolchain or SDL3 headers; it only needs the runtime library
where the app will run:

```sh
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -tags nofakecgo ./cmd/myapp
CGO_ENABLED=0 GOOS=darwin  GOARCH=arm64 go build -tags nofakecgo ./cmd/myapp
CGO_ENABLED=0 GOOS=linux   GOARCH=arm64 go build -tags nofakecgo ./cmd/myapp
```

The wasm build swaps the window layer and the WebGPU backend and needs no
display:

```sh
GOOS=js GOARCH=wasm go build -o web/dist/goi.wasm ./cmd/myapp
```

## Checking a build

Two commands catch the mistakes a compile cannot:

```sh
go run github.com/goi-gui/goi/cmd/goicheck@latest -layout myapp/*.goi
go run github.com/goi-gui/goi/cmd/goifmt@latest -l .
```

`goicheck` validates every file and, with `-layout`, renders the layout headlessly
so a node that collapses to zero size is reported. `goifmt -l` lists files that
are not formatted; `-w` rewrites them.

## Troubleshooting

**`libSDL3.so.0: cannot open shared object file` (or `SDL3.dll` not found).**
The runtime library is missing or not on the loader's path. Install the SDL3
runtime package, put `SDL3.dll` next to the executable, or set
`LD_LIBRARY_PATH`/`DYLD_LIBRARY_PATH` to its folder.

**`duplicated definition of symbol _cgo_init`.** The build has cgo on or is
missing `-tags nofakecgo`. Use exactly
`CGO_ENABLED=0 go build -tags nofakecgo`.

**The window is black while resizing on a Wayland session.** SDL 3.4 keeps its
Wayland driver only on a compositor that offers `fifo-v1`, and otherwise
silently falls back to X11 through XWayland, where an interactive resize shows
the window black until the drag ends. goi sets `SDL_HINT_VIDEO_DRIVER=wayland`
itself, so this only appears if `SDL_VIDEODRIVER` is set in the environment.
Unset it, or set it to `wayland`.

**The app starts and exits with `no WebGPU surface for the "…" video driver`.**
SDL picked a driver goi has no surface for — usually `dummy` or `offscreen`
because no display was available.

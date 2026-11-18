---
title: Building
sidebar_label: goi build
---

# goi build

Install the CLI, set up its tools, then build from the project root:

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
goi setup
goi build
```

`goi build` writes:

```text
dist/<os>-<arch>/<name>
```

`<name>` is the `name` in [`goi.yaml`](goi-yaml.md), `<os>` and `<arch>` are the
target platform. The host is the default; `--os` and `--arch` choose another
one. A Windows target gets the `.exe` suffix; every other target does not.

```sh
goi build                              # host
goi build --os windows --arch amd64    # dist/windows-amd64/<name>.exe
goi build --os darwin --arch arm64     # dist/darwin-arm64/<name>
goi build --os linux --arch arm64      # dist/linux-arm64/<name>
```

Every build is **cgo-free on every platform**. The command sets
`CGO_ENABLED=0` and adds `nofakecgo`, which the WebGPU renderer (`goffi`) needs
so it can share purego's fake C runtime instead of shipping a second one. A cgo
build is not supported.

The binary is stripped and reproducible: the command adds `-trimpath` and
`-ldflags "-s -w"`. It also adds `nohotreload`, so the shipped app does not
watch its design files. The tags in `buildFlags` are the only feature tags the
build receives.

## Cross-compiling

Everything is pure Go, so one machine builds every target. The target's C
toolchain, SDL3 headers and `pkg-config` are not needed; only the runtime
library where the app will run is:

```sh
goi build --os windows --arch amd64
goi build --os darwin --arch arm64
goi build --os linux --arch arm64
```

`GOOS` and `GOARCH` in the environment do not choose the target; pass `--os` and
`--arch`, or let them default to the host. The design directory is not copied:
ship the `.goi` files (and any `goi://` assets) next to the binary, or embed
them. See [the design file next to the binary](#the-design-file-next-to-the-binary).

The browser is the one target outside `goi build`: a wasm page swaps the window
layer and the WebGPU backend. See [Browser](browser.md) for that command.

## Platform requirements

The window layer loads the [SDL3](https://libsdl.org) runtime library through
[purego](https://github.com/ebitengine/purego), so the build needs no C compiler,
SDL3 headers or `pkg-config`. The runtime library is required where the app runs.

### Linux

```sh
# Debian/Ubuntu (the runtime package; the -dev package is not needed)
sudo apt install libsdl3-0

# Fedora
sudo dnf install SDL3

# Arch
sudo pacman -S sdl3
```

SDL3 built from source and installed also works.

### macOS

```sh
brew install sdl3
```

### Windows

The executable needs `SDL3.dll` next to it, from the SDL3 release archive or
MSYS2's `mingw-w64-x86_64-sdl3` package. No MSYS2 shell, C toolchain or
`pkg-config` is needed for the build.

`goi doctor` reports the library it finds, the Vulkan loader and the toolchain.

## Features and binary size

The core build is the window, renderer, layout and text. The optional features
are **off unless their tag is given**. Put the tags in `buildFlags`:

```yaml
buildFlags: [emoji, svg, net, dialog]
```

or take every one:

```yaml
buildFlags: [all]
```

For a development run, the separate [`runFlags`](goi-yaml.md#runflags) list is
the one `goi run` uses.

| Tag | Adds |
| --- | --- |
| `emoji` | Noto Color Emoji, about 10.7 MB, for every emoji offline |
| `mermaid` | Pele, resvg and wazero for `Mermaid` diagrams, about 11 MB |
| `code` | Chroma and its regexp engine for a `Code` block's highlighting |
| `net` | `net/http` and TLS: remote `Image`, `SVG` and map tiles |
| `svg` | oksvg/rasterx for `SVG` elements |
| `markdown` | goldmark for `Markdown` documents |
| `dialog` | zenity/beeep and D-Bus for file dialogs and `Notify` |

Without a tag the design still parses: an `SVG` reports an error, `Markdown`
draws nothing, `Code` draws plain text, a remote `Image` fails to fetch, file
dialogs and `Notify` report an error, and `Mermaid` reports that the build has no
renderer. Text falls back to the font's monochrome glyphs when `emoji` is off.

Approximate sizes for `examples/counter`, Linux amd64, Go 1.27, built with
`goi build` (which always passes `-ldflags "-s -w"`):

| Build | Native |
| --- | ---: |
| core, `buildFlags: []` | **26.4 MB** |
| `buildFlags: [all]` | **56.1 MB** |

The per-feature cost of adding one tag to the core build:

| Tag | Binary | Adds |
| --- | ---: | ---: |
| `emoji` | 37.2 MB | +10.7 MB |
| `mermaid` | 37.3 MB | +10.9 MB |
| `code` | 30.3 MB | +3.8 MB |
| `net` | 28.6 MB | +2.1 MB |
| `svg` | 27.6 MB | +1.1 MB |
| `markdown` | 27.3 MB | +0.9 MB |
| `dialog` | 26.8 MB | +0.3 MB |

Without `-s -w`, the core build is 38.7 MB and the `all` build is 74.6 MB.
The wasm numbers are larger because they include the Go runtime and the app's
embedded assets; a wasm build passes `-tags all` if it needs the same features.
The browser never carries Mermaid's wasm rasterizer, so a `Mermaid` there draws
the unsupported-build message even with `all`.

There is no native `libwgpu_native.so` in a current build: the renderer talks to
Vulkan/DX12/Metal through `gogpu/wgpu`'s pure-Go backends, so the only runtime
libraries are the display driver and SDL3 itself.

The biggest fixed costs are the Go runtime, the WebGPU binding (`wgpu`, `naga`
and `goffi`) and text shaping (`go-text/typesetting`). `emoji` and `mermaid` are
the two large optional cuts; neither changes an existing `.goi` file.

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
build without `emoji` never carries it. Animations are capped at 32 MB each and
count against the image cache, map tiles have their own 32 MB budget, and
rasterized SVG icons have an 8 MB one.

## The design file next to the binary

`LoadWindow` resolves the entry against the `ui` directory in `goi.yaml`, or
against the process's working directory when there is no `goi.yaml`. Either way
it reads from where the app runs, not from where the executable sits. Ship the
`.goi` files next to the binary and run it from that folder, or embed them:

```go
//go:embed myapp.goi
var design embed.FS

win, err := app.LoadWindow("myapp.goi",
	ui.WithAssets(design),
	ui.WithSize(900, 600),
)
```

An embedded design has nothing to watch, so hot reload is skipped. A release
build that ships loose files can turn it off:

```go
win, err := app.LoadWindow("myapp.goi",
	ui.WithHotReload(false),
	ui.WithSize(900, 600),
)
```

## Checking a build

Two commands catch the mistakes a compile cannot:

```sh
go run -tags all github.com/goi-gui/goi/cmd/goicheck@latest -layout ui/*.goi
goifmt -l .
```

`goicheck` validates every file and, with `-layout`, renders the layout headlessly
so a node that collapses to zero size is reported. The `all` tag lets the check
measure Markdown, Code and the other optional features; a core build would see a
`Markdown` as an empty box. `goifmt -l` lists files that are not formatted; `-w`
rewrites them. `goifmt` comes from `goi setup`.

## Troubleshooting

**`libSDL3.so.0: cannot open shared object file` (or `SDL3.dll` not found).**
The runtime library is missing or not on the loader's path. Install the SDL3
runtime package, put `SDL3.dll` next to the executable, or set
`LD_LIBRARY_PATH`/`DYLD_LIBRARY_PATH` to its folder. `goi doctor` shows the
library it finds.

**`duplicated definition of symbol _cgo_init`.** A manual `go build` has cgo on
or is missing `-tags nofakecgo`. Use `goi build`, which sets both correctly.

**The window is black while resizing on a Wayland session.** SDL 3.4 keeps its
Wayland driver only on a compositor that offers `fifo-v1`, and otherwise
silently falls back to X11 through XWayland, where an interactive resize shows
the window black until the drag ends. goi sets `SDL_HINT_VIDEO_DRIVER=wayland`
itself, so this only appears if `SDL_VIDEODRIVER` is set in the environment.
Unset it, or set it to `wayland`.

**The app starts and exits with `no WebGPU surface for the "…" video driver`.**
SDL picked a driver goi has no surface for — usually `dummy` or `offscreen`
because no display was available.

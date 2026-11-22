---
title: "Building"
sidebar:
  label: "goi build"
---

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

`<name>` is the `name` in [`goi.yaml`](/guide/goi-yaml/), `<os>` and `<arch>` are the
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
`-ldflags "-s -w"`. A Windows target also gets `-H windowsgui`, so the GUI
subsystem is used and double-clicking the executable does not open a console.

The command declares a `go:embed` for the `assets` directory and registers it,
so the binary is self-contained and does not watch its design files. No `//go:embed`
directive and no hot reload option are needed in the app. Assets reached through
`goi://` are embedded with the design; plain paths still read the process's
working directory. The tags in `buildFlags` are the only feature tags the build
receives; `auto` scans the design and adds the ones it needs before the build,
and prints the resolved list.

## Embedding by hand

`goi build` writes the `go:embed` for you. A manual `go build` can carry the
same assets with `ui.RegisterAssets`:

```go
import "embed"

//go:embed assets
var assets embed.FS

func main() {
	ui.RegisterAssets(assets)
	// ... NewApp and LoadWindow as usual
}
```

`RegisterAssets` is global and is preferred over the `ui` directory in
`goi.yaml`; `LoadWindow` takes only the entry path:

```go
win, err := app.LoadWindow("ui/Main.goi")
if err != nil {
	log.Fatal(err)
}
defer win.Close()
```

An embedded design skips hot reload because there is no directory to watch. For
a design loaded from disk, build with the `nohotreload` tag (or list it in
`runFlags`) when a debugger should not race a reload.

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
`--arch`, or let them default to the host. The design is embedded in every
target, so there is nothing to copy next to the binary.

The browser is a target too:

```sh
goi build --os js --arch wasm    # dist/js-wasm/<name>.wasm
```

The wasm build swaps the window layer and the WebGPU backend and embeds the same
design. See [Browser](/guide/browser/) for the page that loads it, and
[`goi serve`](/guide/browser/#development-server) when the goal is a development
server with hot reload rather than a build.

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

`goi build --os windows` links the GUI subsystem (`-H windowsgui`), so a
double-click does not open a terminal. A GUI binary has no console of its own;
redirect its output if `GOI_DEBUG` logs are wanted without one.

`goi doctor` reports the library it finds, the Vulkan loader and the toolchain.

## Features and binary size

The core build is the window, renderer, layout and text. The optional features
are **off unless their tag is given**. Put the tags in `buildFlags`:

```yaml
buildFlags: [emoji, svg, net]
```

or take every one:

```yaml
buildFlags: [all]
```

For a development run, the separate [`runFlags`](/guide/goi-yaml/#runflags) list is
the one `goi run` uses.

| Tag | Adds |
| --- | --- |
| `emoji` | Noto Color Emoji, about 10.7 MB, for every emoji offline |
| `mermaid` | Pele, resvg and wazero for `Mermaid` diagrams, about 11 MB |
| `code` | Chroma and its regexp engine for a `Code` block's highlighting |
| `net` | `net/http` and TLS: remote `Image`, `SVG` and map tiles |
| `svg` | oksvg/rasterx for `SVG` elements |
| `markdown` | goldmark for `Markdown` documents |
| `terminal` | Maple Mono NF CN, about 20 MB, for the terminal and its CJK text |

Without a tag the design still parses: an `SVG` reports an error, `Markdown`
draws nothing, `Code` draws plain text, a remote `Image` fails to fetch, and
`Mermaid` reports that the build has no renderer. Text falls back to the font's
monochrome glyphs when `emoji` is off. A `Terminal` still works without its
tag, using Roboto Mono; `terminal` embeds the Maple face it uses by default.
File dialogs and `Notify` are always available on the desktop; the browser stubs
them.

Approximate sizes for `examples/counter`, Linux amd64, Go 1.27, built with
`goi build` (which always passes `-ldflags "-s -w"`):

| Build | Native |
| --- | ---: |
| core, `buildFlags: []` | **26.4 MB** |
| `buildFlags: [all]` | **76.8 MB** |

The per-feature cost of adding one tag to the core build:

| Tag | Binary | Adds |
| --- | ---: | ---: |
| `emoji` | 37.2 MB | +10.7 MB |
| `mermaid` | 37.3 MB | +10.9 MB |
| `code` | 30.3 MB | +3.8 MB |
| `net` | 28.6 MB | +2.1 MB |
| `svg` | 27.6 MB | +1.1 MB |
| `markdown` | 27.3 MB | +0.9 MB |
| `terminal` | 47.0 MB | +20.6 MB |

Without `-s -w`, the core build is 38.7 MB and the `all` build is 95.3 MB.
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

## Frame rate

`app.VSync(true)` is the default: the frame loop follows the display refresh.
`app.MaxFPS(n)` caps the drawn frames per second when vsync is off, which is
useful to measure how much headroom an animation leaves. `app.ShowFPS(true)`
draws the current rate in the top-right corner; it is a debug overlay, so leave
it off in a release.

## Checking a build

Two commands catch the mistakes a compile cannot:

```sh
go run -tags all github.com/goi-gui/goi/cmd/goicheck@latest -layout assets/ui/*.goi
goifmt -l .
```

`goicheck` validates every file and, with `-layout`, renders the layout headlessly
so a node that collapses to zero size is reported. The `all` tag lets the check
measure Markdown, Code and the other optional features; a core build would see a
`Markdown` as an empty box. `goifmt -l` lists files that are not formatted; `-w`
rewrites them. `goifmt` comes from `goi setup`.

## Troubleshooting

The common failures — a missing SDL3 library, cgo symbols, a black Wayland
resize and a missing WebGPU surface — are collected on
[Troubleshooting](/guide/troubleshooting/).

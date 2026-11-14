---
title: Building
sidebar_label: Building
---

# Building

A goi app is one ordinary Go program, so `go build` is the whole build. What
differs per platform is the window layer: it is cgo over [SDL3](https://libsdl.org),
so each target needs a C compiler, `pkg-config` and SDL3's development files.
Everything else — the parser, layout, paint list, text and the WebGPU renderer —
is pure Go.

There is no build tag to pick a platform. `platform.SurfaceHandles` asks SDL
which video driver it got and hands the renderer the matching native handle, so
one code path covers all four:

| Driver | Native handles | Renderer backend |
| --- | --- | --- |
| `wayland` | `wl_display`, `wl_surface` | Vulkan |
| `x11` | X11 `Display`, `Window` | Vulkan |
| `windows` | `HINSTANCE`, `HWND` | Direct3D 12 |
| `cocoa` | `CAMetalLayer` | Metal |

No GPU SDK is needed beyond the display driver: the backends come from
[`gogpu/wgpu`](https://github.com/gogpu/wgpu) and are pure Go.

## Linux

Install SDL3 and a toolchain:

```sh
# Debian/Ubuntu
sudo apt install build-essential pkg-config libsdl3-dev

# Fedora
sudo dnf install gcc pkgconf-pkg-config SDL3-devel

# Arch
sudo pacman -S base-devel pkgconf sdl3
```

Then build with the internal linker:

```sh
go build -ldflags=-linkmode=internal -o myapp ./cmd/myapp
```

`-ldflags=-linkmode=internal` is not optional on Linux. goffi, which the
renderer uses for its Vulkan calls, relies on `cgo_import_dynamic`, and the
external linker that cgo selects by default rejects that combination. Every
other platform links normally.

## macOS

```sh
brew install sdl3
go build -o myapp ./cmd/myapp
```

Homebrew installs `sdl3.pc` into `$(brew --prefix)/lib/pkgconfig`, which
`pkg-config` already searches on Apple silicon and Intel Homebrew prefixes.

## Windows

cgo needs a C toolchain and `pkg-config`, which MSYS2 provides. From an
**MSYS2 MINGW64** shell:

```sh
pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-pkgconf mingw-w64-x86_64-sdl3
go build -o myapp.exe ./cmd/myapp
```

Run `go build` from that shell so `gcc` and `pkg-config` are on `PATH`; a
plain `cmd.exe` window will not find them.

A GUI app usually should not open a console window:

```sh
go build -ldflags="-H windowsgui" -o myapp.exe ./cmd/myapp
```

## Smaller binaries

A release build usually wants `-s -w`: it drops the symbol table and DWARF
debug info, which is about 13 MB on a Linux amd64 build of the `hello` example.

The colour emoji font is the single largest embedded asset. It is Noto Color
Emoji, about 10.7 MB, and it is what makes every emoji render offline. A build
that does not need colour emoji can leave it out:

```sh
go build -tags noemoji -ldflags="-s -w" -o myapp ./cmd/myapp
```

In a `noemoji` build, text falls back to the font's monochrome glyphs where
they exist. The flag is independent of the platform and works in a wasm build too.

Approximate sizes, Linux amd64 with Go 1.27 and the `examples/hello` app:

| Build | Native | Browser wasm |
| --- | ---: | ---: |
| default, unstripped | 53 MB | — |
| default, `-s -w` | 40 MB | 54 MB |
| `-tags noemoji`, `-s -w` | **30 MB** | **44 MB** |
| a minimal window, `-s -w` | 20 MB | 27 MB |

The wasm numbers include the Go runtime and the app's embedded assets, so they
are larger than the native build; compare builds of the same app. A native
`libwgpu_native.so` is a separate 9 MB file on disk, not part of the binary.

The biggest fixed costs are the Go runtime, the WebGPU binding (`wgpu`, `naga`
and `goffi`), text shaping (`go-text/typesetting`) and the two fonts. Removing
Mermaid from an app that used it saved another 7 MB on the native probe and a
much larger amount in wasm, because it brought its own SVG rasterizer and wasm
runtime.

### Purego and cgo-free builds

The same app builds without cgo. The platform layer then loads `libSDL3` through
[purego](https://github.com/ebitengine/purego) instead of linking it:

```sh
CGO_ENABLED=0 go build -tags nofakecgo -o myapp ./cmd/myapp
```

- **`CGO_ENABLED=0`** picks the purego window backend automatically.
- **`-tags nofakecgo`** is required because the WebGPU renderer (`goffi`) and
  purego each ship their own fake C runtime; without the tag the linker sees two
  `_cgo_init`/`dlopen` implementations. `nofakecgo` tells goffi to use purego's
  copy, and the single runtime serves both.
- The target needs SDL3 as a **runtime** shared library (`libSDL3.so.0`, 
  `SDL3.dll` or `libSDL3.dylib`), but not its development headers or
  `pkg-config`.
- Linux, Windows and macOS (amd64 and arm64) are build-tested this way. macOS
  gets its Metal layer through `SDL_Metal_*` loaded by purego.
- The binary is roughly the same size as the cgo build; what disappears is the
  C toolchain and SDL development package requirement, not the SDL runtime.

A purego build of the `hello` example is about 54 MB unstripped (53 MB with
cgo), and `-tags noemoji -ldflags="-s -w"` brings it to about 31 MB.

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

The packages above `internal/platform` have no cgo, so they cross-compile as
they are — useful for `go vet`, for the formatter and checker, and for anything
that does not open a window:

```sh
CGO_ENABLED=0 GOOS=windows go build ./internal/...
CGO_ENABLED=0 GOOS=darwin  go build ./internal/...
```

The purego platform cross-compiles a full app: `CGO_ENABLED=0` does not ask the
target for a C toolchain or SDL3 headers, only for the runtime library at run
time.

```sh
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -tags nofakecgo ./cmd/myapp
CGO_ENABLED=0 GOOS=darwin  GOARCH=arm64 go build -tags nofakecgo ./cmd/myapp
```

The cgo platform still cannot be cross-compiled with the stock toolchain: it
needs the target's SDL3 headers and a C compiler for that target. Build cgo
binaries on each platform — what goi's own CI does, with SDL3 built from source
on Linux, Homebrew on macOS and MSYS2 on Windows.

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

**The window is black while resizing on a Wayland session.** SDL 3.4 keeps its
Wayland driver only on a compositor that offers `fifo-v1`, and otherwise
silently falls back to X11 through XWayland, where an interactive resize shows
the window black until the drag ends. goi sets `SDL_HINT_VIDEO_DRIVER=wayland`
itself, so this only appears if `SDL_VIDEODRIVER` is set in the environment.
Unset it, or set it to `wayland`.

**`package sdl3 was not found in the pkg-config search path`.** SDL3 is missing
or its `.pc` file is not on the search path. On macOS with a non-standard prefix
set `PKG_CONFIG_PATH=$(brew --prefix)/lib/pkgconfig`; on Windows make sure you
are in an MSYS2 MINGW64 shell.

**`invalid instruction` or `unexpected reloc` from the linker on Linux.** The
external linker is being used. Add `-ldflags=-linkmode=internal`.

**The app starts and exits with `no WebGPU surface for the "…" video driver`.**
SDL picked a driver goi has no surface for — usually `dummy` or `offscreen`
because no display was available.

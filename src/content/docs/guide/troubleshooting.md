---
title: "Troubleshooting"
sidebar:
  label: "Troubleshooting"
---

Start with `goi doctor`: it checks the Go toolchain, the `goi`/`goipls`/`goifmt`
versions, the SDL3 runtime library, the GPU backend and the optional tools. Most
startup failures are one missing row in that report.

## Build and start

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

**`goi run` says the project has no `goi.yaml` or `main.go`.** Run it from the
project root, next to `goi.yaml`, and make sure the `entrypoint` names the
directory that holds `main.go` (usually `cmd`). See
[goi.yaml](/guide/goi-yaml/).

## Design and layout

**A `.goi` file reports `unknown property "…"`.** The property belongs to a
different element, or it is a common property misnamed on a component. The
[component page](/components/) lists the properties that element adds; the
[common properties](/guide/common-properties/) page lists the box. `goicheck`
prints the line and the component name.

**A component is visible but has zero size.** `goicheck -layout` renders the
design headlessly and reports a node that collapses. A `Row` or `Column` child
usually needs a `width`/`height`, a `flex`, or a parent that gives it room. See
[Checking a build](/guide/build/#checking-a-build).

**An asset works in `goi run` but is missing in `goi build`.** A plain path is
read from the process's working directory; only `goi://` paths and files under
`assets` are embedded. Use a `goi://` src, or embed the file yourself with
[RegisterAssets](/guide/build/#embedding-by-hand).

**Hot reload does not pick up a change.** `goi run` watches the `assets`
directory, not arbitrary Go files. A `Bind` value is rebuilt on every reload, so
app state must live outside `Bind`; if the window still shows old data, check
that the `.goi` file is under the configured `assets` directory.

## Runtime

**File dialogs fail on Linux.** They need `zenity`, `matedialog` or `qarma` on
`PATH`. `ui.DialogsAvailable()` and `goi doctor` show whether one was found; see
[File dialogs](/system/file-dialogs/).

**Audio or video does not play.** Install `ffmpeg`, or point `GOI_FFMPEG` at the
binary. `ui.MediaAvailable()` and `ui.MediaError(player)` report what was tried;
see [Audio](/components/audio/#requirements) and
[Video](/components/video/#requirements).

**A terminal shows boxes for CJK text.** The `terminal` tag embeds Maple Mono NF
CN, which covers CJK; without the tag the terminal falls back to Roboto Mono,
which does not. Add `terminal` to `buildFlags` (or use `all`), or name a CJK
font the app loads with `fontFamily`. See [Terminal](/components/terminal/).

**The framework is silent, or too loud.** `GOI_DEBUG=TRUE` turns its startup and
reload lines on, `DEBUG_UI=TRUE` logs input events, and `ui.SetLogger` sends them
to your logger. See [Development logs](/guide/run/#development-logs).


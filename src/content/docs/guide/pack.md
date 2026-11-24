---
title: "Packaging"
sidebar:
  label: "goi pack"
---

`goi pack` builds the app for Linux and wraps it in an [AppImage](https://appimage.org/):
one executable file a user downloads, marks executable and runs, on any desktop
distribution.

```sh
goi pack
# goi: packed dist/linux-amd64/myapp-x86_64.AppImage
```

It builds the same binary [`goi build`](/guide/build/) writes, then assembles an
AppDir around it:

```text
dist/linux-<arch>/
├── <name>                        (the plain build, as goi build writes it)
└── <name>-<x86_64|aarch64>.AppImage
```

The AppImage holds:

```text
AppRun                            starts usr/bin/<name>
<id>.desktop                      the desktop entry, Exec and Icon point at <name> and <id>
<id>.png                          the icon, also linked as .DirIcon
usr/bin/<name>                    the app
usr/bin/libSDL3.so.0              the SDL3 runtime found on this machine
```

`<name>` and `<id>` come from [`goi.yaml`](/guide/goi-yaml/), so both have to be
plain names (letters, digits, `.`, `_`, `-`). `id` is required: it names the
desktop entry and the icon a desktop environment installs.

## The icon

`goi pack` needs a PNG. It uses, in order:

1. `--icon PATH`
2. `icon:` in `goi.yaml`
3. `assets/icon.png`
4. `assets/images/icon.png`
5. `assets/images/<name>.png`

A 256×256 or larger square icon looks right in app menus; a smaller one packs
with a warning. Names 1 and 2 are resolved against the project root, the rest
against the `assets` directory.

## SDL3

The Go binary is static, so the SDL3 runtime is the one thing a target machine
may lack. `goi pack` copies the library `goi doctor` finds on the build machine
next to the binary, where the loader looks first.

- `--sdl PATH` bundles a specific `libSDL3.so.0` instead.
- `--no-sdl` leaves it out; the target system then has to install SDL3 itself.
- `--arch arm64` on an amd64 machine still builds a valid image, but the host
  library cannot be bundled; the command warns and expects `--sdl` with a target
  library.

The image inherits the C library and Wayland/X11 libraries of the machine that
built it, because the bundled `libSDL3.so.0` was compiled there. Package on the
oldest distribution you support, which is the usual AppImage rule.

## appimagetool

The last step is [appimagetool](https://github.com/AppImage/appimagetool). `goi
pack` uses, in order:

1. `--appimagetool PATH`
2. `GOI_APPIMAGETOOL`
3. `appimagetool` on `PATH`
4. a pinned download (`1.9.1`, checksum verified) into the user cache, used by
   every later pack

The first pack therefore needs network access twice: for the tool, and for the
AppImage runtime that appimagetool fetches. Later packs reuse both. A machine
without network can install appimagetool itself and point at it with
`--appimagetool`.

## Flags

```sh
goi pack                              # host architecture
goi pack --arch arm64                 # dist/linux-arm64/<name>-aarch64.AppImage
goi pack --icon art/logo.png
goi pack --sdl /usr/lib/libSDL3.so.0
goi pack --no-sdl                     # system-provided SDL3
goi pack --appimagetool ~/bin/appimagetool
goi pack --keep-appdir                # leave the assembled AppDir for inspection
```

`--os` defaults to the host. Only Linux is implemented: macOS `.app` bundles and
Windows installers come later, and the command says so instead of writing a
half-package.

## Running the result

```sh
chmod +x myapp-x86_64.AppImage
./myapp-x86_64.AppImage
```

Desktop integration (menu entry, icon) is done by the desktop's AppImage
integration, or by extracting the image and copying the `.desktop` file and
icon into place. The image is not signed and carries no update information, so
updates are another download.

## What is not packed

The design files, fonts and other assets are already embedded in the binary by
[`goi build`](/guide/build/), so the AppImage does not ship the `assets`
directory. The GPU drivers stay with the system: the app uses Vulkan (or a
software fallback) through the driver that is installed.

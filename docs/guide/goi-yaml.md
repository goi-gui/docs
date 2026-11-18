---
title: goi.yaml
sidebar_label: goi.yaml
---

# goi.yaml

`goi.yaml` is the project file `goi init` writes and every command reads. It
names the app, chooses the design directory and the entrypoint package, and sets
the tags for a run and a build.

```yaml
# Application name and id, used by goi build and packaging.
name: myapp
id: com.example.myapp

# Build tags passed to goi run. nofakecgo and CGO_ENABLED=0 are always
# used; all turns on every optional feature.
runFlags: [all]

# Build tags passed to goi build.
buildFlags: [all]

# Where LoadWindow finds the design files.
ui: ui

# Directory goi run and goi build execute.
entrypoint: cmd
```

Every key is optional except `name` when `goi build` is used. The generated file
writes them all so the layout is visible.

## `name`

The executable name [`goi build`](build.md) writes. It must be a file name, not a
path; a Windows target gets `.exe` appended by the command.

## `id`

The application's reverse-DNS identity, such as `com.example.myapp`. It is a
stable identity for packaging and platform integration; the build commands do
not derive paths from it.

## `runFlags`

The build tags for [`goi run`](run.md). It defaults to `[all]` when the key is
missing, and `[]` keeps the core build:

```yaml
runFlags: [emoji, svg, net]
runFlags: []
```

## `buildFlags`

The build tags for [`goi build`](build.md). It defaults to `[all]` when the key
is missing. It is separate from `runFlags`, so a development run can enable a
feature that a release build leaves out, or the other way round:

```yaml
runFlags: [all]
buildFlags: [emoji, svg, net, dialog]
```

`buildFlags` is not read by `goi run`; `runFlags` is not read by `goi build`.
Both commands always add `nofakecgo` and set `CGO_ENABLED=0`.

The values are the optional feature tags:

| Tag | Adds |
| --- | --- |
| `emoji` | Noto Color Emoji for every emoji offline |
| `mermaid` | the Mermaid renderer |
| `code` | syntax highlighting in `Code` |
| `net` | remote `Image`, `SVG` and map tiles |
| `svg` | `SVG` elements |
| `markdown` | `Markdown` documents |
| `dialog` | file dialogs and `Notify` |
| `all` | every one of the above |

A tag can also be a space- or comma-separated group inside one entry
(`"emoji svg"`), which is useful when a flag list comes from a script.

## `ui`

The one directory holding the `.goi` files, relative to `goi.yaml`. It defaults
to `ui`. The entry file is not configuration: the program names it, and it is
resolved inside `ui`:

```go
win, err := app.LoadWindow("Main.goi")
```

Without a `goi.yaml`, such as a single-file program, the entry is resolved from
the working directory instead. `LoadWindow` takes the usual options; hot reload
is on by default and `ui.WithHotReload(false)` turns it off. A design embedded
in the binary, usually for a wasm build, is loaded with `ui.WithAssets(fsys)`.

Asset paths that start with `goi://` resolve against this directory. Plain
paths resolve against the process's working directory, which is also where
`goi run` starts the app.

## `entrypoint`

The Go package directory [`goi run`](run.md) and [`goi build`](build.md)
execute. It defaults to `cmd`. Changing it to `app` moves the package, and the
commands follow; `<entrypoint>/main.go` is the file they look for.

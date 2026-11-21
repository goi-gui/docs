---
title: "goi.yaml"
---

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

# Where LoadWindow finds the design files and their assets.
assets: assets

# Directory goi run and goi build execute.
entrypoint: cmd
```

Every key is optional except `name` when `goi build` is used. The generated file
writes them all so the layout is visible.

## `name`

The executable name [`goi build`](/guide/build/) writes. It must be a file name, not a
path; a Windows target gets `.exe` appended by the command.

## `id`

The application's reverse-DNS identity, such as `com.example.myapp`. It is a
stable identity for packaging and platform integration; the build commands do
not derive paths from it.

## `runFlags`

The build tags for [`goi run`](/guide/run/). It defaults to `[all]` when the key is
missing, and `[]` keeps the core build:

```yaml
runFlags: [emoji, svg, net]
runFlags: []
```

## `buildFlags`

The build tags for [`goi build`](/guide/build/). It defaults to `[all]` when the key
is missing. It is separate from `runFlags`, so a development run can enable a
feature that a release build leaves out, or the other way round:

```yaml
runFlags: [all]
buildFlags: [emoji, svg, net]
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
| `all` | every one of the above |

A tag can also be a space- or comma-separated group inside one entry
(`"emoji svg"`), which is useful when a flag list comes from a script.

### `auto`

`auto` scans every `.goi` file under `assets` and adds the feature tags the
design actually uses. It only manages the feature tags below, so flags of your
own stay where they are:

```yaml
runFlags: [auto, abc, myflag]
buildFlags: [auto, abc, myflag]
```

| Found in a design | Tag |
|---|---|
| `SVG` | `svg` |
| `Mermaid` | `mermaid` |
| `Markdown` | `markdown` |
| `Code` | `code` |
| `Map`, or an `http(s)://` URL | `net` |
| an emoji in any `.goi` string | `emoji` |

`auto` also drops a stale managed tag when the design stops using it. File
dialogs and `Notify` no longer have a tag: they are part of every desktop build.
A tag you write yourself that is not one of the managed features (`abc`,
`myflag`, `nohotreload`, …) is always kept. An old `dialog` entry is ignored.

`all` wins over `auto`: it already turns every feature on, so the design is not
scanned and the custom tags are kept.

With `auto`, `goi build` scans before it builds. `goi run` keeps scanning while
it runs: when a saved `.goi` changes which features are needed, it stops `go run`
and starts it again with the new tags. The first run and every restart print
the resolved tags, with `all` expanded:

```text
goi: run tags: mermaid, abc, myflag
```

Without `auto`, the flags are used as written and the same line prints them.

## `assets`

The one directory holding the designs and their assets, relative to `goi.yaml`.
It defaults to `assets`. The `.goi` files live in its `ui/` subdirectory, while
`goi://` assets can sit anywhere under it:

```text
assets/
├── ui/
│   └── Main.goi
└── images/
    └── cover.png
```

The entry file is not configuration: the program names it, and it is resolved
inside `assets`:

```go
win, err := app.LoadWindow("ui/Main.goi")
```

Without a `goi.yaml`, such as a single-file program, the entry is resolved from
the working directory instead. The container is automatic: `goi run` reads the
`assets` directory, and `goi build` declares a `go:embed` for it and reads the
embedded copy. No Go call chooses between them.

Asset paths that start with `goi://` resolve against the `assets` directory, so
`goi://images/cover.png` is `assets/images/cover.png`. Imports use the same
scheme: `import "goi://shared/Other.goi"` names a fragment from every file, while
a plain path stays relative to the importing file. Plain image paths resolve
against the process's working directory, which is also where `goi run` starts
the app. The editor's auto import searches this directory, and its path
completion offers container paths from it.

## `entrypoint`

The Go package directory [`goi run`](/guide/run/) and [`goi build`](/guide/build/)
execute. It defaults to `cmd`. Changing it to `app` moves the package, and the
commands follow; `<entrypoint>/main.go` is the file they look for.

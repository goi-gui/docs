---
title: "Assets"
---

A project has one asset container: the directory `goi.yaml` names with
`assets`, usually `assets/`. The design entry (`ui/Main.goi`), its fragments,
fonts, images, SVG files, audio and captions all live under it.

```yaml
# goi.yaml
assets: assets
```

```text
myapp/
  goi.yaml
  cmd/main.go
  assets/
    ui/Main.goi
    ui/Sidebar.goi
    images/logo.png
    fonts/Nunito.ttf
```

A path that starts with `goi://` always means the container root:

```goi
Image {
	src: "goi://images/logo.png"
}
```

That is `assets/images/logo.png` in development and the embedded copy in a
build. A plain path is not a container path, and the rule depends on where it is
written:

| Written in | A plain path means |
|---|---|
| an `import` | relative to the importing file |
| an `Image`, `SVG`, `Audio` or `Video` `src` | the process's working directory, or an absolute path |
| `LoadFont` / `LoadFontFamily` | relative to the `assets` container |
| `LoadWindow` | relative to the `assets` container |

Use `goi://` for a bundled file in a `.goi` `src`; a plain path there is how an
app plays a file the user picked. See
[Image](/components/image/#where-a-src-points) and
[Fragments](/guide/fragments/) for the import rule.

## Development and build

`goi run` reads the container from disk, so a changed file is picked up by hot
reload. `goi build` embeds the whole container in the binary and registers it
with `goi://`, so a shipped app needs no asset folder.

A plain path is still read from the process's working directory in a build; a
`goi://` path and every file under `assets` are the embedded copies. Prefer
`goi://` for anything the app needs at runtime.

An app that builds without `goi build` can register the same container itself;
see [Embedding by hand](/guide/build/#embedding-by-hand).

## Picked files

A file the user chooses with a file dialog gets a `goi://picked/…` source, which
every image, media and caption reader understands. The prefix is
`ui.PickPrefix`. A picked file lives for the session; it is not written into the
assets container. See [Picking a file](/guide/browser/#picking-a-file) and
[File dialogs](/system/file-dialogs/).

## Fonts

A font is a normal asset: `app.LoadFont("Nunito", "fonts/Nunito.ttf")` reads
`assets/fonts/Nunito.ttf` in development and the embedded copy in a build. See
[Fonts](/guide/fonts/).

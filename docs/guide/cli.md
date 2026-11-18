---
title: The goi command
sidebar_label: CLI
---

# The goi command

`goi` starts a project and runs it with the features the project asks for.

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
```

## Start a project

```sh
mkdir hello
cd hello
goi init example.com/hello
```

It writes:

```text
hello/
├── cmd/
│   └── main.go
├── go.mod
├── go.sum
├── goi.yaml
└── ui/
    └── Main.goi
```

`cmd/main.go` calls `app.LoadWindowFromConfig()`. The method reads the design
location from `goi.yaml`, loads it with `ui.DirFS` and turns hot reload on, so
editing `ui/Main.goi` updates the open window. `Main.goi` is a centred
"Hello, world!" — the smallest complete design.

`init` runs `go mod init` and then `go mod tidy`, so the new module has the goi
dependency and a `go.sum`. If the machine is offline, the files are still
written and tidy can be run later.

## `goi.yaml`

```yaml
# Feature tags passed to goi run. nofakecgo and CGO_ENABLED=0 are always used.
# Add emoji, svg, mermaid, markdown, code, net, dialog, or all.
extensions: []

# Where LoadWindowFromConfig finds the design and which file is the entry.
ui: [ui]
entry: Main.goi
```

`extensions` is a list of build tags. `goi run` always adds `nofakecgo` and sets
`CGO_ENABLED=0`; the entries in the list add optional features:

```yaml
extensions: [emoji, svg, net, dialog]
```

Use `all` to turn every optional feature on. A tag can also be a space- or
comma-separated group inside one entry (`"emoji svg"`). The features and their
cost are described in [Building](build.md#features-and-binary-size).

`ui` is optional and defaults to `[ui]`; `entry` defaults to `Main.goi`. More
than one directory is an overlay: files are looked up in order, and hot reload
watches every one. `LoadWindowFromConfig` reads `ui.yaml` after `goi.yaml` when
it exists, so a project can keep the design settings in a separate file; a
`ui.yaml` only overrides the `ui` and `entry` fields it writes.

`LoadWindowFromConfig` takes the usual options. Hot reload is on by default;
`ui.WithHotReload(false)` turns it off. The generated `cmd/main.go` uses the
defaults:

```go
win, err := app.LoadWindowFromConfig()
```

## Run a project

```sh
goi run
```

`run` loads `goi.yaml` from the project root, composes

```text
go run -tags nofakecgo,<extensions...> ./cmd
```

with `CGO_ENABLED=0`, and leaves the program's output and exit status alone.
It expects `cmd/main.go`; a project without one or without a `goi.yaml` gets a
hint from the command.

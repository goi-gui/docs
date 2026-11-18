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

`cmd/main.go` calls `app.LoadWindow("Main.goi")`. The method reads the `ui`
directory from `goi.yaml` and resolves the entry inside it, so the file it opens
is `ui/Main.goi`. Hot reload is on by default, so editing that file updates the
open window. `Main.goi` is a centred "Hello, world!" — the smallest complete
design.

`init` runs `go mod init` and then `go mod tidy`, so the new module has the goi
dependency and a `go.sum`. If the machine is offline, the files are still
written and tidy can be run later.

## `goi.yaml`

```yaml
# Build tags passed to goi run. nofakecgo and CGO_ENABLED=0 are always used.
# all turns on every optional feature: emoji, svg, mermaid, markdown, code,
# net and dialog.
buildFlags: [all]

# Where LoadWindow finds the design files.
ui: ui
```

`buildFlags` is a list of build tags. It defaults to `[all]` when the key is
missing, and the generated file writes that value. `goi run` always adds
`nofakecgo` and sets `CGO_ENABLED=0`; the entries in the list add optional
features:

```yaml
buildFlags: [emoji, svg, net, dialog]
```

`all` turns every optional feature on. To keep only the core build, write
`buildFlags: []`. A tag can also be a space- or comma-separated group inside one
entry (`"emoji svg"`). The features and their cost are described in
[Building](build.md#features-and-binary-size).

`ui` is the one directory holding the `.goi` files, relative to `goi.yaml`. It
defaults to `ui` when the key is missing. The entry file is not configuration:
the program names it, and it is resolved inside `ui`:

```go
win, err := app.LoadWindow("Main.goi")
```

Without a `goi.yaml`, such as a single-file example, the entry is resolved from
the working directory instead. `LoadWindow` takes the usual options; hot reload
is on by default and `ui.WithHotReload(false)` turns it off. A design embedded
in the binary, usually for a wasm build, is loaded with `ui.WithAssets(fsys)`.

## Run a project

```sh
goi run
```

`run` loads `goi.yaml` from the project root, composes

```text
go run -tags nofakecgo,<buildFlags...> ./cmd
```

with `CGO_ENABLED=0`, and leaves the program's output and exit status alone.
It expects `cmd/main.go`; a project without one or without a `goi.yaml` gets a
hint from the command.

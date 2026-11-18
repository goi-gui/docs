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
├── go.mod
├── go.sum
├── goi.yaml
├── main.go
└── ui/
    └── Main.goi
```

`main.go` loads the `ui` directory with `ui.DirFS` and
`ui.WithHotReload(true)`, so editing `ui/Main.goi` updates the open window.
`Main.goi` is a centred "Hello, world!" — the smallest complete design.

`init` runs `go mod init` and then `go mod tidy`, so the new module has the goi
dependency and a `go.sum`. If the machine is offline, the files are still
written and tidy can be run later.

## `goi.yaml`

```yaml
# Feature tags passed to goi run. nofakecgo and CGO_ENABLED=0 are always used.
# Add emoji, svg, mermaid, markdown, code, net, dialog, or all.
extensions: []
```

`extensions` is a list of build tags. `goi run` always adds `nofakecgo` and sets
`CGO_ENABLED=0`; the entries in the list add optional features:

```yaml
extensions: [emoji, svg, net, dialog]
```

Use `all` to turn every optional feature on. A tag can also be a space- or
comma-separated group inside one entry (`"emoji svg"`). The features and their
cost are described in [Building](build.md#features-and-binary-size).

## Run a project

```sh
goi run .
goi run path/to/project
goi run path/to/project/main.go
```

`run` loads `goi.yaml` from the project directory, composes

```text
go run -tags nofakecgo,<extensions...> .
```

with `CGO_ENABLED=0`, and leaves the program's output and exit status alone.
Without a `goi.yaml` it stops and asks for `goi init`.

---
title: The goi command
sidebar_label: CLI
---

# The goi command

`goi` starts, runs and builds goi projects with the features the project asks
for.

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
```

## Start a project

```sh
mkdir hello
cd hello
goi init --name hello --id com.example.hello --module example.com/hello
```

`init` writes:

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

The flags are optional. Run `goi init` without them and the command asks for the
missing values in the terminal:

| Flag | Asks for | Example |
| --- | --- | --- |
| `--name` | the application and executable name | `myapp` |
| `--id` | a reverse-DNS application id | `com.example.myapp` |
| `--module` | the Go module path for `go mod init` | `github.com/you/myapp` |
| `--ui` | the directory holding the `.goi` files | `ui` |

Only the values a flag did not give are asked for, so
`goi init --name myapp` prompts for the id and the module. `--ui` defaults to
`ui`. This makes the fully flagged form safe for a script and the bare form
friendly for a first project.

`cmd/main.go` calls `app.LoadWindow("Main.goi")`. The method reads the `ui`
directory from `goi.yaml` and resolves the entry inside it, so the file it opens
is `ui/Main.goi`. Hot reload is on by default, so editing that file updates the
open window. `Main.goi` is a centred "Hello, world!" — the smallest complete
design.

`init` runs `go mod init` with the module flag and then `go mod tidy`, so the new
module has the goi dependency and a `go.sum`. If the machine is offline, the
files are still written and tidy can be run later.

## `goi.yaml`

```yaml
# Application name and id, used by goi build and packaging.
name: myapp
id: com.example.myapp

# Build tags passed to goi run and goi build. nofakecgo and
# CGO_ENABLED=0 are always used; all turns on every optional feature.
buildFlags: [all]

# Where LoadWindow finds the design files.
ui: ui

# Directory goi run and goi build execute.
entrypoint: cmd
```

`name` is the executable name `goi build` writes. `id` is the application's
reverse-DNS id; it is the app's identity rather than a build setting. Both lead
the file because they name the project.

`buildFlags` is a list of build tags. It defaults to `[all]` when the key is
missing, and the generated file writes that value. `goi run` and `goi build`
always add `nofakecgo` and set `CGO_ENABLED=0`; the entries in the list add
optional features:

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

`entrypoint` is the Go package directory `goi run` and `goi build` execute. It
defaults to `cmd`, and the generated project writes it out so the layout is
visible. Changing it to `app` moves the package and the commands follow it.

## Run a project

```sh
goi run
```

`run` loads `goi.yaml` from the project root, composes

```text
go run -tags nofakecgo,<buildFlags...> ./<entrypoint>
```

with `CGO_ENABLED=0`, and leaves the program's output and exit status alone.
The caller's environment is forwarded to `go`; only `CGO_ENABLED` is replaced.
Hot reload stays on. It expects `<entrypoint>/main.go`; a project without one or
without a `goi.yaml` gets a hint from the command.

## Build a project

```sh
goi build
```

`build` writes the executable to

```text
dist/<os>-<arch>/<name>
```

where `<os>` and `<arch>` are the running system and `<name>` is the `name` in
`goi.yaml`. It builds for the host: `GOOS` and `GOARCH` from the environment are
ignored, so a cross target needs a direct `go build`. A Windows host gets the
`.exe` suffix; every other host does not.

The binary is stripped and reproducible: the command adds `-trimpath` and
`-ldflags "-s -w"`. It compiles the package named by `entrypoint` with the same
tags as `run`, plus `nohotreload`, so the binary does not watch its design
files. `nofakecgo` and `CGO_ENABLED=0` are still applied.

## Set up the tools

```sh
goi setup
```

It installs the Go-side CLI tools a goi project uses:

```text
go install github.com/goi-gui/goi/cmd/goipls@latest
go install github.com/goi-gui/goi/cmd/goifmt@latest
```

`goipls` is the editor language server and `goifmt` is the design-file
formatter. `setup` leaves the project's `go.mod` alone; use `goi update` when the
goi dependency should move too.

## Update the tools

```sh
goi update
```

It runs, in order:

```text
go get github.com/goi-gui/goi@latest
go install github.com/goi-gui/goi/cmd/goipls@latest
go install github.com/goi-gui/goi/cmd/goifmt@latest
```

The first updates the goi dependency in the current module, so the project
builds against the newest release. The two installs put the language server and
the formatter in `GOBIN`. The `goi` binary itself is a separate install:

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
```

## Check the setup

```sh
goi doctor
```

It prints the OS and architecture, the distribution and kernel when available,
the Go toolchain and `CGO_ENABLED`, the `goi`, `goipls` and `goifmt` versions,
the SDL3 runtime library, the Vulkan loader and its ICDs, and the optional
`ffmpeg` and `git` tools. A row is `ok`, `missing` or `optional`; the command
still exits successfully when an optional tool is absent.

A desktop build needs Go, SDL3 and a GPU backend: Vulkan on Linux and Windows,
Metal on macOS. `SDL3` is loaded at run time, not linked, which is why the doctor
looks for the shared library rather than a compiler or development package.

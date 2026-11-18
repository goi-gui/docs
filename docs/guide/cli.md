---
title: The goi command
sidebar_label: CLI
---

# The goi command

`goi` creates, runs, builds and checks a goi project.

## Install

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
goi setup
```

`goi setup` installs the two Go-side tools a project uses:

- `goipls`, the language server for editors
- `goifmt`, the `.goi` formatter

Run `goi setup` once on a new machine. It does not touch a project; the design
settings live in [`goi.yaml`](goi-yaml.md). `goi update` later refreshes the
project's goi dependency and both tools.

## Commands

| Command | Does |
| --- | --- |
| [`goi init`](init.md) | create a project with `cmd/main.go`, `goi.yaml` and `ui/Main.goi` |
| [`goi run`](run.md) | run the entrypoint package with hot reload and `runFlags` |
| [`goi build`](build.md) | build `dist/<os>-<arch>/<name>` with `buildFlags` |
| `goi setup` | install `goipls` and `goifmt` |
| `goi update` | update the goi dependency, `goipls` and `goifmt` |
| `goi doctor` | show the toolchain, SDL3, Vulkan and the companion tools |

The CLI is a cobra tree: `goi --help`, `goi <command> --help` and shell
completion work as usual.

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

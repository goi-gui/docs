---
title: "The goi command"
sidebar:
  label: "CLI"
---

`goi` creates, runs, builds and checks a goi project.

## Install

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
goi setup
```

`goi setup` installs the CLI and the two Go-side tools a project uses:

- `goi`, the command itself
- `goipls`, the language server for editors
- `goifmt`, the `.goi` formatter

Run `goi setup` once on a new machine. Inside a Go module it also bumps the
project's goi dependency; `goi update` is the same command under the other name.
The design settings live in [`goi.yaml`](/guide/goi-yaml/).

## Commands

| Command | Does |
| --- | --- |
| [`goi init`](/guide/init/) | create a project with `cmd/main.go`, `goi.yaml` and the `hello` example under `assets/` |
| [`goi run`](/guide/run/) | run the entrypoint package with hot reload and `runFlags` |
| [`goi build`](/guide/build/) | build `dist/<os>-<arch>/<name>` with `buildFlags` |
| `goi setup` / `goi update` | install goi, `goipls` and `goifmt`; bump the dependency in a module |
| `goi doctor` | show the toolchain, SDL3, Vulkan and the companion tools |
| `goi version` | print the installed goi version |

The CLI is a cobra tree: `goi --help`, `goi <command> --help` and shell
completion work as usual. `goi version` prints the version recorded in the
binary; a local `go build` reports `devel` (or a pseudo-version with `+dirty`
when the checkout has changes).

## Set up or update the tools

```sh
goi setup
goi update
```

The two commands are aliases and do the same work:

```text
go install github.com/goi-gui/goi/cmd/goi@latest
go install github.com/goi-gui/goi/cmd/goipls@latest
go install github.com/goi-gui/goi/cmd/goifmt@latest
go get -u github.com/goi-gui/goi@latest
```

The last line runs only when the current directory has a `go.mod`, so a project
gets the newest goi dependency while a machine-wide setup outside a module just
refreshes the three binaries.

`goipls` is the editor language server and `goifmt` is the `.goi` formatter.
`goi` itself is reinstalled too, which keeps the CLI and the tools on the same
release.

## Check the setup

```sh
goi doctor
```

The first row asks the GitHub releases API whether a newer release exists. It
shows `ok`, `available` with the tag and the `goi update` hint, `devel` for a
local build, or `?` when GitHub cannot be reached. The check has a short timeout
and does not stop the rest of the report.

The remaining rows show the OS and architecture, the distribution and kernel
when available, the Go toolchain and `CGO_ENABLED`, the `goi`, `goipls` and
`goifmt` versions, the SDL3 runtime library, the Vulkan loader and its ICDs, and
the optional `ffmpeg` and `git` tools. A row is `ok`, `missing` or `optional`;
the command still exits successfully when an optional tool is absent.

A desktop build needs Go, SDL3 and a GPU backend: Vulkan on Linux and Windows,
Metal on macOS. `SDL3` is loaded at run time, not linked, which is why the doctor
looks for the shared library rather than a compiler or development package.

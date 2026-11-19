---
title: goi init
sidebar_label: goi init
---

# goi init

`goi init` creates a project in the current directory: a Go module, a
`cmd/main.go`, a [`goi.yaml`](goi-yaml.md) and the `hello` example under
`assets/` — the goi logo and a greeting.

```sh
mkdir hello
cd hello
goi init
```

It asks for the application name, id and Go module in the terminal, then writes:

```text
hello/
├── assets/
│   ├── images/
│   │   └── goi.svg
│   └── ui/
│       └── Main.goi
├── cmd/
│   └── main.go
├── go.mod
├── go.sum
└── goi.yaml
```

Start it with [`goi run`](run.md):

```sh
goi run
```

## Flags instead of the prompt

The prompts are only there for a first project. For a script or when the values
are already known, pass them as flags and the terminal is skipped:

```sh
goi init --name hello --id com.example.hello --module example.com/hello --assets assets
```

| Flag | Sets | Example |
| --- | --- | --- |
| `--name` | the application and executable name | `myapp` |
| `--id` | a reverse-DNS application id | `com.example.myapp` |
| `--module` | the Go module path for `go mod init` | `github.com/you/myapp` |
| `--assets` | the directory holding the designs and their assets | `assets` |

Only the values a flag did not give are asked for, so
`goi init --name myapp` prompts for the id and the module. `--assets` defaults
to `assets`, so it does not prompt unless a different directory is wanted. The fully
flagged form is safe for a script; the bare form is friendly for a first
project.

`init` runs `go mod init` with the module value and then `go mod tidy`, so the
new module has the goi dependency and a `go.sum`. If the machine is offline, the
files are still written and tidy can be run later.

## What the generated program does

`cmd/main.go` calls:

```go
win, err := app.LoadWindow("ui/Main.goi")
```

The entry is resolved inside the `assets` directory named in `goi.yaml`, so the
file it opens is `assets/ui/Main.goi`. Hot reload is on by default, so editing
that file updates the open window. `Main.goi` is the `hello` example: an SVG
logo from `assets/images/goi.svg` above a greeting. It is the same screen as
`examples/hello`, so there is a working starting point to edit.

The generated `goi.yaml` also gives the app a name and id, names `assets` as the
assets directory, `cmd` as the entrypoint, and sets both
[`runFlags` and `buildFlags`](goi-yaml.md) to `all`.

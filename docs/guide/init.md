---
title: goi init
sidebar_label: goi init
---

# goi init

`goi init` creates a project in the current directory: a Go module, a
`cmd/main.go`, a [`goi.yaml`](goi-yaml.md) and `ui/Main.goi` with a centred
hello world.

```sh
mkdir hello
cd hello
goi init --name hello --id com.example.hello --module example.com/hello
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

Then start it with [`goi run`](run.md):

```sh
goi run
```

## Flags and prompts

The flags are optional. Run `goi init` without them and the command asks for the
missing values in the terminal with a text field per value:

| Flag | Asks for | Example |
| --- | --- | --- |
| `--name` | the application and executable name | `myapp` |
| `--id` | a reverse-DNS application id | `com.example.myapp` |
| `--module` | the Go module path for `go mod init` | `github.com/you/myapp` |
| `--ui` | the directory holding the `.goi` files | `ui` |

Only the values a flag did not give are asked for, so
`goi init --name myapp` prompts for the id and the module. `--ui` defaults to
`ui`, so it does not prompt unless a different directory is wanted. The fully
flagged form is safe for a script; the bare form is friendly for a first
project.

`init` runs `go mod init` with the module value and then `go mod tidy`, so the
new module has the goi dependency and a `go.sum`. If the machine is offline, the
files are still written and tidy can be run later.

## What the generated program does

`cmd/main.go` calls:

```go
win, err := app.LoadWindow("Main.goi")
```

The entry is resolved inside the `ui` directory named in `goi.yaml`, so the file
it opens is `ui/Main.goi`. Hot reload is on by default, so editing that file
updates the open window. `Main.goi` is a centred "Hello, world!" — the smallest
complete design.

The generated `goi.yaml` also gives the app a name and id, names `cmd` as the
entrypoint and sets both [`runFlags` and `buildFlags`](goi-yaml.md) to `all`.

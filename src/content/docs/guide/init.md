---
title: "goi init"
---

`goi init` creates a project in the current directory: a Go module, a
`cmd/main.go`, a [`goi.yaml`](/guide/goi-yaml/), a `.gitignore` and the `hello`
example under `assets/` — the goi logo and a greeting. It also asks whether to
initialize a git repository (No by default) and, when the directory already has
files, whether to overwrite the project files (No by default; `-w` skips the
question).

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
├── .gitignore
├── go.mod
├── go.sum
└── goi.yaml
```

Start it with [`goi run`](/guide/run/):

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
| `-g`, `--git` | initialize a git repository; the prompt defaults to No | `--git` |
| `-w`, `--overwrite` | replace project files in a non-empty directory | `-w` |

Only the values a flag did not give are asked for, so
`goi init --name myapp` prompts for the id and the module. `--assets` defaults
to `assets`, so it does not prompt unless a different directory is wanted. The
git question appears when the name, id or module still needs asking; when all
three are passed the prompt is skipped, so use `--git` to initialize a
repository in a script. A non-empty directory asks before its project files are
replaced; `-w` skips that question.

The generated `.gitignore` ignores the project's `dist/` directory, where
`goi build` writes its output. If the file already exists, the line is added
without dropping the entries that were there.

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
assets directory, `cmd` as the entrypoint, sets [`runFlags`](/guide/goi-yaml/) to
`all` for development, and `buildFlags` to `auto`, so a build carries only the
features the design uses.

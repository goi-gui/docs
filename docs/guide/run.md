---
title: goi run
sidebar_label: goi run
---

# goi run

`goi run` builds and starts the project in the current directory with hot reload
on.

```sh
goi run
```

It reads [`goi.yaml`](goi-yaml.md), then composes:

```text
go run -tags nofakecgo,<runFlags...> ./<entrypoint>
```

- `runFlags` is the tag list for a development run. It defaults to `[all]`.
- `entrypoint` is the package directory, `cmd` by default.
- `CGO_ENABLED=0` is set. `nofakecgo` is always added.
- The caller's environment is forwarded to `go`; `CGO_ENABLED` is the only
  value replaced.
- Output and exit status of the app are left alone.

A project without `<entrypoint>/main.go` or without a `goi.yaml` gets a hint from
the command.

## Development logs

`goi run` turns the framework's own logs on. It sets:

```text
GOI_DEBUG=TRUE
LOGGER_OUTPUT_FORMAT=logfmt
```

Only the framework's lines are affected. The app's own output, including its own
logger, is untouched. A normal run prints startup and window loading:

```text
INF ui: starting service=goi
INF ui: window loaded file=ui/Main.goi service=goi took=98.2ms
```

Set `GOI_DEBUG` yourself to keep them quiet:

```sh
GOI_DEBUG=FALSE goi run
```

An explicit value wins, so `GOI_DEBUG=FALSE` and `GOI_DEBUG=0` both disable the
lines. `LOGGER_OUTPUT_FORMAT=logfmt` is sent by `goi run` regardless of the
environment, so a run always uses that format.

The same switch works on a built app. [`goi build`](build.md) leaves the logs
off by default, and the operator can turn them on:

```sh
GOI_DEBUG=TRUE ./dist/linux-amd64/myapp
```

A built app does not get `LOGGER_OUTPUT_FORMAT=logfmt` from `goi build`; set it
if that format is wanted. A Windows build uses `-H windowsgui`, so it is a
GUI-subsystem executable with no console: `GOI_DEBUG` lines have nowhere to go
there. Build on another platform, or use a manual `go build` without that flag,
when the Windows logs themselves are what is being debugged.

## Hot reload

Hot reload is automatic: `goi run` watches the `assets` directory, so editing a
`.goi` file rebuilds the tree, carries over the state the framework owns and runs
`Bind` again. Application state must therefore live outside `Bind`.

No Go code is involved, and there is no switch to set. `goi build` copies the
design into the binary and skips the watcher, so development reloads and a
shipped app stay in one project without separate builds.

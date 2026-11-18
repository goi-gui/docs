---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# goi

A declarative GUI framework for Go, rendered with WebGPU.

goi describes a window in `.goi` files: elements, properties, ids, `if`/`else`
and `for` loops. Go finds elements by id, holds the state and attaches the
behaviour. Edit a `.goi` file and the window updates without a restart: hot
reload is built in.

```goi
bridge {
	Count int
	onInc func()
}

Window {
	title: "Counter"

	Column {
		padding:        24
		spacing:        16
		crossAxisAlign: center

		Text {
			text: formatf("%d", bridge.Count)
			role: displayLarge
		}

		Button {
			id:      inc
			label:   "+"
			onClick: bridge.onInc()
		}
	}
}
```

```go
var count int // outside Bind: Bind runs again after every hot reload

func main() {
	app, _ := ui.NewApp()
	win, _ := app.LoadWindow("counter.goi")

	win.Bind(func(w *ui.Window) error {
		ui.SetData(w, "Count", count)
		return ui.SetHandler(w, "onInc", func() {
			count++
			ui.SetData(w, "Count", count)
		})
	})

	app.Run()
}
```

`SetData` feeds `bridge.Count`; `SetHandler` supplies the body a bridge call
runs. The label follows the value without a manual repaint.

## Install

Install the CLI, then the tools it uses:

```sh
go install github.com/goi-gui/goi/cmd/goi@latest
goi setup
goi doctor
```

`goi setup` installs `goipls` (the editor language server) and `goifmt` (the
`.goi` formatter). `goi doctor` checks those tools, the Go toolchain, the SDL3
runtime library and the GPU backend. Run `goi setup` once on a new machine; see
[the goi command](guide/cli.md).

goi runs on Linux (Wayland and X11), Windows and macOS. The window layer loads
the SDL3 runtime library through purego, so the build is cgo-free and needs no C
compiler, `pkg-config` or SDL3 development files; the runtime library is the
only requirement.

```sh
# Linux (the runtime package; libsdl3-0 on Debian/Ubuntu, sdl3 on Arch)
sudo apt install libsdl3-0

# macOS
brew install sdl3

# Windows: put SDL3.dll next to the executable
```

The same binary asks SDL which video driver it got and draws through Vulkan
(Wayland, X11), Direct3D 12 (Windows) or Metal (macOS); no GPU SDK is needed
beyond the driver.

## Start a project

```sh
mkdir hello
cd hello
goi init --name hello --id com.example.hello --module example.com/hello
goi run
```

`goi init` asks for any value a flag did not give, then writes a `cmd/main.go`,
a [`goi.yaml`](guide/goi-yaml.md), a Go module and a `ui/Main.goi` with a centred
hello world. `cmd/main.go` loads it through `app.LoadWindow("Main.goi")`, and
`goi run` reads the development tags from `goi.yaml`. See
[goi init](guide/init.md) and [goi run](guide/run.md).

When the app is ready, build it:

```sh
goi build
```

That writes `dist/<os>-<arch>/<name>` for the host. `--os` and `--arch` choose
another target; the release tags come from `buildFlags`. See
[goi build](guide/build.md).

## Start here

- [.goi syntax](syntax.md) — the language reference: declarations, imports,
  props, slots and literals.
- [Conditionals](guide/conditionals.md), [loops](guide/loops.md) — showing an
  arm or repeating elements.
- [Bridge](guide/bridge.md) — passing values and handlers from Go.
- [Fragments](guide/fragments.md) — splitting a design across files with props,
  children and named slots.
- [Translations](guide/i18n.md) — `t(...)` from JSON catalogs in an `i18n`
  folder, with a language switch from Go.
- [Components](components.md) — every element, grouped by purpose, with a
  `.goi` example and its properties.
- [Icons](icons.md) — every Material Symbols name the renderer can draw.
- [Zed extension](ide-extensions/zed.md) — highlighting, completion and
  diagnostics for `.goi` files.

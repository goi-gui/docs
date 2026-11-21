---
title: "goi"
sidebar:
  label: "Introduction"
---

A declarative GUI framework for Go, rendered with WebGPU on Linux (Wayland and
X11), Windows and macOS.

goi describes a window in `.goi` files: elements, properties, ids, `if`/`else`
and `for` loops. Go finds elements by id, holds the state and attaches the
behaviour. Hot reload is built in: edit a `.goi` file and the open window updates
without a restart. One project builds for every supported platform, drawing
through Vulkan, Direct3D 12 or Metal.

The components and the design language follow
[Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive):
expressive colour, type, shape and motion, with light and dark schemes.

```goi
// assets/ui/Main.goi

bridge {
	Count   int
	onInc   func()
	onDec   func()
	onReset func()
}

Window {
	title: "Counter"

	Column {
		crossAxisAlign: center
		mainAxisAlign:  center
		gap:            20

		Text {
			text: "Counter"
			role: titleLarge
		}

		Row {
			gap:            20
			crossAxisAlign: center
			mainAxisAlign:  center

			Button {
				label:    "-"
				onClick:  bridge.onDec()
				disabled: bridge.Count == 0
			}

			Text {
				text: formatf("%02d", bridge.Count)
				role: displayLarge
			}

			Button {
				label:   "+"
				onClick: bridge.onInc()
			}
		}

		IconButton {
			icon:     refresh
			onClick:  bridge.onReset()
			disabled: bridge.Count == 0
		}
	}
}
```

```go
app, _ := ui.NewApp()
win, _ := app.LoadWindow("ui/Main.goi")

// count lives outside Bind: Bind runs again after every hot reload
count := 0

win.Bind(func(w *ui.Window) error {
	ui.SetData(w, "Count", count)
	ui.SetHandler(w, "onInc", func() {
		count++
		ui.SetData(w, "Count", count)
	})
	ui.SetHandler(w, "onDec", func() {
		count--
		ui.SetData(w, "Count", count)
	})
	ui.SetHandler(w, "onReset", func() {
		count = 0
		ui.SetData(w, "Count", count)
	})
	return nil
})

app.Run()
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
[the goi command](/guide/cli/).

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
a [`goi.yaml`](/guide/goi-yaml/), a Go module and the `hello` example under
`assets/`: the goi logo and a greeting. `cmd/main.go` loads it through
`app.LoadWindow("ui/Main.goi")`, and
`goi run` reads the development tags from `goi.yaml`. See
[goi init](/guide/init/) and [goi run](/guide/run/).

When the app is ready, build it:

```sh
goi build
```

That writes `dist/<os>-<arch>/<name>` for the host. `--os` and `--arch` choose
another target; the release tags come from `buildFlags`. See
[goi build](/guide/build/).

## Start here

- [.goi syntax](/syntax/) — the language reference: declarations, imports,
  props, slots and literals.
- [Conditionals](/guide/conditionals/), [responsive](/guide/responsive/) and
  [states](/guide/states/) — a property per condition, window width or
  interaction state, nested together.
- [Loops](/guide/loops/) — repeating elements from a list.
- [Bridge](/guide/bridge/) — passing values and handlers from Go.
- [Async work](/guide/async/) — updating the UI from a goroutine with `App.Post`.
- [Fragments](/guide/fragments/) — splitting a design across files with props,
  children and named slots.
- [Translations](/guide/i18n/) — `t(...)` from JSON catalogs in an `i18n`
  folder, with a language switch from Go.
- [Components](/components/) — every element, grouped by purpose, with a
  `.goi` example and its properties.
- [Icons](/icons/) — every Material Symbols name the renderer can draw.
- [Zed extension](/ide-extensions/zed/) — highlighting, completion and
  diagnostics for `.goi` files.

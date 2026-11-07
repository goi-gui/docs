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
	win, _ := app.LoadWindowFile("counter.goi", ui.WithHotReload(true))

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

## Install

```sh
go get github.com/goi-gui/goi/ui
```

The WebGPU renderer and the SDL3 window layer live behind the `ui` package.
Only `ui` is imported by an application.

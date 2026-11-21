---
title: "Menu"
---

A popup list of `MenuItem`s.

[All components](/components/)

<p align="center">
  <img src="/img/components/menu-light.png" alt="Menu in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/menu-dark.png" alt="Menu in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Menu {
	MenuItem {
		label: "Cut"
		leadingIcon:  content_cut
	}

	MenuItem {
		label: "Copy"
		leadingIcon:  content_copy
	}

	MenuItem {
		label: "Paste"
		leadingIcon:  content_paste
	}
}
```

## Properties

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
menu := w.MustByID[*ui.Menu]("menu")
menu.SetVisible(!menu.Visible())
```

Every element also accepts the [common properties](/guide/common-properties/).

---
title: "Toolbar"
---

A horizontal strip of compact controls.

[All components](/components/)

<p align="center">
  <img src="/img/components/toolbar-light.png" alt="Toolbar in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/toolbar-dark.png" alt="Toolbar in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Toolbar {
	spacing: 4

	IconButton {
		icon: format_bold
	}

	IconButton {
		icon: format_italic
	}

	Divider {
	}

	IconButton {
		icon: format_underlined
	}
}
```

## Properties

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
bar := w.MustByID[*ui.Toolbar]("format")
bar.Spacing.Set(2)
```

Every element also accepts the [common properties](/guide/common-properties/).

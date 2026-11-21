---
title: "Tooltip"
---

A short hint shown while the pointer is over what it wraps. A `Tooltip` is a
container: its child is the thing being explained, and the bubble floats above
that child without taking room in the layout.

[All components](/components/)

<p align="center">
  <img src="/img/components/tooltip-light.png" alt="Tooltip in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/tooltip-dark.png" alt="Tooltip in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Tooltip {
	text: "Saves to your library"

	Button {
		label: "Save"
		leadingIcon:  save
	}
}

Tooltip {
	text: "Ctrl+K opens search"

	Text {
		text: "Search"
	}
}
```

The box of a `Tooltip` is exactly the box of its child, so hovering anywhere on
the child brings the bubble out. Several children are laid out like a `Column`,
so the usual `spacing` and `crossAxisAlign` apply; wrap them in a `Row` when the
hint belongs to a row.

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | the bubble's text; empty draws nothing |
| `spacing` | number | space between the children on the main axis |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along it |

The bubble is drawn above the child, 6dp away, and slides inside the window when
the child sits near an edge; when there is no room above, it goes below. It is
painted in the scheme's `inverseSurface` with `bodySmall` text, like the Material
3 plain tooltip. It does not change layout, so showing and hiding it costs no
reflow.

## From Go

```go
tip := w.MustByID[*ui.Tooltip]("tip")
tip.Text.Set("Saves to your library")
```

Every element also accepts the [common properties](/components/#common-properties).

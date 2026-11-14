# Tooltip

A short hint shown while the pointer is over what it wraps. A `Tooltip` is a
container: its child is the thing being explained, and the bubble floats above
that child without taking room in the layout.

[All components](../components.md)

## In a `.goi` file

```goi
Tooltip {
	text: "Saves to your library"

	Button {
		label: "Save"
		icon:  save
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
| `variant` | enum | — (no style variants) |

The bubble is drawn above the child, 6dp away, and slides inside the window when
the child sits near an edge; when there is no room above, it goes below. It is
painted in the scheme's `inverseSurface` with `bodySmall` text, like the Material
3 plain tooltip. It does not change layout, so showing and hiding it costs no
reflow.

## From Go

```go
tip := ui.MustByID[*ui.Tooltip](w, "tip")
tip.Text.Set("Saves to your library")
```

Every element also accepts the [common properties](../components.md#common-properties).

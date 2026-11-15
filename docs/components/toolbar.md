# Toolbar

A horizontal strip of compact controls.

[All components](../components.md)

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
		variant: vertical
	}

	IconButton {
		icon: format_underlined
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
bar := ui.MustByID[*ui.Toolbar](w, "format")
bar.Spacing.Set(2)
```

Every element also accepts the [common properties](../components.md#common-properties).

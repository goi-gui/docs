# ButtonGroup

A row of related buttons that share one shape and one gap.

[All components](../components.md)

## In a `.goi` file

```goi
ButtonGroup {
	spacing: 8

	Button {
		label:   "Day"
		variant: outlined
	}

	Button {
		label:   "Week"
		variant: outlined
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | filled, tonal, elevated, outlined, text (each child button draws its own; the group adds no style) |
| `size` | enum | — (children size themselves) |
| `disabled` | bool | dims the element and blocks input |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
group := ui.MustByID[*ui.ButtonGroup](w, "group")
group.Spacing.Set(12)
```

Every element also accepts the [common properties](../components.md#common-properties).

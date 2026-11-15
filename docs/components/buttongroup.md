# ButtonGroup

A row of related buttons that share one shape and one gap.

[All components](../components.md)

<p align="center">
  <img src="/img/components/buttongroup-light.png" alt="ButtonGroup in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/buttongroup-dark.png" alt="ButtonGroup in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

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

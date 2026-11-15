# Card

A Material 3 surface that groups related content.

[All components](../components.md)

<p align="center">
  <img src="/img/components/card-light.png" alt="Card in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/card-dark.png" alt="Card in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Card {
	label:      "Elevated"
	supporting: "Surface container low"
	variant:    elevated
	width:      240
}

Card {
	variant: filled
	width:   240
	height:  88
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `supporting` | string | secondary line under the label |
| `icon` | string | leading Material Symbols ligature |
| `variant` | enum | `elevated` (default), `filled`, `outlined` |
| `disabled` | bool | dims the element and blocks input |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
card := ui.MustByID[*ui.Card](w, "summary")
card.Label.Set("3 results")
card.OnClick(func(ui.ClickEvent) { open(3) })
```

Every element also accepts the [common properties](../components.md#common-properties).

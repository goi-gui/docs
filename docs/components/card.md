# Card

A Material 3 surface that groups related content.

[All components](../components.md)

<p align="center">
  <strong>elevated</strong><br />
  <img src="/img/components/card-elevated-light.png" alt="Card elevated in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/card-elevated-dark.png" alt="Card elevated in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/card-filled-light.png" alt="Card filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/card-filled-dark.png" alt="Card filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/card-outlined-light.png" alt="Card outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/card-outlined-dark.png" alt="Card outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
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
| `leadingIcon` | string | leading Material Symbols ligature |
| `variant` | enum | `elevated` (default), `filled`, `outlined` |
| `disabled` | bool | dims the element and blocks input |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
card := w.MustByID[*ui.Card]("summary")
card.Label.Set("3 results")
card.OnClick(func(ui.ClickEvent) { open(3) })
```

Every element also accepts the [common properties](../components.md#common-properties).

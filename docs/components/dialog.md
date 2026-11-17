# Dialog

A modal surface for a decision or a short form.

[All components](../components.md)

<p align="center">
  <img src="/img/components/dialog-light.png" alt="Dialog in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/dialog-dark.png" alt="Dialog in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Dialog {
	label:      "Reset settings?"
	supporting: "This cannot be undone."
	width:      280
	height:     168
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `supporting` | string | secondary line under the label |
| `leadingIcon` | string | leading Material Symbols ligature |
| `filledIcon` | bool | draws the element's icons in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
dialog := w.MustByID[*ui.Dialog]("confirm")
scrim := w.MustByID[*ui.Rectangle]("scrim")
open := func(v bool) {
	scrim.SetVisible(v)
	dialog.SetVisible(v)
}
w.OnKey(func(e ui.KeyEvent) {
	if e.Key == ui.KeyEscape {
		open(false)
	}
})
```

Every element also accepts the [common properties](../components.md#common-properties).

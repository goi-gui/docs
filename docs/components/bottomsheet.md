# BottomSheet

A surface anchored to the bottom edge.

[All components](../components.md)

<p align="center">
  <img src="/img/components/bottomsheet-light.png" alt="BottomSheet in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/bottomsheet-dark.png" alt="BottomSheet in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
BottomSheet {
	label:  "Share"
	width:  320
	height: 160
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `supporting` | string | secondary line under the label |
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
sheet := w.MustByID[*ui.BottomSheet]("sheet")
sheet.SetVisible(true)

// Animate the placement, not the node: a sheet that grows is usually a
// Positioned whose top edge moves.
frame := w.MustByID[*ui.Positioned]("sheetFrame")
app.Animate(&frame.Top, 300, 250*time.Millisecond, ui.Emphasized)
```

Every element also accepts the [common properties](../components.md#common-properties).

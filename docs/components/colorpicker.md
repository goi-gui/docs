# ColorPicker

A saturation/value square and a hue bar for picking an opaque colour.

[All components](../components.md)

## In a `.goi` file

```goi
ColorPicker {
	label: "Accent"
	text:  "#6750a4"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the caption above the square; `Select colour` when empty |
| `text` | string | the value as `#rrggbb`; any CSS colour is read, and picking rewrites it in hex; empty means black |

## Behaviour

The square's x axis is saturation and its y axis is value; the bar below it is
the hue. Pressing or dragging inside either control moves the picked point and
updates `text` immediately. The release reports the value once through
`onSubmit`, while `onEdit` fires on every change.

```goi
ColorPicker {
	label:    "Accent"
	text:     "#6750a4"
	onEdit:   bridge.Preview(event)
	onSubmit: bridge.Apply(event)
}
```

The payload is the colour as `#rrggbb`. A picked value is always opaque sRGB: an
alpha in an existing value is dropped by the first pick. The header shows the
current hex, and the round swatch at the bottom previews it.

A focused picker also takes the keyboard: Left/Right turn the hue by one degree
(Shift by ten), Up/Down change the value, Ctrl+Up/Down change the saturation by
1% (Shift by 10%), and Enter reports through `onSubmit`.

## From Go

```go
accent := ui.MustByID[*ui.ColorPicker](w, "accent")
accent.OnEdit(func(hex string) { preview.SetBackground(hex) })
accent.OnSubmit(func(hex string) { saveAccent(hex) })
accent.Text.Set("#ff8800")
accent.SetHSV(30, 1, 1) // the same colour, set from the controls' own space
```

Every element also accepts the [common properties](../components.md#common-properties).

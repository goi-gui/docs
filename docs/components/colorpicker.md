# ColorPicker

A saturation/value square, a hue bar, an alpha bar and a hex field for picking a
colour, with Cancel and OK actions.

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
| `text` | string | the value as `#rrggbb`, or `#rrggbbaa` when translucent; any CSS colour is read, and picking or typing rewrites it in hex; empty means black |

## Behaviour

The square's x axis is saturation and its y axis is value; the bar below it is
the hue, and the checkerboard bar under that is the alpha. Pressing or dragging
inside any control moves the picked point and updates `text` immediately. The
release reports the value once through `onSubmit`, while `onEdit` fires on every
change.

The field under the square edits the same value as a hex code. It accepts
`#rrggbb`, `#rrggbbaa`, the shorthand forms, and a bare run without the hash
(`00ff00` is `#00ff00`); anything that is not a hex digit is dropped. The preview
follows as soon as the text parses, an unparseable value falls back to the last
colour that did when the field loses focus or OK is pressed, and an opaque
colour is written back without the alpha digits. The round swatch beside the
field previews the value over the card surface.

Cancel and OK sit at the bottom. OK reports through `onOK` and `onSubmit`; Cancel
reports through `onCancel`. Both carry the current colour as `#rrggbb` or
`#rrggbbaa`, and the app decides what Cancel means for its own state.

```goi
ColorPicker {
	label:    "Accent"
	text:     "#6750a4"
	onEdit:   bridge.Preview(event)
	onSubmit: bridge.Apply(event)
	onOK:     bridge.Confirm(event)
	onCancel: bridge.Dismiss(event)
}
```

The payload is the colour as `#rrggbb`, or `#rrggbbaa` when the alpha is below
full. The header shows the current hex, and the round swatch at the bottom
previews it over the card surface.

A focused picker also takes the keyboard: Left/Right turn the hue by one degree,
Ctrl+Left/Right change the alpha, Up/Down change the value, Ctrl+Up/Down change
the saturation; Shift makes the step ten times bigger. Enter is OK and Escape is
Cancel. Typing a hex character
while the card itself is focused opens the field with the old value selected, so
the first character replaces it.

## From Go

```go
accent := ui.MustByID[*ui.ColorPicker](w, "accent")
accent.OnEdit(func(hex string) { preview.SetBackground(hex) })
accent.OnSubmit(func(hex string) { saveAccent(hex) })
accent.OnOK(func(hex string) { closeDialog() })
accent.OnCancel(func(hex string) { closeDialog() })
accent.Text.Set("#ff8800")
accent.SetHSV(30, 1, 1)    // the same colour, set from the controls' own space
accent.SetHSVA(30, 1, 1, 0.5) // the same colour at half opacity
```

Every element also accepts the [common properties](../components.md#common-properties).

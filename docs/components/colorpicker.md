# ColorPicker

A saturation/value square, a hue bar and a hex field for picking an opaque
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
| `text` | string | the value as `#rrggbb`; any CSS colour is read, and picking or typing rewrites it in hex; empty means black |

## Behaviour

The square's x axis is saturation and its y axis is value; the bar below it is
the hue. Pressing or dragging inside either control moves the picked point and
updates `text` immediately. The release reports the value once through
`onSubmit`, while `onEdit` fires on every change.

The field under the square edits the same value as a hex code. It accepts
`#rrggbb`, the shorthand forms, and a bare run without the hash (`00ff00` is
`#00ff00`); anything that is not a hex digit is dropped. The preview follows as
soon as the text parses, and an unparseable value falls back to the last colour
that did when the field loses focus or OK is pressed. The round swatch beside
the field previews the value.

Cancel and OK sit at the bottom. OK reports through `onOK` and `onSubmit`; Cancel
reports through `onCancel`. Both carry the current colour as `#rrggbb`, and the
app decides what Cancel means for its own state.

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

The payload is the colour as `#rrggbb`. A picked value is always opaque sRGB: an
alpha in an existing value is dropped by the first pick. The header shows the
current hex, and the round swatch at the bottom previews it.

A focused picker also takes the keyboard: Left/Right turn the hue by one degree
(Shift by ten), Up/Down change the value, Ctrl+Up/Down change the saturation by
1% (Shift by 10%), Enter is OK and Escape is Cancel. Typing a hex character
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
accent.SetHSV(30, 1, 1) // the same colour, set from the controls' own space
```

Every element also accepts the [common properties](../components.md#common-properties).

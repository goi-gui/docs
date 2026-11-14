# TextField

An editable single-line field with a floating label.

[All components](../components.md)

## In a `.goi` file

```goi
TextField {
	label: "Email"
	width: 320
}

TextField {
	label:   "Name"
	text:    "Ada"
	variant: outlined
}

TextField {
	label:       "Email"
	placeholder: "you@example.com"
	icon:        mail
}

TextField {
	label:      "Notes"
	supporting: "Shown under the field"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `text` | string | current value |
| `placeholder` | string | shown while the value is empty |
| `supporting` | string | secondary line under the label |
| `icon` | string | leading Material Symbols ligature |
| `trailingIcon` | string | trailing Material Symbols ligature |
| `variant` | enum | `filled` (default), `outlined` |
| `color` | color | value, label and placeholder colour; unset keeps onSurface |
| `disabled` | bool | dims the element and blocks input |

The field's box is the design's when it styles one: `background` (solid or a
gradient), `borderColor`/`borderWidth` with the per-side properties, `radius` and
`shadow` replace the variant's fill, outline, shape and elevation. A design
border also wins over the focus colour, so a custom field keeps its own look
while focused.

## From Go

```go
email := ui.MustByID[*ui.TextField](w, "email")
email.OnEdit(func(s string) { draft.Email = s })
email.OnSubmit(func(s string) { save(s) })
```

Every element also accepts the [common properties](../components.md#common-properties).

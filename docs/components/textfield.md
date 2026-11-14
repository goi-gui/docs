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
| `type` | string | what can be entered: `text` (default), `numeric`, `alpha`, `alphanumeric`, or the characters themselves |
| `mask` | string | input mask: `#` a digit, `@` a letter, `*` either, every other character a literal |
| `color` | color | value, label and placeholder colour; unset keeps onSurface |
| `disabled` | bool | dims the element and blocks input |

A field's `type` filters what reaches its value, whether it arrives as a
keystroke, a paste or an IME commit. The three names are shortcuts; any other
value is the exact set of characters to allow, matched rune for rune and
case-sensitively. A decimal field writes `type: "0123456789."`; a hex field that
takes a normal `#RRGGBB` writes `type: "0123456789abcdefABCDEF#"`.

```goi
TextField {
	label: "Phone"
	type:  numeric
	mask:  "(###) ###-####"
	width: 320
}

TextField {
	label: "Ticket"
	type:  "ABC123"
}

TextField {
	label: "Hex"
	type:  "0123456789abcdefABCDEF#"
}
```

A `mask` formats the value as it is typed: the literals appear on their own and
the caret moves past them, so typing `5551234567` gives `(555) 123-4567`.
Backspace and Delete remove an entered character and skip the literals between
them. A `type` and a `mask` both apply: a character has to pass the type and fit
the slot. The value keeps the literals, so `onEdit` and `onSubmit` report the
formatted string.

The mask formats input, not a value the design or the app writes: `text` is
shown as written until the field is edited.

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

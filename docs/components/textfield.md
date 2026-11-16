# TextField

An editable single-line field with a floating label.

[All components](../components.md)

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/textfield-filled-light.png" alt="TextField filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/textfield-filled-dark.png" alt="TextField filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/textfield-outlined-light.png" alt="TextField outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/textfield-outlined-dark.png" alt="TextField outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>obscured</strong><br />
  <img src="/img/components/textfield-password-light.png" alt="TextField with obscureText and a trailing slot in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/textfield-password-dark.png" alt="TextField with obscureText and a trailing slot in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

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
	leadingIcon:        mail
}

TextField {
	label:      "Notes"
	supporting: "Shown under the field"
}

TextField {
	label:       "Password"
	text:        "correct horse"
	obscureText: true
	leadingIcon: lock
}
```

## Leading and trailing bodies

The icon properties take a Material Symbols name. When a field needs something
else there — a reveal button, a clear mark, an avatar — the `$leading` and
`$trailing` slots take any element, and layout centres it in the 40dp column the
icon would use:

```goi
TextField {
	label:       "Password"
	text:        "correct horse"
	obscureText: true

	$leading {
		Icon {
			icon: lock
		}
	}

	$trailing {
		IconButton {
			icon: visibility
		}
	}
}
```

An explicit `leadingIcon` or `trailingIcon` wins over the matching slot, so one
design can take either without a condition: a field with an icon ignores the
body it was given and keeps the field to one icon's width.

## Hiding the value

`obscureText: true` turns a field into a password field: every character paints
as a dot, and the selection, the caret and the IME composition follow the dots,
so the caret still sits on the character it covers. The value itself does not
change — `text`, `onEdit` and `onSubmit` keep the real string, and the app can
flip the setting at any time:

A design can wire a reveal button itself, with the value it wants:

```goi
TextField {
	id:          password
	label:       "Password"
	obscureText: true

	$trailing {
		IconButton {
			icon:    visibility
			onClick: password.setObscureText(false)
		}
	}
}
```

From Go the state is readable as well, which is what a button that toggles both
ways needs:

```go
password := w.MustByID[*ui.TextField]("password")
reveal.OnClick(func(ui.ClickEvent) {
	password.SetObscureText(!password.Obscure.Get())
})
```

`obscureText` is off by default. It hides the value on screen only; it is not
encryption, and a field that must never be read back is a job for the backend.

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `text` | string | current value |
| `placeholder` | string | shown while the value is empty |
| `supporting` | string | secondary line under the label |
| `leadingIcon` | string | leading Material Symbols ligature; wins over `$leading` |
| `trailingIcon` | string | trailing Material Symbols ligature; wins over `$trailing` |
| `variant` | enum | `filled` (default), `outlined` |
| `type` | string | what can be entered: `text` (default), `numeric`, `alpha`, `alphanumeric`, or the characters themselves |
| `mask` | string | input mask: `#` a digit, `@` a letter, `*` either, `\` makes the next character literal, everything else literal |
| `color` | color | value, label and placeholder colour; unset keeps onSurface |
| `disabled` | bool | dims the element and blocks input |
| `obscureText` | bool | paints one dot per character, password-style; off by default |

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

The three slot characters can be shown literally with a backslash. A `.goi`
string spells that backslash twice: `mask: "\\# ###"` shows a leading `#` and
takes three digits, so `123` becomes `# 123`. `\#`, `\@` and `\*` are literal
punctuation, `\\` is a literal backslash, and a backslash before any other
character makes that character literal too.

```goi
TextField {
	label: "Issue"
	mask:  "\\# ###"
}
```

The mask formats input, not a value the design or the app writes: `text` is
shown as written until the field is edited.

A field with `supporting` text reserves a line under its box: its natural height
is 76 instead of 56, so a column leaves room for the helper. An explicit
`height` covers the field and that line together; the fill and outline stop
above it.

The field's box is the design's when it styles one: `background` (solid or a
gradient), `borderColor`/`borderWidth` with the per-side properties, `radius` and
`shadow` replace the variant's fill, outline, shape and elevation. A design
border also wins over the focus colour, so a custom field keeps its own look
while focused.

## From Go

```go
email := w.MustByID[*ui.TextField]("email")
email.OnEdit(func(s string) { draft.Email = s })
email.OnSubmit(func(s string) { save(s) })

password := w.MustByID[*ui.TextField]("password")
password.SetObscureText(true) // and false to reveal the value again
```

Every element also accepts the [common properties](../components.md#common-properties).

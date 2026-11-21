---
title: "TextArea"
---

A multiline text field.

[All components](/components/)

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/textarea-filled-light.png" alt="TextArea filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/textarea-filled-dark.png" alt="TextArea filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/textarea-outlined-light.png" alt="TextArea outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/textarea-outlined-dark.png" alt="TextArea outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
TextArea {
	id:          notes
	label:       "Notes"
	placeholder: "Enter starts a new line"
	text:        "first line\nsecond line"
	width:       360
	height:      140
}

TextArea {
	label:   "Outlined notes"
	variant: outlined
	width:   360
	height:  140
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | floats above the value once there is one |
| `text` | string | the value; `\n` separates lines |
| `placeholder` | string | shown while the value is empty |
| `supporting` | string | helper line under the field |
| `variant` | enum | `filled` (default) or `outlined` |
| `disabled` | bool | mutes the field and stops edits |

## Filled and outlined

`variant: filled` (the default) keeps the label in a top band inside the
container, with the value starting below it. `variant: outlined` moves a
floating label onto the border and cuts the line behind it; the value starts at
the top padding, since the label no longer takes a band inside the box. A
placeholder floats the label in both variants and keeps its own line, and the
travel is animated the same way as a single-line field.

## Behaviour

A field with `supporting` text reserves its line under the box, and an explicit
`height` covers the text area and that line together.

Enter inserts a newline instead of submitting; `Submit` fires on Ctrl+Enter you
handle, or when an app reads the value. Home and End move to the start and end
of the current line, Up and Down walk the wrapped lines and keep the column.
Paste keeps newlines; a single-line TextField still strips them.

The field wraps at its own width, so a long line becomes several visual lines
and the caret scrolls vertically to stay visible.

## From Go

```go
area := w.MustByID[*ui.TextArea]("notes")
area.OnEdit(func(s string) {
	fmt.Println("value:", s)
})
area.SetText("loaded from disk")
area.Caret = len(area.Text.Get())
```

Every element also accepts the [common properties](/guide/common-properties/).

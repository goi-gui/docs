# RichText

One paragraph whose runs may differ: bold here, a link there, a code span in
the middle. It is the inline model `Markdown` builds its paragraphs with, and it
is available on its own when a design needs mixed styling inside a sentence.

[All components](../components.md)

## In a `.goi` file

```goi
RichText {
	id:    note
	role:  bodyLarge
	wrap:  true
	width: 100%
	text:  "Spans come from Go; text is the plain run a design can write alone."
}
```

## From Go

```go
note := ui.MustByID[*ui.RichText](w, "note")
note.SetSpans([]ui.Span{
	{Text: "Install with "},
	{Text: "go install", Code: true},
	{Text: ", then read the "},
	{Text: "guide", Link: "https://goi.dev/guide"},
	{Text: " — it is "},
	{Text: "short", Bold: true, Italic: true},
	{Text: "."},
})
```

A `Span`'s fields:

| Field | Effect |
|---|---|
| `Text` | the run's words |
| `Bold` | one step heavier than the role's weight |
| `Italic` | slanted |
| `Underline`, `Strike` | a line under or through the run |
| `Code` | a tinted pill behind the run, the way inline code reads |
| `Link` | draws in `primary` and underlined; the destination is kept for you |
| `Color` | overrides the colour for this run; `0` keeps the node's |

## Wrapping

A run may break across lines, so one `Span` is not a node: its words flow into
the paragraph and continue on the next line. Breaking is by whitespace, so a
word that is styled in the middle — `bo` in one run and `ld` in another — still
moves to the next line whole. A word wider than the column — a URL, a long
identifier — is cut instead of escaping the box.

Layout and paint wrap with the same function and each run's own weight, so the
height the layout reserves is exactly the lines the painter draws. The result is
cached per paragraph, keyed by the span version, the column and the style, so a
still paragraph costs a map lookup per frame.

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | the plain run used when no spans were set |
| `role` | enum | a type-scale role, `bodyMedium` by default |
| `fontSize` | number | overrides the role's size |
| `color` | color | the paragraph's colour; a run's own colour wins |
| `align` | enum | `start`, `center` or `end`, applied to each line |
| `wrap` | bool | break lines at the box width |

The rest is the common box, so a RichText takes `width`, `padding`,
`background` and the rest of the
[common properties](../components.md#common-properties).

## What it does not do

- **Selection.** A RichText is not selectable; a `Text` with `selectable: true`
  is. Selection over mixed runs needs a caret model per run, which is not there
  yet.
- **Shaped ligatures across runs.** Every run is shaped on its own, which is
  right for Latin text and a small compromise for scripts whose shaping crosses
  a style boundary.
- **Opening a link.** `Link` styles and records the destination; goi has no URL
  opener of its own, so tapping a link is the app's job.

# RichText

One paragraph whose runs may differ: bold here, a link there, a code span in
the middle. It is the inline model `Markdown` builds its paragraphs with, and it
is available on its own when a design needs mixed styling inside a sentence.

[All components](../components.md)

## In a `.goi` file

A design writes the runs itself, one `Text` child per run:

```goi
RichText {
	id:    note
	role:  bodyLarge
	wrap:  true
	width: 100%

	Text { text: "Install with " }
	Text { text: "go install" color: tertiary }
	Text { text: ", then read the " }
	Text { text: "guide" decoration: underline color: primary }
	Text { text: " — it is " }
	Text { text: "short" fontWeight: bold fontStyle: italic }
	Text { text: "." }
}
```

Each child's style becomes its run's: `fontWeight` of 600 or more (or `bolder`)
is bold, `fontStyle: italic` slants, `decoration` carries `underline` and
`line-through`, and `color` does either of two things. A literal is fixed; a
theme role such as `primary` or `tertiary` stays a role, so the run follows the
scheme when the theme changes. A `custom:` colour does not reach a run, because
the painter resolves roles only — use a literal there.

The children are a way to author the runs, not nodes: they are turned into spans
when the file is built and dropped from the tree, so their `id`s are not
registered and layout, paint and lookups never see them. A run that changes while
the app runs comes from `SetSpans` below. Size and family are the paragraph's
own, so a `fontSize` on a child does not change its run.

`text` is still there for a paragraph that needs no styling: with no children and
no spans, the whole thing is one plain run.

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
| `ColorRole` | a theme role such as `"primary"`, followed across theme changes; wins over `Color` |

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

# Markdown

A whole markdown document, rendered as the elements goi already has: a heading
becomes a `Text` with a role, a fenced block a `Code`, a rule a `Divider`, a list
a run of rows, a table a `Table`. Because the children are real nodes, layout,
themes, wrapping and scrolling work without a second renderer inside the
component.

[All components](../components.md)

## In a `.goi` file

```goi
Markdown {
	id:   readme
	text: "# Title\n\nA paragraph with **bold** words.\n\n- one\n- two"
}
```

`text` is the document. A design file has no multi-line literal, so the lines are
joined with `\n`; a document read at runtime is usually loaded in Go instead.

## From Go

```go
doc := ui.MustByID[*ui.Markdown](w, "readme")
doc.SetSource(source)

// or, when the file ships beside the binary:
b, err := os.ReadFile("docs/README.md")
if err == nil {
	doc.SetSource(string(b))
}
```

The source is parsed when it changes, not every frame: a frame that shows the
same document costs one string comparison.

## What it builds

| Markdown | Element |
|---|---|
| `# Heading` to `###### Heading` | `Text` with `headlineLarge`, `headlineMedium`, `headlineSmall`, `titleLarge`, `titleMedium`, `titleSmall` |
| a paragraph | `Text` with `wrap: true` |
| `- item` / `1. item` | a `Row` with a bullet or a number and the text; nesting indents by depth |
| a fenced or indented code block | `Code`, with the fence's language as `language` |
| `> quote` | a `Column` with a bar on the left and the quote's blocks inside |
| `---` | `Divider` |
| a GFM table | `Table`, with a `TableColumn` per header cell and a `Text` inside each `TableCell` |

Emphasis, strong text, code spans, links and images keep their **words** and lose
their markup: a `Text` node draws one style, so a run of mixed weight becomes
plain text rather than three colours.

Table alignment markers (`:---`, `:---:`, `---:`) become the column and cell
`align`, so a right-aligned column reads the way the document asked.

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | the document; `\n` separates lines |

The rest is the common box, so a Markdown element takes `width`, `padding`,
`background`, `scroll` and the rest of the
[common properties](../components.md#common-properties). A long document usually
lives in a scrolling `Column` with `width: 100%`.

## What it does not do

- **Raw HTML.** A `<div>` in the document is skipped rather than drawn as source
  or handed to the page.
- **Footnotes, definition lists, front matter.** The parser is goldmark with its
  GFM extension, so tables, task lists, strikethrough and autolinks are in;
  anything else is not part of the AST this component maps.
- **Inline styling.** Bold inside a paragraph does not draw bolder, because one
  `Text` node carries one style.
- **Syntax colours in a fence without a language.** A fence with no language
  reads as plain text, which is what `Code` does with an unknown name.

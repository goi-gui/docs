# Markdown

A whole markdown document, rendered as the elements goi already has: a heading
becomes a `RichText` with a role, a fenced block a `Code`, a rule a `Divider`, a list
a run of rows, a table a `Table`. Because the children are real nodes, layout,
themes, wrapping and scrolling work without a second renderer inside the
component.

[All components](../components.md)

## In a `.goi` file

```goi
Markdown {
	id: readme
	text: !"# Title

		A paragraph with **bold** words.

		- one
		- two"!
}
```

`text` is the document, written between `!"` and `"!` when it spans lines. The
block's own indentation is stripped, so the document can be indented with the
element around it and still read as markdown; a nested list keeps the extra
indentation that makes it nested. A one-line document can stay a normal quoted
string, and a document read at runtime is usually loaded in Go instead.

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
| `# Heading` to `###### Heading` | `RichText` with `headlineLarge`, `headlineMedium`, `headlineSmall`, `titleLarge`, `titleMedium`, `titleSmall` |
| a paragraph | `RichText` with `wrap: true` |
| `- item` / `1. item` | a `Row` with a bullet or a number and the text; nesting indents by depth |
| a fenced or indented code block | `Code`, with the fence's language as `language` |
| `> quote` | a `Column` with a bar on the left and the quote's blocks inside |
| `---` | `Divider` |
| a GFM table | `Table`, with a `TableColumn` per header cell and a `RichText` inside each `TableCell` |

Inline markup becomes styled runs on the [RichText](richtext.md) that draws the
block: `*italic*` slants, `**bold**` draws heavier, `` `code` `` gets a tinted
pill, `~~struck~~` strikes through and `[links](https://goi.dev)` draw in the
primary colour, underlined. A run breaks across lines with the rest of the
paragraph, so a bold word in the middle of a sentence wraps where it should. An
image keeps its alt text, since a run cannot carry a bitmap. A link is clickable:
a URL opens in the user's browser, a path in the file manager, and `OnLink` on
the paragraph routes it somewhere else — see [Links](richtext.md#links).

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
- **Text selection.** A paragraph is a `RichText`, which is not selectable yet.
- **Syntax colours in a fence without a language.** A fence with no language
  reads as plain text, which is what `Code` does with an unknown name.

---
title: "Code"
---

A syntax-highlighted code block.

[All components](/components/)

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/code-outlined-light.png" alt="Code outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/code-outlined-dark.png" alt="Code outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/code-filled-light.png" alt="Code filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/code-filled-dark.png" alt="Code filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Code {
	language: go
	text:     "fmt.Println(\"hello\")\nreturn nil"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `text` | string | the source; `\n` separates lines |
| `language` | string | any of the ~300 lexer names Chroma knows: `go`, `goi`, `js`, `python`, `sh`, `yaml`, `sql`, `rust`, `html`, `css`, `toml`, …; anything else reads as plain |
| `showCopy` | bool | draws a copy button in the top-right corner; `true` by default |
| `variant` | enum | `outlined` (default, draws a 1dp border) or `filled` (no border) |

## Behaviour

Lines break only on `\n`, never at the box edge: a code block keeps its shape
and a line too long for the box is clipped. The height follows the line count,
so no `height` is needed. Tabs expand to four spaces.

Highlighting colors keywords and function names with `primary`, strings and
attributes with `tertiary`, numbers and type names with `secondary`, and
comments with `onSurfaceVariant`, so the block follows the theme. The lexing is
[Chroma](https://github.com/alecthomas/chroma)'s, so every language it ships
works, including template syntax inside a string.

The text is selectable like prose: drag to select, double click for a word,
triple click for the line's paragraph, Ctrl+C to copy. The copy button in the
corner copies the whole block; it is drawn by default and `showCopy: false`
removes it.

Tabs are expanded to four spaces, because a tab has no advance of its own in the
font. What you see is what is copied, so a selected snippet comes out with
spaces.

## From Go

```go
block := w.MustByID[*ui.Code]("snippet")
block.SetText(source)
block.Language.Set("python")
```

Every element also accepts the [common properties](/guide/common-properties/).

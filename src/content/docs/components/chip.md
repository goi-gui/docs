---
title: "Chip"
---

A compact, rounded element for filters, inputs, suggestions and tags.

[All components](/components/)

<p align="center">
  <strong>assist</strong><br />
  <img src="/img/components/chip-assist-light.png" alt="Chip assist in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/chip-assist-dark.png" alt="Chip assist in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>filter</strong><br />
  <img src="/img/components/chip-filter-light.png" alt="Chip filter in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/chip-filter-dark.png" alt="Chip filter in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>input</strong><br />
  <img src="/img/components/chip-input-light.png" alt="Chip input in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/chip-input-dark.png" alt="Chip input in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>suggestion</strong><br />
  <img src="/img/components/chip-suggestion-light.png" alt="Chip suggestion in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/chip-suggestion-dark.png" alt="Chip suggestion in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Chip {
	label: "Assist"
	leadingIcon:  event
}

Chip {
	label:    "Filter"
	variant:  filter
	selected: true
}

Chip {
	label:   "Input"
	variant: input
}

Chip {
	label:   "Suggestion"
	variant: suggestion
}

Chip {
	label:        "Tag"
	trailingIcon: close
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `leadingIcon` | string | leading Material Symbols ligature |
| `trailingIcon` | string | trailing Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledLeadingIcon` | bool | fills only the leading icon; `filledIcon` fills both slots |
| `filledTrailingIcon` | bool | fills only the trailing icon; `filledIcon` fills both slots |
| `variant` | enum | `assist` (default), `filter`, `input`, `suggestion` |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state; shows a check in place of the leading icon |
| `labelColor` | color | the label's colour; unset follows the variant's content colour |
| `leadingIconColor` | color | the leading glyph's colour, including the check a selected chip shows |
| `trailingIconColor` | color | the trailing glyph's colour |

The chip's outline is the design's to change: `borderThickness: 0` removes it,
and a thickness with `borderColor` replaces it. A thickness alone restyles the
outline the chip already draws, so `borderThickness: 2` is a thicker chip rather
than no chip border.

## From Go

```go
chip := w.MustByID[*ui.Chip]("filter")
chip.OnClick(func(ui.ClickEvent) {
	chip.Selected.Set(!chip.Selected.Get())
})
```

A chip is 32dp tall and pads 16dp at each end. A leading icon (or the check a
selected chip shows instead) sits 8dp from the edge with an 8dp gap, and a
`trailingIcon` costs the same on the other side, so the label box always ends
inside the pill. Selecting a chip therefore relayouts it: the check needs the
same room an icon does.

Every element also accepts the [common properties](/components/#common-properties).

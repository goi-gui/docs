# SearchBar

A text field shaped as a search input, with a leading search glyph.

[All components](../components.md)

<p align="center">
  <img src="/img/components/searchbar-light.png" alt="SearchBar in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/searchbar-dark.png" alt="SearchBar in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
SearchBar {
	label:       "Search"
	placeholder: "Search components"
	width:       360
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `text` | string | current value |
| `placeholder` | string | shown while the value is empty |
| `leadingIcon` | string | leading Material Symbols ligature |
| `trailingIcon` | string | trailing Material Symbols ligature |
| `variant` | enum | — (always an elevated pill) |
| `disabled` | bool | dims the element and blocks input |

## From Go

```go
search := w.MustByID[*ui.SearchBar]("search")
search.OnEdit(func(q string) { filter(q) })
```

Every element also accepts the [common properties](../components.md#common-properties).

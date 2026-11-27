---
title: "SearchBar"
---

A text field shaped as a search input, with a leading search glyph and two
optional icon-square slots.

[All components](/components/)

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

## Leading and trailing bodies

The icon properties take a Material Symbols name. When the bar needs something
else in one of the 40dp columns, `$leading` and `$trailing` take any element and
layout centres it there:

```goi
SearchBar {
	label:       "Search"
	placeholder: "Search components"

	$leading {
		IconButton { icon: tune }
	}

	$trailing {
		IconButton { icon: close }
	}
}
```

A `$leading` body replaces the built-in search glyph; the query keeps the same
52dp start, so the text does not jump. An explicit `trailingIcon` wins over
`$trailing`, so one design can use either without a condition.

A trailing clear button can empty the bar without a Go handler:

```goi
SearchBar {
	id: "search"

	$trailing {
		IconButton {
			icon:    close
			onClick: search.clear()
		}
	}
}
```

`clear()` puts the caret at the start and keeps the focus. From Go, call
`search.Clear()`.

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `text` | string | current value |
| `placeholder` | string | shown while the value is empty |
| `trailingIcon` | string | trailing Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledTrailingIcon` | bool | fills only the trailing icon; `filledIcon` fills both slots |
| `disabled` | bool | dims the element and blocks input |
| `autoFocus` | bool | focuses the field as soon as it is shown; off by default |

## From Go

```go
search := w.MustByID[*ui.SearchBar]("search")
search.OnEdit(func(q string) { filter(q) })
```

Every element also accepts the [common properties](/guide/common-properties/).

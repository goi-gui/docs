---
title: "List"
---

A vertical container for `ListItem`s and `MenuItem`s.

[All components](/components/)

<p align="center">
  <img src="/img/components/list-light.png" alt="List in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/list-dark.png" alt="List in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
List {
	id:      results
	spacing: 4

	ListItem {
		label: "Inbox"
		leadingIcon:  inbox
	}

	ListItem {
		label: "Drafts"
		leadingIcon:  draft
	}
}
```

For rows that come from Go, loop over a bridge slice; `ui.SetData` rebuilds the
rows when the data changes:

```goi
List {
	id: results

	for _, it := range bridge.items {
		ListItem {
			label: it.label
		}
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
ui.SetData(w, "items", items)
```

`SetData` rebuilds the rows the loop built, so a refresh cannot stack duplicates.

Every element also accepts the [common properties](/components/#common-properties).

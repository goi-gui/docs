---
title: "Column"
---

Stacks children vertically, top to bottom.

[All components](/components/)

<p align="center">
  <img src="/img/components/column-light.png" alt="Column in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/column-dark.png" alt="Column in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Column {
	spacing:        12
	padding:        16
	crossAxisAlign: stretch

	Text {
		text: "Title"
		role: "titleMedium"
	}

	Text {
		text: "Body"
		role: "bodyMedium"
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

A column is also the usual list: a `for … range` over a bridge slice, which
`ui.SetData` rebuilds when the data changes.

```goi
Column {
	id:      list
	spacing: 8

	for _, it := range bridge.items {
		ListItem {
			label: it.label
		}
	}
}
```

```go
ui.SetData(w, "items", items)
```

Every element also accepts the [common properties](/components/#common-properties).

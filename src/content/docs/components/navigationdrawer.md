---
title: "NavigationDrawer"
---

A modal drawer that lists the same destinations as the rail and bar.

[All components](/components/)

<p align="center">
  <img src="/img/components/navigationdrawer-light.png" alt="NavigationDrawer in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/navigationdrawer-dark.png" alt="NavigationDrawer in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
NavigationDrawer {
	label: "Categories"

	NavigationItem {
		label:    "Home"
		leadingIcon:     home
		selected: true
	}

	NavigationItem {
		label: "Search"
		leadingIcon:  search
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `animation` | enum | `slide` (default), `fade`, `none`; how the selected indicator moves |

`animation` controls the band behind the selected destination. `slide` moves it from the old item to the new one, `fade` crossfades the two, and `none` changes it at once.

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
drawer := w.MustByID[*ui.NavigationDrawer]("drawer")
drawer.OnClick(func(ui.ClickEvent) { closeDrawer() })
```

Every element also accepts the [common properties](/guide/common-properties/).

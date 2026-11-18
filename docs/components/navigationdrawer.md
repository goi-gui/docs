# NavigationDrawer

A modal drawer that lists the same destinations as the rail and bar.

[All components](../components.md)

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
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

`animation` controls the band behind the selected destination. `slide` moves it from the old item to the new one, `fade` crossfades the two, and `none` changes it at once.

## From Go

```go
drawer := w.MustByID[*ui.NavigationDrawer]("drawer")
drawer.OnClick(func(ui.ClickEvent) { closeDrawer() })
```

Every element also accepts the [common properties](../components.md#common-properties).

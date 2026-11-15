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
		icon:     home
		selected: true
	}

	NavigationItem {
		label: "Search"
		icon:  search
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
drawer := ui.MustByID[*ui.NavigationDrawer](w, "drawer")
drawer.OnClick(func(ui.ClickEvent) { closeDrawer() })
```

Every element also accepts the [common properties](../components.md#common-properties).

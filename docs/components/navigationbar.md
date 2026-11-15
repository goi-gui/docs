# NavigationBar

The bottom navigation bar for the compact window class.

[All components](../components.md)

<p align="center">
  <img src="/img/components/navigationbar-light.png" alt="NavigationBar in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/navigationbar-dark.png" alt="NavigationBar in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
NavigationBar {
	id:      navbar
	visible: responsive {
		base: true
		sm: false
	}

	NavigationItem {
		label:    "Home"
		icon:     home
		selected: true
	}

	NavigationItem {
		label: "Search"
		icon:  search
	}

	NavigationItem {
		label: "Profile"
		icon:  person
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
bar := ui.MustByID[*ui.NavigationBar](w, "navbar")
bar.OnSelect(func(i int) { show(i) })
```

Every element also accepts the [common properties](../components.md#common-properties).

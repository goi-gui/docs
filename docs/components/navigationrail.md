# NavigationRail

The side navigation rail for medium and expanded windows.

[All components](../components.md)

<p align="center">
  <img src="/img/components/navigationrail-light.png" alt="NavigationRail in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/navigationrail-dark.png" alt="NavigationRail in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
NavigationRail {
	id:            rail
	visible:       responsive {
		base: false
		sm: true
	}
	paddingBottom: 16

	NavigationItem {
		label:    "Home"
		leadingIcon:     home
		selected: true
	}

	NavigationItem {
		label: "Search"
		leadingIcon:  search
	}

	// A rail's own actions sit at the bottom, under the destinations.
	Rectangle {
		flex: 1
	}

	Switch {
		id:        theme
		width:     52
		alignSelf: center
		iconOn:    dark_mode
		iconOff:   light_mode
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
rail := w.MustByID[*ui.NavigationRail]("rail")
rail.OnSelect(func(i int) { show(i) })

// The index counts destinations only, so the theme switch below them does not
// shift the page list.
```

Every element also accepts the [common properties](../components.md#common-properties).

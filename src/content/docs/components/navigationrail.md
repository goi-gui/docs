---
title: "NavigationRail"
---

The side navigation rail for medium and expanded windows.

[All components](/components/)

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
| `animation` | enum | `slide` (default), `fade`, `none`; how the selected indicator moves |

`animation` controls the band behind the selected destination. `slide` moves it from the old item to the new one, `fade` crossfades the two, and `none` changes it at once.

The rail draws no edge line of its own; it sits on `surfaceContainer` so it reads
as its own surface. A design that wants a divider asks for one, on whichever
side it wants:

```goi
NavigationRail {
	borderRightThickness: 1
	borderRightColor:     theme.outlineVariant
	// …
}
```

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
rail := w.MustByID[*ui.NavigationRail]("rail")
rail.OnSelect(func(i int) { show(i) })

// The index counts destinations only, so the theme switch below them does not
// shift the page list.
```

Every element also accepts the [common properties](/guide/common-properties/).

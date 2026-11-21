---
title: "NavigationBar"
---

The bottom navigation bar for the compact window class.

[All components](/components/)

<p align="center">
  <strong>compact</strong><br />
  <img src="/img/components/navigationbar-light.png" alt="NavigationBar compact in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/navigationbar-dark.png" alt="NavigationBar compact in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>medium</strong><br />
  <img src="/img/components/navigationbar-medium-light.png" alt="NavigationBar medium in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/navigationbar-medium-dark.png" alt="NavigationBar medium in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
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
		leadingIcon:     home
		selected: true
	}

	NavigationItem {
		label: "Search"
		leadingIcon:  search
	}

	NavigationItem {
		label: "Profile"
		leadingIcon:  person
	}
}
```

## Compact and medium

`variant: compact` (the default) stacks each destination: the icon sits above its
label, and the selected one gets a pill around the icon. `variant: medium` puts
the icon and the label side by side in one pill, centred in the destination, and
leaves an idle destination without a pill. Both are 80dp tall; a design picks one
per bar:

```goi
NavigationBar {
	variant: medium
	// …
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `compact` (default) or `medium`; where the icon and label sit |
| `animation` | enum | `slide` (default), `fade`, `none`; how the selected indicator moves |

`animation` controls the band behind the selected destination. `slide` moves it from the old item to the new one, `fade` crossfades the two, and `none` changes it at once.

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
bar := w.MustByID[*ui.NavigationBar]("navbar")
bar.OnSelect(func(i int) { show(i) })
```

Every element also accepts the [common properties](/guide/common-properties/).

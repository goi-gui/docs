---
title: "Tabs"
---

A tab bar that groups `Tab` children.

[All components](/components/)

<p align="center">
  <strong>secondary</strong><br />
  <img src="/img/components/tabs-light.png" alt="Secondary tabs in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/tabs-dark.png" alt="Secondary tabs in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>primary</strong><br />
  <img src="/img/components/tabs-primary-light.png" alt="Primary tabs in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/tabs-primary-dark.png" alt="Primary tabs in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Tabs {
	variant: primary // icons stack over the labels, secondary is the default

	Tab {
		label:       "Flights"
		leadingIcon: flight
		selected:    true
	}

	Tab {
		label:       "Trips"
		leadingIcon: luggage
	}

	Tab {
		label:       "Explore"
		leadingIcon: explore
	}
}

Tabs {
	Tab {
		label:    "Overview"
		selected: true
	}

	Tab {
		label: "Specs"
	}

	Tab {
		label: "Details"
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | `secondary` (default) or `primary`; the indicator and the bar's height |

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## Primary and secondary

`variant: secondary` (the default) is the shorter bar: the indicator spans the
tab's cell, and a text-only tab sits centred in it. `variant: primary` puts an
icon above its label and draws the indicator under the content, not the cell,
so a row of top-level destinations reads as a group. The primary bar reserves
64dp of height; secondary keeps 48dp. Both take `leadingIcon`, and the selected
tab uses the primary colour.

The bar underlines the child whose own `selected` is true, so a design can open
a page on a given tab. A `Tabs` whose `SelectedIndex` was set from Go still
underlines that child while no tab is marked selected.

## From Go

```go
tabs := w.MustByID[*ui.Tabs]("tabs")
tabs.OnSelect(func(i int) { showPanel(i) })
```

Every element also accepts the [common properties](/guide/common-properties/).

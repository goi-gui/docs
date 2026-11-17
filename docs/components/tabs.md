# Tabs

A tab bar that groups `Tab` children.

[All components](../components.md)

<p align="center">
  <img src="/img/components/tabs-light.png" alt="Tabs in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/tabs-dark.png" alt="Tabs in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
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
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

The bar underlines the child whose own `selected` is true, so a design can open
a page on a given tab. A `Tabs` whose `SelectedIndex` was set from Go still
underlines that child while no tab is marked selected.

## From Go

```go
tabs := w.MustByID[*ui.Tabs]("tabs")
tabs.OnSelect(func(i int) { showPanel(i) })
```

Every element also accepts the [common properties](../components.md#common-properties).

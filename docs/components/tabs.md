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
| `variant` | enum | — (no style variants) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
tabs := w.MustByID[*ui.Tabs]("tabs")
tabs.OnSelect(func(i int) { showPanel(i) })
```

Every element also accepts the [common properties](../components.md#common-properties).

---
title: "SideSheet"
---

A surface anchored to a side edge, for settings or detail.

[All components](/components/)

<p align="center">
  <img src="/img/components/sidesheet-light.png" alt="SideSheet in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/sidesheet-dark.png" alt="SideSheet in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
SideSheet {
	label:  "Filters"
	width:  320
	height: 480
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
side := w.MustByID[*ui.SideSheet]("filters")
side.SetVisible(true)
```

Every element also accepts the [common properties](/components/#common-properties).

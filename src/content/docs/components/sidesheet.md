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

## Showing and hiding

A sheet is a surface, not a window: it has no open state of its own. Put it in a
`Stack` or a `Positioned`, keep a full-window `Rectangle` behind it as the
scrim, and toggle `visible` on both:

```goi
Rectangle {
	id:         sheetScrim
	width:      100%
	height:     100%
	background: #00000066
	visible:    false
}

SideSheet {
	id:      sheet
	visible: false
	label:   "Share"
}
```

The same `visible` property is what `SetVisible` drives from Go. Animate the
`Positioned.Top` that holds the sheet (or its `translateY`) instead of animating
`visible`, so the surface slides in over the scrim. `onClickOutside` on the
sheet is a convenient way to dismiss it; the [Dialog](/components/dialog/) page
shows the same scrim pattern.

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## From Go

```go
side := w.MustByID[*ui.SideSheet]("filters")
side.SetVisible(true)
```

Every element also accepts the [common properties](/guide/common-properties/).

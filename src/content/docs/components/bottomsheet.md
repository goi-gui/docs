---
title: "BottomSheet"
---

A surface anchored to the bottom edge.

[All components](/components/)

<p align="center">
  <img src="/img/components/bottomsheet-light.png" alt="BottomSheet in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/bottomsheet-dark.png" alt="BottomSheet in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
BottomSheet {
	label:  "Share"
	width:  320
	height: 160
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

BottomSheet {
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
sheet := w.MustByID[*ui.BottomSheet]("sheet")
sheet.SetVisible(true)

// Animate the placement, not the node: a sheet that grows is usually a
// Positioned whose top edge moves.
frame := w.MustByID[*ui.Positioned]("sheetFrame")
app.Animate(&frame.Top, 300, 250*time.Millisecond, ui.Emphasized)
```

Every element also accepts the [common properties](/guide/common-properties/).

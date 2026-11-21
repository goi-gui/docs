---
title: "Positioned"
---

Anchors a child inside a Stack. Only valid as a direct child of `Stack`.

[All components](/components/)

<p align="center">
  <img src="/img/components/positioned-light.png" alt="Positioned in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/positioned-dark.png" alt="Positioned in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Stack {
	height: 200

	Positioned {
		left: 16
		top:  16

		Card {
			label: "Top left"
			width: 160
		}
	}

	Positioned {
		right:  16
		bottom: 16

		Chip {
			label: "Bottom right"
		}
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `left` | number | distance from the stack's left edge; `-1` is auto |
| `top` | number | distance from the stack's top edge; `-1` is auto |
| `right` | number | anchor to the right edge; `-1` is auto |
| `bottom` | number | anchor to the bottom edge; `-1` is auto |
| `translateX` | number | post-anchor horizontal shift, for enter/exit motion |
| `translateY` | number | post-anchor vertical shift |

## From Go

```go
frame := w.MustByID[*ui.Positioned]("drawer")
frame.TranslateX.Set(-320)
slide := app.Animate(&frame.TranslateX, 0, 250*time.Millisecond, ui.Emphasized)
slide.Stop() // and it can chain with .Then(d, ease, fn)
```

Every element also accepts the [common properties](/components/#common-properties).

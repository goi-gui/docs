# GestureDetector

A hit area that reports gestures, the way Flutter's detector works. It wraps its
child, sizes to it, and adds a double tap, a long press, a pan and the pointer's
position beside the click every element already has.

[All components](../components.md)

<p align="center">
  <img src="/img/components/gesturedetector-light.png" alt="GestureDetector in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/gesturedetector-dark.png" alt="GestureDetector in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
GestureDetector {
	cursor: grab

	Card {
		label: "Drag me"
	}
}
```

The events are handler calls, like every other event:

```goi
bridge {
	onFlip  func()
	onHold  func()
	onHover func(on bool)
}

GestureDetector {
	onDoubleTap: bridge.onFlip()
	onLongPress: bridge.onHold()
	onMouseEnter: bridge.onHover(true)
	onMouseLeave: bridge.onHover(false)
	// …
}
```

The child is laid out like a `Stack`: an undeclared child fills the box, and
`Positioned` works inside it.

## Properties

| Property | Type | Notes |
|---|---|---|
| `onDoubleTap` | event | a second tap on the same detector within 300ms |
| `onLongPress` | event | a press that stays within 8dp for 500ms |
| `onPanStart` | event | the pointer left the 8dp slop with the button down |
| `onPanUpdate` | event | each move after the pan started |
| `onPanEnd` | event | the button came up after a pan |
| `onMouseEnter` | event | the pointer entered the detector's box |
| `onMouseMove` | event | the pointer moved while over it, once per move |
| `onMouseLeave` | event | the pointer left the box, or the window |

`onClick` comes from every element and fires on a tap without a pan or a long
press. A double tap fires `onDoubleTap` instead of `onClick` for its second tap,
and a long press fires `onLongPress` without a click on release, so one gesture
never runs an action twice.

Gesture and mouse handlers take no `event`: a click, a pan and a pointer
position carry geometry, not a scalar a design could use. Go gets it, though:

```go
card := w.MustByID[*ui.GestureDetector]("card")
card.OnPanStart(func(ui.PanEvent) { start = box.TranslateX.Get() })
card.OnPanUpdate(func(e ui.PanEvent) { box.TranslateX.Set(start + e.DX) })
card.OnDoubleTap(func(ui.ClickEvent) { flip() })
card.OnMouseMove(func(e ui.MouseEvent) { hint.Set(fmt.Sprintf("%.0f, %.0f", e.X, e.Y)) })
```

`ui.PanEvent` carries `X`, `Y` and the step's `DX`/`DY`; `ui.MouseEvent` carries
the pointer's `X` and `Y` in window coordinates. A pan owns the gesture, so a
scroll view under the detector does not also scroll while the pointer drags.

## From Go

```go
tap := w.MustByID[*ui.GestureDetector]("tap")
off := tap.OnLongPress(func(ui.ClickEvent) { hold(true) })
off() // unsubscribe
```

Every element also accepts the [common properties](../components.md#common-properties).

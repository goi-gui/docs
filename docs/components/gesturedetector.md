# GestureDetector

A hit area that reports gestures, the way Flutter's detector works. It wraps its
child, sizes to it, and adds a double tap, a long press and a pan beside the
click every element already has.

[All components](../components.md)

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
	onFlip func()
	onHold func()
}

GestureDetector {
	onDoubleTap: bridge.onFlip()
	onLongPress: bridge.onHold()
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

`onClick` comes from every element and fires on a tap without a pan or a long
press. A double tap fires `onDoubleTap` instead of `onClick` for its second tap,
and a long press fires `onLongPress` without a click on release, so one gesture
never runs an action twice.

Gesture handlers take no `event`: a click and a pan carry geometry, not a scalar
a design could use. Go gets it, though:

```go
card := ui.MustByID[*ui.GestureDetector](w, "card")
card.OnPanStart(func(ui.PanEvent) { start = box.TranslateX.Get() })
card.OnPanUpdate(func(e ui.PanEvent) { box.TranslateX.Set(start + e.DX) })
card.OnDoubleTap(func(ui.ClickEvent) { flip() })
```

`ui.PanEvent` carries `X`, `Y` and the step's `DX`/`DY`. A pan owns the gesture,
so a scroll view under the detector does not also scroll while the pointer drags.

## From Go

```go
tap := ui.MustByID[*ui.GestureDetector](w, "tap")
off := tap.OnLongPress(func(ui.ClickEvent) { hold(true) })
off() // unsubscribe
```

Every element also accepts the [common properties](../components.md#common-properties).

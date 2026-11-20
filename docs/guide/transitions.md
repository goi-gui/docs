---
title: Transitions
sidebar_label: Transitions
---

# Transitions

`transition` animates a property when its value changes. The value can come from
an expression, a conditional, a bridge field or a Go setter; the transition only
says how the property travels from the current value to the new one.

```goi
Rectangle {
	width:      bridge.isCollapsed ? 200 : 500
	height:     bridge.isCollapsed ? 80 : 260
	background: conditional {
		theme.primaryContainer: !bridge.isCollapsed
		theme.surfaceContainer: bridge.isCollapsed
	}
	transition: size 300ms, background 200ms
}
```

The first value is written directly. Every later change eases from whatever the
property currently shows, so a second click halfway through a move continues
from the middle instead of jumping back.

## The syntax

```goi
transition: width 500ms, height 500ms, background 1s
transition: width 500ms ease-out 100ms, opacity 300ms linear
```

Each entry is `<property> <duration> [timing-function] [delay]`:

- **property** is a property on the same element. `size` writes width and
  height; `gap` and `spacing` name the same cell; `all` is the fallback for every
  property not named explicitly.
- **duration** and **delay** use `ms` or `s`. A delay may be negative, which
  starts that entry partway through, like CSS.
- **timing-function** is optional; without it the entry uses goi's cubic
  ease-out.
- A named entry wins over `all`. A property with no entry, and no `all`, changes
  at once.
- `transition: none` removes the transitions from the element.
- A transition may only name properties the element has. A typo is a checker
  error, not a silently ignored entry.

## Timing functions

| Function | Shape |
|---|---|
| `linear` | constant speed; good for a progress-like move |
| `ease` | the CSS ease curve: a quick middle and a soft landing |
| `ease-in` | starts slowly |
| `ease-out` | arrives softly |
| `ease-in-out` | slow at both ends |
| *(omitted)* | goi's cubic ease-out; the original default |

```goi
Column {
	opacity:     bridge.visible ? 1 : 0
	transition: opacity 250ms ease-in
}

Rectangle {
	width:      bridge.wide ? 480 : 240
	transition: width 400ms linear 100ms
}
```

## What can move

The transition machinery handles numbers, colours, `rotate`, `scale` and
`shadow`:

- **Numbers** cover sizes and layout: `width`, `height`, `size`, `padding`,
  `margin`, `borderThickness`, `radius`, `opacity`, `fontSize`, `gap` and
  `spacing`, scrollbar sizes and a `Positioned`'s `translateX`/`translateY`.
- **Colours** cover `background`, `color`, `borderColor` and the other colour
  properties. A solid colour eases channel by channel.
- **`rotate` and `scale`** interpolate their angle and factors.
- **`shadow`** interpolates its layers. A list with a different number of layers
  fades layers in or out instead of snapping.

A gradient is a whole value, not a colour: changing a `background` gradient
switches it at once. Transitioning a layout property re-lays out each frame;
paint-only properties such as opacity or translate are cheaper.

## A complete example

```goi
bridge {
	open    bool
	onToggle func()
}

Window {
	Column {
		padding: 24
		spacing: 16

		Button {
			label:   bridge.open ? "Collapse" : "Expand"
			onClick: bridge.onToggle()
		}

		Column {
			width:      320
			height:     bridge.open ? 220 : 80
			padding:    20
			radius:     16
			background: conditional {
				theme.primaryContainer: bridge.open
				theme.surfaceContainer: !bridge.open
			}
			transition: size 300ms ease-out, background 200ms

			Text {
				text: "The card grows and changes colour together."
				wrap: true
			}
		}
	}
}
```

The Go side only flips the value; the design owns the motion:

```go
open := false

win.Bind(func(w *ui.Window) error {
	ui.SetData(w, "open", open)
	ui.SetHandler(w, "onToggle", func() {
		open = !open
		ui.SetData(w, "open", open)
	})
	return nil
})
```

## From Go

A Go setter goes through the same transition. `Prop.Set` is the entry point, so
a property with a transition eases from its current value even when the write
comes from code:

```go
box.SetWidth(320)          // width 500ms in the design
box.SetBackground(next)    // background 1s in the design
```

The design's `size` shorthand writes both axes, and a transition on `size` (or
on width and height) animates both. A setter called before the first frame
writes directly, which avoids a loading hop from a default value.

## Interruptions and updates

A running transition is not restarted from the old start value. A new target
reads the cell's current interpolated value, so an interrupted move reverses
smoothly from where it was.

A list row that updates in place keeps its transition. A changed range, a
condition that adds or removes a row, or a different row shape rebuilds the
rows, and a rebuilt row starts its transitions fresh.

## Transitions, tweens and themes

Use `transition` when a property's new value is already the thing the design
wants to show and the motion is a simple ease from the current value. Use a
[tween](tweens.md) for a sequence, a custom easing, several properties driven by
one clock, or a value that is not a property.

A `transition` on a colour follows a new role value too, including a scheme
change. To move the whole window between schemes, use
[`themeTransition`](theming.md) instead: it blends every role together, while a
property transition only moves the properties that have an entry.

## See also

- [syntax](../syntax.md#transitions) — the terse reference.
- [Tweens](tweens.md) — Go-driven animation.
- [Hero](../components/hero.md) — a shared element that flies between two pages.
- [Theming](theming.md) — `themeTransition`, schemes and seeds.
- [Shadows](shadows.md), [Rotate](rotate.md) and [Scale](scale.md) — the values a
  transition can interpolate.

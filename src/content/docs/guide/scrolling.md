---
title: "Scrolling"
---

Any element with `scroll: true` can move its content: the wheel, a drag, a
fling and the scrollbar all work, and the element keeps a clamped offset. A
`Column`, `Row`, `Flex`, `Carousel` and `NavigationRail` scroll by default; on
the other elements scrolling starts off. The scrollbar properties, snap
properties and `autoScroll` are listed with the other
[common properties](/guide/common-properties/).

The axis is the element's own, so a `Column` moves down, a `Row` or a
`Carousel` moves sideways, and a `Table` uses its vertical axis. A scroll
container reports its offset and both edges, and a child can snap to a line.

## Scroll snapping

A scroll container can settle on its children. The container says how strictly
(`scrollSnapType`) and each child says which edge lines up
(`scrollSnapAlign`); the axis is the container's own, so a `Column` snaps
vertically and a `Row` or a `Carousel` sideways without an `x`/`y` suffix:

```goi
Column {
	scrollSnapType:    mandatory
	scrollSnapStop:    stop
	scrollPadding:     10
	width:             100%
	height:            300

	for range 10 {
		Rectangle {
			width:           100%
			height:          200
			scrollSnapAlign: start
		}
	}
}
```

- `mandatory` always settles on a snap point; `proximity` takes one only when
  the gesture ends within a quarter of the frame of it, so a hand that stops
  mid-block keeps that place.
- A notched wheel moves one snap point per notch. A touchpad swipe, a drag and
  a fling scroll freely and settle when they end; `scrollSnapStop: stop` stops a
  fling at the first point it reaches instead of coasting through several.
- `scrollPadding` insets the `start` and `end` lines from the frame, which is
  what keeps a card from sitting flush against the edge. `center` ignores it.
- Snapping is a property of any scrolling element, so it works on a `Column`, a
  `Row`, a `List`, a `Carousel`, a `Table` and the panels that scroll on their
  own. `scrollSnapAlign` on a child of a non-scrolling parent does nothing.

## Scrolling from a design or Go

Every scrolling element answers the same shortcuts: a raw offset, a child by
position, or a child by id, each with an instant and a smooth form, plus
auto-scroll. The axis is the element's own, so a `Column` moves down, a `Row`
or a `Carousel` moves sideways, and a `Table` uses its vertical axis.

```goi
Column {
	id:      page
	height:  320
	scroll:  true

	Button {
		label:   "Center the fifth card"
		onClick: page.scrollToNthChildSmooth(5, center, 400ms)
	}

	Button {
		label:   "Back to the top"
		onClick: page.scrollToSmooth(0, 300ms)
	}

	for range 10 {
		Rectangle {
			width:  100%
			height: 80
		}
	}
}
```

A child-scroll call takes an optional alignment after the child: `start` (the
default), `center` or `end`. `center` puts the child's middle in the middle of
the viewport, and `end` lines its trailing edge up with the far edge, so the
last rows can be brought fully into view. The smooth forms take a duration such
as `300ms`; a duration of `0` jumps. A wheel, a drag or a scrollbar grab cancels
the flight where it is, because that gesture takes over the offset.

| In a design | From Go | Moves to |
|---|---|---|
| `page.scrollTo(200)` | `page.ScrollTo(200)` | offset 200 |
| `page.scrollToSmooth(200, 300ms)` | `page.ScrollToSmooth(200, 300*time.Millisecond)` | offset 200, eased |
| `page.scrollToNthChild(5)` | `page.ScrollToNthChild(5)` | the fifth visible direct child, at the start |
| `page.scrollToNthChild(5, center)` | `page.ScrollToNthChild(5, ui.ScrollCenter)` | the fifth child, centered |
| `page.scrollToNthChildSmooth(5, center, 300ms)` | `page.ScrollToNthChildSmooth(5, 300*time.Millisecond, ui.ScrollCenter)` | the fifth child, centered and eased |
| `page.scrollToChild("row7")` | `page.ScrollToChild("row7")` | an element anywhere inside the area, at the start |
| `page.scrollToChild("row7", end)` | `page.ScrollToChild("row7", ui.ScrollEnd)` | that element, end-aligned |
| `page.scrollToChildSmooth("row7", end, 300ms)` | `page.ScrollToChildSmooth("row7", 300*time.Millisecond, ui.ScrollEnd)` | that element, end-aligned and eased |
| `page.autoScroll(true)` | `page.AutoScroll(true)` | follow the end as content grows and jump there now |
| `page.autoScrollSmooth(true, 300ms)` | `page.AutoScrollSmooth(true, 300*time.Millisecond)` | the same, eased over the duration |

A design writes the alignment between the child and the duration, matching the
first example. Go keeps the duration next to the other required argument and
takes the alignment last, so a plain `ScrollToNthChildSmooth(5, 300*time.Millisecond)`
still starts-aligned. The alignment is a `ui.ScrollAlign`: `ui.ScrollStart`,
`ui.ScrollCenter` or `ui.ScrollEnd`.

`NthChild` counts from one among the direct children that are visible, and the
id form finds a descendant at any depth. The Go methods return `false` when the
element does not scroll, the index is out of range or the id is not inside it,
so a caller can tell a miss from a move. An offset past the end clamps when it is
read, so it follows the content if the content later grows.

## Scroll events

A scroll area reports every movement and both edges:

```goi
List {
	id:              chat
	onScroll:        bridge.onChatScroll(event.x, event.y, event.byUser)
	onScrollToEnd:   bridge.onChatAtEnd()
	onScrollToStart: bridge.onChatAtStart()
}
```

`onScroll` carries the clamped `x` and `y` offsets, the largest offsets the
content allows as `maxX` and `maxY`, and `byUser`, which is `true` for a wheel,
drag, fling or scrollbar grab and `false` for a programmatic move or an
auto-scroll. `progress` is the primary axis from `0` at the start to `1` at the
end, and `0` when the content does not overflow. `onScrollToEnd` and
`onScrollToStart` fire once when the primary axis arrives at that edge; a short
area that does not overflow counts as both. The same handlers are on every
element, because any element with `scroll: true` can move.

From Go the subscription is the same shape:

```go
chat := w.MustByID[*ui.List]("chat")
chat.OnScroll(func(e ui.ScrollEvent) {
	fmt.Println(e.X, e.Y, e.MaxX, e.MaxY, e.Progress, e.ByUser)
})
chat.OnScrollToEnd(func() { showJumpToLatest(false) })
```

## Auto-scroll

`autoScroll: true` follows the end of the content as it grows. The follow pauses
the moment the reader scrolls away and starts again when the end is reached, so
a chat can append messages without pulling someone back from the history they
are reading.

```goi
List {
	id:         chat
	autoScroll: true
}
```

From Go, call `AutoScroll(true)` to enable it and jump to the current end, or
`AutoScrollSmooth(true, 300ms)` to ease there and keep that duration for later
growth. `AutoScroll(false)` stops it. The methods return nothing; the property
is readable as `autoScroll` and the state via `AutoScrollEnabled` and
`ScrollAtEnd`.

```go
chat := w.MustByID[*ui.List]("chat")
chat.AutoScrollSmooth(true, 300*time.Millisecond)
```

The `ScrollEvent` type also carries `MaxX`, `MaxY` and `Progress`, so a handler
can render a scrollbar or a "jump to latest" button from the same event.

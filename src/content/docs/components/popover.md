---
title: "Popover"
---

A surface that floats against its children. The children are the anchor, laid
out as a row; everything written in the `$popover` slot is the panel, which
hangs 8dp below them and lines up with `align`. The panel is closed until
`show: true`, so a design opens it as a condition of its own state.

[All components](/components/)

<p align="center">
  <img src="/img/components/popover-light.png" alt="Popover in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/popover-dark.png" alt="Popover in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Popover {
	align: start // start | center | end, against the anchor's own box
	show:  true  // opens the panel; false by default

	Button { label: "Share" }

	$popover {
		Card {
			label:      "Anyone with the link"
			supporting: "Link sharing is on"
			width:      240
			height:     96
		}
	}
}
```

The panel is an ordinary child of the `Popover`, so paint and hit-testing reach
it and it can take the common properties. It floats outside the popover's own
box, which stays as small as the anchor. Two things follow from being an
overlay: the panel is not cut by the element that holds it, and it paints above
the siblings written after it without naming a `zIndex`. When it would leave the
window it flips above the anchor, and a panel wider than the window slides in
from the edge rather than hanging off it.

The branch that holds a panel paints above its siblings, which is what keeps the
panel on top of the elements written after its host. That lift is a default, not
a rule that beats everything: an element with an explicit `zIndex` paints above
it. A modal drawer or dialog written after a page that contains a popover needs
`zIndex` for that reason.

A scrolling ancestor is the one box a panel does not escape, but only once it
really scrolls. The panel belongs to the scroll it was written in: it moves with
its anchor, is cut at the scroller's frame like the content, and disappears when
the anchor is scrolled out of view — a popover at the end of a long `Column`
shows nothing until you scroll down to it. A `Column` that merely wraps the
popover has nothing to scroll, so it lets the panel out; a card or a `ClipRRect`
does the same, which is what keeps a menu-like popover inside a raised
surface.

The slot is written once; `show` decides whether the panel is on screen, so a
bridge value can open and close it without rebuilding the tree.

```goi
bridge {
	sharing   bool
	onDismiss func()
}

Popover {
	show:           bridge.sharing
	onClickOutside: bridge.onDismiss()

	Button { label: "Share" }

	$popover { Card { label: "Anyone with the link" height: 96 } }
}
```

`onClickOutside` is how it goes away again: a press anywhere outside the
popover — the anchor and the panel both count as inside — reaches the handler on
the press itself. It is on every element, not only this one; see the
[events table](/guide/events/). While `show` is false the handler stays quiet,
so a popover that stays mounted does not hear every press on the page.

## Properties

| Property | Type | Notes |
|---|---|---|
| `align` | enum | `start`, `center`, `end`; lines the panel up with the anchor's box |
| `show` | bool | opens the `$popover` panel; `false` by default |
| `spacing` | number | gap between the anchor children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## Showing and hiding

`show` is the state: paint, hit-testing, focus traversal and `onClickOutside`
all follow it. It can be a design expression, as above, or a method call from an
event when the design has no bridge value for it. A `Popover` has `toggle()` and
`show(bool)`, and both write the same property:

```goi
Popover {
	id: menu

	Button {
		label:   "Menu"
		onClick: menu.toggle()
	}

	$popover {
		Card {
			label: "Panel"
		}
	}
}

Button {
	label:   "Close menu"
	onClick: menu.show(false)
}
```

A popover with no `$popover` slot has nothing to show; the property still
changes so the design can read it, but no panel appears.

## From Go

```go
pop := w.MustByID[*ui.Popover]("pop")
pop.Align.Set("end")
pop.Shown.Set(true) // the show property
pop.Show(true)      // the same, or pop.Show(false)
pop.Toggle()        // flips and reports the new state
```

Every element also accepts the [common properties](/guide/common-properties/).

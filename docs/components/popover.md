# Popover

A surface that floats against its children. The children are the anchor, laid
out as a row; everything written in the `$popover` slot is the panel, which
hangs 8dp below them and lines up with `align`.

[All components](../components.md)

<p align="center">
  <img src="/img/components/popover-light.png" alt="Popover in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/popover-dark.png" alt="Popover in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Popover {
	align: start // start | center | end, against the anchor's own box

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
the siblings written after it — no `zIndex` is needed. When it would leave the
window it flips above the anchor, and a panel wider than the window slides in
from the edge rather than hanging off it.

A design that only shows the panel sometimes puts the slot inside a condition;
the panel then appears and disappears with that branch. `onClickOutside` is how
it goes away again: a press anywhere outside the popover — the anchor and the
panel both count as inside — reaches the handler on the press itself.

```goi
bridge {
	sharing   bool
	onDismiss func()
}

Popover {
	onClickOutside: bridge.onDismiss()

	Button { label: "Share" }

	if bridge.sharing {
		$popover { Card { label: "Anyone with the link" height: 96 } }
	}
}
```

`onClickOutside` is on every element, not only this one; see the
[events table](../components.md#events). While the panel is hidden the handler
stays quiet, so a popover that stays mounted does not hear every press on the
page.

## Properties

| Property | Type | Notes |
|---|---|---|
| `align` | enum | `start`, `center`, `end`; lines the panel up with the anchor's box |
| `spacing` | number | gap between the anchor children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

## From Go

```go
pop := ui.MustByID[*ui.Popover](w, "pop")
pop.Align.Set("end")
```

Every element also accepts the [common properties](../components.md#common-properties).

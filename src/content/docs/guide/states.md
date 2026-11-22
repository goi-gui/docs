---
title: "State"
sidebar:
  label: "State"
---

A `state` modifier picks a property value from the element's interaction or
control state. It is the value form of a CSS pseudo-class: one block writes the
look at rest, under the pointer, while pressed and while disabled.

```goi
Column {
	padding: 20
	radius:  16
	background: state {
		default: theme.surfaceContainer
		hover:   theme.surfaceContainerHigh
		active:  theme.primaryContainer
	}
}
```

`default` is the fallback when no other entry matches. It is optional: without
it, the block writes only while a state matches, and the property otherwise
keeps its normal value. For a component that value is its variant colour, so a
filled Button's background comes back as `primary`, not transparent; an auto
`width` or `height` animates from the size it is laid out at, not from zero. The
last matching entry wins, so write the states in priority order: `hover` before
`active`, and `disabled` last.

## States

| Key | Active when |
| --- | --- |
| `default` | no other entry matched; without it the property keeps its normal value |
| `hover` | the pointer is over the element or one of its children |
| `active` | a pointer press is held on the element (`pressed` is an alias) |
| `focus` | the element has keyboard focus; a text field uses this |
| `disabled` | the component is disabled |
| `enabled` | the component is not disabled |
| `checked` | a switch, checkbox or radio button is checked |
| `unchecked` | that control is not checked |
| `selected` | the component is selected, as a chip, tab or row can be |
| `expanded` | the component is expanded, as a menu or sheet can be |
| `collapsed` | the component is not expanded |

A plain element reacts to `hover` and `active` too. Its children count as part
of its area, so hovering a label inside a `Column` also hovers the `Column`.

## Built-in components

The state writes the property before the component paints, so a Material
component can take its own colours per state. A block with only `hover` leaves
the component's own fill alone at rest; with a transition it animates from that
fill:

```goi
Button {
	label: "Hover me"
	background: state {
		hover: red
	}
	transition: background 500ms
}
```

A filled Button starts that animation from `theme.primary`. Add `default` only
when the resting colour should differ from the variant's own.

The same holds for a size: a button whose width is auto grows from the width it
has on screen, and shrinks back to it when the pointer leaves.

```goi
Button {
	label: "Hover me"
	width: state {
		hover: 300
	}
	transition: width 500ms
}
```

```goi
Button {
	label: "Save"
	background: state {
		default: theme.surfaceContainerHigh
		hover:   theme.surfaceContainerHighest
		active:  theme.primaryContainer
	}
}
```

It works for any property the component draws, not only `background`: `color`,
`radius`, `border`, `shadow`, `rotate`, `scale` and the component's own
properties all take a state block.

```goi
Card {
	scale: state {
		default: 1
		hover:   1.02
	}
	rotate: state {
		hover: 2deg
	}
	transition: scale 200ms, rotate 200ms
}
```

A disabled button can keep a muted pair without a second element:

```goi
Button {
	label: "Save"
	background: state {
		default:  theme.primary
		hover:    theme.primaryContainer
		disabled: theme.surfaceContainerHighest
	}
	color: state {
		default:  theme.onPrimary
		disabled: theme.onSurfaceVariant
	}
}
```

`focus` is what a text field uses, and `checked` is what a switch uses:

```goi
TextField {
	label: "Email"
	background: state {
		default: theme.surfaceContainerHighest
		focus:   theme.surfaceContainerLow
	}
}

Switch {
	checked: true
	background: state {
		unchecked: theme.surfaceContainerHighest
		checked:   theme.primary
	}
}
```

## Nesting

`state`, [`responsive`](/syntax/#responsive-values) and
[`conditional`](/syntax/#conditional-values) nest in any order. A value can
follow the window width, a bridge value and the pointer at once:

```goi
Column {
	background: responsive {
		base: theme.surface
		sm: conditional {
			bridge.selected: state {
				default: theme.primaryContainer
				hover:   theme.primary
			}
			default: theme.surfaceContainer
		}
	}
}
```

The entry is resolved from the outside in. An inner block with no matching entry
falls back to its own `default`, then to the property's own value; a component
with a variant colour uses that colour when the property was never written.

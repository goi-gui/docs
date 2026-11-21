---
title: "States"
sidebar:
  label: "States"
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

`default` is the fallback when no other entry matches. The last matching entry
wins, so write the states in priority order: `hover` before `active`, and
`disabled` last.

## States

| Key | Active when |
| --- | --- |
| `default` | no other entry matched |
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
component can take its own colours per state:

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
`radius`, `border`, `shadow` and the component's own properties all take a state
block. A disabled button can keep a muted pair without a second element:

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
falls back to its own `default`, then to the property's own value.

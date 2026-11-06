---
title: Conditionals
---

# Conditionals

`if` picks one arm of elements, written the way Go writes it. It switches
elements, not text or properties: each arm holds members of the parent element,
and only the matching arm is shown.

```goi
Window {
	Column {
		if app.dark {
			Text { text: "Dark" }
		} else if window.width > 900 {
			Text { text: "Wide" }
		} else {
			Text { text: "Light" }
		}
	}
}
```

## What a condition can read

The condition is an ordinary expression and must resolve to a `bool`. It may
use:

| Source | Example |
|---|---|
| the colour scheme | `app.dark`, `app.theme`, `app.os` |
| the window | `window.width`, `window.height` |
| the bridge | `bridge.Loading` |
| a fragment's props | `props.Expanded` |
| a declared id | `panel.checked`, `menu.visible` |

and combine them with comparisons, `&&`, `||`, `!` and `?:`:

```goi
if bridge.Count > 0 && !bridge.Loading {
	Text { text: formatf("%d items", bridge.Count) }
}
```

## Reactivity

A Go-set bool property re-evaluates the condition on the next frame, so a
checkbox is a fully reactive condition without any extra wiring:

```goi
Column {
	Checkbox { id: detailed label: "Show details" }

	if detailed.checked {
		Text { text: "Extra detail" }
	}
}
```

```go
ui.MustByID[*ui.Checkbox](w, "detailed").Checked.Set(true)
```

`SetData` works the same way: setting `bridge.Loading` shows and hides an arm
without rebuilding the window.

## How the arms are built

- Every arm is built when the window loads and only the matching one is shown,
  so a hidden arm costs no layout.
- An arm holds elements and blocks only. An `if` inside a `Text` is an error,
  because a leaf has no children to switch.
- Blocks nest: an inner `if` shows only where its outer arm also shows.
- An `if` inside a `for` body sees the loop variables.
- Ids inside arms are registered like any other id, so two arms cannot declare
  the same one.

## Matching one value: switch

`switch` compares one value against a list of cases, with Go's spelling:

```goi
Column {
	switch bridge.job {
	case "swe", "eee", "fe":
		Text { text: "Engineer" }
	case "teacher":
		Text { text: "Teacher" }
	default:
		Text { text: "Something else" }
	}
}
```

The subject is any value expression: a bridge variable, a prop, a reference to
an `id` property, or something computed (`switch bridge.Count > 9 ? "many" :
"few"`). A case may hold several values separated by commas.

- The first arm with a matching value wins; `default` shows when none does.
- At most one `default` is allowed; leaving it out means no arm shows on a miss.
- A switch is a block, so it holds elements and blocks only, and can sit inside
  an `if` or a `for`.
- Every arm is built with the window and only the chosen one is shown, exactly
  like `if`.

## Choosing a value instead of an element

When the choice is a value rather than a block, use the ternary form. It works
anywhere a value works:

```goi
Button {
	label: "Toggle theme"
	icon:  app.dark ? "light_mode" : "dark_mode"
}
```

The two branches of `?:` must have compatible types: both strings, both numbers,
both colours, or both bools.

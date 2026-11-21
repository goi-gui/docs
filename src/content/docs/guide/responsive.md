---
title: "Responsive"
sidebar:
  label: "Responsive"
---

The `responsive` modifier picks a property value from the window width. It is
the value form of a media query: one block describes the same property at each
size class, so a design can change its layout without a second design or a Go
handler.

```goi
Window {
	width: responsive {
		base: 480
		md:   760
	}

	Column {
		padding: responsive {
			base: 16
			lg:   32
		}

		Grid {
			columns: responsive {
				base: 1
				sm:   2
				lg:   3
			}

			Card { label: "One" }
			Card { label: "Two" }
			Card { label: "Three" }
		}
	}
}
```

The entry with the largest minimum width that is not above the window width
wins. Breakpoints are min-widths in logical pixels, like Tailwind:

| Tier | Applies from |
|---|---:|
| `base` | 0 |
| `sm` | 640 |
| `md` | 768 |
| `lg` | 1024 |
| `xl` | 1280 |

So the grid above has one column below 640, two from 640, and three from 1024.
The `base` entry is optional; without it the property keeps its normal default
below the lowest tier that is present. A `base` on `Window.width` also sizes the
initial window before the first frame.

## What it is useful for

- **Layout.** Switch a `Row` to a `Column`, change a grid's column count, or
  adjust padding and gaps at a size class.
- **Visibility.** Hide a navigation bar when the rail becomes available:

  ```goi
  NavigationBar {
  	visible: responsive {
  		base: true
  		sm:   false
  	}
  }
  ```

- **Sizing.** Give a panel more room on a wide window, as in the first example.
- **Combining conditions.** A tier can hold another modifier, so a value can
  depend on the width and the pointer at the same time:

  ```goi
  Column {
  	background: responsive {
  		base: theme.surface
  		sm: state {
  			default: theme.surfaceContainer
  			hover:   theme.surfaceContainerHigh
  		}
  	}
  }
  ```

## Details

- A property is re-evaluated when the window width changes, not on every
  unrelated frame. The file owns a responsive property: a value set from Go
  with `Prop.Set` is replaced on the next breakpoint pass.
- `id` cannot be responsive, because an id names a node once. Any other value
  property can be, including `visible`, numbers, colours, enums and bools.
- The older brace map still parses: `padding: { base: 8, md: 16 }` is the same
  as `padding: responsive { base: 8 md: 16 }`. `goifmt` writes the keyword form.
- A responsive value nests with [`conditional`](/guide/conditionals/#choosing-between-more-than-two-values)
  and [`state`](/guide/states/). Each block resolves from the outside in and
  falls back to its own `default`, then to the property's value.

The full value grammar is in the [syntax reference](/syntax/#responsive-values).

---
title: Reserved names
sidebar_label: Reserved Names
---

# Reserved names

Some names in a `.goi` file are not declared anywhere: the framework supplies
them, and a design reads them without any setup. `app` and `window` are the two
that describe the running program — the resolved theme and the client area — so
a design can follow the scheme and the window size instead of hard-coding them.

```goi
Text { text: app.dark ? "Dark" : "Light" }

Rectangle {
	width:       max(120, min(window.width / 3, 480))
	height:      2
	background:  app.dark ? primary : secondary
}
```

## `app` — the scheme and the platform

| Member | Type | Reads |
|---|---|---|
| `app.theme` | string | the resolved scheme's name: `light`, `dark`, or a name the app registered with `ui.WithTheme` |
| `app.mode` | `light` / `dark` / `unknown` | the resolved scheme's mood, usable where an enum or a colour role is expected |
| `app.systemMode` | `light` / `dark` / `unknown` | the desktop's own preference, independent of the theme the app picked |
| `app.dark` | bool | `true` when the resolved scheme is dark |
| `app.language` | string | the active language: `SetLanguage`'s code, or the desktop's when none was set |
| `app.systemLanguage` | string | the desktop's language as an ISO 639-1 code: `tr`, `en`, `de`; empty when the platform does not report one |
| `app.os` | string | `runtime.GOOS`: `linux`, `darwin`, `windows`, `freebsd` |

- `app.theme` is the string form of the scheme, so it feeds any string property:
  `theme: app.systemMode` is how a design follows the desktop's preference
  instead of a fixed choice.
- `app.mode` is the *mood* rather than the name. A custom dark theme registered
  as `"midnight"` reads `app.theme == "midnight"` and `app.mode == "dark"`, so
  `app.mode == "dark"` keeps working when the app renames its scheme.
- `app.dark` is the bool for conditions; `if app.dark { … }` and
  `switch app.mode { case "dark": … }` say the same thing.
- `app.systemMode` is `unknown` when the platform does not report a preference,
  which is why `app.dark` follows the resolved theme rather than the desktop.
- All five theme members re-resolve when the app changes the theme, so a value
  that uses them updates on the next frame with no reload.
- `app.systemLanguage` is read at startup and again when the desktop reports a
  locale change. It is the language, not the region: `tr-TR` reads `tr`.
- `app.os` is fixed for the life of the process; use it for the one or two
  places where a platform genuinely differs, not to fork a whole design.

## `window` — the client area

| Member | Type | Reads |
|---|---|---|
| `window.width` | number | the logical client width, updated on every resize |
| `window.height` | number | the logical client height, updated on every resize |
| `window.minimized` | bool | whether the window is minimized, as the platform reports it |
| `window.minimizable` | bool | whether the framework may minimize the window |
| `window.maximized` | bool | whether the window is maximized, as the platform reports it |
| `window.maximizable` | bool | whether the framework may maximize the window |
| `window.resizable` | bool | whether the user may resize the window |
| `window.fullscreen` | bool | whether the window fills the display |

The two sizes are in logical (density-independent) pixels, the same unit as
`width`, `padding` and `fontSize`, so no scale factor is needed. They are the
client area, not the outer frame: the title bar and the window border are not
included.

The state members are reported by the platform, so they follow the user's own
actions, not only what the design asked for:

```goi
bridge {
	ToggleMaximize func()
}

Button {
	label:   window.maximized ? "Restore" : "Maximize"
	onClick: bridge.ToggleMaximize()
}
```

Reach for them when a layout has to react to size rather than to a breakpoint:

```goi
Rectangle {
	// A third of the window, but never below 120 or above 480.
	width: max(120, min(window.width / 3, 480))
}
```

For the ordinary responsive case, the breakpoint map is the better tool: it
re-lays out only when a breakpoint is crossed, while an expression re-evaluates
every frame.

```goi
Text {
	width: { base: 280, md: 420, lg: 560 }
}
```

## The other reserved names

Four more names are supplied by the framework rather than declared. They are
covered on their own pages; this table is just where they fit:

| Name | Supplied by | Page |
|---|---|---|
| `bridge.Name` | `ui.SetData` and `ui.SetHandler`, read from the `bridge` block | [Bridge](bridge.md) |
| `data.Name` | the original spelling of `bridge`; both read the same values | [Bridge](bridge.md) |
| `props.Name` | the instance of a fragment, read from the fragment's `props` block | [Fragments](fragments.md) |
| `event` | an event property's payload, only inside a handler call | [Events](#event) |
| `id.prop` | another element's property, by the `id` it declares | [Ids and instances](../syntax.md#ids-and-instances) |

### `event`

`event` is not a namespace but a single value: the payload of the event that
fired. It is only valid as an argument of a handler call, and only where the
event actually carries something.

```goi
bridge {
	onToggle func(on bool)
	onVolume func(level float64)
}

Switch {
	label:    "Follow the desktop"
	onToggle: bridge.onToggle(event)     // event is a bool here
}

Slider {
	value:    0.4
	onChange: bridge.onVolume(event)     // event is a number here
}
```

| Event | `event` carries |
|---|---|
| `onToggle` | bool |
| `onChange` | number |
| `onEdit` | string |
| `onSubmit` | string |
| `onSelect` | number (the selected index) |
| `onClick` | no value; `onClick` is a plain callback |

Passing `event` to an `onClick` handler, or to a parameter of another type, is a
diagnostic. A fragment does not see `event` at all: the fragment decides what it
passes to the handler it was given.

## Rules that apply to all of them

- A reserved name cannot be declared in `bridge`, so `bridge { app string }` is
  an error.
- An unknown member is an error with a suggestion: `app.drak` points at
  `app.dark`, and `window.widht` at `window.width`.
- A reserved name is a value, not an element or a property name. Writing
  `app { }` as a child element makes it an ordinary element named `app`, which
  no component matches.
- They work anywhere a value does: a property, a condition, a `switch` subject,
  a loop count, a `formatf` argument or a handler argument.

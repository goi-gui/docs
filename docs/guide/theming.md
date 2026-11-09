# Theming

A goi app draws every colour from a **scheme**: a complete set of Material 3
colour roles plus a type scale. One design serves light and dark because it names
roles, never hex values, for anything that should adapt.

```goi
Text { text: "Hello" color: theme.primary }
Rectangle { background: theme.surfaceContainerHigh }
```

A role is a name, not a value. When the scheme changes, the same design redraws
in the new colours with no reload.

## The built-in schemes

Two are always registered:

| Name | Mood |
|---|---|
| `light` | the baseline light scheme |
| `dark` | the baseline dark scheme |

A design picks one of three ways:

```goi
Window {
	theme: light           // always light
}

Window {
	theme: dark            // always dark
}

Window {
	theme: app.systemMode  // follow the desktop setting
}
```

`theme: app.systemMode` reads the desktop's preference on every frame, so a
design follows the OS when it switches at night. From Go, `Window.SystemMode()`
reports what the desktop says, and `Window.Mode()` reports what the window is
actually showing.

## The roles

The scheme is the Material 3 role set. The pairs to reach for:

- **Surface**: `surface`, `surfaceDim`, `surfaceBright`, and the containers
  `surfaceContainerLowest` … `surfaceContainerHighest`, with `onSurface` for
  text on any of them.
- **Primary**: `primary`, `onPrimary`, `primaryContainer`,
  `onPrimaryContainer`; the same shape for `secondary`, `tertiary` and `error`.
- **Outline**: `outline` for a strong border, `outlineVariant` for a separator.
- **Inverse**: `inverseSurface`, `onInverseSurface`, `inversePrimary` for a
  snackbar or a tooltip.
- **Shadow and scrim**: `shadow`, `scrim`.

A role name is what `theme.<role>` takes, and the whole list completes after
`theme.` in the editor.

## Building a scheme

Start from a built-in one, change the roles the brand owns, and register it:

```go
brand := ui.LightTheme()          // a copy; the built-in one stays intact
brand.Name = "brand"
brand.Colors.Primary = 0x411F89FF
brand.Colors.OnPrimary = 0xFFFFFFFF
brand.Colors.PrimaryContainer = 0xEADDFFFF
brand.Colors.OnPrimaryContainer = 0x21005DFF
brand.Colors.Surface = 0xFFFBFEFF
brand.Colors.OnSurface = 0x1C1B1FFF

app, _ := ui.NewApp()
win, _ := app.LoadWindow(fs, "main.goi",
	ui.WithTheme("brand", brand),
	ui.WithSize(900, 700),
)
```

Then the design names it:

```goi
Window {
	theme: brand
}
```

`WithTheme` registers a name; a registered name replaces a built-in one of the
same name, so `WithTheme("dark", myDark)` is how an app overrides dark mode.

A scheme carries its mood in `Theme.Dark`. That is what `app.dark` and
`app.mode` read, so a hand-built dark scheme reads as dark even if its colours
are unusual.

## A light and a dark scheme together

Register one name per mood and switch between them when the OS does:

```go
app, _ := ui.NewApp()
win, _ := app.LoadWindow(fs, "main.goi",
	ui.WithTheme("brandLight", brandLight),
	ui.WithTheme("brandDark", brandDark),
)
```

`theme: app.systemMode` cannot know which of the two to pick, so an app that
registers two takes the switch itself:

```go
win.Bind(func(w *ui.Window) error {
	apply := func(dark bool) {
		name := "brandLight"
		if dark {
			name = "brandDark"
		}
		w.Root().Theme.Set(name)
	}
	if w.SystemMode() == ui.ModeDark {
		apply(true)
	}
	return nil
})
```

## Type scale

A scheme also owns the type scale: the sizes and weights behind
`role: "titleLarge"` and the rest. `Theme.Type` is that scale, and a scheme that
wants a different body size sets it there instead of in every `Text`.

## What a role is not

- A role is not a custom colour. `theme.primary` is always the scheme's primary;
  the app's own names live under `customColor.` — see
  [Custom colours](custom-colors.md).
- A role is not a literal. `#3b82f6` and `white` stay the same in both schemes;
  `theme.primary` does not. Use the first for a deliberate fixed colour, the
  second for anything that should adapt.
- A role inside a gradient string is not resolved. Gradients are parsed once from
  their string, so use literals there.

## See also

- [Colours](colours.md) — every colour form, and gradients.
- [Custom colours](custom-colors.md) — colours the app defines.
- [syntax](../syntax.md#colours-and-gradients) — the reference table.

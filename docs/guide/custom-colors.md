# Custom colours

A **custom colour** is a name the app defines in Go and the design uses as if it
were a theme role. It is the escape hatch for a brand colour, a status colour, or
a palette the design tool exports: one place in Go holds the value, and every
element that names it follows.

```go
win.SetCustomColors(map[string]uint32{
	"brand":   0x411F89FF,
	"success": 0x2E7D32FF,
	"warning": 0xED6C02FF,
})
```

```goi
Text {
	text:  "ship it"
	color: customColor.brand
}

Text {
	text:  "Shipped"
	color: customColor.success
}
```

## One at a time

`SetCustomColor` sets or replaces a single name, which is the usual way to react
to something:

```go
win.SetCustomColor("success", 0x2E7D32FF)
```

A name resolves on every frame, not once at load, so setting it again recolours
every element that uses it with no reload and no rebind. That is what makes a
custom colour usable for a live status: set `success` red when a build fails, and
every dot, label and border naming it changes in the next frame.

## The rules

- **The name must be a `.goi` identifier**: a letter or `_`, then letters, digits
  or `_`. `brand`, `brand_2` and `_accent` are fine; `brand-color` is not.
- **A theme role's name is reserved.** `SetCustomColor("primary", …)` logs an
  error and is ignored, so a design that says `theme.primary` always follows the
  scheme. Custom names and role names cannot shadow each other.
- **A name nothing defines warns once** and draws the scheme's `onSurface` until
  it is defined. The warning names the file and suggests the closest role, so a
  typo shows up in the log instead of as a mystery colour.
- **Custom colours do not adapt on their own.** A custom colour is one value; if
  it should differ by scheme, set it again when the scheme changes:

  ```go
  win.Bind(func(w *ui.Window) error {
  	brand := uint32(0x411F89FF)
  	if w.Mode() == ui.ModeDark {
  		brand = 0xD0BCFFFF
  	}
  	w.SetCustomColor("brand", brand)
  	return nil
  })
  ```

  `Bind` runs again after a hot reload, so the colour is re-applied then too.

## Where a custom colour goes

Anywhere a colour goes: `color`, `background`, `borderColor`,
`decorationColor`, `scrollbarColor`, and a shadow's colour. It is not a
gradient: a gradient is written as a CSS string, and a custom name inside it is
not resolved.

For a themed colour the design should simply name the scheme role —
`theme.primary` — which follows light and dark with no Go at all. Reach for a
custom colour when the value is the app's to decide, not the scheme's.

## Completion

`goipls` completes the `customColor` prefix in a colour position, but it cannot
list the names: they are declared in Go, and the language server reads one
`.goi` file at a time. Hovering `customColor.brand` explains that the app defines
it with `ui.SetCustomColor`.

## See also

- [Colours](colours.md) — every colour form.
- [Theming](theming.md) — the scheme and its roles.

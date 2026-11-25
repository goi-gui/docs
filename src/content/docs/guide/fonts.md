---
title: "Fonts"
---

A design names a font family. A family installed on the machine is found
automatically; the built-in Roboto is always there; and a font the app ships
comes from `App.LoadFont`, `LoadFontFamily` or `LoadVariableFont`. Shipped font
files live in the same `assets` directory as the design, so `fonts/Nunito.ttf`
means `assets/fonts/Nunito.ttf`.

## Registering a family

```go
app, err := ui.NewApp()
if err != nil {
	return err
}
defer app.Close()

if err := app.LoadFont("Nunito", "fonts/Nunito.ttf"); err != nil {
	return err
}

win, err := app.LoadWindow("ui/Main.goi")
```

`LoadFont` takes the name a design will write and a path inside the `assets`
directory. `goi run` reads the file from disk; `goi build` embeds it in the
binary, so the same call works in a release. The name is the handle, not the
font's own family name, so `app.LoadFont("Brand", "fonts/Brand.ttf")` is reached
with `fontFamily: "Brand"`.

For several files, use one map:

```go
if err := app.LoadFontMany(map[string]string{
	"Nunito Regular": "fonts/Nunito-Regular.ttf",
	"Nunito Bold":    "fonts/Nunito-Bold.ttf",
	"Nunito Italic":  "fonts/Nunito-Italic.ttf",
}); err != nil {
	return err
}
```

Every valid file is loaded even when one path fails; the returned error joins
the failures. This form gives each file its own family name.

## One family, several files

A family with weight and italic files uses the Google Fonts naming convention:

```text
assets/fonts/
  Nunito-Regular.ttf
  Nunito-Italic.ttf
  Nunito-Medium.ttf
  Nunito-SemiBold.ttf
  Nunito-Bold.ttf
  Nunito-BoldItalic.ttf
  Nunito-ExtraBold.ttf
  Nunito-Black.ttf
```

Register the pattern once:

```go
if err := app.LoadFontFamily("Nunito", "fonts/Nunito-*.ttf"); err != nil {
	return err
}
```

For several families, use one map:

```go
if err := app.LoadFontFamilyMany(map[string]string{
	"Nunito": "fonts/Nunito-*.ttf",
	"Inter":  "fonts/Inter-*.ttf",
}); err != nil {
	return err
}
```

Every valid pattern loads even when another one fails; the errors are joined.

The design keeps one `fontFamily` and picks the file with `fontWeight` and
`fontStyle`:

```goi
Text {
	text:       "Nunito Bold"
	fontFamily: "Nunito"
	fontWeight: 700
}

Text {
	text:       "Nunito Bold Italic"
	fontFamily: "Nunito"
	fontWeight: 700
	fontStyle:  italic
}
```

The pattern is an assets-relative glob, so `fonts/Nunito-*.ttf` picks every
static file. The style suffix accepts `Regular`, `Thin`, `ExtraLight`, `Light`,
`Medium`, `SemiBold`, `Bold`, `ExtraBold`, `Black`, any of those with `Italic`,
and `Italic` alone. If the exact weight is absent, the nearest one in the family
is used. A family loaded with `LoadFont` has one face for every weight; use
`LoadFontFamily` when the files differ.

## Variable fonts

One variable font file can cover every weight:

```go
if err := app.LoadVariableFont("Nunito", "fonts/Nunito[wght].ttf", nil); err != nil {
	return err
}
```

An italic variable file joins the same family:

```go
if err := app.LoadVariableFont("Nunito", "fonts/Nunito-Italic[wght].ttf", nil); err != nil {
	return err
}
```

`fontWeight` drives the `wght` axis; `axes` pins any other axis, for example
`"wdth": 90` or `"opsz": 14`. The `axes` map does not control `wght`. A file
whose own style is italic fills the family's italic slot, so `fontStyle: italic`
uses its outlines. Without an italic file, `fontStyle: italic` slants the
upright face; `ital` and `slnt` axes are not driven separately.

The file must be a variable font. A static file is rejected instead of being
registered as a variable font. `fontWeight` needs a `wght` axis; a font without
one keeps its default instance. If the outlines cannot be read, the call
returns an error rather than drawing blank text.

Calling any of these after the window is up also works: the next frame draws
with the new face.

## System fonts

`fontFamily` can name a font installed on the machine; no Go call is needed:

```goi
Window {
	Text {
		text:       "System"
		fontFamily: "DejaVu Sans"
	}

	Text {
		text:       "System Bold"
		fontFamily: "DejaVu Sans"
		fontWeight: 700
	}
}
```

The lookup runs when a window loads, again on hot reload, and when Go calls
`SetFontFamily` after the window is up. It matches the family name without
regard to case or extra spaces (`dejavu sans` is the same family) and registers
every installed weight and italic file, so `fontWeight` and `fontStyle` choose
the real outlines. A variable font is used through its `wght` axis.

A name the platform knows under another name resolves as well: on Linux
fontconfig decides (`fc-match`), on Windows the FontSubstitutes registry key
(`Helvetica` is drawn as `Arial`), and the generic families `sans-serif`,
`serif`, `monospace`, `system-ui`, `cursive` and `fantasy` map to the usual face
of the platform (`DejaVu Sans`, `Helvetica`, `Segoe UI` and so on). Besides
`.ttf`, `.otf`, `.ttc` and `.otc`, old Mac resource-fork `.dfont` files and
`.woff` web fonts are read.

It reads the platform's font directories: on Linux `/usr/share/fonts`,
`/usr/local/share/fonts`, `~/.local/share/fonts` and `~/.fonts`; on macOS the
system and user Library font folders; on Windows the Windows Fonts folder and
the per-user fonts folder. The scan is lazy and cached, so a design that names
only Roboto or families it loaded never reads them. A name that was not found
stays a miss until the app restarts; installing the font while it runs is not
picked up.

A system font is not embedded in the binary. Building or packaging on a machine
without that family falls back to Roboto, so use `LoadFont` when the app must
ship the face. The browser build has no system fonts either. The app's own
`LoadFont`, `LoadFontFamily` or `LoadVariableFont` for a name wins over the
installed family, whether it runs before or after the window.

## Using it in a design

On the window, for every element that inherits it:

```goi
Window {
	fontFamily: "Nunito"

	Column {
		Text {
			text:       "Nunito"
			fontFamily: "Nunito"
		}

		Text {
			text:       "Roboto"
			fontFamily: "Roboto"
		}
	}
}
```

Roboto is built in, so the second line needs no `LoadFont`. Use `fontFamily` on
one element to override what it would inherit.

`fontFamily` is a common property, so it works on any element and a child
inherits the nearest one that set it. `Roboto` is always available without a
registration and an installed family needs none either; a name that is neither
Roboto, installed, nor registered falls back to Roboto and logs one warning per
family, so a typo is visible rather than silent. An empty name simply inherits.

Measurement follows the same face the painter draws, so a wrapped paragraph
breaks where it is measured; a wide custom face changes a label's size, and
layout sees that.

## From Go

```go
text := w.MustByID[*ui.Text]("label")
text.SetFontFamily("Nunito")
```

`SetFontFamily("")` hands the element back to its parent's family. Setting a
family that is installed on the machine works too; the lookup happens the first
time the new family is measured or drawn.

## Limits

- `LoadVariableFont` maps `fontWeight` to `wght`; extra axes are fixed per call.
  Italic uses a second variable file when the family has one; otherwise it is
  synthetic, and the `ital`/`slnt` axes are not used.
- A variable font needs a `wght` axis for `fontWeight` to change anything; a
  static file is an error. Some CFF2 variable fonts have outlines the parser
  cannot read and return an error too.
- Synthetic bold is not applied. A single `LoadFont` face therefore draws every
  weight the same; use `LoadFontFamily` for static files or `LoadVariableFont`
  for a weight axis.
- Icons keep Material Symbols whatever the family; a `Text` with an `icon` on
  it still draws the icon font.
- A family added after a window has drawn reshapes the visible text on the next
  frame; text that was already in the atlas is re-rasterized under the new
  family's tag.

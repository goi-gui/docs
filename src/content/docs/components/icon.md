---
title: "Icon"
---

One Material Symbols glyph, drawn at the size its box gives it and in the colour
the design names.

[All components](/components/)

<p align="center">
  <img src="/img/components/icon-light.png" alt="Icon in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/icon-dark.png" alt="Icon in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>filledIcon</strong><br />
  <img src="/img/components/icon-filled-light.png" alt="Outlined and filled icons in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/icon-filled-dark.png" alt="Outlined and filled icons in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Icon {
	icon: home
}

Icon {
	icon:  favorite
	size:  32
	color: theme.primary
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `icon` | string | the Material Symbols ligature, such as `home` or `arrow_forward`; completion offers every name the font has |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `color` | color | the glyph's colour; defaults to `onSurfaceVariant`. A role such as `theme.primary`, or a hex literal |
| `filledIcon` | bool | draws the filled instance of the same Material Symbols glyph; `false` (default) is the outlined one |

`filledIcon: true` swaps the whole icon font for its filled instance, so the
same `home` keeps its name and its metrics and only the shape changes. Every
component that draws an icon takes the same property. A component with a leading
and a trailing glyph, such as a `TextField`, also takes `filledLeadingIcon` and
`filledTrailingIcon`, which fill one slot; `filledIcon` still fills both, so a
design can use either spelling. A name the filled instance does not carry — the
two instances are cut from the same family at different times — still draws: the
renderer falls back to the outlined glyph instead of spelling the name out.

The glyph fills the shorter side of its box and stays centred, so `size: 24`
gives the M3 default, `size: 40` a larger glyph, and a box such as `width: 80
height: 24` keeps a 24dp glyph in the middle. Changing `icon` or `color` only
repaints; changing the box lays the tree out again.

## From Go

```go
bell := w.MustByID[*ui.Icon]("bell")
bell.Color.Set(0x6750A4FF) // any hex, or the role the design named
bell.SetSize(32, 32)
bell.Icon.Set("notifications_active")
```

Every element also accepts the [common properties](/components/#common-properties).

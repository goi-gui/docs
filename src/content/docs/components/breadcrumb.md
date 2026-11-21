---
title: "Breadcrumb"
---

A trail of destinations: the crumbs are children, the separators are the
component's.

[All components](/components/)

<p align="center">
  <img src="/img/components/breadcrumb-light.png" alt="Breadcrumb in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/breadcrumb-dark.png" alt="Breadcrumb in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Breadcrumb {
	Text {
		text:  "Featured"
		color: theme.onSurfaceVariant
	}

	Text {
		text:  "Shirts"
		color: theme.onSurfaceVariant
	}

	Text {
		text:  "Tops"
		color: theme.onSurface
	}
}
```

The separator's glyph and colour are properties, so a trail can end with a
forward arrow or a slash without touching the crumbs:

```goi
Breadcrumb {
	separator:      chevron_right
	separatorColor: theme.onSurfaceVariant
	separatorSize:  18

	Text { text: "Home" }
	Icon { icon: folder }
	Text { text: "Documents" }
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `separator` | string | the Material Symbols glyph between crumbs; `chevron_right` by default, empty draws none |
| `separatorColor` | color | the separator's colour; unset follows `onSurfaceVariant` |
| `separatorSize` | number | the separator's size in dp; 18 by default |
| `spacing` | number | the gap each separator sits in; 24 by default, so the 18dp glyph has room |
| `crossAxisAlign` | enum | `start`, `center` (default), `end`, `stretch`; places a crumb across the trail |
| `mainAxisAlign` | enum | `start` (default), `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly` |

A crumb is any element, so its colour, its icon and its behaviour are whatever
that element takes: a `Text` with `color`, an `Icon`, or a `Text` with a `link`.
Give the trail a `width` or a `flex` when it should share a row.

## From Go

```go
trail := w.MustByID[*ui.Breadcrumb]("trail")
trail.Separator.Set("chevron_right")
trail.SeparatorColor.Set(0x49454FFF)
```

Every element also accepts the [common properties](/components/#common-properties).

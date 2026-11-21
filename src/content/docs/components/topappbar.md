---
title: "TopAppBar"
---

The bar at the top of a screen: a leading icon, a title and a trailing icon.

[All components](/components/)

<p align="center">
  <img src="/img/components/topappbar-light.png" alt="TopAppBar in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/topappbar-dark.png" alt="TopAppBar in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
TopAppBar {
	id:           appbar
	label:        "Inbox"
	leadingIcon:         menu
	trailingIcon: search
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `leadingIcon` | string | leading Material Symbols ligature |
| `trailingIcon` | string | trailing Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledLeadingIcon` | bool | fills only the leading icon; `filledIcon` fills both slots |
| `filledTrailingIcon` | bool | fills only the trailing icon; `filledIcon` fills both slots |

## From Go

```go
bar := w.MustByID[*ui.TopAppBar]("appbar")
bar.Label.Set("Settings")
bar.OnClick(func(e ui.ClickEvent) {
	// e.X is a window coordinate; compare against the bar's own box for sides.
	if e.X < 56 {
		toggleDrawer()
	}
})
```

Every element also accepts the [common properties](/guide/common-properties/).

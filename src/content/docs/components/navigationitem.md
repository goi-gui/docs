---
title: "NavigationItem"
---

One destination in a navigation bar, rail or drawer.

[All components](/components/)

<p align="center">
  <img src="/img/components/navigationitem-light.png" alt="NavigationItem in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/navigationitem-dark.png" alt="NavigationItem in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
NavigationItem {
	label:    "Home"
	leadingIcon:     home
	selected: true
}

NavigationItem {
	label: "Search"
	leadingIcon:  search
}

NavigationItem {
	label:    "Locked"
	leadingIcon:     lock
	disabled: true
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `leadingIcon` | string | leading Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledLeadingIcon` | bool | fills only the leading icon; `filledIcon` fills both slots |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state |
| `labelColor` | color | the label's colour while idle |
| `selectedLabelColor` | color | the label's colour while selected |
| `iconColor` | color | the icon's colour while idle |
| `selectedIconColor` | color | the icon's colour while selected |
| `selectedContainerColor` | color | the indicator behind a selected item; defaults to `secondaryContainer` |

An item finds its navigation container wherever it sits: wrapped in a `Column`
for layout, it still draws its indicator and still stacks its icon and label the
way the rail or bar does.

A selected destination draws its icon in the filled Material Symbols instance,
so the active item reads even before a colour change. `filledIcon` and
`filledLeadingIcon` still force the filled glyph on an idle item.

## From Go

```go
item := w.MustByID[*ui.NavigationItem]("search")
item.OnClick(func(ui.ClickEvent) { show(searchPage) })
item.M3().Selected.Set(true)
```

Every element also accepts the [common properties](/guide/common-properties/).

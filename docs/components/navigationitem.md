# NavigationItem

One destination in a navigation bar, rail or drawer.

[All components](../components.md)

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
| `variant` | enum | — (no style variants) |
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

## From Go

```go
item := w.MustByID[*ui.NavigationItem]("search")
item.OnClick(func(ui.ClickEvent) { show(searchPage) })
item.M3().Selected.Set(true)
```

Every element also accepts the [common properties](../components.md#common-properties).

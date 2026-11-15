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
	icon:     home
	selected: true
}

NavigationItem {
	label: "Search"
	icon:  search
}

NavigationItem {
	label:    "Locked"
	icon:     lock
	disabled: true
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `icon` | string | leading Material Symbols ligature |
| `variant` | enum | — (no style variants) |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state |

## From Go

```go
item := w.MustByID[*ui.NavigationItem]("search")
item.OnClick(func(ui.ClickEvent) { show(searchPage) })
item.M3().Selected.Set(true)
```

Every element also accepts the [common properties](../components.md#common-properties).

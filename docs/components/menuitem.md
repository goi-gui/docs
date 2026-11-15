# MenuItem

One row in a menu.

[All components](../components.md)

<p align="center">
  <img src="/img/components/menuitem-light.png" alt="MenuItem in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/menuitem-dark.png" alt="MenuItem in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
MenuItem {
	label: "Cut"
	icon:  content_cut
}

MenuItem {
	label:    "Delete"
	icon:     delete
	disabled: true
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `icon` | string | leading Material Symbols ligature |
| `trailingIcon` | string | trailing Material Symbols ligature |
| `variant` | enum | — (no style variants) |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state |

## From Go

```go
item := ui.MustByID[*ui.MenuItem](w, "cut")
item.OnClick(func(ui.ClickEvent) {
	cut()
	ui.MustByID[*ui.Menu](w, "menu").SetVisible(false)
})
```

Every element also accepts the [common properties](../components.md#common-properties).

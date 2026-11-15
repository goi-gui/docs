# FAB

The floating action button: the primary action of a page.

[All components](../components.md)

<p align="center">
  <img src="/img/components/fab-light.png" alt="FAB in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fab-dark.png" alt="FAB in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
FAB {
	icon: add
}

FAB {
	icon:    edit
	label:   "Compose"
	variant: extended
}

FAB {
	icon: add
	size: 40
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `icon` | string | leading Material Symbols ligature |
| `variant` | enum | `primary` (default), `secondary`, `tertiary`; `extended` with a `label` |
| `disabled` | bool | dims the element and blocks input |
| `expanded` | bool | open state (menu, split button) |

## From Go

```go
fab := ui.MustByID[*ui.FAB](w, "compose")
fab.OnClick(func(ui.ClickEvent) { openEditor() })
```

Every element also accepts the [common properties](../components.md#common-properties).

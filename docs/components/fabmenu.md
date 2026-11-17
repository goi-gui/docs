# FABMenu

A FAB that expands into a column of actions.

[All components](../components.md)

<p align="center">
  <strong>primary</strong><br />
  <img src="/img/components/fabmenu-primary-light.png" alt="FABMenu primary in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fabmenu-primary-dark.png" alt="FABMenu primary in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>secondary</strong><br />
  <img src="/img/components/fabmenu-secondary-light.png" alt="FABMenu secondary in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fabmenu-secondary-dark.png" alt="FABMenu secondary in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>tertiary</strong><br />
  <img src="/img/components/fabmenu-tertiary-light.png" alt="FABMenu tertiary in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fabmenu-tertiary-dark.png" alt="FABMenu tertiary in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
FABMenu {
	id:       actions
	icon:     add
	expanded: false

	FAB {
		icon:    edit
		variant: small
	}

	FAB {
		icon:    photo
		variant: small
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `icon` | string | leading Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `variant` | enum | `primary`, `secondary`, `tertiary` |
| `disabled` | bool | dims the element and blocks input |
| `expanded` | bool | open state (menu, split button) |
| `spacing` | number | gap between children |
| `gap` | number | alias of `spacing` |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the flow |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly`; places the run along the flow |

While `expanded` is true the FAB sits at the bottom of its own box and the
actions stack above it, right-aligned with a 16dp gap, the last declared action
closest to the FAB. While it is closed the box is just the FAB and the actions
have no bounds at all, so they neither draw nor take a click.

## From Go

```go
menu := w.MustByID[*ui.FABMenu]("actions")
menu.OnClick(func(ui.ClickEvent) {
	menu.Expanded.Set(!menu.Expanded.Get())
})
```

Every element also accepts the [common properties](../components.md#common-properties).

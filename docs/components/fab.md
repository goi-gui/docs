# FAB

The floating action button: the primary action of a page.

[All components](../components.md)

<p align="center">
  <strong>primary</strong><br />
  <img src="/img/components/fab-primary-light.png" alt="FAB primary in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fab-primary-dark.png" alt="FAB primary in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>secondary</strong><br />
  <img src="/img/components/fab-secondary-light.png" alt="FAB secondary in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fab-secondary-dark.png" alt="FAB secondary in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>tertiary</strong><br />
  <img src="/img/components/fab-tertiary-light.png" alt="FAB tertiary in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fab-tertiary-dark.png" alt="FAB tertiary in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>extended</strong><br />
  <img src="/img/components/fab-extended-light.png" alt="FAB extended in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/fab-extended-dark.png" alt="FAB extended in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
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
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `variant` | enum | `primary` (default), `secondary`, `tertiary`; `extended` with a `label` |
| `disabled` | bool | dims the element and blocks input |

## From Go

```go
fab := w.MustByID[*ui.FAB]("compose")
fab.OnClick(func(ui.ClickEvent) { openEditor() })
```

Every element also accepts the [common properties](../components.md#common-properties).

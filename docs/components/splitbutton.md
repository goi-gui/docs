# SplitButton

A primary action with an attached menu trigger.

[All components](../components.md)

<p align="center">
  <img src="/img/components/splitbutton-light.png" alt="SplitButton in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/splitbutton-dark.png" alt="SplitButton in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
SplitButton {
	label:    "Split"
	icon:     add
	expanded: false
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `icon` | string | leading Material Symbols ligature |
| `variant` | enum | `filled` (default), `tonal`, `elevated`, `outlined`, `text` |
| `disabled` | bool | dims the element and blocks input |
| `expanded` | bool | open state (menu, split button) |

## From Go

```go
split := ui.MustByID[*ui.SplitButton](w, "split")
split.OnClick(func(ui.ClickEvent) {
	split.Expanded.Set(!split.Expanded.Get())
})
```

Every element also accepts the [common properties](../components.md#common-properties).

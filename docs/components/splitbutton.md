# SplitButton

A primary action with an attached menu trigger.

[All components](../components.md)

<p align="center">
  <strong>filled</strong><br />
  <img src="/img/components/splitbutton-filled-light.png" alt="SplitButton filled in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/splitbutton-filled-dark.png" alt="SplitButton filled in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>tonal</strong><br />
  <img src="/img/components/splitbutton-tonal-light.png" alt="SplitButton tonal in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/splitbutton-tonal-dark.png" alt="SplitButton tonal in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>elevated</strong><br />
  <img src="/img/components/splitbutton-elevated-light.png" alt="SplitButton elevated in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/splitbutton-elevated-dark.png" alt="SplitButton elevated in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>outlined</strong><br />
  <img src="/img/components/splitbutton-outlined-light.png" alt="SplitButton outlined in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/splitbutton-outlined-dark.png" alt="SplitButton outlined in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>text</strong><br />
  <img src="/img/components/splitbutton-text-light.png" alt="SplitButton text in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/splitbutton-text-dark.png" alt="SplitButton text in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
SplitButton {
	label:    "Split"
	leadingIcon:     add
	expanded: false
}
```

The trailing segment draws `arrow_drop_down` unless the design names an icon,
which is how a split button shows its open state:

```goi
SplitButton {
	id:           splitBtn
	label:        "Share"
	trailingIcon: splitBtn.expanded ? arrow_upward : arrow_downward
	onClick:      splitBtn.expand()
}

Button {
	label:   "Open the menu"
	onClick: splitBtn.expand(true)
}
```

`expand()` toggles and `expand(true)` / `expand(false)` sets, so a button can
open a menu and another can close it. The state comes back as
`splitBtn.expanded`, which an expression can read like any other property.

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `leadingIcon` | string | leading Material Symbols ligature |
| `trailingIcon` | string | icon in the menu segment; `arrow_drop_down` when unset |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `filledLeadingIcon` | bool | fills only the leading icon; `filledIcon` fills both slots |
| `filledTrailingIcon` | bool | fills only the trailing icon; `filledIcon` fills both slots |
| `variant` | enum | `filled` (default), `tonal`, `elevated`, `outlined`, `text` |
| `disabled` | bool | dims the element and blocks input |
| `expanded` | bool | open state (menu, split button); set it with `id.expand(on)` from an event or from Go |

## From Go

```go
split := w.MustByID[*ui.SplitButton]("split")
split.OnClick(func(ui.ClickEvent) {
	split.Expanded.Set(!split.Expanded.Get())
})
split.Trailing.Set("arrow_upward") // the menu segment's icon
```

Every element also accepts the [common properties](../components.md#common-properties).

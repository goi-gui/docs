# Checkbox

A binary choice with an optional label.

[All components](../components.md)

<p align="center">
  <img src="/img/components/checkbox-light.png" alt="Checkbox in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/checkbox-dark.png" alt="Checkbox in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Checkbox {
	label:   "Remember me"
	checked: true
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `disabled` | bool | dims the element and blocks input |
| `checked` | bool | on/off state |

## From Go

```go
cb := w.MustByID[*ui.Checkbox]("remember")
cb.OnToggle(func(v bool) { remember = v })
cb.Checked.Set(true)
```

Every element also accepts the [common properties](../components.md#common-properties).

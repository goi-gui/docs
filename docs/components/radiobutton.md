# RadioButton

One option in a set where exactly one is chosen.

[All components](../components.md)

<p align="center">
  <img src="/img/components/radiobutton-light.png" alt="RadioButton in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/radiobutton-dark.png" alt="RadioButton in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
RadioButton {
	label:   "Small"
	checked: true
}

RadioButton {
	label: "Medium"
}

RadioButton {
	label: "Large"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `variant` | enum | — (no style variants) |
| `disabled` | bool | dims the element and blocks input |
| `checked` | bool | on/off state |

## From Go

```go
radios := []*ui.RadioButton{
	w.MustByID[*ui.RadioButton]("small"),
	w.MustByID[*ui.RadioButton]("medium"),
	w.MustByID[*ui.RadioButton]("large"),
}
pick := func(i int) {
	for j, r := range radios {
		r.Checked.Set(j == i)
	}
}
for i, r := range radios {
	i := i
	r.OnToggle(func(bool) { pick(i) })
}
```

Every element also accepts the [common properties](../components.md#common-properties).

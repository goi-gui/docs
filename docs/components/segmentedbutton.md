# SegmentedButton

A horizontal set of segments. Contiguous siblings form one group.

[All components](../components.md)

<p align="center">
  <strong>single</strong><br />
  <img src="/img/components/segmentedbutton-single-light.png" alt="SegmentedButton single in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/segmentedbutton-single-dark.png" alt="SegmentedButton single in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

<p align="center">
  <strong>multi</strong><br />
  <img src="/img/components/segmentedbutton-multi-light.png" alt="SegmentedButton multi in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/segmentedbutton-multi-dark.png" alt="SegmentedButton multi in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
SegmentedButton {
	label:   "Day"
	width:   84
	variant: single
}

SegmentedButton {
	label:    "Week"
	width:    84
	variant:  single
	selected: true
}

SegmentedButton {
	label:   "Month"
	width:   96
	variant: single
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `icon` | string | leading Material Symbols ligature |
| `variant` | enum | `single` (radio behaviour), `multi` (default; each segment toggles) |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state |

## From Go

```go
seg := ui.MustByID[*ui.SegmentedButton](w, "week")
seg.OnClick(func(ui.ClickEvent) {
	seg.Selected.Set(true)
})
```

Every element also accepts the [common properties](../components.md#common-properties).

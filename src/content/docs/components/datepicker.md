---
title: "DatePicker"
---

A calendar surface for picking a date.

[All components](/components/)

<p align="center">
  <img src="/img/components/datepicker-light.png" alt="DatePicker in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/datepicker-dark.png" alt="DatePicker in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
DatePicker {
	id:    date
	label: "Select date"
	text:  "2026-11-02"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the caption above the calendar |
| `text` | string | the picked date as `YYYY-MM-DD`; empty means none |

This is a container: `spacing` and its alias `gap`, `crossAxisAlign` and `mainAxisAlign` are the shared container properties described on [Common properties](/guide/common-properties/#containers-and-spacing).

## Behaviour

The month shown is the month of the value; the arrows in the header move it one
month at a time and leave the value alone. A click on a day cell sets `text` to
that day's ISO date. Today is outlined and the picked day is filled.

The picker draws its own grid, so the cells are not nodes: the click is mapped
back through the same geometry the painter used (`paint.DateLayoutOf`).

## From Go

```go
picker := w.MustByID[*ui.DatePicker]("date")
picker.OnSubmit(func(v string) {
	fmt.Println("picked", v) // "2026-11-02"
})
picker.Text.Set("2026-11-02")
```

Every element also accepts the [common properties](/guide/common-properties/).

# TimePicker

An M3 time picker with a clock face or two typed fields. Both show a 12-hour
time with an AM/PM switch, and both end with the same Cancel and OK actions.

[All components](../components.md)

## In a `.goi` file

```goi
TimePicker {
	text: "07:00"
}
```

The two typed fields instead of the clock:

```goi
TimePicker {
	variant: input
	text:    "19:30"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the caption above the time; `Select time` on the dial and `Enter time` on the fields |
| `text` | string | the picked time as `HH:MM` (24-hour); empty means now |
| `variant` | enum | `dial` (the clock, default) or `input` (two text fields) |

## The dial

The dial is a single 12-hour ring: a click on a number sets the hour and hands
over to the minutes, so a second click completes the time. The picked number is
a filled circle at the end of a hand from the centre.

The two halves of the big time are targets too, so either half can be picked
first. The active half is filled with `primaryContainer` and its text is
`primary`; the other sits on `surfaceContainerHighest`.

## The input variant

`variant: input` replaces the clock with two fields and labels them `Hour` and
`Minute`. The active field is outlined and keeps a caret; the other is a filled
box. Typing digits fills that field: one digit starts the number, a second
completes it, and the hour hands over to the minutes. Arrow up/down step the
active field, left/right switch fields, Enter is OK and Escape is Cancel.

## AM/PM and the actions

The AM/PM control is one bordered box split in two: the chosen half is
`tertiaryContainer` and the other keeps the surface colour. It keeps the 12-hour
reading, so switching it moves the 24-hour value by twelve hours.

The corner icon swaps the variants — a keyboard on the dial and a clock on the
fields — which is also a design-level change, so a `.goi` file can start on
either with `variant`.

- **OK** and Enter emit `onOK` and `onSubmit` with the value.
- **Cancel** and Escape emit `onCancel` with the value, which the app decides
  what to do with.

## From Go

```go
picker := ui.MustByID[*ui.TimePicker](w, "time")
picker.OnOK(func(v string) { fmt.Println("picked", v) }) // "19:30"
picker.OnCancel(func(v string) { closeDialog() })
picker.Text.Set("07:00")
picker.Variant.Set("input")
```

Every element also accepts the [common properties](../components.md#common-properties).

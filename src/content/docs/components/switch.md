---
title: "Switch"
---

A single on/off control with an optional label and optional glyph in the thumb.

[All components](/components/)

<p align="center">
  <img src="/img/components/switch-light.gif" alt="Switch in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/switch-dark.gif" alt="Switch in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
Switch {
	label:   "Dark mode"
	checked: true
}

Switch {
	label:   "Notifications"
	iconOn:  check
	iconOff: close
}

Switch {
	label:   "Theme"
	iconOn:  dark_mode
	iconOff: light_mode
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `disabled` | bool | dims the element and blocks input |
| `checked` | bool | on/off state |
| `icon` | string | leading Material Symbols ligature |
| `filledIcon` | bool | draws every icon of the element in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `iconOn` | string | thumb glyph when checked; overrides `icon` |
| `iconOff` | string | thumb glyph when unchecked; overrides `icon` |

A switch with a glyph uses the larger thumb in both states, with the same 4dp
inset on every side. The glyph is `Primary` on the checked thumb and the surface
colour (white in the light scheme) on the unchecked one.

Toggling animates: the thumb slides from one end to the other while it grows
from 16dp to 24dp, the track fills in, the unchecked outline fades out and the
glyph cross-fades at the half way point. The motion follows a target rather than
a fixed start, so flipping the switch again mid-travel turns it around instead
of restarting, and it always settles exactly on the end state so an idle window
stops drawing. `checked: true` in a design starts settled; nothing slides on
load or on a hot reload. The handle is UI state, not a property: it lives in
`Component.TogglePos` and is advanced by `ui`'s frame tick.

## From Go

```go
dark := w.MustByID[*ui.Switch]("theme")
dark.OnToggle(func(on bool) {
	theme := "light"
	if on {
		theme = "dark"
	}
	w.Root().Theme.Set(theme)
})
```

Every element also accepts the [common properties](/guide/common-properties/).

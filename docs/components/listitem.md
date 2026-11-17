# ListItem

One row in a list: leading icon, label, optional supporting line, trailing affordance.

[All components](../components.md)

<p align="center">
  <img src="/img/components/listitem-light.png" alt="ListItem in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/listitem-dark.png" alt="ListItem in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

```goi
ListItem {
	label:       "Inbox"
	leadingIcon: inbox
}

ListItem {
	label:      "Two lines"
	supporting: "Supporting text"
	leadingIcon: photo
}

ListItem {
	label:    "Selected"
	leadingIcon: star
	selected: true
}

ListItem {
	label:      "Tinted"
	labelColor: theme.primary
	leadingIconColor: theme.tertiary
}
```

## Leading and trailing bodies

The icon properties take a Material Symbols name. When a row needs something
else there — an avatar, a badge, a switch — the `$leading` and `$trailing` slots
take any element, and layout centres it in the 40dp square the icon would use:

```goi
ListItem {
	label:      "Notifications"
	supporting: "On"

	$leading {
		Rectangle {
			width:  32
			height: 32
			radius: 16
			background: theme.tertiaryContainer
		}
	}

	$trailing {
		Switch {
			checked: true
		}
	}
}
```

An explicit `leadingIcon` or `trailingIcon` wins over the matching slot, so one
design can take either without a condition: a row with an icon ignores the body
it was given and keeps the row to one icon's width.

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `supporting` | string | secondary line under the label |
| `leadingIcon` | string | leading Material Symbols ligature; wins over `$leading` |
| `trailingIcon` | string | trailing Material Symbols ligature; wins over `$trailing` |
| `filledIcon` | bool | draws the element's icons in the filled Material Symbols instance; `false` (default) keeps the outlined one |
| `leadingIconColor` | color | the leading icon's colour; unset follows `onSurfaceVariant` |
| `trailingIconColor` | color | the trailing icon's colour; unset follows `onSurfaceVariant` |
| `labelColor` | color | the label's colour; unset follows `onSurface` |
| `supportingColor` | color | the supporting line's colour; unset follows `onSurfaceVariant` |
| `variant` | enum | — (no style variants) |
| `disabled` | bool | dims the element and blocks input |
| `selected` | bool | active/selection state |

## From Go

```go
row := w.MustByID[*ui.ListItem]("item")
row.OnClick(func(ui.ClickEvent) {
	row.Selected.Set(true)
})
```

Every element also accepts the [common properties](../components.md#common-properties).

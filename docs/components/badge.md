# Badge

A small count or status dot, usually overlaid on an icon with `Positioned` or `Stack`.

[All components](../components.md)

## In a `.goi` file

```goi
Badge {}

Badge {
	label: "12"
}

Badge {
	label: "99+"
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `label` | string | the main text |
| `variant` | enum | — (no style variants; `label` turns the dot into a count) |
| `size` | enum | — (no effect; `label` switches between the dot and a count) |

## From Go

```go
badge := ui.MustByID[*ui.Badge](w, "unread")
badge.Label.Set(strconv.Itoa(count))
```

Every element also accepts the [common properties](../components.md#common-properties).

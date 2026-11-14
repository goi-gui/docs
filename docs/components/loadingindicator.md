# LoadingIndicator

The M3 indeterminate loading shape: a twelve-lobed star that turns while it
morphs into a rounded square, squeezes into a pill, and comes back.

[All components](../components.md)

## In a `.goi` file

```goi
LoadingIndicator {
	size: 48
}

LoadingIndicator {
	size:  96
	color: theme.tertiary
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `variant` | enum | — (no style variants) |
| `color` | color | the shape's colour; defaults to `primary`. A role such as `theme.tertiary`, or a hex literal |

The shape scales with its box: `size` is the shortcut for a square one, and a
box that is not square uses the shorter side and stays centred. 48dp is the
default. The animation is drawn from a signed distance in the renderer rather
than from a bitmap, so it stays sharp at any size and at any display scale, and
it costs one quad a frame.

## From Go

```go
spinner := ui.MustByID[*ui.LoadingIndicator](w, "loading")
spinner.Color.Set(0x6750A4FF) // any hex, or the role the design named
spinner.Base().SetWidth(64)
```

Every element also accepts the [common properties](../components.md#common-properties).

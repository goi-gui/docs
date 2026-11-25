---
title: "Common properties"
sidebar:
  label: "Common properties"
---

Every element shares one box: a size, spacing, a background, borders, corners,
a shadow, a cursor, a scroll view and the transform that turns or scales it.
These properties are not repeated on each component page. The page for a
component only lists the properties that component adds.

The same values are available from Go through setters such as `SetWidth`,
`SetPadding` and `SetBackground`, so a size or a colour decided at run time
needs no reload.

## The box

| Property | Type | Notes |
|---|---|---|
| `id` | string | assigned by the builder; the handle Go looks up |
| `width, height` | number | declared size; `-1` (default) means auto |
| `size` | number | both axes at once: `size: 32` is a 32 by 32 box, the same as `width: 32 height: 32` |
| `minWidth, maxWidth` | number | bounds for the resolved width; `SetMinWidth`/`SetMaxWidth` from Go |
| `minHeight, maxHeight` | number | bounds for the resolved height; `SetMinHeight`/`SetMaxHeight` from Go |
| `margin` | number | outer spacing on all sides |
| `marginX`, `marginY` | number | left+right, top+bottom; unset follows `margin` |
| `marginTop`, `marginRight`, `marginBottom`, `marginLeft` | number | per-side override; unset follows `marginX`/`marginY`, then `margin` |
| `padding` | number | inner spacing on all sides |
| `paddingX`, `paddingY` | number | left+right, top+bottom; unset follows `padding` |
| `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` | number | per-side override; unset follows its axis, then `padding` |
| `background` | color | theme role, `#RRGGBB`, or a gradient; on a component it replaces the built-in surface, on a selection control it fills the box behind the control |
| `borderColor`, `borderThickness` | color, number | outline around the box; `-1` (default) draws none and keeps a component's own outline, `0` removes that outline |
| `borderType` | enum | `solid` (default), `dashed` or `dotted`; a thickness without a colour restyles the outline a component already draws |
| `borderXThickness`, `borderYThickness` | number | left+right, top+bottom; unset follows `borderThickness` |
| `borderTopThickness`, `borderRightThickness`, `borderBottomThickness`, `borderLeftThickness` | number | per-side override; unset follows its axis, then `borderThickness` |
| `borderXColor`, `borderYColor` | color | left+right, top+bottom; unset follows `borderColor` |
| `borderTopColor`, `borderRightColor`, `borderBottomColor`, `borderLeftColor` | color | per-side override; unset follows its axis colour, then `borderColor` |
| `radius` | number | corner radius on all four corners |
| `radiusTop`, `radiusRight`, `radiusBottom`, `radiusLeft` | number | rounds both corners on that side; unset follows `radius` |
| `radiusTopLeft`, `radiusTopRight`, `radiusBottomRight`, `radiusBottomLeft` | number | rounds one corner; unset follows the side, then `radius` |
| `fontFamily` | string | a family installed on the machine, one the app registered with `LoadFont`, `LoadFontFamily` or `LoadVariableFont`, or built-in `Roboto`; inherited by children; see [Fonts](/guide/fonts/) |
| `shadow` | shadow | CSS-style shadow: the box everywhere, the glyphs on `Text`; see [Shadows](/guide/shadows/) |
| `visible` | bool | removes the element from layout, painting and hit-testing |
| `ripple` | bool | press feedback on any element. Unwritten keeps the host's default: a component that ripples (buttons, icon buttons, FABs, chips, tabs, switches, menu and list rows) keeps it, a plain element has none. `true` adds one to a box or a picture — the element takes the press even without an `onClick` handler — and `false` removes it from a button. The disc is clipped to the element's own shape, so it never spills past a pill or a card; a press on a child that is not itself a control counts as a press on the rippling element |
| `flex` | number | share of the parent's leftover main-axis space |
| `alignSelf` | enum | `start`, `center`, `end`, `stretch`; overrides the parent's `crossAxisAlign` |
| `scroll` | bool | scroll when content overflows the box. On by default for `Column`, `Row`, `Flex`, `Carousel` and `NavigationRail`; `scroll: false` turns it off, and the rest of the elements start off |
| `autoScroll` | bool | follow the end as content grows, which keeps a chat's newest row in view. The follow pauses when the reader scrolls away and resumes at the end |
| `opacity` | number | 0 to 1, or a percentage such as `50%`; fades the element and its subtree |
| `backdropBlur` | number or blur gradient | radius in dp of the blur applied to what is already painted behind the element, like CSS `backdrop-filter`, or a `linear-gradient`/`radial-gradient` of radii that fades the blur across the box; 0 (default) is no blur |
| `zIndex` | number | paint order among siblings; a higher value paints on top, layout is unaffected. It is the stronger claim: a modal overlay names one to stay above a page whose popover panel lifts its branch |
| `cursor` | enum | pointer shape, named the way CSS names it: `pointer`, `text`, `move`, `grab`, `not-allowed`, the resize arrows, `wait`, `none`, … |
| `pointerEvents` | enum | `auto` (default) or `none`; `none` lets the pointer pass through the element and its subtree, and a child can set `auto` to take presses again, like CSS |
| `rotate` | rotate | CSS `rotate`: `45deg`, `0.25turn`, `x 90deg`, `1 1 1 90deg`; turns the element and its subtree |
| `transition` | transition | properties that animate when their value changes, e.g. `width 500ms, background 1s`; see [Transitions](/guide/transitions/) |
| `scale` | scale | CSS `scale`: `2`, `50%`, `2 0.5`, `200% 50% 200%`; stretches the element and its subtree about its centre, and layout is unaffected — see [Scale](/guide/scale/) |
| `hideScrollbar` | bool | removes the scrollbar entirely |
| `autoHideScrollbar` | bool | `true` (default) shows the bar only while the pointer is over the area or it scrolled in the last two seconds; `false` keeps it up |
| `scrollbarWidth` | number | bar thickness in dp; 4 by default |
| `scrollbarColor` | color | bar colour; defaults to the theme's muted onSurfaceVariant |
| `scrollShadow` | bool | fades an edge when there is content scrolled away from it |
| `scrollShadowColor` | color | colour of that edge gradient; defaults to the scheme's shadow colour |
| `scrollSnapType` | enum | `none` (default), `mandatory` or `proximity`: snap the scroll to the children's snap points, always or only when the gesture ends near one |
| `scrollSnapAlign` | enum | `none` (default), `start`, `center` or `end`: the edge of this child that lines up with the frame |
| `scrollSnapStop` | enum | `normal` (default) lets a gesture pass several snap points; `stop` ends it at the next one |
| `scrollPadding` | number | inset between the frame and a `start`/`end` snap line, the way CSS `scroll-padding` insets it |

`pointerEvents: none` removes the element from hit-testing without changing how
it paints: a press lands on whatever is drawn underneath. The value inherits, so
a subtree is skipped until a child sets `auto`. From Go the effective state is
`PointerEventsEnabled()`, and `SetPointerEvents` sets the property.

Scrolling, snap points and the Go shortcuts have their own page:
[Scrolling](/guide/scrolling/).

## Containers and spacing

Containers lay their children out in a row or a column and accept `spacing`,
its alias `gap`, `crossAxisAlign` and `mainAxisAlign`: `ButtonGroup`, `Toolbar`,
`Carousel`, `FABMenu`, `Tabs`, `NavigationBar`, `NavigationRail`,
`NavigationDrawer`, `Breadcrumb`, `List`, `Menu`, `Card`, `Dialog`, `BottomSheet`, `SideSheet`,
`DatePicker`, `TimePicker`.

The two axes are the Flutter pair, and they replace the old single `align`:

| Property | Where it acts | Values |
|---|---|---|
| `crossAxisAlign` | across the flow: sideways in a `Column`, up and down in a `Row` | `start`, `center`, `end`, `stretch` |
| `mainAxisAlign` | along the flow, on the leftover space | `start`, `center`, `end`, `spaceBetween`, `spaceAround`, `spaceEvenly` |

Both default to `start`. A child that is a container still fills the cross axis
of its parent, so a `Column` inside a `Column` is full width; `stretch` forces
that for a leaf too. `mainAxisAlign` only has room to work when the children do
not already fill the axis, and in a `Wrap` it spreads each run; a `Stack` and a
`ClipRRect` overlay one box at a time, so they accept only the four geometric
values. `alignSelf` overrides the parent's `crossAxisAlign` for one child.

## From Go

The common box is a Go API as well as a design property:

```go
box := w.MustByID[*ui.Column]("page")
box.SetWidth(320)   // dp; a negative value returns it to auto
box.SetHeight(180)
box.SetSize(320, 180) // both at once, like the design's `size`
box.SetPadding(16)
box.SetMargin(8)
box.SetRadius(12)
box.SetBackground(0x6750A4FF) // a solid colour, replacing a role or a gradient
box.SetBorderThickness(1)
box.SetBorderColor(0x79747EFF)
```

One side of a box is settable too, and `-1` removes the override so the side
follows its aggregate again:

```go
box.SetPaddingX(16)     // left and right
box.SetPaddingY(8)      // top and bottom
box.SetMarginX(24)      // left and right
box.SetMarginY(12)      // top and bottom
box.SetMarginTop(24)
box.SetBorderXThickness(2) // left and right
box.SetBorderYThickness(1) // top and bottom
box.SetBorderLeftThickness(2)
box.SetBorderXColor(0x79747EFF)
box.SetBorderTopColor(0x6750A4FF)
box.SetRadiusTopLeft(0) // a flat top-left corner
box.SetRadiusBottom(12)
```

Every setter marks the tree dirty, so the next frame lays out and repaints
without a manual call. A size is dp, not a percentage: a percentage depends on
the parent the node is built in, which is a design-time fact. A colour is a
literal, because a role or a gradient has to be resolved against the scheme; the
getters (`Width`, `Height`, `Background`, …) read back what was set.

`id` is the handle every other Go call uses. See
[Finding elements](/guide/finding-elements/) for `ByID`, `MustByID` and
`Descendant`, and [Events](/guide/events/) for the handlers a component emits.

Every element also takes `onClick` and `onClickOutside`; the rest of the
[events](/guide/events/) belong to the components that emit them.

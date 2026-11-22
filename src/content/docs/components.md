---
title: "Components"
---

Every element the `.goi` format knows, grouped by what it is for. Each name
links to its own page with a `.goi` example, its properties and a Go example.

The framework has three layers: layout primitives (`Column`, `Row`, `Stack`, …),
plain drawing and content nodes (`Rectangle`, `Image`, `SVG`, `Text`, `Code`,
`Terminal`) and the Material 3 components. They all share one box and one way of being driven from Go.

## Layout and structure

- [Window](/components/window/) — The root of the tree.
- [Column](/components/column/) — Stacks children vertically, top to bottom.
- [Row](/components/row/) — Places children left to right.
- [Flex](/components/flex/) — A Row or a Column, chosen by its `direction` property.
- [Stack](/components/stack/) — Overlays children on top of each other, last child on top.
- [Positioned](/components/positioned/) — Anchors a child inside a Stack.
- [Wrap](/components/wrap/) — Flows children left to right and starts a new run when the next child does not fit.
- [Grid](/components/grid/) — Places children in equal-width columns, as rows or packed like a pinboard.
- [AspectRatio](/components/aspectratio/) — Sizes its box from a width/height ratio and lets the other axis follow.
- [ClipRRect](/components/cliprrect/) — Cuts its children to a rounded box.
- [Divider](/components/divider/) — A one-pixel rule between content.
- [TitleBar](/components/titlebar/) — A Row that moves the window when dragged.
- [GestureDetector](/components/gesturedetector/) — Wraps a child and reports a double tap, a long press and a pan.
- [Hero](/components/hero/) — Flies a shared element from one page to the same tag on another.

## Text and content

- [Text](/components/text/) — One run of text at a Material 3 type-scale role.
- [RichText](/components/richtext/) — One paragraph of styled runs.
- [Icon](/components/icon/) — One Material Symbols glyph, sized and tinted on its own.
- [Code](/components/code/) — A syntax-highlighted code block.
- [Markdown](/components/markdown/) — A markdown document, rendered as elements.
- [Mermaid](/components/mermaid/) — A Mermaid diagram, drawn from its source.
- [Terminal](/components/terminal/) — A character-cell terminal backed by an app-supplied tty.

## Graphics

- [Rectangle](/components/rectangle/) — A plain colored box.
- [Image](/components/image/) — Draws a decoded bitmap.
- [SVG](/components/svg/) — Draws an SVG file, with `currentColor` set from the design.

## Actions

- [Button](/components/button/) — The ordinary Material 3 button.
- [IconButton](/components/iconbutton/) — A square button that holds only an icon.
- [FAB](/components/fab/) — The floating action button: the primary action of a page.
- [FABMenu](/components/fabmenu/) — A FAB that expands into a column of actions.
- [ButtonGroup](/components/buttongroup/) — A row of related buttons that share one shape and one gap.
- [SplitButton](/components/splitbutton/) — A primary action with an attached menu trigger.
- [SegmentedButton](/components/segmentedbutton/) — A horizontal set of segments.
- [Chip](/components/chip/) — A compact, rounded element for filters, inputs, suggestions and tags.
- [Toolbar](/components/toolbar/) — A horizontal strip of compact controls.

## Input and selection

- [Checkbox](/components/checkbox/) — A binary choice with an optional label.
- [RadioButton](/components/radiobutton/) — One option in a set where exactly one is chosen.
- [Switch](/components/switch/) — A single on/off control with an optional label and optional glyph in the thumb.
- [Slider](/components/slider/) — A continuous value control.
- [VerticalSlider](/components/verticalslider/) — A continuous value control laid out as a vertical strip, with an optional icon.
- [TextField](/components/textfield/) — An editable single-line field with a floating label.
- [SearchBar](/components/searchbar/) — A text field shaped as a search input, with a leading search glyph.
- [TextArea](/components/textarea/) — A multiline text field.
- [DatePicker](/components/datepicker/) — A calendar surface for picking a date.
- [TimePicker](/components/timepicker/) — An M3 time picker with a clock dial or two typed fields, a 12-hour display and AM/PM.
- [ColorPicker](/components/colorpicker/) — A saturation/value square, hue and alpha bars, and a hex field for picking a colour.

## Containers and lists

- [Card](/components/card/) — A Material 3 surface that groups related content.
- [List](/components/list/) — A vertical container for `ListItem`s and `MenuItem`s.
- [ListItem](/components/listitem/) — One row in a list: leading icon, label, optional supporting line, trailing affordance.
- [Table](/components/table/) — A sortable data grid with declared columns and rows, selectable and sortable from a design or from Go.
- [TableColumn](/components/table/#tablecolumn), [TableRow](/components/table/#tablerow), [TableCell](/components/table/#tablecell) — the parts of a table, documented with it.
- [Carousel](/components/carousel/) — A horizontally snapping strip of cards.
- [CarouselItem](/components/carouselitem/) — One card in a carousel: clipped child, label over a scrim, and press feedback.

## Overlays and feedback

- [Dialog](/components/dialog/) — A modal surface for a decision or a short form.
- [BottomSheet](/components/bottomsheet/) — A surface anchored to the bottom edge.
- [SideSheet](/components/sidesheet/) — A surface anchored to a side edge, for settings or detail.
- [Menu](/components/menu/) — A popup list of `MenuItem`s.
- [MenuItem](/components/menuitem/) — One row in a menu.
- [Popover](/components/popover/) — A panel that floats against the box of its children.
- [Snackbar](/components/snackbar/) — A short, transient message at the bottom of the screen.
- [Tooltip](/components/tooltip/) — A hint that wraps the control it explains and floats above it on hover.

## Navigation

- [TopAppBar](/components/topappbar/) — The bar at the top of a screen: a leading icon, a title and a trailing icon.
- [NavigationBar](/components/navigationbar/) — The bottom navigation bar for the compact window class.
- [NavigationRail](/components/navigationrail/) — The side navigation rail for medium and expanded windows.
- [NavigationDrawer](/components/navigationdrawer/) — A modal drawer that lists the same destinations as the rail and bar.
- [NavigationItem](/components/navigationitem/) — One destination in a navigation bar, rail or drawer.
- [Breadcrumb](/components/breadcrumb/) — A trail of destinations, with the separators between them.
- [Tabs](/components/tabs/) — A tab bar that groups `Tab` children.
- [Tab](/components/tab/) — One tab in a tab bar.

## Status and progress

- [Badge](/components/badge/) — A small count or status dot, usually overlaid on an icon with `Positioned` or `Stack`.
- [LinearProgress](/components/linearprogress/) — A horizontal progress bar.
- [CircularProgress](/components/circularprogress/) — A circular progress ring.
- [LoadingIndicator](/components/loadingindicator/) — The M3 indeterminate loading shape.
- [Skeleton](/components/skeleton/) — A shimmering placeholder for content that has not arrived.

## Media

Both play through ffmpeg, which has to be on `PATH`; both can hide their controls
and be driven from `.goi` (`clip.play()`) or Go (`app.PlayMedia(clip)`).

- [Audio](/components/audio/) — A sound player with a built-in transport bar.
- [Video](/components/video/) — A video player, decoded with ffmpeg.

## Maps and geometry

- [Map](/components/map/) — OpenStreetMap tiles with pan, zoom and overlay children.
- [Geom](/components/geom/) — One filled and stroked polygon on a map.
- [Point](/components/point/) — A marker on a map, with any children.
- [Path](/components/path/) — An open polyline between coordinates on a map.

## Charts

Every chart takes `ChartSeries` children, so a design holds its own data:
`categories: ["Jan", "Feb"]` names the points and one child per line carries
`label`, `values` and `color`. See [LineChart's data](/components/linechart/#the-data).

Every chart draws its chrome from `grid`, `axis`, `legend` and `values`, and is
interactive: hovering shows a tooltip, clicking fires `onSelect` with the point
index. An app whose numbers move replaces the design's data with `SetData`.

A legend is a switch as well as a key: clicking an entry hides that series (or
that slice, on a pie) and clicking it again brings it back. A hidden entry stays
in place, dimmed, and the value scale and the pie's shares follow what is left.
The last visible entry cannot be turned off, so a chart never ends up with
nothing to click.

- [LineChart](/components/linechart/) — A line per series through the points.
- [AreaChart](/components/areachart/) — A line with the space under it filled.
- [BarChart](/components/barchart/) — Grouped, stacked or horizontal bars.
- [PieChart](/components/piechart/) — Slices, or a donut with a hole.
- [ScatterChart](/components/scatterchart/) — One dot per value, no line.
- [RadarChart](/components/radarchart/) — One polygon per series over a spoke per category.
- [GaugeChart](/components/gaugechart/) — One value as an arc, with the number inside.

## Shared behaviour

The box is the same on every element: size, spacing, background, border,
corners, shadow, opacity and transforms. Its table and Go setters are on
[Common properties](/guide/common-properties/).

- [Events](/guide/events/) — the handler properties and their Go subscriptions.
- [Scrolling](/guide/scrolling/) — offsets, snap points, scroll events and auto-scroll.
- [Colours](/guide/colours/), [Theming](/guide/theming/) and
  [Custom colours](/guide/custom-colors/) — how a component gets its colours.
- [Fonts](/guide/fonts/) and [Icons](/icons/) — the type and glyph a component
  draws.
- [Shadows](/guide/shadows/), [Rotate](/guide/rotate/), [Scale](/guide/scale/),
  [Transitions](/guide/transitions/) and [Tweens](/guide/tweens/) — the visual
  properties and motion.
- [Finding elements](/guide/finding-elements/) — `ByID`, `MustByID` and
  `Descendant` from Go.

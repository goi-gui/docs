---
title: "Hero"
---

A shared element that flies from one page to another. Put a `Hero` around the
same thing on both pages and give the two copies the same `tag`; when the pages
switch, the old copy travels from its box to the new copy's box instead of
disappearing.

[All components](/components/)

<p align="center">
  <img src="/img/components/hero-light.gif" alt="The Hero flight in light mode" style="max-width:45%; height:auto; margin:0 1%;" />
  <img src="/img/components/hero-dark.gif" alt="The Hero flight in dark mode" style="max-width:45%; height:auto; margin:0 1%;" />
</p>

## In a `.goi` file

A `Hero` wraps the thing that should be shared. The wrapper hugs its child:

```goi
Hero {
	tag:      "cover"
	duration: 300ms

	Image {
		src:    "cover.jpg"
		width:  160
		height: 100
		radius: 12
	}
}
```

## A page switch

There are no routes in goi: a page switch is a conditional, a `visible` toggle or
any other update that hides one Hero and shows another with the same tag in the
next frame. That change starts the flight.

```goi
bridge {
	detail  bool
	onOpen  func()
	onClose func()
}

Window {
	Stack {
		if bridge.detail {
			Column {
				padding: 24
				spacing: 16

				Button {
					label:   "Back"
					onClick: bridge.onClose()
				}

				Hero {
					tag:      "cover"
					duration: 300ms

					Image {
						src:    "cover.jpg"
						width:  420
						height: 240
						radius: 20
					}
				}
			}
		} else {
			Column {
				padding: 24
				spacing: 24

				Hero {
					tag:      "cover"
					duration: 300ms

					Image {
						src:    "cover.jpg"
						width:  160
						height: 100
						radius: 12
					}
				}

				Button {
					label:   "Details"
					onClick: bridge.onOpen()
				}
			}
		}
	}
}
```

## Properties

| Property | Type | Notes |
|---|---|---|
| `tag` | string | the name shared by the two copies; an empty tag paints normally |
| `duration` | duration | how long the flight takes; 300ms by default |
| `crossAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child across the box |
| `mainAxisAlign` | enum | `start`, `center`, `end`, `stretch`; places a child along the box |

`Hero` is a wrapper: it draws nothing and hugs its children, like a one-child
`Stack`. Give the child a size, or put a size on the Hero itself.

## Behaviour

The framework remembers the visible Heroes of each painted frame. When a tag's
node changes between frames, it starts one flight:

- The source Hero is hidden immediately, as is the rest of the old page if the
  design hid it.
- The **destination content** is laid out in its final box and painted at the
  flight box: it grows, shrinks and moves from the old copy's place. Because the
  last frame is already the real destination Hero, nothing swaps or pops when
  the flight lands.
- The flight uses Material's fast-out-slow-in curve and takes a shallow arc when
  both axes change, so a diagonal move travels around the page instead of
  cutting a straight line. A flight that changes only one axis stays straight.
- The destination Hero stays hidden while the copy is in the air. When the
  flight ends, it paints in place.
- The flight paints above the page, so it is not clipped by the page that
  contains the destination.

The same tag must be unique among the Heroes visible in one frame, and each copy
must be around the same thing. A `Hero` that is resized or moved while its node
stays the same does not fly; it follows ordinary layout.

A flight is one-way. Switching to another page while it runs ends the flight and
the next page paints its Hero normally.

## From Go

```go
cover := w.MustByID[*ui.Hero]("cover")
cover.Duration.Set(450 * time.Millisecond)
```

The tag is usually a design constant. Changing it starts a new shared name for
the next frame; changing it to `""` turns the flight off.

Every element also accepts the [common properties](/components/#common-properties).

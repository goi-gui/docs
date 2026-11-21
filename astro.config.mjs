import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import goi from "./src/languages/goi.mjs";

export default defineConfig({
	site: "https://goi.kaanksc.com",
	integrations: [
		starlight({
			title: "goi",
			logo: { src: "./src/assets/logo.svg", alt: "goi" },
			favicon: "/img/favicon.svg",
			editLink: {
				baseUrl: "https://github.com/goi-gui/docs/edit/main/src/content/docs/",
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/goi-gui/goi",
				},
			],
			customCss: ["./src/styles/custom.css"],
			expressiveCode: {
				shiki: { langs: [goi] },
			},
			sidebar: [
	{
		"label": "Introduction",
		"link": "/"
	},
	{
		"label": "Getting started",
		"items": [
			{
				"label": "CLI",
				"slug": "guide/cli"
			},
			{
				"label": "goi init",
				"slug": "guide/init"
			},
			{
				"label": "goi run",
				"slug": "guide/run"
			},
			{
				"label": "goi build",
				"slug": "guide/build"
			},
			{
				"label": "goi.yaml",
				"slug": "guide/goi-yaml"
			},
			{
				"label": "In the browser",
				"slug": "guide/browser"
			}
		],
		"collapsed": false
	},
	{
		"label": "Language",
		"items": [
			{
				"label": ".goi syntax",
				"slug": "syntax"
			},
			{
				"label": "Conditionals",
				"slug": "guide/conditionals"
			},
			{
				"label": "Loops",
				"slug": "guide/loops"
			},
			{
				"label": "Bridge",
				"slug": "guide/bridge"
			},
			{
				"label": "Async work",
				"slug": "guide/async"
			},
			{
				"label": "Fragments",
				"slug": "guide/fragments"
			},
			{
				"label": "Translations",
				"slug": "guide/i18n"
			},
			{
				"label": "Reserved Names",
				"slug": "guide/reserved"
			}
		],
		"collapsed": false
	},
	{
		"label": "Style and motion",
		"items": [
			{
				"label": "Colours",
				"slug": "guide/colours"
			},
			{
				"label": "Theming",
				"slug": "guide/theming"
			},
			{
				"label": "Custom colours",
				"slug": "guide/custom-colors"
			},
			{
				"label": "Fonts",
				"slug": "guide/fonts"
			},
			{
				"label": "Shadows",
				"slug": "guide/shadows"
			},
			{
				"label": "Rotate",
				"slug": "guide/rotate"
			},
			{
				"label": "Scale",
				"slug": "guide/scale"
			},
			{
				"label": "Transitions",
				"slug": "guide/transitions"
			},
			{
				"label": "Tweens",
				"slug": "guide/tweens"
			}
		],
		"collapsed": false
	},
	{
		"label": "Components",
		"items": [
			{
				"label": "Overview",
				"slug": "components"
			},
			{
				"label": "Layout and structure",
				"items": [
					{
						"label": "Window",
						"slug": "components/window"
					},
					{
						"label": "Column",
						"slug": "components/column"
					},
					{
						"label": "Flex",
						"slug": "components/flex"
					},
					{
						"label": "Row",
						"slug": "components/row"
					},
					{
						"label": "TitleBar",
						"slug": "components/titlebar"
					},
					{
						"label": "Stack",
						"slug": "components/stack"
					},
					{
						"label": "Positioned",
						"slug": "components/positioned"
					},
					{
						"label": "ClipRRect",
						"slug": "components/cliprrect"
					},
					{
						"label": "Hero",
						"slug": "components/hero"
					},
					{
						"label": "GestureDetector",
						"slug": "components/gesturedetector"
					},
					{
						"label": "Wrap",
						"slug": "components/wrap"
					},
					{
						"label": "Grid",
						"slug": "components/grid"
					},
					{
						"label": "AspectRatio",
						"slug": "components/aspectratio"
					},
					{
						"label": "Divider",
						"slug": "components/divider"
					}
				],
				"collapsed": true
			},
			{
				"label": "Content",
				"items": [
					{
						"label": "Text",
						"slug": "components/text"
					},
					{
						"label": "Icon",
						"slug": "components/icon"
					},
					{
						"label": "RichText",
						"slug": "components/richtext"
					},
					{
						"label": "Code",
						"slug": "components/code"
					},
					{
						"label": "Markdown",
						"slug": "components/markdown"
					},
					{
						"label": "Mermaid",
						"slug": "components/mermaid"
					},
					{
						"label": "Image",
						"slug": "components/image"
					},
					{
						"label": "SVG",
						"slug": "components/svg"
					},
					{
						"label": "Rectangle",
						"slug": "components/rectangle"
					}
				],
				"collapsed": true
			},
			{
				"label": "Actions",
				"items": [
					{
						"label": "Button",
						"slug": "components/button"
					},
					{
						"label": "IconButton",
						"slug": "components/iconbutton"
					},
					{
						"label": "FAB",
						"slug": "components/fab"
					},
					{
						"label": "FABMenu",
						"slug": "components/fabmenu"
					},
					{
						"label": "ButtonGroup",
						"slug": "components/buttongroup"
					},
					{
						"label": "SplitButton",
						"slug": "components/splitbutton"
					},
					{
						"label": "SegmentedButton",
						"slug": "components/segmentedbutton"
					},
					{
						"label": "Chip",
						"slug": "components/chip"
					},
					{
						"label": "Toolbar",
						"slug": "components/toolbar"
					}
				],
				"collapsed": true
			},
			{
				"label": "Selection controls",
				"items": [
					{
						"label": "Checkbox",
						"slug": "components/checkbox"
					},
					{
						"label": "RadioButton",
						"slug": "components/radiobutton"
					},
					{
						"label": "Switch",
						"slug": "components/switch"
					},
					{
						"label": "Slider",
						"slug": "components/slider"
					}
				],
				"collapsed": true
			},
			{
				"label": "Text input",
				"items": [
					{
						"label": "TextField",
						"slug": "components/textfield"
					},
					{
						"label": "SearchBar",
						"slug": "components/searchbar"
					},
					{
						"label": "TextArea",
						"slug": "components/textarea"
					}
				],
				"collapsed": true
			},
			{
				"label": "Containment",
				"items": [
					{
						"label": "Card",
						"slug": "components/card"
					},
					{
						"label": "Dialog",
						"slug": "components/dialog"
					},
					{
						"label": "BottomSheet",
						"slug": "components/bottomsheet"
					},
					{
						"label": "SideSheet",
						"slug": "components/sidesheet"
					},
					{
						"label": "List",
						"slug": "components/list"
					},
					{
						"label": "ListItem",
						"slug": "components/listitem"
					},
					{
						"label": "Menu",
						"slug": "components/menu"
					},
					{
						"label": "MenuItem",
						"slug": "components/menuitem"
					},
					{
						"label": "Popover",
						"slug": "components/popover"
					},
					{
						"label": "Snackbar",
						"slug": "components/snackbar"
					},
					{
						"label": "Tooltip",
						"slug": "components/tooltip"
					},
					{
						"label": "Table",
						"slug": "components/table"
					},
					{
						"label": "Carousel",
						"slug": "components/carousel"
					},
					{
						"label": "CarouselItem",
						"slug": "components/carouselitem"
					}
				],
				"collapsed": true
			},
			{
				"label": "Navigation",
				"items": [
					{
						"label": "TopAppBar",
						"slug": "components/topappbar"
					},
					{
						"label": "NavigationBar",
						"slug": "components/navigationbar"
					},
					{
						"label": "NavigationRail",
						"slug": "components/navigationrail"
					},
					{
						"label": "NavigationDrawer",
						"slug": "components/navigationdrawer"
					},
					{
						"label": "NavigationItem",
						"slug": "components/navigationitem"
					},
					{
						"label": "Breadcrumb",
						"slug": "components/breadcrumb"
					},
					{
						"label": "Tabs",
						"slug": "components/tabs"
					},
					{
						"label": "Tab",
						"slug": "components/tab"
					}
				],
				"collapsed": true
			},
			{
				"label": "Status and progress",
				"items": [
					{
						"label": "Badge",
						"slug": "components/badge"
					},
					{
						"label": "LinearProgress",
						"slug": "components/linearprogress"
					},
					{
						"label": "CircularProgress",
						"slug": "components/circularprogress"
					},
					{
						"label": "LoadingIndicator",
						"slug": "components/loadingindicator"
					},
					{
						"label": "Skeleton",
						"slug": "components/skeleton"
					}
				],
				"collapsed": true
			},
			{
				"label": "Date and time",
				"items": [
					{
						"label": "DatePicker",
						"slug": "components/datepicker"
					},
					{
						"label": "TimePicker",
						"slug": "components/timepicker"
					},
					{
						"label": "ColorPicker",
						"slug": "components/colorpicker"
					}
				],
				"collapsed": true
			},
			{
				"label": "Media",
				"items": [
					{
						"label": "Audio",
						"slug": "components/audio"
					},
					{
						"label": "Video",
						"slug": "components/video"
					}
				],
				"collapsed": true
			},
			{
				"label": "Maps",
				"items": [
					{
						"label": "Map",
						"slug": "components/map"
					},
					{
						"label": "Geom",
						"slug": "components/geom"
					},
					{
						"label": "Point",
						"slug": "components/point"
					},
					{
						"label": "Path",
						"slug": "components/path"
					}
				],
				"collapsed": true
			},
			{
				"label": "Charts",
				"items": [
					{
						"label": "LineChart",
						"slug": "components/linechart"
					},
					{
						"label": "AreaChart",
						"slug": "components/areachart"
					},
					{
						"label": "BarChart",
						"slug": "components/barchart"
					},
					{
						"label": "PieChart",
						"slug": "components/piechart"
					},
					{
						"label": "ScatterChart",
						"slug": "components/scatterchart"
					},
					{
						"label": "RadarChart",
						"slug": "components/radarchart"
					},
					{
						"label": "GaugeChart",
						"slug": "components/gaugechart"
					}
				],
				"collapsed": true
			}
		],
		"collapsed": false
	},
	{
		"label": "Icons",
		"slug": "icons"
	},
	{
		"label": "System integration",
		"items": [
			{
				"label": "File dialogs",
				"slug": "system/file-dialogs"
			},
			{
				"label": "Notifications",
				"slug": "system/notifications"
			},
			{
				"label": "Keyboard",
				"slug": "system/keyboard"
			}
		],
		"collapsed": false
	},
	{
		"label": "IDE Extensions",
		"items": [
			{
				"label": "Zed",
				"slug": "ide-extensions/zed"
			}
		],
		"collapsed": false
	}
]
		}),
	],
});

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
					label: "Introduction",
					link: "/",
				},
				{
					label: "Getting started",
					items: [
						{ label: "CLI", slug: "guide/cli" },
						{ label: "goi init", slug: "guide/init" },
						{ label: "goi run", slug: "guide/run" },
						{ label: "goi build", slug: "guide/build" },
						{ label: "goi pack", slug: "guide/pack" },
						{ label: "goi.yaml", slug: "guide/goi-yaml" },
						{ label: "Assets", slug: "guide/assets" },
						{ label: "In the browser", slug: "guide/browser" },
					],
					collapsed: false,
				},
				{
					label: "Language",
					items: [
						{ label: ".goi syntax", slug: "syntax" },
						{
							label: "Modifiers",
							items: [
								{ label: "Conditional", slug: "guide/conditionals" },
								{ label: "Responsive", slug: "guide/responsive" },
								{ label: "State", slug: "guide/states" },
							],
							collapsed: false,
						},
						{ label: "Loops", slug: "guide/loops" },
						{ label: "Fragments", slug: "guide/fragments" },
						{ label: "Translations", slug: "guide/i18n" },
						{ label: "Reserved names", slug: "guide/reserved" },
					],
					collapsed: false,
				},
				{
					label: "Go integration",
					items: [
						{ label: "Bridge", slug: "guide/bridge" },
						{ label: "Events", slug: "guide/events" },
						{ label: "Async work", slug: "guide/async" },
						{ label: "Finding elements", slug: "guide/finding-elements" },
					],
					collapsed: false,
				},
				{
					label: "Layout",
					items: [
						{ label: "Common properties", slug: "guide/common-properties" },
						{ label: "Scrolling", slug: "guide/scrolling" },
					],
					collapsed: false,
				},
				{
					label: "Styling",
					items: [
						{ label: "Colours", slug: "guide/colours" },
						{ label: "Theming", slug: "guide/theming" },
						{ label: "Custom colours", slug: "guide/custom-colors" },
						{ label: "Fonts", slug: "guide/fonts" },
						{ label: "Icons", slug: "icons" },
						{ label: "Shadows", slug: "guide/shadows" },
						{ label: "Rotate", slug: "guide/rotate" },
						{ label: "Scale", slug: "guide/scale" },
						{ label: "Transitions", slug: "guide/transitions" },
						{ label: "Tweens", slug: "guide/tweens" },
					],
					collapsed: false,
				},
				{
					label: "Components",
					items: [
						{ label: "Overview", slug: "components" },
						{
							label: "Layout and structure",
							items: [
								{ label: "Window", slug: "components/window" },
								{ label: "Column", slug: "components/column" },
								{ label: "Row", slug: "components/row" },
								{ label: "Flex", slug: "components/flex" },
								{ label: "Stack", slug: "components/stack" },
								{ label: "Positioned", slug: "components/positioned" },
								{ label: "Wrap", slug: "components/wrap" },
								{ label: "Grid", slug: "components/grid" },
								{ label: "AspectRatio", slug: "components/aspectratio" },
								{ label: "ClipRRect", slug: "components/cliprrect" },
								{ label: "Divider", slug: "components/divider" },
								{ label: "TitleBar", slug: "components/titlebar" },
								{ label: "GestureDetector", slug: "components/gesturedetector" },
								{ label: "Hero", slug: "components/hero" },
							],
							collapsed: true,
						},
						{
							label: "Text and content",
							items: [
								{ label: "Text", slug: "components/text" },
								{ label: "RichText", slug: "components/richtext" },
								{ label: "Icon", slug: "components/icon" },
								{ label: "Code", slug: "components/code" },
								{ label: "Markdown", slug: "components/markdown" },
								{ label: "Mermaid", slug: "components/mermaid" },
								{ label: "Terminal", slug: "components/terminal" },
								{ label: "WebView", slug: "components/webview" },
							],
							collapsed: true,
						},
						{
							label: "Graphics",
							items: [
								{ label: "Rectangle", slug: "components/rectangle" },
								{ label: "Image", slug: "components/image" },
								{ label: "SVG", slug: "components/svg" },
							],
							collapsed: true,
						},
						{
							label: "Actions",
							items: [
								{ label: "Button", slug: "components/button" },
								{ label: "IconButton", slug: "components/iconbutton" },
								{ label: "FAB", slug: "components/fab" },
								{ label: "FABMenu", slug: "components/fabmenu" },
								{ label: "ButtonGroup", slug: "components/buttongroup" },
								{ label: "SplitButton", slug: "components/splitbutton" },
								{ label: "SegmentedButton", slug: "components/segmentedbutton" },
								{ label: "Chip", slug: "components/chip" },
								{ label: "Toolbar", slug: "components/toolbar" },
							],
							collapsed: true,
						},
						{
							label: "Input and selection",
							items: [
								{ label: "Checkbox", slug: "components/checkbox" },
								{ label: "RadioButton", slug: "components/radiobutton" },
								{ label: "Switch", slug: "components/switch" },
								{ label: "Slider", slug: "components/slider" },
								{ label: "TextField", slug: "components/textfield" },
								{ label: "SearchBar", slug: "components/searchbar" },
								{ label: "TextArea", slug: "components/textarea" },
								{ label: "DatePicker", slug: "components/datepicker" },
								{ label: "TimePicker", slug: "components/timepicker" },
								{ label: "ColorPicker", slug: "components/colorpicker" },
							],
							collapsed: true,
						},
						{
							label: "Containers and lists",
							items: [
								{ label: "Card", slug: "components/card" },
								{ label: "List", slug: "components/list" },
								{ label: "ListItem", slug: "components/listitem" },
								{ label: "Table", slug: "components/table" },
								{ label: "TableColumn", link: "/components/table/#tablecolumn" },
								{ label: "TableRow", link: "/components/table/#tablerow" },
								{ label: "TableCell", link: "/components/table/#tablecell" },
								{ label: "Carousel", slug: "components/carousel" },
								{ label: "CarouselItem", slug: "components/carouselitem" },
							],
							collapsed: true,
						},
						{
							label: "Overlays and feedback",
							items: [
								{ label: "Dialog", slug: "components/dialog" },
								{ label: "BottomSheet", slug: "components/bottomsheet" },
								{ label: "SideSheet", slug: "components/sidesheet" },
								{ label: "Menu", slug: "components/menu" },
								{ label: "MenuItem", slug: "components/menuitem" },
								{ label: "Popover", slug: "components/popover" },
								{ label: "Snackbar", slug: "components/snackbar" },
								{ label: "Tooltip", slug: "components/tooltip" },
							],
							collapsed: true,
						},
						{
							label: "Navigation",
							items: [
								{ label: "TopAppBar", slug: "components/topappbar" },
								{ label: "NavigationBar", slug: "components/navigationbar" },
								{ label: "NavigationRail", slug: "components/navigationrail" },
								{ label: "NavigationDrawer", slug: "components/navigationdrawer" },
								{ label: "NavigationItem", slug: "components/navigationitem" },
								{ label: "Breadcrumb", slug: "components/breadcrumb" },
								{ label: "Tabs", slug: "components/tabs" },
								{ label: "Tab", slug: "components/tab" },
							],
							collapsed: true,
						},
						{
							label: "Status and progress",
							items: [
								{ label: "Badge", slug: "components/badge" },
								{ label: "LinearProgress", slug: "components/linearprogress" },
								{ label: "CircularProgress", slug: "components/circularprogress" },
								{ label: "LoadingIndicator", slug: "components/loadingindicator" },
								{ label: "Skeleton", slug: "components/skeleton" },
							],
							collapsed: true,
						},
						{
							label: "Media",
							items: [
								{ label: "Audio", slug: "components/audio" },
								{ label: "Video", slug: "components/video" },
							],
							collapsed: true,
						},
						{
							label: "Maps and geometry",
							items: [
								{ label: "Map", slug: "components/map" },
								{ label: "Geom", slug: "components/geom" },
								{ label: "Point", slug: "components/point" },
								{ label: "Path", slug: "components/path" },
							],
							collapsed: true,
						},
						{
							label: "Charts",
							items: [
								{ label: "LineChart", slug: "components/linechart" },
								{ label: "AreaChart", slug: "components/areachart" },
								{ label: "BarChart", slug: "components/barchart" },
								{ label: "PieChart", slug: "components/piechart" },
								{ label: "ScatterChart", slug: "components/scatterchart" },
								{ label: "RadarChart", slug: "components/radarchart" },
								{ label: "GaugeChart", slug: "components/gaugechart" },
							],
							collapsed: true,
						},
					],
					collapsed: false,
				},
				{
					label: "System integration",
					items: [
						{ label: "File dialogs", slug: "system/file-dialogs" },
						{ label: "Notifications", slug: "system/notifications" },
						{ label: "Keyboard", slug: "system/keyboard" },
					],
					collapsed: false,
				},
				{
					label: "Tooling",
					items: [
						{ label: "Zed", slug: "ide-extensions/zed" },
						{ label: "VS Code", slug: "ide-extensions/vscode" },
						{ label: "Troubleshooting", slug: "guide/troubleshooting" },
					],
					collapsed: false,
				},
			]
		}),
	],
});

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    'syntax',
    'guide/build',
    {
      type: 'category',
      label: 'Language',
      collapsed: false,
      items: [
        'guide/conditionals',
        'guide/loops',
        'guide/shadows',
        'guide/reserved',
        'guide/bridge',
        'guide/fragments',
        'guide/i18n',
        {
          type: 'category',
          label: 'Colour and motion',
          collapsed: true,
          items: ['guide/colours', 'guide/theming', 'guide/custom-colors', 'guide/rotate', 'guide/tweens'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Components',
      link: {type: 'doc', id: 'components'},
      collapsed: false,
      items: [
        {
          type: 'category',
          label: "Layout and structure",
          collapsed: true,
          items: ["components/window", "components/column", "components/row", "components/titlebar", "components/stack", "components/positioned", "components/cliprrect", "components/wrap", "components/grid", "components/rectangle", "components/image", "components/svg", "components/text"],
        },
        {
          type: 'category',
          label: "Actions",
          collapsed: true,
          items: ["components/button", "components/iconbutton", "components/fab", "components/fabmenu", "components/buttongroup", "components/splitbutton", "components/segmentedbutton", "components/chip"],
        },
        {
          type: 'category',
          label: "Selection controls",
          collapsed: true,
          items: ["components/checkbox", "components/radiobutton", "components/switch", "components/slider"],
        },
        {
          type: 'category',
          label: "Text input",
          collapsed: true,
          items: ["components/textfield", "components/searchbar", "components/textarea"],
        },
        {
          type: 'category',
          label: "Containment",
          collapsed: true,
          items: ["components/card", "components/dialog", "components/bottomsheet", "components/sidesheet", "components/divider", "components/list", "components/listitem", "components/menu", "components/menuitem", "components/tooltip", "components/snackbar", "components/table"],
        },
        {
          type: 'category',
          label: "Navigation",
          collapsed: true,
          items: ["components/topappbar", "components/navigationbar", "components/navigationrail", "components/navigationdrawer", "components/navigationitem", "components/tabs", "components/tab"],
        },
        {
          type: 'category',
          label: "Status and progress",
          collapsed: true,
          items: ["components/badge", "components/linearprogress", "components/circularprogress", "components/loadingindicator"],
        },
        {
          type: 'category',
          label: "Date and time",
          collapsed: true,
          items: ["components/datepicker", "components/timepicker"],
        },
        {
          type: 'category',
          label: "Media and grouping",
          collapsed: true,
          items: ["components/carousel", "components/toolbar", "components/code"],
        },
      ],
    },
    'icons',
    {
      type: 'category',
      label: 'System integration',
      collapsed: false,
      items: [
        'system/file-dialogs',
        'system/notifications',
        'system/keyboard',
      ],
    },
    {
      type: 'category',
      label: 'IDE Extensions',
      collapsed: false,
      items: ['ide-extensions/zed'],
    },
  ],
};

export default sidebars;

// Registers the `.goi` language with the Prism instance Docusaurus highlights
// with. The grammar is line-oriented the way goifmt writes a design: element
// names start with a capital, property names are the lowercase word before a
// colon, and the namespaces the framework supplies (`app`, `window`, `bridge`)
// read as builtins.
//
// The stock theme-classic component also loads `themeConfig.prism.
// additionalLanguages`; this copy keeps that, so adding one to the config still
// works.
import siteConfig from "@generated/docusaurus.config";

/** @param {import('prism-react-renderer').Prism} Prism */
export default function prismIncludeLanguages(Prism) {
	const { themeConfig } = siteConfig;
	const additionalLanguages = themeConfig.prism?.additionalLanguages ?? [];
	const before = globalThis.Prism;
	globalThis.Prism = Prism;
	for (const lang of additionalLanguages) {
		if (lang === "php") {
			// eslint-disable-next-line global-require
			require("prismjs/components/prism-markup-templating.js");
		}
		// eslint-disable-next-line global-require, import/no-dynamic-require
		require(`prismjs/components/prism-${lang}`);
	}
	delete globalThis.Prism;
	if (typeof before !== "undefined") {
		globalThis.Prism = before;
	}

	Prism.languages.goi = {
		comment: [
			{ pattern: /\/\/[^\n]*/, greedy: true },
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
		],
		string: {
			pattern: /"(?:\\[\s\S]|[^"\\\n])*"/,
			greedy: true,
		},
		// `#rgb`, `#rrggbb`, `#rrggbbaa`; a bare `#` is never anything else.
		color: {
			pattern: /#[0-9a-fA-F]{3,8}\b/,
			alias: "string",
		},
		// A fragment's slots: `$children`, `$header`.
		slot: {
			pattern: /\$[A-Za-z_]\w*/,
			alias: "keyword",
		},
		// The namespaces the framework supplies. They are matched before the
		// block keywords so `bridge.Count` is a namespace, not a declaration.
		// `theme` and `customColor` are colour roles, which the scheme resolves.
		builtin: {
			pattern: /\b(?:app|window|props|bridge|data|event|theme|customColor)\b(?=\s*\.)/,
		},
		keyword: {
			pattern:
				/\b(?:import|props|bridge|data|type|func|if|else|for|range|switch|case|default|responsive|conditional|inset|none|normal|bold|bolder|lighter|italic|underline|overline|line-through)\b/,
		},
		boolean: /\b(?:true|false)\b/,
		// The pure builtins a value may call.
		function:
			/\b(?:formatf|t|len|cap|min|max)\b(?=\s*\()/,
		// An element or a declared type: a capitalised name before its body.
		tag: {
			pattern: /\b[A-Z][A-Za-z0-9]*(?=\s*\{)/,
			alias: "class-name",
		},
		// A property or a fragment prop: `text:`, `Title:`. `row :=` is a
		// loop variable, not a property.
		property: {
			pattern: /\b[A-Za-z_]\w*(?=\s*:(?!=))/,
		},
		// A declared primitive type or `map`/`func` in a bridge block.
		"builtin-type": {
			pattern:
				/\b(?:bool|string|color|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|float32|float64|byte|rune|map)\b/,
			alias: "builtin",
		},
		number: {
			pattern: /\b\d+(?:\.\d+)?%?/,
			greedy: true,
		},
		operator: /:=|==|!=|<=|>=|&&|\|\||[+\-*/%<>=!?]/,
		punctuation: /[{}[\](),;:.]/,
	};
}

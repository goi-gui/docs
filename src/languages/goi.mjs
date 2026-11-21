// The `.goi` grammar, ported from the Prism definition the Docusaurus site
// used. Element names start with a capital, properties are the lowercase word
// before a colon, and the namespaces the framework supplies (`app`, `window`,
// `bridge`) read as support scopes.
export default {
	name: 'goi',
	scopeName: 'source.goi',
	patterns: [
		{ include: '#comments' },
		{ include: '#strings' },
		{ include: '#colors' },
		{ include: '#slots' },
		{ include: '#namespace' },
		{ include: '#keywords' },
		{ include: '#booleans' },
		{ include: '#functions' },
		{ include: '#tags' },
		{ include: '#properties' },
		{ include: '#types' },
		{ include: '#numbers' },
		{ include: '#operators' },
		{ include: '#punctuation' },
	],
	repository: {
		comments: {
			patterns: [
				{ match: '//.*$', name: 'comment.line.double-slash.goi' },
				{
					begin: '/\\*',
					end: '\\*/',
					name: 'comment.block.goi',
				},
			],
		},
		strings: {
			match: '"(?:\\\\.|[^"\\\\])*"',
			name: 'string.quoted.double.goi',
		},
		colors: {
			match: '#[0-9a-fA-F]{3,8}\\b',
			name: 'constant.other.color.goi',
		},
		slots: {
			match: '\\$[A-Za-z_]\\w*',
			name: 'variable.other.slot.goi',
		},
		namespace: {
			match: '\\b(?:app|window|props|bridge|data|event|theme|customColor)\\b(?=\\s*\\.)',
			name: 'support.other.namespace.goi',
		},
		keywords: {
			match:
				'\\b(?:import|props|bridge|data|type|func|if|else|for|range|switch|case|default|responsive|conditional|inset|none|normal|bold|bolder|lighter|italic|underline|overline|line-through)\\b',
			name: 'keyword.control.goi',
		},
		booleans: {
			match: '\\b(?:true|false)\\b',
			name: 'constant.language.boolean.goi',
		},
		functions: {
			match: '\\b(?:formatf|t|len|cap|min|max)\\b(?=\\s*\\()',
			name: 'support.function.goi',
		},
		tags: {
			match: '\\b[A-Z][A-Za-z0-9]*(?=\\s*\\{)',
			name: 'entity.name.type.goi',
		},
		properties: {
			match: '\\b[A-Za-z_]\\w*(?=\\s*:(?!=))',
			name: 'variable.other.property.goi',
		},
		types: {
			match:
				'\\b(?:bool|string|color|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|float32|float64|byte|rune|map)\\b',
			name: 'storage.type.goi',
		},
		numbers: {
			match: '\\b\\d+(?:\\.\\d+)?%?',
			name: 'constant.numeric.goi',
		},
		operators: {
			match: ':=|==|!=|<=|>=|&&|\\|\\||[+\\-*/%<>=!?]',
			name: 'keyword.operator.goi',
		},
		punctuation: {
			match: '[{}\\[\\](),;:.]',
			name: 'punctuation.separator.goi',
		},
	},
};

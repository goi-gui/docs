---
title: "Setup"
---

A `setup { … }` block holds Go declarations that only the file it was written
in can read. It is for small, pure helpers next to a page: a label formatter, a
derived value, a shared constant.

```goi
setup {
	var name = "Kaan"

	func greet(n string) string {
		return "Hi, " + strings.TrimSpace(n)
	}
}

Window {
	Text { text: greet(name) }
}
```

The body is Go source. It may contain `import`, `const`, `var`, `type` and
`func` declarations. A package-level `:=` is not valid Go: write `var name =`
instead.

Imports are managed for you. Using `strings.TrimSpace` imports `strings`, using
`fmt.Println` imports `fmt`, and an import the body does not use is dropped, so
an unused import is not an error. A name that two standard packages share
(`rand`, `template`, `json`, `pprof`, `scanner`) resolves to the common one;
import the other spelling explicitly when you need it.

## Scope

- Every file has its own scope. A name in `Main.goi` is not visible in an
  imported fragment, and a fragment's names are not visible in the page that
  imports it.
- Every fragment **instance** gets its own copy of the fragment's setup state.
  Two `Counter {}` calls in one page therefore have two independent `count`
  values, not one shared value.
- The file is interpreted once, not once per instance. Each instance carries
  only its variables; a hundred counters cost a few kilobytes, not a hundred
  interpreters. Methods and variadic functions compile too. A file the shared
  program cannot express — a method that reads a setup variable, or a parameter
  that is not a primitive — falls back to a per-instance interpreter,
  copy-on-write: instances that only read share one interpreter until a setup
  function reads or writes a setup variable.
- All setup files share one interpreter, each as its own package, so `fmt` and
  the rest of the standard library compile once for the whole design. A file is
  compiled the first time something reads it: a hundred fragments of which ten
  are on the page cost ten, not a hundred.
- Only the packages the body uses are loaded, including the ones imported for
  you: a setup block with no package reference registers none. Loading the whole
  standard library for every file would cost about 1.3 MB per file for nothing.
- A fragment previewed on its own runs its own setup, the same way `goicheck`
  and the editor preview do.

## Values and functions

A setup variable is an ordinary value in a property:

```goi
setup {
	var label = "Total"
	var count = 3
}

Text { text: label }
Text { text: formatf("%d items", count) }
```

A setup function is called with the same expression grammar as the rest of the
design. Numbers, strings, bools and lists cross the boundary the way they do for
a bridge handler; a function may return one value and an optional `error`.

```goi
setup {
	func price(total float64, tax float64) float64 {
		return total * (1 + tax)
	}
}

Text { text: formatf("%.2f", price(100, 0.2)) }
```

Setup functions are evaluated while the design is running. Keep them pure and
cheap: a property that reads a setup function is evaluated again on every
expression pass. They should not touch nodes, start goroutines or block.

Setup values also drive control blocks, with the type their declaration gives
them:

```goi
setup {
	var show bool
	var mode = "compact"
	var items = []string{"one", "two"}
}

Window { Column {
	if show { Text { text: "shown" } }
	switch mode {
		case "compact":
			Text { text: "compact" }
		default:
			Text { text: "full" }
	}
	for _, item := range items { Text { text: item } }
} }
```

A bool is an `if` condition, a string or number can be a `switch` subject, and a
slice, map or number can be ranged over.

## Props access

A fragment's `props` block is readable from its setup as `props.name`, with the
type the prop declared:

```goi
props {
	title string
	count int
}

setup {
	func label() string {
		return fmt.Sprintf("%s:%d", props.title, props.count)
	}
}
```

Each fragment instance sees the values its caller passed; a prop the instance
leaves out is its type's zero value. A prop passed as a bridge value is read
again when setup runs, so it follows `ui.SetData`. The entry file has no props
unless it is previewed as a fragment.

## Bridge access

Setup code can read the design's bridge values and call its handlers. The
bridge block may declare a handler with the `func` spelling or as a method, and
a handler may return one value:

```goi
bridge {
	content string
	getFileName() string
	onSave(fileName string)
}

setup {
	import "fmt"

	func save() {
		name := bridge.getFileName()
		bridge.onSave(name)
		fmt.Println(bridge.content)
	}
}
```

`bridge.content` follows `ui.SetData`; the fields are refreshed when setup code
runs. A handler call uses the Go function registered with `ui.SetHandler`, and
its return value is available in setup. The handler still belongs to Go: setup
only calls it.

A list keeps the type the bridge declared. Rows `ui.SetData` stores may be
structs (fields matched by their `goi` tag, then name, ignoring case) or maps;
setup sees the shape from the design:

```goi
bridge {
	tickets []ticket
}

type ticket {
	title  string
	unread bool
}

setup {
	func unread() int {
		n := 0
		for _, t := range bridge.tickets {
			if t.unread {
				n++
			}
		}
		return n
	}
}
```

`[]string`, `[]float64` and `map[string]int` arrive typed the same way, so a
setup function can take `[]ticket` or return `[]string` without a cast.

## Events

A setup function may be an event handler. The design calls it by name, and its
return value is ignored:

```goi
setup {
	var count = 0

	func increase() { count++ }
	func decrease() { count-- }
}

Window {
	Column {
		Text { text: formatf("Count: %d", count) }
		Button { label: "+" onClick: increase() }
		Button { label: "-" onClick: decrease() }
	}
}
```

The functions run on the UI goroutine. Keep them short, and read their state
through an ordinary property expression; the next expression pass picks up the
new value.

## Lifecycle

Two names are reserved for the framework. `onMount` runs once for each visible
instance after the page's first frame is painted, and again whenever a condition
shows it after it was hidden. `onUnmount` runs when a condition hides it, when
the window closes, or when a hot reload replaces the design:

```goi
setup {
	var loading = true

	func onMount() {
		loading = true
	}

	func onUnmount() {
		// release anything this instance opened
	}
}
```

Both hooks run on the UI goroutine. Loading and the first paint never wait for
them, so the window appears even when a hook does some work. They are not
design functions: an element cannot call `onMount()` or `onUnmount()`.

Keep a hook short. A slow hook delays the frame after the first paint. For real
background work, call a Go bridge handler and let Go run it in a goroutine; the
handler posts the result back with `ui.SetData`. Setup state is not safe to
touch from another goroutine.

## What setup cannot do

- Importing application packages is not supported yet: the interpreter has the
  Go standard library, not the app's module.
- Setup is not a sandbox. The standard library can read files and open network
  connections, so only load designs you trust.
- A setup variable is read-only from the design. A function may change its own
  variables, but the recommended shape is a pure function of its arguments.

## Hot reload

Editing a design reloads it and evaluates the setup blocks again. Setup
variables start from their initial values on every reload; keep state that must
survive in Go outside `Bind`, and push it into the design with `ui.SetData`.

A broken setup block stops the reload and leaves the last working page on
screen. The error names the `.goi` file and line.

## Tools

The language server parses and type-checks each setup body with Go's own parser
and checker. A syntax or type error gets a squiggle on the `.goi` line, setup
values and functions complete in property values, and Go names, local variables
and imported package members complete inside the body. Both editor extensions
highlight the body as Go: VS Code includes its Go grammar, and Zed injects the
Go parser into the block.

`goicheck` evaluates setup blocks, so `goicheck -layout` catches a block that
does not parse or a function that fails while the page is being checked.

Setup support is a build feature. `auto` in `runFlags` or `buildFlags` detects a
setup block and adds the `setup` tag; `all` includes it too. Without the tag a
core build reports that the design uses setup instead of treating its names as
literals.

Setup code is interpreted, not compiled into the app. `goi build` embeds the
interpreter with the design, so a packaged app needs no Go toolchain at runtime.

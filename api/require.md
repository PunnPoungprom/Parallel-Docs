# require

Module loading. Module names are explicit aliases — there is no filesystem navigation.

```luau
require(name: string): any
```

| Form | Loads from |
| --- | --- |
| `require("@modules/<name>")` | World modules: `<world>/parallel/scripts/modules/<name>.luau` |
| `require("@<name>")` | Engine builtins shipped in the mod jar (e.g. [`@bytenet`](/api/bytenet)) |

A module is a `.luau` file that returns a value (usually a table):

```luau
-- <world>/parallel/scripts/modules/mathx.luau
return {
	double = function(n: number): number
		return n * 2
	end,
}
```

```luau
local mathx = require("@modules/mathx")
print(mathx.double(21)) --> 42
```

## Semantics

- **Cached per side**: a module runs once per Luau environment; every `require` after the first
  returns the same value (Roblox semantics). The cache is cleared when the environment restarts
  (`/parallel reload`, relog).
- **Both sides see world modules**: the server reads them from disk; clients receive them in the
  join-sync batch alongside client scripts. This makes modules the right place for shared
  definitions — e.g. a [ByteNet namespace](/api/bytenet) both sides must agree on.
- **Cycles error** instead of recursing forever.

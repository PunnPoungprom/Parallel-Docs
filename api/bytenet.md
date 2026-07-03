# ByteNet (@bytenet)

```luau
local ByteNet = require("@bytenet")
```

Typed packets over [NetworkService](/api/networkservice) — a pure-Luau port of
[ByteNet](https://github.com/ffrostfall/ByteNet) (MIT). Instead of hand-packing buffers, you
declare packet shapes once and get `send`/`listen` with plain tables.

Sends are batched per `RunService.Heartbeat` into one message per namespace, which keeps you well
inside the [serverbound quotas](/api/networkservice#quotas-limits).

## Defining packets

Define namespaces in a **shared [module](/api/require)** so both sides agree on packet ids:

```luau
-- <world>/parallel/scripts/modules/combatpackets.luau
local ByteNet = require("@bytenet")

return ByteNet.defineNamespace("combat", function()
	return {
		attack = ByteNet.definePacket({
			value = ByteNet.struct({
				target = ByteNet.string,
				dir = ByteNet.vec3,
				strength = ByteNet.u8,
			}),
		}),
		hitfx = ByteNet.definePacket({
			value = ByteNet.struct({
				pos = ByteNet.vec3,
				crit = ByteNet.bool,
			}),
		}),
	}
end)
```

Packet ids are derived from **sorted packet names**, so identical definitions on both sides always
agree. Each namespace gets one NetworkService channel (`bn:<name>`); a namespace name can only be
defined once per environment.

## Sending & listening

```luau
-- client
local packets = require("@modules/combatpackets")

packets.attack.send({ target = "Bob", dir = me:GetLookDirection(), strength = 3 })

packets.hitfx.listen(function(data)
	-- data.pos, data.crit
end)
```

```luau
-- server
local packets = require("@modules/combatpackets")

packets.attack.listen(function(data, player)
	-- validate, then respond:
	packets.hitfx.sendTo({ pos = somePos, crit = true }, player)   -- one player
	packets.hitfx.sendToAll({ pos = somePos, crit = false })       -- everyone
end)
```

| Function | Side | Notes |
| --- | --- | --- |
| `packet.send(data)` | client | queue for the server |
| `packet.sendTo(data, player)` | server | `player` is a player handle (e.g. from `listen`) |
| `packet.sendToAll(data)` | server | broadcast |
| `packet.listen(callback)` | both | server callbacks get `(data, player)`; client gets `(data)` |

Queued packets flush on the next Heartbeat. If a player disconnects between queue and flush, their
packets are dropped quietly.

## Data types

| Type | Wire size | Luau value |
| --- | --- | --- |
| `ByteNet.u8` / `u16` / `u32` | 1 / 2 / 4 B | number (unsigned) |
| `ByteNet.i8` / `i16` / `i32` | 1 / 2 / 4 B | number (signed) |
| `ByteNet.f32` / `f64` | 4 / 8 B | number |
| `ByteNet.bool` | 1 B | boolean |
| `ByteNet.string` | 2 B + bytes | string (max 65 535 bytes) |
| `ByteNet.vec3` | 12 B | native vector (f32 × 3) |
| `ByteNet.optional(inner)` | 1 B + inner | value or `nil` |
| `ByteNet.array(inner)` | 2 B + items | `{ T }` (max 65 535 items) |
| `ByteNet.map(keyType, valueType)` | 2 B + pairs | `{ [K]: V }` |
| `ByteNet.struct(fields)` | sum of fields | named-field table |

::: warning Differences from upstream ByteNet
Unreliable packets are not supported — Minecraft custom payloads ride the TCP connection, so
everything is reliable and ordered.
:::

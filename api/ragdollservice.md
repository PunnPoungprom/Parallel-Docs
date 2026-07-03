# RagdollService <Badge type="tip" text="server" />

```luau
local Ragdoll = game:GetService("RagdollService")
```

Ragdoll players with real physics — a server-side wrapper around the
[Sable Ragdolls](https://modrinth.com/mod/sable-ragdolls) mod's `RagdollAPI` (built on Sable). It's an
**optional dependency**: if that mod isn't installed, every call is a no-op and `IsAvailable()` returns
`false`, so scripts written against it still run fine for servers without it.

Velocities are in **blocks per second**.

## Fling (like the `/ragdoll` command)

```luau
Ragdoll:Fling(player, length, strength, fromPosition): boolean
```

Launches `player` away from `fromPosition` for `length` ticks, with speed scaled by `strength`
(`1` ≈ moderate, `3` ≈ very strong). The camera follows the body and manual exit is locked — just like
the command. Returns whether it started.

```luau
local World = game:GetService("World")
-- ragdoll everyone near an explosion, flung outward from its center
for _, player in game:GetService("Players"):GetPlayers() do
    Ragdoll:Fling(player, 80, 2, explosionPos)   -- 4 seconds, strong
end
```

## Launch (full control)

```luau
Ragdoll:Launch(player, velocity, options?): boolean
```

Ragdoll `player` with an explicit `velocity` vector. `options`:

| field | default | meaning |
| --- | --- | --- |
| `length` | `60` | ticks before the ragdoll ends |
| `autoSeat` | `false` | the player's camera follows the ragdoll body |
| `lockDismount` | `false` | prevent the player exiting the ragdoll manually |

```luau
Ragdoll:Launch(player, vector.create(0, 6, 4), { length = 60, autoSeat = true })
```

## Other methods

```luau
Ragdoll:Release(player): boolean      -- end the player's ragdoll early (false if none active)
Ragdoll:IsRagdolled(player): boolean
Ragdoll:IsAvailable(): boolean        -- whether the Sable Ragdolls mod is installed
-- a dummy ragdoll with no player behind it:
Ragdoll:SpawnPlayerless(position, headingDegrees, velocity?): boolean
```

::: warning Server-only + optional mod
All methods are server-only and operate on the overworld (like other server services). They require the
**Sable Ragdolls** mod installed on the server; without it they no-op and return `false`/`nil`. Guard
with `IsAvailable()` if a script must adapt to its absence.
:::

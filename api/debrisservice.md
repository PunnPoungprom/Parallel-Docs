# DebrisService <Badge type="tip" text="server" />

```luau
local Debris = game:GetService("DebrisService")
```

Turn a block into **purely-visual flying debris** — a tumbling, fading chunk that **never re-places
itself** — and (optionally) restore the original block a moment later. Server-only; the debris entity
replicates to every nearby player automatically.

## Shatter a block

```luau
Debris:Shatter(pos, velocity, options?)
```

The block at `pos` becomes debris flung with `velocity` (in **blocks per tick**), and the spot is left
empty until the block is restored. No-op if the position is air.

```luau
local World = game:GetService("World")
local Players = game:GetService("Players")

local player = Players:GetPlayers()[1]
local hit = World:Raycast(player:GetEyePosition(), player:GetLookDirection(), 8)
if hit and hit.Block then
    Debris:Shatter(hit.Position, vector.create(0, 0.4, 0), {
        lifetime = 3,       -- fly for 3s, then fade out
        restore = true,     -- put the original block back
        restoreDelay = 3,   -- after 3s (defaults to lifetime)
        restoreFade = 1,    -- fade it back in over 1s
    })
end
```

## Cosmetic debris (no world change)

```luau
Debris:Spawn(pos, blockId, velocity, options?)
```

Spawns debris of an arbitrary block id at `pos` **without touching the world** — handy for bursts,
impacts, or trails. `restore`/`restoreDelay` are ignored (nothing was removed).

```luau
for i = 1, 12 do
    local dir = vector.create(math.random() - 0.5, math.random(), math.random() - 0.5)
    Debris:Spawn(center, "minecraft:cobblestone", dir * 0.5, { lifetime = 2 })
end
```

## Options

All times are in **seconds**.

| field | default | meaning |
| --- | --- | --- |
| `lifetime` | `3` | how long the debris flies before it fades out |
| `fade` | `1` | length of the fade-out at the end of life |
| `restore` | `true` | put the original block back (`Shatter` only) |
| `restoreDelay` | `= lifetime` | delay before the block returns (`Shatter` only) |
| `restoreFade` | `0.5` | fade-in time for the restored block (`0` = instant pop) |
| `gravity` | `0.04` | downward acceleration, blocks/tick² |
| `spin` | `20` | max tumble in degrees/tick (`0` = no spin) |
| `collide` | `true` | bounce off the world instead of passing through |

::: tip How restore works
The shattered spot is swapped for an invisible, walk-through placeholder block-entity that holds the
original block and reverts to it after `restoreDelay`, fading it in over the last `restoreFade`. It
persists across chunk reloads. If a player/piston/fluid overwrites the placeholder first, the restore is
quietly abandoned.
:::

::: warning Limitations
Server-only, and operates on the **overworld** (like other `World` mutations — per-dimension comes
later). Only the block's *state* is preserved across a restore, so blocks with stored contents (chests,
furnaces, …) come back empty. The fade is flat, unlit translucency (like the line/ribbon renderer), and
can sort imperfectly through other transparent blocks.
:::

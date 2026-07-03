# World

```luau
local World = game:GetService("World")
```

World queries on **both sides**; world effects **server-only**. Server scripts currently operate on
the **overworld** (per-dimension access is planned); client scripts read whatever level the client
is in.

Positions are native Luau vectors or `{x, y, z}` tables.

## GetBlock

```luau
World:GetBlock(pos): string
```

Block id at `pos`, e.g. `"minecraft:stone"`.

## GetTime

```luau
World:GetTime(): number
```

World day time in ticks.

## GetDimension

```luau
World:GetDimension(): string
```

E.g. `"minecraft:overworld"`.

## Raycast

```luau
World:Raycast(origin, direction, distance: number?, options: { IgnoreEntity }?): RaycastResult?
```

Casts a ray and returns the **nearer** of a block or entity hit, or `nil` if nothing is hit within
`distance` (default `64`). `direction` is normalized for you. Pass `options.IgnoreEntity` (an
[`EntityHandle`](/api/entityhandle)/[`Player`](/api/player) or a UUID string) to skip the shooter.

The result table:

| Field      | Type            | Notes                                          |
| ---------- | --------------- | ---------------------------------------------- |
| `Position` | `vector`        | World-space hit point                          |
| `Normal`   | `vector`        | Surface normal (reverse of the ray for entities) |
| `Distance` | `number`        | Blocks from `origin` to the hit                |
| `Block`    | `string?`       | Block id — set only for a terrain hit          |
| `Entity`   | `EntityHandle?` | Set only for an entity hit                     |

```luau
-- what is the player looking at?
local eye = player:GetPosition() + vector.create(0, 1.5, 0)
local hit = World:Raycast(eye, player:GetLookDirection(), 5, { IgnoreEntity = player })
if hit and hit.Entity then
	hit.Entity:Damage(6, player)
end
```

## GetEntitiesInBox

```luau
World:GetEntitiesInBox(center, size, options: { Ignore }?): { EntityHandle }
```

Living entities whose bounding box overlaps the axis-aligned box of dimensions `size` centred on
`center`. The classic melee **hitbox** query. `options.Ignore` excludes one entity.

## GetEntitiesInRadius

```luau
World:GetEntitiesInRadius(center, radius: number, options: { Ignore }?): { EntityHandle }
```

Living entities within `radius` blocks of `center` (spherical). Good for AoE / explosions.

```luau
-- server: damage everything around a point except the caster
for _, e in World:GetEntitiesInRadius(center, 4, { Ignore = caster }) do
	e:Damage(8, caster)
end
```

## SetBlock <Badge type="warning" text="server" />

```luau
World:SetBlock(pos, blockId: string)
```

Errors on unknown block ids.

## PlaySound <Badge type="warning" text="server" />

```luau
World:PlaySound(soundId: string, pos, volume: number?, pitch: number?)
```

```luau
World:PlaySound("minecraft:entity.player.levelup", pos)
```

## SpawnParticles <Badge type="warning" text="server" />

```luau
World:SpawnParticles(particleId: string, pos, count: number?)
```

Simple particle types only (e.g. `"minecraft:crit"`, `"minecraft:heart"`).

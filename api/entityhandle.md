# EntityHandle

A generic **entity handle** — any mob, item, or player — returned by
[`World:Raycast`](/api/world#raycast), [`World:GetEntitiesInBox`](/api/world#getentitiesinbox), and
[`World:GetEntitiesInRadius`](/api/world#getentitiesinradius).

Like [player handles](/api/player), handles are small readonly tables plus methods, and they are
plain data — send them through [NetworkService](/api/networkservice) or [ByteNet](/api/bytenet)
unchanged. Every method re-resolves the live entity by UUID at call time.

> Players come back as `EntityHandle` too (with `IsPlayer()` true) — the combat methods below work on
> them. For player-specific things (`Name`, `IsSneaking`, …) use a [Player](/api/player) handle from
> [`Players`](/api/players).

## Properties

```luau
entity.Id: number   -- runtime entity id
entity.UUID: string
entity.Type: string -- e.g. "minecraft:zombie"
```

## Getters

Return `nil` when the entity can't be resolved — despawned, or (on the client) outside render
distance.

```luau
entity:GetPosition(): vector?
entity:GetVelocity(): vector?
entity:GetLookDirection(): vector?
entity:GetName(): string?
entity:GetTypeId(): string?
entity:GetHealth(): number?    -- nil for non-living entities
entity:GetMaxHealth(): number?
entity:IsAlive(): boolean
entity:IsPlayer(): boolean?
```

## Mutators <Badge type="warning" text="server" />

These error on the client, and error if the entity is gone.

### Damage

```luau
entity:Damage(amount: number, attacker: (EntityHandle | Player | string)?)
```

Deals `amount` damage. Pass an `attacker` (handle or UUID string) to set **kill credit** and
**knockback direction** — a player attacker uses a player-attack source, a living attacker a
mob-attack source; otherwise the source is generic.

```luau
-- server: a swing from `player` hits everything in front of them
local hits = World:GetEntitiesInBox(player:GetPosition(), { x = 4, y = 3, z = 4 }, { Ignore = player })
for _, e in hits do
	e:Damage(6, player)
end
```

### Kill / Remove

```luau
entity:Kill()   -- lethal damage (drops loot, plays death)
entity:Remove() -- silently discard (no drops)
```

### Teleport / SetVelocity

```luau
entity:Teleport(pos: vector | {x, y, z})
entity:SetVelocity(vel: vector | {x, y, z}) -- synced immediately; use for knockback
```

# ItemService <Badge type="warning" text="server" />

```luau
local ItemService = game:GetService("ItemService")
```

Server-side hooks for **custom item behavior**. Mark an item id as custom and its vanilla
interaction is cancelled, while the matching signal still fires so your script implements the
behavior. Signals fire for *every* item, so you can also just observe without cancelling.

> Because signals fire **asynchronously** (the handler runs a tick later), a handler can't decide to
> cancel after the fact — you declare which ids are custom up front with `SetCustom`, the same model
> as [key capture](/api/userinputservice#setkeycaptured).

## SetCustom / IsCustom

```luau
ItemService:SetCustom(itemId: string, custom: boolean?) -- custom defaults to true
ItemService:IsCustom(itemId: string): boolean
```

```luau
ItemService:SetCustom("minecraft:blaze_rod", true) -- our "fire staff" base item
```

## Signals

```luau
ItemService.Used:Connect(function(player, item) end)                       -- right-click in air
ItemService.UsedOnBlock:Connect(function(player, item, pos, face) end)     -- right-click a block
ItemService.Attacked:Connect(function(player, item, target) end)          -- left-click / attack (target may be nil)
ItemService.FinishedUsing:Connect(function(player, item) end)             -- food eaten, bow released
```

- `player` is a [Player](/api/player), `item` an [ItemStack](/api/itemstack).
- `UsedOnBlock`: `pos` is the block position (vector), `face` the clicked side (`"up"`, `"north"`, …).
- `Attacked`: `target` is the hit [EntityHandle](/api/entityhandle) when attacking an entity, else `nil`.

::: tip `FinishedUsing`
Fires *after* the action completes, so a consumed stack may already be reduced. To stop consumption,
mark the item custom (which cancels the use) and run your own logic in `Used`.
:::

## Example — a fire staff

```luau
-- server script
local ItemService = game:GetService("ItemService")
local World = game:GetService("World")

ItemService:SetCustom("minecraft:blaze_rod", true) -- no vanilla use

ItemService.Used:Connect(function(player, item)
	if item:GetId() ~= "minecraft:blaze_rod" then return end

	local mana = item:GetDataValue("mana") or 10
	if mana <= 0 then return end

	local eye = player:GetEyePosition()
	local hit = World:Raycast(eye, player:GetLookDirection(), 30, { IgnoreEntity = player })
	if hit and hit.Entity then
		hit.Entity:Damage(8, player)
	end
	if hit then
		World:SpawnParticles("minecraft:flame", hit.Position, 20)
	end

	item:SetDataValue("mana", mana - 1) -- charge stored on the item itself
end)
```

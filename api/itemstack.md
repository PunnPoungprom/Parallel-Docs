# ItemStack

A live reference to a stack in a player's inventory — returned by
[`Player:GetHeldItem`](/api/player) / `GetItemInSlot` and by the
[`ItemService`](/api/itemservice) signals. Like the other handles, it re-resolves the real stack
every call, so reads and mutations always act on the actual inventory.

## Getters

```luau
item:GetId(): string            -- "minecraft:stick" ("minecraft:air" when empty)
item:GetCount(): number
item:GetMaxStackSize(): number
item:GetDisplayName(): string
item:IsEmpty(): boolean
```

## Custom data

The item's `minecraft:custom_data` as a Luau table — the clean way to mark and configure your
custom items. Values follow the same rules as [DataService](/api/dataservice) (nil/bool/number/
string/table).

```luau
item:GetData(): { [string]: any }
item:GetDataValue(key: string): any
```

```luau
-- read a tag set when the item was given
if item:GetDataValue("kind") == "fireStaff" then
	local mana = item:GetDataValue("mana") or 0
end
```

## Mutators <Badge type="warning" text="server" />

These error on the client, and error if the player is offline.

```luau
item:SetData(data: { [string]: any }?) -- nil clears all custom data
item:SetDataValue(key: string, value: any)
item:SetCount(count: number)
item:Shrink(amount: number?)           -- consume `amount` (default 1) — use-up-on-cast
item:SetDisplayName(name: string?)     -- nil clears the custom name
```

```luau
-- consume one on use
item:Shrink(1)
-- or tag/charge it
item:SetDataValue("mana", 5)
item:SetDisplayName("Fire Staff")
```

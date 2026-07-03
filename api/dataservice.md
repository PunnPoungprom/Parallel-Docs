# DataService

```luau
local DataService = game:GetService("DataService")
```

Persistent save data for scripts, **server-only**. Two scopes — a **world** store shared by the whole
world, and a **per-player** store keyed by UUID. Writes are saved to disk immediately, so nothing is
lost when the server stops or a player disconnects, and per-player data survives the player leaving
and rejoining (even if they're offline for a while).

Data lives in the world folder (`<world>/parallel/data/world.json` and
`players/<uuid>.json`), so it travels with the save. The client has no access to these files.

## Storable values

Values follow Roblox DataStore rules — `nil`, booleans, numbers, strings, and (nested) tables.
Vectors, buffers, functions and other userdata can't be saved (store `{x = v.x, y = v.y, z = v.z}`
instead). A table with keys `1..n` is saved as a JSON array; any other table is a JSON object, so
numeric keys on a non-array table come back as **string** keys. Setting a value to `nil` removes it.

## World store

### GetWorldData

```luau
DataService:GetWorldData(): { [string]: any }
```

The whole world store as a fresh table (empty table if nothing saved yet).

### SetWorldData

```luau
DataService:SetWorldData(data: { [string]: any })
```

Replace the whole world store.

### GetWorld / SetWorld

```luau
DataService:GetWorld(key: string): any
DataService:SetWorld(key: string, value: any)   -- value = nil removes the key
```

Read/write a single key without round-tripping the whole table.

```luau
local spawns = DataService:GetWorld("spawnsUsed") or 0
DataService:SetWorld("spawnsUsed", spawns + 1)
```

## Player store

A player is a [PlayerHandle](./player) (or a UUID string).

### GetPlayerData

```luau
DataService:GetPlayerData(player): { [string]: any }
```

The player's whole store as a fresh table (empty table if nothing saved yet).

### SetPlayerData

```luau
DataService:SetPlayerData(player, data: { [string]: any })
```

Replace the player's whole store.

### GetPlayer / SetPlayer

```luau
DataService:GetPlayer(player, key: string): any
DataService:SetPlayer(player, key: string, value: any)   -- value = nil removes the key
```

## Example

Give every player persistent coins, loaded on join and saved as they earn:

```luau
local Players = game:GetService("Players")
local DataService = game:GetService("DataService")

Players.PlayerAdded:Connect(function(player)
    local data = DataService:GetPlayerData(player)
    data.coins = data.coins or 0
    data.lastSeen = os.time()
    DataService:SetPlayerData(player, data)        -- persists immediately
    print(player.Name .. " has " .. data.coins .. " coins")
end)

local function awardCoins(player, amount)
    local coins = DataService:GetPlayer(player, "coins") or 0
    DataService:SetPlayer(player, "coins", coins + amount)
end
```

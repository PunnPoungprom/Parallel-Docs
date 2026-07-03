# UserInputService <Badge type="warning" text="client" />

```luau
local UserInputService = game:GetService("UserInputService")
```

Client-side keyboard and mouse input — the way a **client** script drives actions (a combat swing, an
ability, a UI toggle). Input only exists on the client, so this service is unavailable in server
scripts. To affect the world, fire the action to the server with
[NetworkService](/api/networkservice).

## Signals

### InputBegan / InputEnded

```luau
UserInputService.InputBegan:Connect(function(input: InputObject, gameProcessed: boolean) end)
UserInputService.InputEnded:Connect(function(input: InputObject, gameProcessed: boolean) end)
```

Fire on every key/mouse-button press (`InputBegan`) and release (`InputEnded`). `gameProcessed` is
`true` when a GUI or chat consumed the input — combat scripts should ignore those.

`InputObject`:

| Field           | Type      | Notes                                       |
| --------------- | --------- | ------------------------------------------- |
| `KeyCode`       | `string`  | Friendly name, e.g. `"W"`, `"Space"`, `"MouseLeft"` |
| `UserInputType` | `string`  | `"Keyboard"` or `"MouseButton"`             |
| `Pressed`       | `boolean` | `true` on `InputBegan`, `false` on `InputEnded` |

## Polling

```luau
UserInputService:IsKeyDown(key: string): boolean          -- "W", "Space", "LeftShift", ...
UserInputService:IsMouseButtonDown(button: string): boolean -- "MouseLeft" | "MouseRight" | "MouseMiddle"
UserInputService:GetMouseLocation(): vector                 -- GUI-scaled cursor (x, y, 0)
```

Recognized key names: `A`–`Z`, `0`–`9`, `F1`–`F12`, `Space`, `Enter`, `Escape`, `Tab`, `Backspace`,
`Left`/`Right`/`LeftShift`/`RightShift`/`LeftControl`/`RightControl`/`LeftAlt`/`RightAlt`, and the
arrow keys `Up`/`Down`/`Left`/`Right`. Other keys still arrive in events under their raw
`key.keyboard.*` name.

## Cancelling vanilla input

### SetKeyCaptured

```luau
UserInputService:SetKeyCaptured(key: string, captured: boolean?) -- captured defaults to true
UserInputService:IsKeyCaptured(key: string): boolean
```

Capture a key to **suppress its vanilla action** — pressing `E` won't open the inventory, etc. — while
it still fires `InputBegan`/`InputEnded` to your script. Because signals fire asynchronously, a handler
can't "sink" the input after the fact; you declare the capture up front instead. Captures reset on
relog / script reload.

```luau
-- E now drives an ability instead of the inventory
UserInputService:SetKeyCaptured("E", true)
UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode == "E" then
		game:GetService("NetworkService"):FireServer("ability", buffer.create(0))
	end
end)
```

## Combat example

The full client → server → hit → damage loop. **Client** detects the swing and tells the server;
the **server** is authoritative for the raycast and the damage.

```luau
-- client script
local UserInputService = game:GetService("UserInputService")
local NetworkService = game:GetService("NetworkService")

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode == "MouseLeft" then
		NetworkService:FireServer("attack", buffer.create(0))
	end
end)
```

```luau
-- server script
local NetworkService = game:GetService("NetworkService")
local World = game:GetService("World")

NetworkService:OnServerEvent("attack", function(player)
	local eye = player:GetPosition() + vector.create(0, 1.5, 0)
	local hit = World:Raycast(eye, player:GetLookDirection(), 4, { IgnoreEntity = player })
	if hit and hit.Entity then
		hit.Entity:Damage(6, player)
	end
end)
```

# AnimationTrack <Badge type="warning" text="client" />

```luau
local track = player:LoadAnimation("wave")
track:Play()
```

Roblox-Animator-style playback of editor-authored animations on **real players**. While a track
plays it overrides the vanilla walk/swing pose; on stop the player returns to vanilla animation.

## Authoring animations

Animations are standalone files in `<world>/parallel/animations/<name>.json`, created from the
scene editor:

1. Animate an **actor** on the timeline as usual (the actor rig is the same six bones as the
   player model: head, body, arms, legs).
2. Right-click the actor in the Explorer → **Save animation…** — exports that actor's tracks from
   the active timeline.
3. Right-click → **Load animation** imports a saved file back onto an actor to keep editing —
   animations are reusable across scenes and actors.

Re-saving an animation invalidates live tracks immediately, so a running test script picks up the
new keys on its next `LoadAnimation` — iterate without relogging.

## Loading

```luau
player:LoadAnimation(name: string): AnimationTrack
```

Works on any [Player](/api/player) handle the client can see — not just
[`Players.LocalPlayer`](/api/players#localplayer). Tracks are interned per (player, name): repeated
calls return the same track. Errors if the animation file doesn't exist.

## Playback

```luau
track:Play()                     -- restarts from 0 if the track had finished
track:Stop()
track:IsPlaying(): boolean
track:SetLooped(looped: boolean) -- defaults to the animation's loop flag
track:GetLooped(): boolean
track:SetSpeed(speed: number)    -- 1 = normal; negative plays backwards
track:GetSpeed(): number
track:GetLength(): number        -- seconds
track:GetTime(): number
track:SetTime(time: number)
```

```luau
local Players = game:GetService("Players")
local UIS = game:GetService("UserInputService")

local wave = Players.LocalPlayer:LoadAnimation("wave")
UIS.InputBegan:Connect(function(key, gameProcessed)
	if key == "G" and not gameProcessed then
		wave:Play()
	end
end)
```

## Multiplayer

The server syncs `<world>/parallel/animations` to every client on join and on `/parallel reload`
(and re-broadcasts when the host saves from the editor) — players never install animation files.

`AnimationTrack` playback itself is **client-local**: other players don't see a track you play.
For everyone to see it, use the replicated server-side form —
[`player:PlayAnimation(name)`](/api/player#playanimation-stopanimation) — or broadcast your own
event with [NetworkService](/api/networkservice) and play the track on each client.

## Limits

- **One track per player at a time** — playing another track replaces the current one (no blending
  or fade in/out yet).
- Only bone **rotations** transfer to real players; keyframe position/scale offsets apply to scene
  actors but not here.

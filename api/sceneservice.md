# SceneService <Badge type="warning" text="client" />

```luau
local SceneService = game:GetService("SceneService")
```

Loads and drives the active cinematic scene. **Client-only** — usable from client scripts and the
scene's own scripts. Scenes are authored in the in-game editor and saved as JSON under
`<world>/parallel/scenes/`.

## Load

```luau
SceneService:Load(name: string): SceneService
```

Loads `<scenes>/<name>.json` as the open scene. Returns the service itself, so calls chain:

```luau
SceneService:Load("intro"):Play()
```

## Play

```luau
SceneService:Play(animationName: string?)
```

Starts (or resumes) playback **and starts the scene's scripts** on a fresh take. With a name,
switches the scene to that animation first (resetting the playhead if it differs from the active
one).

## Pause / Stop

```luau
SceneService:Pause()
SceneService:Stop()
```

`Stop` resets the playhead and **kills the scene's scripts**. Natural completion (reaching the end
of a non-looping take) does *not* kill them, so `Completed` listeners can react.

## Playhead

```luau
SceneService:IsPlaying(): boolean
SceneService:GetTime(): number
SceneService:SetTime(time: number)   -- clamped to [0, animation length]
SceneService:GetSceneName(): string
SceneService:SetAnimation(name: string)  -- errors if no such animation
```

## Completed

```luau
SceneService.Completed: Signal<(sceneName: string)>
```

Fires when a non-looping take reaches its end.

```luau
SceneService:Load("intro"):Play()
SceneService.Completed:Wait()
print("cutscene over")
```

## MarkerReached

```luau
SceneService.MarkerReached: Signal<(name: string, time: number)>
```

Fires when the playhead **crosses a timeline marker during playback** — not while scrubbing in the
editor. Markers at t=0 never fire (start a take slightly after, or treat `Play()` itself as your
t=0 event). Markers are placed on the timeline ruler in the editor (M key, or right-click).

```luau
SceneService.MarkerReached:Connect(function(name, time)
	if name == "door_opens" then
		World:PlaySound("minecraft:block.iron_door.open", doorPos)
	end
end)
```

# Lighting <Badge type="warning" text="client" />

```luau
local Lighting = game:GetService("Lighting")
```

Script access to the **Lighting editor window**'s settings — the Roblox-style post-processing stack
(shadows, ambient occlusion, atmosphere, sun rays, color correction, bloom, blur). Changes apply the
next frame, so it's built for runtime mood shifts: cutscene grading, scene fog, dream sequences.

Changes are **runtime-only** — nothing is written to the world's `lighting.json` unless the user
saves from the editor. `Reset()` (or a relog) restores the saved look. Client-only.

## Effects and properties

Every effect has an `Enabled` flag; disabled effects cost nothing to render. Properties are the
Lighting window's fields with an uppercase first letter. Colors are `vector(r, g, b)` in `0..1`.

| Effect | Properties |
| --- | --- |
| `Shadows` | `Enabled`, `Strength` 0–1, `Softness` 0–4, `Distance` 8–128, `Quality` 0–2, `CloudShadows` |
| `AmbientOcclusion` | `Enabled`, `Intensity` 0–2, `Radius` 0.1–4 (blocks) |
| `Atmosphere` | `Enabled`, `Density` 0–1, `Offset` 0–1, `Color`, `Decay`, `Glare` 0–2, `Haze` 0–10 |
| `SunRays` | `Enabled`, `Intensity` 0–1, `Spread` 0–2 |
| `ColorCorrection` | `Enabled`, `Brightness` −1–1, `Contrast` −1–1, `Saturation` −1–1, `TintColor` |
| `Bloom` | `Enabled`, `Intensity` 0–2, `Size` 1–56, `Threshold` 0–2 |
| `Blur` | `Enabled`, `Size` 0–56 |

## Set / Get

```luau
Lighting:Set(effect: string, property: string, value: number | boolean | vector)
Lighting:Get(effect: string, property: string): number | boolean | vector
```

```luau
Lighting:Set("Bloom", "Intensity", 1.2)
Lighting:Set("Atmosphere", "Color", vector(0.9, 0.6, 0.4))   -- sunset fog
print(Lighting:Get("ColorCorrection", "Saturation"))
```

Unknown effect or property names raise an error listing the valid options.

## SetEnabled / GetEnabled

```luau
Lighting:SetEnabled(effect: string, enabled: boolean)
Lighting:GetEnabled(effect: string): boolean
```

Sugar for `Set(effect, "Enabled", value)` — the optimization toggles, scriptable.

## Reset

```luau
Lighting:Reset()
```

Drops every script change and re-reads the world's `lighting.json`.

```luau
-- drained flashback look while a scene plays, restored when it completes
local Lighting = game:GetService("Lighting")
local Scene = game:GetService("SceneService")

Scene.Completed:Connect(function()
	Lighting:Reset()
end)

Lighting:SetEnabled("ColorCorrection", true)
Lighting:Set("ColorCorrection", "Saturation", -0.7)
Lighting:Set("ColorCorrection", "Contrast", 0.15)
Scene:Load("flashback"):Play()
```

::: warning Editor saves capture script changes
If you drag a slider in the Lighting window **while** script overrides are active, the editor saves
whatever is currently live — script values included. `Reset()` before authoring.
:::

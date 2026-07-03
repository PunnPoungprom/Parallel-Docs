# GuiService <Badge type="warning" text="client" />

```luau
local Gui = game:GetService("GuiService")
```

Roblox-style **retained 2D UI** for HUDs and menus. Scripts create elements once and mutate
properties; the engine owns the tree, per-frame layout, drawing, and input hit-testing — Lua only
pays when something *changes*, so a health bar costs one property write per update, not per frame.

The GUI tree is **client-local by design**: server gameplay talks to it through
[NetworkService](./networkservice) events, the same way every Roblox game drives its UI.
Everything clears on script reload and world disconnect.

```luau
local Gui = game:GetService("GuiService")

local screen = Gui:CreateScreen("hud")
local bar = screen:Add("Frame", {
    Position = UDim2.new(0.5, -100, 1, -40),   -- centered, 40px above the bottom
    Size = UDim2.new(0, 200, 0, 12),
    AnchorPoint = vector(0.5, 0, 0),
    BackgroundColor = vector(0.1, 0.1, 0.1),
    BackgroundTransparency = 0.2,
})
local fill = bar:Add("Frame", {
    Size = UDim2.new(1, 0, 1, 0),
    BackgroundColor = vector(0.9, 0.2, 0.2),
})
local label = screen:Add("TextLabel", {
    Position = UDim2.new(0.5, 0, 1, -46),
    AnchorPoint = vector(0.5, 1, 0),
    Size = UDim2.fromOffset(200, 14),
    Text = "100 / 100",
    TextColor = vector(1, 1, 1),
    TextShadow = true,
    BackgroundTransparency = 1,
})

-- later, when health changes:
fill.Size = UDim2.new(hp / maxHp, 0, 1, 0)
label.Text = ("%d / %d"):format(hp, maxHp)
```

Elements, properties, and signals are documented on the [GuiElement](./guielement) page.

## CreateScreen

```luau
Gui:CreateScreen(name: string): ScreenGui
```

Creates a screen root (a full-window canvas) and returns its handle. Screens draw in creation
order — later screens on top. Reusing a name **replaces** that screen (the old tree is destroyed),
so a script that reruns doesn't stack duplicates.

## GetScreen

```luau
Gui:GetScreen(name: string): ScreenGui?
```

An existing screen's handle, or `nil` — lets a second script find a screen another script built.

## SetCursorVisible

```luau
Gui:SetCursorVisible(visible: boolean?)   -- defaults to true
```

**Menu mode**: frees the mouse cursor while gameplay keeps rendering (like opening a screen,
without one). While on, mouse clicks are consumed by the GUI — over a button they fire
`Activated`, anywhere else they're swallowed so vanilla can't re-grab the cursor. Turn it off to
return the mouse to the camera.

HUD-only UIs (no buttons) never need this; hover and click routing also work whenever the cursor
happens to be free.

```luau
Gui:SetCursorVisible(true)
menu.Visible = true
btnClose.Activated:Connect(function()
    menu.Visible = false
    Gui:SetCursorVisible(false)
end)
```

## IsCursorVisible

```luau
Gui:IsCursorVisible(): boolean
```

## Limits & notes

- Coordinates are **gui-scaled pixels** (the same space vanilla HUD uses —
  `UserInputService:GetMouseLocation()` matches).
- At most **4096 live elements**; `Destroy()` what you no longer need. For things like note
  highways or kill feeds, pool and reuse elements instead of creating/destroying per item.
- While a vanilla screen (chat, inventory, the editor) is open, the HUD still draws but GUI
  clicks/hover are inactive.

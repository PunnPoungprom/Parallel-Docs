# GuiElement <Badge type="warning" text="client" />

The element handles that make up a [GuiService](./guiservice) tree. Created with
`screen:Add(className, props?)` (or `element:Add` for children); every property below can be set
in the `props` table at creation and read/written on the handle afterwards.

| Class | Draws | Extra properties / signals |
| --- | --- | --- |
| `ScreenGui` | nothing (full-window root) | `Name`, `Visible` only |
| `Frame` | colored quad | — |
| `TextLabel` | quad + text | `Text*` properties |
| `TextButton` | quad + text | `Text*` + `Activated` |
| `ImageLabel` | quad + texture | `Image*` properties |
| `ImageButton` | quad + texture | `Image*` + `Activated` |

```luau
local btn = screen:Add("TextButton", {
    Position = UDim2.fromScale(0.5, 0.5),
    AnchorPoint = vector(0.5, 0.5, 0),
    Size = UDim2.fromOffset(120, 28),
    Text = "Play",
    BackgroundColor = vector(0.15, 0.15, 0.2),
    TextColor = vector(1, 1, 1),
})
btn.Activated:Connect(function() print("clicked") end)
btn.MouseEnter:Connect(function() btn.BackgroundColor = vector(0.25, 0.25, 0.35) end)
btn.MouseLeave:Connect(function() btn.BackgroundColor = vector(0.15, 0.15, 0.2) end)
```

## UDim2

Positions and sizes are `UDim2`s, Roblox semantics: **absolute = parent × scale + offset**, in
gui-scaled pixels.

```luau
UDim2.new(xScale, xOffset, yScale, yOffset)
UDim2.fromScale(xScale, yScale)
UDim2.fromOffset(xOffset, yOffset)
```

`UDim2.new(0.5, -100, 1, -40)` = half the parent's width minus 100px; parent's full height minus
40px. Read back as `u.XScale`, `u.XOffset`, `u.YScale`, `u.YOffset`.

## Layout properties

| Property | Type | Notes |
| --- | --- | --- |
| `Position` | `UDim2` | where `AnchorPoint` lands inside the parent |
| `Size` | `UDim2` | default `UDim2.fromOffset(100, 100)` |
| `AnchorPoint` | `vector` | fraction of own size; `vector(0.5, 0.5, 0)` centers on `Position` |
| `Rotation` | `number` | degrees clockwise around the center; rotates the subtree. Visual only — hit-testing stays axis-aligned, and it doesn't combine with `ClipsDescendants` |
| `ZIndex` | `number` | sibling draw order (stable; equal values keep creation order) |
| `Visible` | `boolean` | hides the whole subtree |
| `ClipsDescendants` | `boolean` | scissor children to this element's rect |
| `Parent` | element | assign to re-parent; never `nil` it — `Destroy()` instead |
| `AbsolutePosition` / `AbsoluteSize` | `vector` | read-only resolved rect (px), updated each frame |

## Appearance properties

| Property | Type | Notes |
| --- | --- | --- |
| `BackgroundColor` | `vector` | `(r, g, b)` in 0..1 |
| `BackgroundTransparency` | `number` | 0 opaque .. 1 invisible (skips the quad entirely) |
| `Text` | `string` | |
| `TextSize` | `number` | pixel height (Minecraft font, scaled) |
| `TextColor` | `vector` | default black |
| `TextWrapped` | `boolean` | wrap to the element width |
| `TextShadow` | `boolean` | vanilla drop shadow |
| `TextXAlignment` | `"Left" \| "Center" \| "Right"` | default `Center` |
| `TextYAlignment` | `"Top" \| "Center" \| "Bottom"` | default `Center` |
| `Image` | `string` | resource location, e.g. `"minecraft:textures/item/diamond.png"` |
| `ImageColor` | `vector` | multiply tint |
| `ImageTransparency` | `number` | |

Text properties only exist on `TextLabel`/`TextButton`, image properties on
`ImageLabel`/`ImageButton` — anything else raises an error (so typos surface instead of silently
doing nothing).

## Signals

| Signal | On | Fires |
| --- | --- | --- |
| `Activated` | buttons | press **and** release land on the same button; the click never reaches the game |
| `MouseEnter` | any element | cursor entered the element's (clipped) rect |
| `MouseLeave` | any element | cursor left it |

Hover and click routing are active whenever the cursor is free — in
[menu mode](./guiservice#setcursorvisible), or any time the mouse isn't grabbed — and pause while
a vanilla screen is open. Signals are destroyed with their element.

## Methods

### Add

```luau
element:Add(className: string, props: GuiProps?): GuiElement
```

Creates a child. `props` entries apply exactly like property writes (unknown names error, and the
half-built element is removed).

### Destroy

```luau
element:Destroy()
```

Removes the element and its whole subtree, disconnecting all their signals. Destroyed handles
error on further use.

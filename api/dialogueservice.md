# DialogueService <Badge type="warning" text="client" />

```luau
local Dialogue = game:GetService("DialogueService")
```

Blocking dialogue for story scripting. **Client-only.** Both calls **yield** the calling script
until the player responds, so dialogue reads top-to-bottom:

```luau
Dialogue:Say("Bob", "Welcome aboard the Skytrain.")
local choice = Dialogue:Ask("Bob", "Coffee?", { "Yes please", "No thanks" })
if choice == 1 then
	Dialogue:Say("Bob", "Coming right up.")
end
```

## Say

```luau
Dialogue:Say(speaker: string, text: string)
```

Shows one line with a Continue prompt; resumes the script when the player advances (or dismisses
with Esc).

## Ask

```luau
Dialogue:Ask(speaker: string, text: string, choices: { string }): (number?, string?)
```

Shows a question with choices. Returns the chosen **1-based index** and its label — or `nil` if
the player dismissed the screen with Esc, so handle that branch:

```luau
local index, label = Dialogue:Ask("Guard", "State your business.", { "Trade", "Just passing" })
if index == nil then
	-- player closed the dialogue
	return
end
```

::: info
The on-screen speaker entity is currently the local player; per-NPC portraits are planned. The
speaker *name* shown is whatever string you pass.
:::

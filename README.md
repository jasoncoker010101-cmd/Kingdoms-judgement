# Kingdom's Judgment

A browser-based kingdom-management RPG prototype. The current playable slice focuses on the royal audience: explore Avelorn's throne room, meet the royal court and a petitioner, and make judgments that change the realm's resources, public mood, and stability.

## Run locally

Serve the repository root with any static web server, for example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Controls

- **Move:** WASD or arrow keys; touch players can use the on-screen directional pad.
- **Speak/interact:** E, Space, Enter, or the Speak button. On desktop, clicking a courtier also starts an audience.
- **Court and records:** use Throne Room, Capital, Kingdom, and Council tabs.
- **Save:** use the Save button; progress is also saved in this browser automatically.

## Current playable systems

- New reign and continue-from-save flows, with confirmation before replacing a saved reign.
- Side-view, canvas-drawn pixel-art throne room and direct ruler movement.
- Distinct court characters with portraits, short character-specific conversations, and council records.
- One-time eastern-road and Eastmere petitions with different resource, public mood, stability, and relationship outcomes.
- Capital, kingdom overview, court roster, and a recent-judgment ledger.
- Responsive touch controls and local browser persistence.

The next development milestone is a clear, player-controlled day-advance loop that updates income, food, construction, and new events without advancing time unexpectedly.

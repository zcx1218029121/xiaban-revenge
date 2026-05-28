# ADR-0002: Roguelike Expansion — Stress Rework, Card Types, Routes

## Status
Accepted

## Context
Post-refactoring review identified monotony: limited card pool (44), few relics (12), linear events, stress-as-buff problem.

## Decisions

### Stress Rework
- Keep damage bonus at high stress (4-6: +25%, 7-9: +50%)
- Breakdown at 10: lose turn + take 30% max HP damage + reset to 5
- Stress halves (floor) at end of each day instead of resetting to 0

### Card Expansion (100+)
- New types: Spell (one-shot, self-removing), Equipment (persistent), Curse (negative, forced into deck)
- 5 factions, balanced distribution
- 3 rarities: C/U/R

### Relic Expansion (40)
- 4 rarity tiers: Common, Uncommon, Rare, Legendary
- Cursed Relics: powerful effect + permanent drawback

### Enemy Randomization
- Day-tiered pools: Day 1 easy, Day 5 hard
- Enemies assigned factions with synergy bonuses

### Branching Routes
- Each day: 2-3 route choices (safe/risk/neutral)
- Safe: easier fights, healing, fewer rewards
- Risk: elite fights, curse cards, better rewards
- Replaces fixed linear event schedule

## Cost
- Significant content creation (60+ cards, 28 relics, route system)
- Route UI requires new screen design
- Enemy pool system replaces fixed event schedule

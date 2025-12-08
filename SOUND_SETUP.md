# Sound Effects Setup Guide

## Required Sound Files

You need to download 7 sound effect files and place them in the correct directories.

### Directory Structure
```
assets/sounds/
├── ui/
│   ├── click.mp3
│   ├── modal-open.mp3
│   └── modal-close.mp3
└── game/
    ├── correct.mp3
    ├── wrong.mp3
    ├── victory.mp3
    └── pop.mp3
```

---

## Download Links (Free, High-Quality)

### UI Sounds

1. **click.mp3** - Button click sound
   - Source: https://freesound.org/people/kwahmah_02/sounds/256116/
   - Alternative: https://mixkit.co/free-sound-effects/click/
   - Description: Short, satisfying click (50-100ms)

2. **modal-open.mp3** - Modal opening sound
   - Source: https://freesound.org/people/InspectorJ/sounds/411459/
   - Alternative: https://mixkit.co/free-sound-effects/whoosh/
   - Description: Subtle swoosh up (200ms)

3. **modal-close.mp3** - Modal closing sound
   - Source: https://freesound.org/people/InspectorJ/sounds/411460/
   - Alternative: https://mixkit.co/free-sound-effects/whoosh/
   - Description: Subtle swoosh down (200ms)

### Game Sounds

4. **correct.mp3** - Correct answer sound
   - Source: https://freesound.org/people/LittleRobotSoundFactory/sounds/270303/
   - Alternative: https://mixkit.co/free-sound-effects/win/
   - Description: Bright, positive ding (300-500ms)

5. **wrong.mp3** - Wrong answer sound
   - Source: https://freesound.org/people/Bertrof/sounds/131657/
   - Alternative: https://mixkit.co/free-sound-effects/lose/
   - Description: Buzzer or descending tone (300ms)

6. **victory.mp3** - Victory/win sound
   - Source: https://freesound.org/people/LittleRobotSoundFactory/sounds/270333/
   - Alternative: https://mixkit.co/free-sound-effects/game-win/
   - Description: Triumphant fanfare (1-2 seconds)

7. **pop.mp3** - Balloon pop sound
   - Source: https://freesound.org/people/InspectorJ/sounds/411639/
   - Alternative: https://mixkit.co/free-sound-effects/pop/
   - Description: Balloon popping (200ms)

---

## Quick Download Instructions

### Option 1: Freesound.org (Recommended)
1. Visit freesound.org
2. Search for the sound type (e.g., "button click")
3. Filter by: License = "Creative Commons 0"
4. Download as MP3
5. Rename to match the filename above

### Option 2: Mixkit.co (Easiest)
1. Visit mixkit.co/free-sound-effects/
2. Browse categories: "UI", "Game", "Win/Lose"
3. Download directly as MP3
4. Rename to match the filename above

### Option 3: Zapsplat.com
1. Visit zapsplat.com (free account required)
2. Search for sound type
3. Download as MP3
4. Rename to match the filename above

---

## File Requirements

- **Format**: MP3 (most compatible)
- **Sample Rate**: 44.1kHz
- **Bit Rate**: 128-192 kbps
- **Duration**: 50ms - 2 seconds
- **File Size**: <50KB each (total ~300KB)

---

## After Downloading

1. Place files in correct directories as shown above
2. Restart your development server (`npm start`)
3. The SoundManager will automatically preload all sounds
4. Test by tapping buttons - you should hear sounds!

---

## Temporary Workaround (If You Can't Download Now)

If you want to test the system without sounds:
1. Comment out the sound imports in `SoundManager.ts`
2. The app will work fine, just silently
3. Add sounds later when ready

---

## Testing Sounds

After adding files, test in the app:
- Tap any button → should hear click
- Open rules modal → should hear modal-open
- Close rules modal → should hear modal-close
- Win/lose in games → should hear correct/wrong/victory

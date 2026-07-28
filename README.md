# 2026 Album Panini Sticker Tracker

Web-based tracker for the Panini 2026 FIFA World Cup sticker collection. Developed purely with HTML, CSS, and JavaScript, it runs directly in the browser with no server or installation required.

## Features

- **980 stickers tracked** — 48 teams (20 stickers each) + 20 special FWC stickers
- **Click to mark** — Tap any sticker to toggle it as obtained/unobtained
- **Duplicate management** — Track how many copies you have of each sticker with visual badges
- **Two tabs** — Switch between Collection view and Duplicates view
- **Progress bar** — Visual percentage of your collection completion
- **Export / Import** — Save and restore your progress as a JSON file
- **Copy duplicates list** — One click to copy all your repeated stickers to clipboard
- **Country flags** — Each team row shows its national flag
- **Responsive design** — Works on desktop, tablet, and mobile
- **Touch support** — Long press on mobile to remove a duplicate
- **Persistent data** — All progress saved in `localStorage`

## Usage

1. Open `index.html` in any modern browser
2. Click on a sticker code to mark it as obtained (yellow + strikethrough)
3. Click again to unmark it
4. Switch to the **Repetidas** tab to manage duplicates
   - **Click** = +1 duplicate
   - **Right-click** (desktop) or **long press** (mobile) = -1 duplicate
5. Use **Export** to save your progress, **Import** to load a previous save
6. **Copiar repetidas** copies your duplicate list to share with friends

## Stack

- **HTML5** — Structure and table-based layout
- **CSS3** — Theming, responsive design, sticky toolbar, transitions
- **JavaScript** — Vanilla JS, no frameworks or dependencies
- **localStorage** — Client-side data persistence

## Notes

- No server or installation required — just open the HTML file
- Sticker codes follow the Panini format (e.g., `MEX1`, `BRA20`, `FWC1`)
- Flags are loaded from [flagcdn.com](https://flagcdn.com)
- Data stays in your browser unless you export it

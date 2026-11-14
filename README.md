# MVA Universe Project
Open `universe.html` (hub) or `index.html` (MVA Robotics site). Serve over http/https (e.g. `npx serve`), not file://.
- `/` MVA Robotics Innovation Org pages (bg.js shared nav)
- `/space/` 15 interactive 3D space viewers
- `/cosmos-app/` COSMOS app (13 worlds, layers, zoom, Inside view, own sound)
- `/shared/` mva-shell.js/css: common menu (K), space sound (M), fullscreen (F), warp transitions
Edit the page list once in `shared/mva-shell.js` (REG).
- `astronaut-health-lab.html`: ASTROVERSE Astronaut Health Lab (3D suit, 3D orbits, telemetry, vision, quantum). Linked from Home, Health, Brahmand Home, Problem, the Universe Hub and the K menu; it links back to `universe.html` and `health.html`.
- External apps linked from the hero banner, Brahmand sections, Universe Hub and the K menu: https://brahmand-ganga.vercel.app/ (live app) and https://brahmand-ganga-frontend.vercel.app/ (frontend with NASA API features). They open in a new tab.

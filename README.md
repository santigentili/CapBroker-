# claude-skills-repo

Skills de Claude Code para este proyecto, versionadas junto al repo en `.claude/skills/`.

Al clonar este repo, Claude Code detecta automáticamente las skills dentro de
`.claude/skills/` y las deja disponibles en ese directorio (scope de proyecto),
sin necesidad de instalarlas globalmente.

## Skills incluidas

- **ui-ux-pro-max** — Inteligencia de diseño UI/UX para web, mobile y desktop
  (estilos, paletas, tipografías, guías de UX, stacks específicos).
- **impeccable** — Diseño, rediseño, crítica y pulido de interfaces frontend
  (UX review, jerarquía visual, accesibilidad, theming, design systems).
- **design-taste-frontend** — Dirección de arte anti-slop para landing pages
  y sitios marketing, basada en ~247 sitios curados (One Page Love, Awwwards).
- **caveman** — Modo de comunicación ultra-comprimido para reducir tokens de
  salida manteniendo precisión técnica.

## Uso

Simplemente invocá la skill por nombre dentro de este repo (ej. `/caveman`,
o pidiendo una tarea de diseño/UX) y Claude Code la carga desde
`.claude/skills/`.

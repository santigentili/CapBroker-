# CapBroker web (solo interfaz)

Vite + React + TypeScript. Sin backend: nada se guarda ni se envía.

```bash
cd web
npm install
npm run dev      # http://localhost:5173/capbroker-demo/
npm run build
```

## Rutas
- `/capbroker-demo/` — versión principal, sin datos (estados vacíos reales).
- `/capbroker-demo/test/` — mismas pantallas con datos inventados (compañías ficticias).

Cada ruta existe en las dos versiones: `buscador`, `vencimientos`, `cotizador`, `comparativa`, `facturacion`, `configuracion`.

## Estructura
```
src/
  app/        Shell (barra lateral, buscador superior, banner de datos de ejemplo)
  data/       tipos, datos vacíos, datos inventados, contexto
  lib/        formatos (fechas, pesos), textos de aviso
  pages/      una carpeta-archivo por sección
  styles/     tokens, base, layout, componentes
  ui/         botones, campos, tablas auxiliares, pestañas, avisos
```

Para servir en producción hace falta que el servidor devuelva `index.html` en cualquier ruta bajo `/capbroker-demo/`.

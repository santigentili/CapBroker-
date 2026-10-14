# Design

Modo: Operate (herramienta de trabajo diaria). Un solo tema claro: escritorio de oficina de día.

## Mundo visual
Papel y carpeta de productor: superficies neutras verdosas, tinta casi negra con tinte verde, un único acento petróleo. Sin degradados, sin sombras en reposo, sin emojis. Los estados se distinguen siempre por ícono más texto, nunca solo por color.

## Color (tokens en `web/src/styles/tokens.css`)
- Fondo `#f6f7f5`, superficie `#ffffff`, barra lateral `#e9ede9`, tinta `#14201c`.
- Acento (acciones primarias, selección): petróleo `#0e4f5c`.
- Semánticos: vigente verde, por vencer ámbar, vencida rojo, cada uno con fondo tonal y texto ≥4.5:1.

## Tipografía
IBM Plex Sans autoalojada (400/500/600), una sola familia. Escala fija en rem: 13 / 14 / 15 (base) / 17 / 20 / 26. Cifras tabulares en toda la interfaz (montos, fechas, patentes).

## Forma y componentes
- Radio 6px en botones y campos, 10px en paneles. Botones rectos con ícono Lucide a la izquierda.
- Botones: primario (petróleo), secundario (borde), silencioso (texto), peligro (tono rojo). Todos con hover, foco visible, activo, deshabilitado y cargando.
- Tablas reales con encabezado; en pantallas angostas cada fila pasa a bloque con etiquetas.
- Detalle y avisos van en paneles en línea, sin modales.

## Movimiento
150–250 ms, solo para estado (hover, panel lateral del menú, aviso emergente). Respeta `prefers-reduced-motion`.

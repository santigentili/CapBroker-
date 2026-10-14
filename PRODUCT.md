# Product

<!-- impeccable:product-schema 1 -->

> Registro inferido del pedido inicial del usuario (sin entrevista formal). Lo marcado "sin definir" no se inventa.

## Platform

web

## Stack
delegated: Vite + React + TypeScript + React Router; fuentes e íconos empaquetados, sin pedidos a servicios externos. El usuario no eligió stack; se eligió para poder sumar backend y seguridad después sin reescribir la interfaz.

## Users
Productores asesores de seguros particulares de Argentina. Trabajan solos o con equipo chico, con carteras de asegurados repartidas en varias compañías, cada una con su propio portal. Usan la herramienta a diario, en escritorio y a veces desde el celular.

## Product Purpose
Concentrar en un solo lugar la cartera de pólizas del productor para: buscar rápido (nombre, patente, referencia), controlar vencimientos y avisar a los asegurados por WhatsApp o mail, cotizar en varias compañías sin entrar a cada portal, comparar facturación y comisiones por compañía y ramo, y facturar con AFIP. Éxito: el productor deja de entrar compañía por compañía y de escribirle uno a uno a los asegurados.

## Positioning
Herramienta por usuario (cada productor carga sus credenciales o sus PDF y su cartera), no un portal de una compañía.

## Operating Context
- Origen de datos, en este orden de preferencia: conexión a la cuenta del productor en cada compañía (si es técnicamente posible) o, si no, carga manual de PDF a una base propia. Ambos caminos deben dar la misma funcionalidad.
- Ramos actuales: Automotor, ART, AP (accidentes personales), Hogar, Vida, Comercio.
- Cada compañía paga un porcentaje de comisión distinto según el ramo; el productor debe poder editarlo por compañía y ramo.
- Idioma: español rioplatense (Argentina). Moneda: pesos argentinos.

## Capabilities and Constraints
- Buscador propio sobre toda la cartera.
- Sección de pólizas vencidas con aviso por WhatsApp, mail o ambos.
- Configuración por usuario: credenciales de compañías, carga de Excel/PDF de asegurados.
- Cotizador / recotizador multi-compañía con PDF de cotización (solo con compañías conectadas).
- Comparativa de facturación, premios, comisiones y pólizas activas por compañía.
- Facturación AFIP: flujo sin definir; el usuario lo explicará después.
- Seguridad (credenciales, datos personales): las instrucciones llegan en una etapa posterior. Esta etapa es solo interfaz, sin persistencia ni envíos reales.

## Evidence on Hand
No hay datos reales, clientes, testimonios ni logos. Los datos de /test son inventados y deben decirlo en pantalla. Nunca usar marcas reales de compañías con datos inventados.

## Product Principles
1. Primero la tarea de hoy: lo que vence y lo que hay que avisar.
2. Dos caminos de datos (conexión o PDF) con la misma interfaz.
3. Nada se envía ni se guarda sin que el productor lo vea y confirme.
4. Sin datos inventados en la versión principal; los estados vacíos enseñan qué cargar.

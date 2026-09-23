# Firmador de Diplomas en PDF

Firma digitalmente diplomas en PDF con una imagen de firma (PNG). Sube el PDF y la firma, ubícala una sola vez sobre la primera hoja y el sistema la replica automáticamente en la **misma posición** en todas las páginas (hasta 300 diplomas por archivo).

Pensado para el vicedecanato: no requiere instalar nada, se usa desde el navegador y **los documentos nunca salen del equipo**.

## Uso

1. Sube el PDF con los diplomas.
2. Sube la imagen de la firma (idealmente PNG con transparencia).
3. Arrastra la firma a su posición en la primera hoja (ajusta tamaño y rotación).
4. Pulsa **"Aplicar a todas las páginas"** y descarga el PDF firmado.

## Sitio publicado

**https://kurterodrigo.github.io/pdf-firmador-diplomas/**

Cada push a `main` regenera el sitio automáticamente (~1 min).

## Ejecutar en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

> Los módulos JS requieren un servidor: no funciona abriendo `index.html` con doble clic.

## Tecnología y arquitectura

- 100% en el navegador (**sin servidor ni base de datos**), hosting gratuito en GitHub Pages.
- **PDF.js** renderiza la primera hoja para posicionar la firma.
- **pdf-lib** incrusta la firma una sola vez y la reutiliza por referencia en todas las páginas.
- Código modular con **principios SOLID** e inyección de dependencias.

```
js/
├── main.js                 Orquestador (inyección de dependencias)
├── uploaders/              Subida y validación de PDF y firma
├── preview/                Render de la hoja con PDF.js
├── positioning/            Arrastre/escala/rotación + px → puntos PDF
├── processing/             Replicado de la firma en todas las páginas
├── export/                 Descarga del PDF firmado
└── ui/                     Componentes y barra de progreso
```

## Documentación completa

Ver el plan, arquitectura, riesgos y visión comercial en [`PROYECTO.md`](PROYECTO.md).

## Estado

MVP funcional y publicado. Próximos pasos: pruebas con diplomas reales del área de postgrado, y roadmap de producto en la sección 11 del documento.
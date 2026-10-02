/**
 * Replicador
 * Responsabilidad única: incrustar las firmas y replicarlas en la misma
 * posición en todas las páginas del PDF con pdf-lib.
 * Contrato: aplicar(bytesPdf, firmas, progreso) -> Promise<Uint8Array>
 * firmas: [{ bytes, x, y, ancho, alto, rotacion }]
 * La librería PDFLib se recibe por inyección (principio D).
 * Cada imagen se incrusta una sola vez y se reutiliza por referencia.
 */
export class Replicador {
  constructor({ PDFLib }) {
    this.PDFLib = PDFLib;
  }

  async aplicar(bytesPdf, firmas, progreso) {
    const documento = await this.PDFLib.PDFDocument.load(bytesPdf);

    const imagenes = [];
    for (const firma of firmas) {
      let imagen;
      try {
        imagen = await documento.embedPng(firma.bytes);
      } catch (error) {
        imagen = await documento.embedJpg(firma.bytes);
      }
      imagenes.push({ imagen, ...firma });
    }

    const paginas = documento.getPages();
    for (let i = 0; i < paginas.length; i++) {
      const pagina = paginas[i];
      for (const firma of imagenes) {
        pagina.drawImage(firma.imagen, {
          x: firma.x,
          y: firma.y,
          width: firma.ancho,
          height: firma.alto,
          rotate: this.PDFLib.degrees(firma.rotacion || 0),
        });
      }
      if (progreso) progreso.actualizar(Math.round(((i + 1) / paginas.length) * 100));
    }

    return documento.save();
  }
}
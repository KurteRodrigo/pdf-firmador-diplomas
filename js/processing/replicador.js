/**
 * Replicador
 * Responsabilidad única: incrustar la firma y replicarla en la misma posición
 * en todas las páginas del PDF con pdf-lib.
 * Contrato: aplicar(bytesPdf, bytesFirma, posicion, progreso) -> Promise<Uint8Array>
 * La librería PDFLib se recibe por inyección (principio D).
 * La imagen se incrusta una sola vez y se reutiliza por referencia en cada página.
 */
export class Replicador {
  constructor({ PDFLib }) {
    this.PDFLib = PDFLib;
  }

  async aplicar(bytesPdf, bytesFirma, posicion, progreso) {
    const documento = await this.PDFLib.PDFDocument.load(bytesPdf);

    let imagen;
    try {
      imagen = await documento.embedPng(bytesFirma);
    } catch (error) {
      imagen = await documento.embedJpg(bytesFirma);
    }

    const paginas = documento.getPages();
    for (let i = 0; i < paginas.length; i++) {
      paginas[i].drawImage(imagen, {
        x: posicion.x,
        y: posicion.y,
        width: posicion.ancho,
        height: posicion.alto,
        rotate: this.PDFLib.degrees(posicion.rotacion || 0),
      });
      if (progreso) progreso.actualizar(Math.round(((i + 1) / paginas.length) * 100));
    }

    return documento.save();
  }
}
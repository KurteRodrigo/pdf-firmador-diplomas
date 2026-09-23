/**
 * VistaPrevia
 * Responsabilidad única: renderizar la primera hoja del PDF en un canvas con PDF.js.
 * Contrato: renderizar(arrayBuffer, numeroPagina, canvas) -> Promise<PdfDocument>
 * Expone: paginaSizePts { width, height } (tamaño de la página en puntos PDF)
 * La librería pdfjsLib se recibe por inyección (principio D).
 */
export class VistaPrevia {
  constructor({ pdfjsLib }) {
    this.pdfjsLib = pdfjsLib;
    this.paginaSizePts = null;
  }

  async renderizar(arrayBuffer, numeroPagina, canvas) {
    const documento = await this.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pagina = await documento.getPage(numeroPagina);
    const base = pagina.getViewport({ scale: 1 });
    this.paginaSizePts = { width: base.width, height: base.height };

    const escala = 1.5;
    const viewport = pagina.getViewport({ scale: escala });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;

    const contexto = canvas.getContext('2d');
    await pagina.render({ canvasContext: contexto, viewport }).promise;
    return documento;
  }
}
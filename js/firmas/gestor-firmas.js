/**
 * GestorFirmas
 * Responsabilidad única: administrar la carga y posicionamiento de una o más
 * firmas sobre el lienzo. Cada firma obtiene su propia capa de imagen y su
 * propio Posicionador, de modo que no hay límite fijo de firmas.
 * Dependencias inyectadas: Posicionador (clase) y UploaderFirma (principio D).
 */
export class GestorFirmas {
  constructor({ lienzo, capa, Posicionador, uploaderFirma }) {
    this.lienzo = lienzo;
    this.capa = capa;
    this.Posicionador = Posicionador;
    this.uploaderFirma = uploaderFirma;
    this.firmas = [];
    this.siguienteIndice = 1;
  }

  get cantidad() {
    return this.firmas.length;
  }

  async agregar(archivo, controlTamano, controlRotacion) {
    const img = document.createElement('img');
    img.className = 'firma-overlay';
    img.alt = `Firma ${this.siguienteIndice}`;
    img.draggable = false;
    this.capa.appendChild(img);

    const posicionador = new this.Posicionador(this.lienzo, img, controlTamano, controlRotacion);
    img.src = await this.uploaderFirma.cargar(archivo);
    posicionador.activar();

    const registro = { archivo, posicionador };
    this.firmas.push(registro);
    this.siguienteIndice++;
    return registro;
  }
}
/**
 * Posicionador
 * Responsabilidad única: manejar el arrastre, el tamaño y la rotación de la
 * firma sobre el lienzo. Todas las posiciones se expresan en pixeles
 * relativos al lienzo (canvas), no al viewport.
 * No conoce PDFs ni imágenes (principio I).
 * Contrato: activar(), getEstado() -> { x, y, ancho, alto, rotacion }
 */
export class Posicionador {
  constructor(lienzo, firma, controlTamano, controlRotacion) {
    this.lienzo = lienzo;
    this.firma = firma;
    this.controlTamano = controlTamano;
    this.controlRotacion = controlRotacion;
    this.activo = false;
    this.arrastrando = false;
    this.x = 0;
    this.y = 0;
    this.rotacion = 0;
  }

  activar() {
    this.activo = true;
    this.arrastrando = false;
    this.firma.addEventListener('mousedown', this.alIniciarArrastre.bind(this));
    document.addEventListener('mousemove', this.alMover.bind(this));
    document.addEventListener('mouseup', this.alSoltar.bind(this));
    this.controlTamano.addEventListener('input', this.alAjustarTamano.bind(this));
    this.controlRotacion.addEventListener('input', this.alRotar.bind(this));
  }

  obtenerLienzoRect() {
    return this.lienzo.getBoundingClientRect();
  }

  alIniciarArrastre(evento) {
    const rect = this.obtenerLienzoRect();
    this.arrastrando = true;
    this.desfaseX = evento.clientX - rect.left - this.x;
    this.desfaseY = evento.clientY - rect.top - this.y;
  }

  alMover(evento) {
    if (!this.arrastrando) return;
    const rect = this.obtenerLienzoRect();
    this.x = evento.clientX - rect.left - this.desfaseX;
    this.y = evento.clientY - rect.top - this.desfaseY;
    this.firma.style.left = `${this.x}px`;
    this.firma.style.top = `${this.y}px`;
  }

  alSoltar() {
    this.arrastrando = false;
  }

  alAjustarTamano(evento) {
    const porcentaje = parseInt(evento.target.value, 10);
    this.firma.style.width = `${porcentaje}%`;
  }

  alRotar(evento) {
    this.rotacion = parseInt(evento.target.value, 10);
    this.firma.style.transform = `rotate(${this.rotacion}deg)`;
  }

  getEstado() {
    const rect = this.firma.getBoundingClientRect();
    return {
      x: this.x,
      y: this.y,
      ancho: rect.width,
      alto: rect.height,
      rotacion: this.rotacion,
    };
  }
}
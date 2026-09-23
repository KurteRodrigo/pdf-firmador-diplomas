/**
 * Posicionador
 * Responsabilidad única: manejar el arrastre y el tamaño de la firma sobre el lienzo.
 * No conoce PDFs ni imágenes: solo trabaja con pixeles en pantalla (principio I).
 * Contrato: activar(), getEstado() -> { x, y, ancho, alto, rotacion }
 */
export class Posicionador {
  constructor(lienzo, firma, controlTamano) {
    this.lienzo = lienzo;
    this.firma = firma;
    this.controlTamano = controlTamano;
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
  }

  alIniciarArrastre(evento) {
    this.arrastrando = true;
    this.desfaseX = evento.clientX - this.x;
    this.desfaseY = evento.clientY - this.y;
  }

  alMover(evento) {
    if (!this.arrastrando) return;
    this.x = evento.clientX - this.desfaseX;
    this.y = evento.clientY - this.desfaseY;
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

  getEstado() {
    const rect = this.firma.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      ancho: rect.width,
      alto: rect.height,
      rotacion: this.rotacion,
    };
  }
}
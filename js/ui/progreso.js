/**
 * Progreso
 * Responsabilidad única: reflejar el avance del procesamiento en la UI.
 * Contrato: iniciar(), actualizar(porcentaje), finalizar()
 */
export class Progreso {
  constructor(elementoTexto, panel, barra) {
    this.texto = elementoTexto;
    this.panel = panel;
    this.barra = barra;
  }

  iniciar() {
    this.mostrarPanel();
    this.mostrarBarra(0);
  }

  actualizar(porcentaje) {
    this.mostrarBarra(porcentaje);
  }

  finalizar() {
    this.texto.textContent = 'Listo';
  }

  mostrarPanel() {
    if (this.panel) this.panel.classList.remove('oculto');
  }

  mostrarBarra(porcentaje) {
    this.texto.textContent = `Procesando… ${porcentaje}%`;
    if (this.barra) this.barra.style.width = `${porcentaje}%`;
  }
}
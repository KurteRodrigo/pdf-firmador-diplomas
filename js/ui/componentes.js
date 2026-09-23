/**
 * Componentes
 * Responsabilidad única: utilidades de UI mínimas y reutilizables.
 */
export function mostrar(elemento) {
  elemento.classList.remove('oculto');
}

export function ocultar(elemento) {
  elemento.classList.add('oculto');
}
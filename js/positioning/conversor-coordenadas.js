/**
 * ConversorCoordenadas
 * Responsabilidad única: transformar posiciones de pantalla (px) a puntos PDF.
 * Contrato: convertir(estado, contexto) -> { x, y, ancho, alto, rotacion }
 * contexto: { vistaAncho, vistaAlto, paginaAnchoPts, paginaAltoPts }
 * Nota: los PDF usan el origen en la esquina inferior izquierda y el eje Y invertido.
 */
export class ConversorCoordenadas {
  convertir(estado, contexto) {
    const escalaX = contexto.paginaAnchoPts / contexto.vistaAncho;
    const escalaY = contexto.paginaAltoPts / contexto.vistaAlto;
    return {
      x: estado.x * escalaX,
      y: (contexto.vistaAlto - estado.y - estado.alto) * escalaY,
      ancho: estado.ancho * escalaX,
      alto: estado.alto * escalaY,
      rotacion: estado.rotacion,
    };
  }
}
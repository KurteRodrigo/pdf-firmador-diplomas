/**
 * UploaderPDF
 * Responsabilidad única: leer y validar el archivo PDF seleccionado.
 * Contrato: cargar(archivo) -> Promise<ArrayBuffer>
 */
export class UploaderPDF {
  async cargar(archivo) {
    if (!archivo) {
      throw new Error('Seleccione un archivo PDF.');
    }
    if (archivo.type !== 'application/pdf') {
      throw new Error('El archivo seleccionado no es un PDF.');
    }
    return archivo.arrayBuffer();
  }
}
/**
 * UploaderFirma
 * Responsabilidad única: leer y validar la imagen de firma seleccionada.
 * Contrato: cargar(archivo) -> Promise<Url> (URL de objeto para previsualizar)
 */
export class UploaderFirma {
  async cargar(archivo) {
    if (!archivo) {
      throw new Error('Seleccione una imagen de firma.');
    }
    if (!archivo.type.startsWith('image/')) {
      throw new Error('La firma debe ser un archivo de imagen (PNG, JPG o WebP).');
    }
    return URL.createObjectURL(archivo);
  }
}
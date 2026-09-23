/**
 * Exportador
 * Responsabilidad única: convertir los bytes del PDF firmado en una descarga.
 * Contrato: descargar(bytes, nombre)
 */
export class Exportador {
  descargar(bytes, nombre) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    URL.revokeObjectURL(url);
  }
}
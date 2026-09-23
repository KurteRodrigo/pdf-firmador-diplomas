/**
 * main.js
 * Punto de entrada u orquestador. No contiene lógica de dominio:
 * solo obtiene los elementos del DOM, instancia los módulos y les
 * inyecta sus dependencias (principio D: el flujo no se acopla a librerías).
 */
import { UploaderPDF } from './uploaders/uploader-pdf.js';
import { UploaderFirma } from './uploaders/uploader-firma.js';
import { VistaPrevia } from './preview/vista-previa.js';
import { Posicionador } from './positioning/posicionador.js';
import { ConversorCoordenadas } from './positioning/conversor-coordenadas.js';
import { Replicador } from './processing/replicador.js';
import { Exportador } from './export/exportador.js';
import { Progreso } from './ui/progreso.js';
import { mostrar } from './ui/componentes.js';

const PDFLib = window.PDFLib;
const pdfjsLib = window.pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';

const el = {
  inputPdf: document.getElementById('input-pdf'),
  inputFirma: document.getElementById('input-firma'),
  lienzoPanel: document.getElementById('lienzo-panel'),
  canvas: document.getElementById('canvas-pagina'),
  firma: document.getElementById('firma-arrastrable'),
  controles: document.getElementById('controles'),
  controlTamano: document.getElementById('control-tamano'),
  btnAplicar: document.getElementById('btn-aplicar'),
  progresoPanel: document.getElementById('progreso-panel'),
  textoProgreso: document.getElementById('texto-progreso'),
  rellenoProgreso: document.getElementById('relleno-progreso'),
};

const uploaderPDF = new UploaderPDF();
const uploaderFirma = new UploaderFirma();
const vistaPrevia = new VistaPrevia({ pdfjsLib });
const posicionador = new Posicionador(el.canvas, el.firma, el.controlTamano);
const conversor = new ConversorCoordenadas();
const replicador = new Replicador({ PDFLib });
const exportador = new Exportador();
const progreso = new Progreso(el.textoProgreso, el.progresoPanel, el.rellenoProgreso);

let pdfBytes = null;
let firmaFile = null;

el.inputPdf.addEventListener('change', async () => {
  try {
    pdfBytes = await uploaderPDF.cargar(el.inputPdf.files[0]);
    await vistaPrevia.renderizar(pdfBytes, 1, el.canvas);
    mostrar(el.firma);
    posicionador.activar();
    mostrar(el.lienzoPanel);
  } catch (error) {
    alert(error.message);
  }
});

el.inputFirma.addEventListener('change', async () => {
  try {
    firmaFile = el.inputFirma.files[0];
    el.firma.src = await uploaderFirma.cargar(firmaFile);
    mostrar(el.controles);
  } catch (error) {
    alert(error.message);
  }
});

el.btnAplicar.addEventListener('click', async () => {
  if (!pdfBytes || !firmaFile) {
    alert('Suba primero el PDF y la imagen de firma.');
    return;
  }
  try {
    progreso.iniciar();
    const posicion = conversor.convertir(posicionador.getEstado(), {
      vistaAncho: el.canvas.width,
      vistaAlto: el.canvas.height,
      paginaAnchoPts: vistaPrevia.paginaSizePts.width,
      paginaAltoPts: vistaPrevia.paginaSizePts.height,
    });
    const bytesFirmado = await replicador.aplicar(pdfBytes, await firmaFile.arrayBuffer(), posicion, progreso);
    exportador.descargar(bytesFirmado, 'diplomas_firmado.pdf');
  } catch (error) {
    alert(`No se pudo firmar el documento: ${error.message}`);
  } finally {
    progreso.finalizar();
  }
});
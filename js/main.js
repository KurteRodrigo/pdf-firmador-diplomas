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
import { GestorFirmas } from './firmas/gestor-firmas.js';
import { mostrar } from './ui/componentes.js';

const PDFLib = window.PDFLib;
const pdfjsLib = window.pdfjsLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';

const el = {
  inputPdf: document.getElementById('input-pdf'),
  inputsFirma: [
    document.getElementById('input-firma-1'),
    document.getElementById('input-firma-2'),
  ],
  estadosFirma: [
    document.getElementById('estado-firma-1'),
    document.getElementById('estado-firma-2'),
  ],
  controls: [
    {
      tamano: document.getElementById('control-tamano-1'),
      rotacion: document.getElementById('control-rotacion-1'),
    },
    {
      tamano: document.getElementById('control-tamano-2'),
      rotacion: document.getElementById('control-rotacion-2'),
    },
  ],
  lienzoPanel: document.getElementById('lienzo-panel'),
  canvas: document.getElementById('canvas-pagina'),
  capaFirmas: document.getElementById('capas-firmas'),
  controles: document.getElementById('controles'),
  btnAplicar: document.getElementById('btn-aplicar'),
  progresoPanel: document.getElementById('progreso-panel'),
  textoProgreso: document.getElementById('texto-progreso'),
  rellenoProgreso: document.getElementById('relleno-progreso'),
};

const uploaderPDF = new UploaderPDF();
const uploaderFirma = new UploaderFirma();
const vistaPrevia = new VistaPrevia({ pdfjsLib });
const conversor = new ConversorCoordenadas();
const replicador = new Replicador({ PDFLib });
const exportador = new Exportador();
const progreso = new Progreso(el.textoProgreso, el.progresoPanel, el.rellenoProgreso);
const gestorFirmas = new GestorFirmas({
  lienzo: el.canvas,
  capa: el.capaFirmas,
  Posicionador,
  uploaderFirma,
});

let pdfBytes = null;

el.inputPdf.addEventListener('change', async () => {
  try {
    pdfBytes = await uploaderPDF.cargar(el.inputPdf.files[0]);
    await vistaPrevia.renderizar(pdfBytes, 1, el.canvas);
    mostrar(el.lienzoPanel);
  } catch (error) {
    alert(error.message);
  }
});

el.inputsFirma.forEach((input, indice) => {
  input.addEventListener('change', () =>
    registrarFirma(input, el.estadosFirma[indice], el.controls[indice], indice + 1)
  );
});

async function registrarFirma(input, estado, control, numero) {
  const archivo = input.files[0];
  if (!archivo) return;
  estado.textContent = 'Cargando…';
  try {
    await gestorFirmas.agregar(archivo, control.tamano, control.rotacion);
    estado.textContent = `Cargada (firma ${numero})`;
    mostrar(el.controles);
  } catch (error) {
    estado.textContent = 'Error';
    alert(error.message);
  }
}

el.btnAplicar.addEventListener('click', async () => {
  if (!pdfBytes) {
    alert('Suba primero el PDF.');
    return;
  }
  if (gestorFirmas.cantidad === 0) {
    alert('Suba al menos una imagen de firma.');
    return;
  }
  try {
    progreso.iniciar();
    const rectCanvas = el.canvas.getBoundingClientRect();
    const contexto = {
      vistaAncho: rectCanvas.width,
      vistaAlto: rectCanvas.height,
      paginaAnchoPts: vistaPrevia.paginaSizePts.width,
      paginaAltoPts: vistaPrevia.paginaSizePts.height,
    };

    const firmas = [];
    for (const registro of gestorFirmas.firmas) {
      firmas.push({
        bytes: await registro.archivo.arrayBuffer(),
        ...conversor.convertir(registro.posicionador.getEstado(), contexto),
      });
    }

    const bytesFirmado = await replicador.aplicar(pdfBytes, firmas, progreso);
    exportador.descargar(bytesFirmado, 'diplomas_firmado.pdf');
  } catch (error) {
    alert(`No se pudo firmar el documento: ${error.message}`);
  } finally {
    progreso.finalizar();
  }
});
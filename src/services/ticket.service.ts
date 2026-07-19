import PDFDocument from 'pdfkit';
import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';
import { Response } from 'express';

export class TicketService {
  async generarTicket(solicitudId: string, res: Response) {
    const { data: solicitud, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        clientes(*, usuarios(nombre, apellido, email, telefono)),
        dispositivos(*, modelos(*, marcas(*))),
        servicios(*),
        sucursales(*)
      `)
      .eq('id', solicitudId)
      .single();

    if (error || !solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: estados } = await supabase
      .from('estado_dispositivo')
      .select('*')
      .eq('solicitud_id', solicitudId)
      .eq('tipo', 'ingreso')
      .single();

    const { data: cotizacion } = await supabase
      .from('cotizaciones')
      .select('*')
      .eq('solicitud_id', solicitudId)
      .single();

    const { data: diagnostico } = await supabase
      .from('diagnosticos')
      .select('*')
      .eq('solicitud_id', solicitudId)
      .single();

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${solicitud.codigo_seguimiento}.pdf`);

    doc.pipe(res);

    this.drawHeader(doc);
    this.drawDatosOrden(doc, solicitud);
    this.drawDatosCliente(doc, solicitud);
    this.drawDatosDispositivo(doc, solicitud);
    
    if (estados) {
      this.drawDiagnosticoInicial(doc, estados);
    }
    
    if (diagnostico) {
      this.drawDiagnosticoTecnico(doc, diagnostico);
    }
    
    if (cotizacion) {
      this.drawPresupuesto(doc, cotizacion);
    }
    
    this.drawFooter(doc, solicitud);

    doc.end();
  }

  private drawHeader(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#2563eb')
      .text('TecniCel', 50, 50)
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#666666')
      .text('Servicio Tecnico de Celulares', 50, 75)
      .text('Av. Principal 123, Lima, Peru', 50, 90)
      .text('Tel: (01) 234-5678 | Email: info@tecnicel.com', 50, 105)
      .moveDown(2);

    doc
      .moveTo(50, 130)
      .lineTo(550, 130)
      .stroke('#2563eb');
  }

  private drawDatosOrden(doc: PDFKit.PDFDocument, solicitud: any) {
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('ORDEN DE SERVICIO', 50, 150);

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#dc2626')
      .text(`Codigo: ${solicitud.codigo_seguimiento}`, 50, 175);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#000000')
      .text(`Fecha de ingreso: ${new Date(solicitud.created_at).toLocaleDateString('es-PE')}`, 50, 200)
      .text(`Modalidad: ${solicitud.modalidad}`, 50, 215)
      .text(`Sucursal: ${solicitud.sucursales?.nombre || 'No asignada'}`, 50, 230);
  }

  private drawDatosCliente(doc: PDFKit.PDFDocument, solicitud: any) {
    const cliente = solicitud.clientes?.usuarios;
    
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text('DATOS DEL CLIENTE', 50, 260);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Nombre: ${cliente?.nombre || ''} ${cliente?.apellido || ''}`, 50, 280)
      .text(`Telefono: ${cliente?.telefono || 'No registrado'}`, 50, 295)
      .text(`Email: ${cliente?.email || 'No registrado'}`, 50, 310);
  }

  private drawDatosDispositivo(doc: PDFKit.PDFDocument, solicitud: any) {
    const dispositivo = solicitud.dispositivos;
    const modelo = dispositivo?.modelos;
    const marca = modelo?.marcas;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('DATOS DEL DISPOSITIVO', 50, 340);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Marca: ${marca?.nombre || 'No especificada'}`, 50, 360)
      .text(`Modelo: ${modelo?.nombre || 'No especificado'}`, 50, 375)
      .text(`Servicio: ${solicitud.servicios?.nombre || 'No especificado'}`, 50, 390)
      .text(`Problema reportado: ${solicitud.descripcion_problema || 'No especificado'}`, 50, 405, {
        width: 500,
        align: 'left',
      });
  }

  private drawDiagnosticoInicial(doc: PDFKit.PDFDocument, estado: any) {
    let yPos = 440;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('ESTADO INICIAL DEL DISPOSITIVO', 50, yPos);

    yPos += 20;

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Estado general: ${estado.estado_general || 'No evaluado'}`, 50, yPos);
    yPos += 15;

    doc.text(`Pantalla: ${estado.pantalla_estado || 'No evaluado'}`, 50, yPos);
    yPos += 15;

    doc.text(`Carcasa: ${estado.carcasa_estado || 'No evaluado'}`, 50, yPos);
    yPos += 15;

    doc.text(`Botones: ${estado.botones_estado || 'No evaluado'}`, 50, yPos);
    yPos += 15;

    doc.text(`Camara: ${estado.camara_estado || 'No evaluado'}`, 50, yPos);
    yPos += 15;

    doc.text(`Audio: ${estado.audio_estado || 'No evaluado'}`, 50, yPos);
    yPos += 15;

    doc.text(`Bateria: ${estado.carga_bateria !== null ? estado.carga_bateria + '%' : 'No evaluado'}`, 50, yPos);
    yPos += 15;

    if (estado.accesorios_entregados && estado.accesorios_entregados.length > 0) {
      doc.text(`Accesorios: ${estado.accesorios_entregados.join(', ')}`, 50, yPos);
      yPos += 15;
    }

    if (estado.observaciones) {
      doc.text(`Observaciones: ${estado.observaciones}`, 50, yPos, { width: 500 });
      yPos += 30;
    }

    if (estado.observaciones_adicionales) {
      doc.text(`Notas adicionales: ${estado.observaciones_adicionales}`, 50, yPos, { width: 500 });
    }
  }

  private drawDiagnosticoTecnico(doc: PDFKit.PDFDocument, diagnostico: any) {
    let yPos = 520;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('DIAGNOSTICO TECNICO', 50, yPos);

    yPos += 20;

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Problema detectado: ${diagnostico.problema_detectado}`, 50, yPos, { width: 500 });
    yPos += 20;

    doc.text(`Solucion propuesta: ${diagnostico.solucion_propuesta}`, 50, yPos, { width: 500 });
  }

  private drawPresupuesto(doc: PDFKit.PDFDocument, cotizacion: any) {
    let yPos = 580;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('PRESUPUESTO ESTIMADO', 50, yPos);

    yPos += 20;

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Mano de obra: S/ ${cotizacion.mano_de_obra || '0.00'}`, 50, yPos);
    yPos += 15;

    doc.text(`Descuento: S/ ${cotizacion.descuento || '0.00'}`, 50, yPos);
    yPos += 15;

    doc.text(`Impuesto: S/ ${cotizacion.impuesto || '0.00'}`, 50, yPos);
    yPos += 15;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`TOTAL: S/ ${cotizacion.total || '0.00'}`, 50, yPos);
  }

  private drawFooter(doc: PDFKit.PDFDocument, solicitud: any) {
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#666666')
      .text('INSTRUCCIONES PARA EL CLIENTE', 50, 700, { width: 500 })
      .fontSize(8)
      .text('1. Guarde este ticket para recoger su equipo', 50, 715, { width: 500 })
      .text('2. Rastree el estado de su reparacion en: www.tecnicel.com/tracking', 50, 728, { width: 500 })
      .text(`3. Su codigo de seguimiento es: ${solicitud.codigo_seguimiento}`, 50, 741, { width: 500 })
      .text('4. Tiempo estimado de reparacion: 3-5 dias habiles', 50, 754, { width: 500 });
  }
}

export const ticketService = new TicketService();

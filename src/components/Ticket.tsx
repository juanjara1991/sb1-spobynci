import React, { useEffect } from 'react';
import { Ticket as TicketType } from '../types';

interface TicketProps {
  ticket: TicketType;
  onPrintComplete: () => void;
}

function Ticket({ ticket, onPrintComplete }: TicketProps) {
  useEffect(() => {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write the ticket content to the iframe
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Número ${ticket.prefix}${ticket.number}</title>
          <style>
            @page {
              size: 80mm 150mm;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10mm;
              width: 60mm;
            }
            .ticket {
              text-align: center;
            }
            .header {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 5mm;
              padding-bottom: 5mm;
              border-bottom: 1px solid #000;
            }
            .number {
              font-size: 36pt;
              font-weight: bold;
              margin: 5mm 0;
            }
            .type {
              font-size: 18pt;
              margin: 5mm 0;
              font-weight: bold;
            }
            .date {
              font-size: 10pt;
              margin: 5mm 0;
            }
            .footer {
              margin-top: 5mm;
              font-size: 10pt;
              padding-top: 5mm;
              border-top: 1px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              CESFAM Dr. Aníbal Ariztía
            </div>
            <div class="type">
              NÚMERO ${ticket.isPreferential ? 'PREFERENTE' : 'GENERAL'}
            </div>
            <div class="number">
              ${ticket.prefix}${ticket.number}
            </div>
            <div class="date">
              Fecha: ${ticket.arrivalTime.toLocaleDateString()}<br>
              Hora: ${ticket.arrivalTime.toLocaleTimeString()}
            </div>
            <div class="footer">
              Por favor, espere a ser llamado
            </div>
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();

      // Print the iframe content
      iframe.contentWindow?.print();

      // Remove the iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
        onPrintComplete();
      }, 1000);
    }
  }, [ticket, onPrintComplete]);

  return null;
}

export default Ticket;
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PlanActionPdfService {
    
    openPDFInNewWindow(): void {
        const pdfDoc = this.generatePDF();
        
        // 1. Créer un blob avec le bon type MIME
        const blob = pdfDoc.output('blob');
        
        // 2. Créer un objet File pour forcer le nom
        const file = new File([blob], "Plan d'action.pdf", { type: 'application/pdf' });
        
        // 3. Créer une URL objet
        const fileUrl = URL.createObjectURL(file);
        
        // 4. Ouvrir dans un nouvel onglet avec iframe
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Plan d'action</title>
              <style>
                html, body { 
                  margin: 0; 
                  padding: 0; 
                  height: 100%; 
                  overflow: hidden; 
                }
                iframe { 
                  border: none; 
                  width: 100%; 
                  height: 100%; 
                }
              </style>
            </head>
            <body>
              <iframe src="${fileUrl}" title="Plan d'action"></iframe>
            </body>
            </html>
          `);
          newWindow.document.close();
          
          // 5. Activer le téléchargement via un lien caché
          const downloadLink = newWindow.document.createElement('a');
          downloadLink.href = "fileUrl";
          downloadLink.download = "Plan d'action.pdf";
          downloadLink.style.display = 'none';
          newWindow.document.body.appendChild(downloadLink);
          
          // 6. Nettoyer après 10 secondes
          setTimeout(() => {
            URL.revokeObjectURL(fileUrl);
            newWindow.document.body.removeChild(downloadLink);
          }, 10000);
        }
      }

  generatePDF() {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    
    // Configuration de base
    doc.setLineWidth(0.2);
    
    // En-tête
    doc.setFontSize(7);
    doc.text('IT 3 455-05', margin, 10);
    doc.text('Annexe 4 Etat 09.2018', margin, 15);
    doc.text('Page 1 sur 4', margin, 20);
    
    // Titre et logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Plan d\'action', pageWidth / 2, 20, { align: 'center' });
    
    const logoLeoni = 'LEONI';
    const currentTextColor = doc.getTextColor();
    doc.setTextColor('#005c96');
    doc.text(logoLeoni, pageWidth - margin - 5, 20, { align: 'right' });
    doc.setTextColor(currentTextColor);

    // ========== TABLEAU CENTRAL ==========
    const columns = [
      { header: 'Nr', dataKey: 'nr', width: 8 },
      { header: 'Date', dataKey: 'date', width: 25 },
      { header: 'Description de problème', dataKey: 'probleme', width: 50 },
      { header: 'Matricule Opérateur/Chef de ligne', dataKey: 'matricule', width: 40 },
      { header: 'Description des décisions prises', dataKey: 'decisions', width: 50 },
      { header: 'Délais', dataKey: 'delais', width: 20 },
      { header: 'Responsable', dataKey: 'responsable', width: 20 },
      { header: 'Contremaitre', dataKey: 'contremetre', width: 20 }, // Notez l'orthographe ici
      { header: 'Maintenance', dataKey: 'maintenance', width: 20 },
      { header: 'Qualité', dataKey: 'qualite', width: 20 }
  ];
  // Création des données avec vérification explicite
const tableData = [];
for (let i = 0; i < 14; i++) {
    tableData.push({
        nr: i + 1,
        date: '',
        probleme: '',
        matricule: '',
        decisions: '',
        delais: '',
        responsable: '',
        contremetre: '',
        maintenance: '',
        qualite: ''
    });
}

    // Configuration des en-têtes
    const headers = [
        [
            { content: 'Nr', rowSpan: 2 },
            { content: 'Date', rowSpan: 2 },
            { content: 'Description de problème', rowSpan: 2 },
            { content: 'Matricule Opérateur/Chef de ligne', rowSpan: 2 },
            { content: 'Description des décisions prises', rowSpan: 2 },
            { content: 'Délais', rowSpan: 2 },
            { content: 'Responsable', rowSpan: 2 },
            { content: 'Signature', colSpan: 3 }
        ],
        [
            // Cellules vides pour les colonnes avec rowSpan
            '', '', '', '', '', '', '',
            'Contremaitre', 
            'Maintenance', 
            'Qualité'
        ]
    ];

    autoTable(doc, {
      columns: columns, 
      head: [
          [
              { content: 'Nr', rowSpan: 2 },
              { content: 'Date', rowSpan: 2 },
              { content: 'Description de problème', rowSpan: 2 },
              { content: 'Matricule Opérateur/Chef de ligne', rowSpan: 2 },
              { content: 'Description des décisions prises', rowSpan: 2 },
              { content: 'Délais', rowSpan: 2 },
              { content: 'Responsable', rowSpan: 2 },
              { content: 'Signature', colSpan: 3, rowSpan: 1 }
          ],
          [
              // Ces cellules seront automatiquement masquées par la fusion
              { content: 'Contremaitre' },
              { content: 'Maintenance' },
              { content: 'Qualité' }
          ]
      ],
      body: tableData,
       foot: [
        [
            { 
                content: 'Remarque :', 
                colSpan: 10,
                styles: {
                    halign: 'left',
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    cellPadding: { top: 5, bottom: 5 }
                }
            }
        ]
    ],
      startY: 25,
      margin: { left: margin, right: margin },
      styles: {
          fontSize: 7,
          cellPadding: 2.5,
          halign: 'center',
          valign: 'middle',
          textColor: [0, 0, 0],
          fillColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          lineWidth: 0.2
      },
      columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 25, halign: 'left' },
          2: { cellWidth: 50, halign: 'left' },
          3: { cellWidth: 40, halign: 'left' },
          4: { cellWidth: 50, halign: 'left' },
          5: { cellWidth: 20, halign: 'left' },
          6: { cellWidth: 20, halign: 'left' },
          7: { cellWidth: 20, halign: 'center' },
          8: { cellWidth: 20, halign: 'center' },
          9: { cellWidth: 20, halign: 'center' }
      },
      headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.3,
          minCellHeight: 6
      },
      bodyStyles: {
          minCellHeight: 10,
          lineWidth: 0.2
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.2
    },
      alternateRowStyles: {
          fillColor: [245, 245, 245]
      },
      didParseCell: (data) => {
          if (data.section === 'head' && data.row.index === 1) {
              // S'assurer que les sous-titres (Contremaitre, Maintenance, Qualité) sont visibles
              data.cell.styles.fillColor = [255, 255, 255];
              data.cell.styles.textColor = [0, 0, 0];
              data.cell.styles.lineWidth = 0.2;
          }
      }
  });

    return doc;
}
}
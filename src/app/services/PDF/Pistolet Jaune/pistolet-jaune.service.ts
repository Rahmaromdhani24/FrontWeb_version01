import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format, addDays } from 'date-fns';
import autoTable from 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PistoletJauneService {

  // Méthode pour ouvrir le PDF dans un nouvel onglet
 openPDFInNewWindow(): void {
    const pdfDoc = this.generatePDF();
    
    // Créer l'URL du blob
    const pdfBlob = pdfDoc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Ouvrir dans un nouvel onglet
    const newWindow = window.open(pdfUrl, '_blank');
    
    // Nettoyer la mémoire après que la fenêtre est chargée
    if (newWindow) {
      newWindow.onload = () => {
        URL.revokeObjectURL(pdfUrl);
      };
    }
  }
  generatePDF() {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const tableStartY = 50;
    
    // Configuration de l'épaisseur des lignes
    const normalLineWidth = 0.2; // Épaisseur normale pour toutes les lignes
    doc.setLineWidth(normalLineWidth);
    
    // En-tête (reste identique)
    doc.setFontSize(7);
    doc.text('IT 3 455-05', margin, 10);
    doc.text('Annexe 4 Etat 09.2018', margin, 15);
    doc.text('Page 1 sur 4', margin, 20);
    
    // Titre principal (reste identique)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const title = 'Carte d\'enregistrement des données du processus "Pistolet collier de serrage"';
    doc.text(title, pageWidth / 2, 20, { align: 'center' });

    
    // ========== TABLEAU VERTICAL ==========
    const centerTableX = pageWidth * 0.009;
    const rowTitles = [
        'Code de répartition',
        '         Date',
        '         Nom',
        'X',  // Rowspan de 5
        'X̄',  // X barre
        '            R', 
        '      Nr courant'
    ];
    
    // Dimensions (reste identique)
    const titleCellWidth = 25;
    const dataCellWidth = 8.5;
    const cellHeight = 7;
    const xRowSpan = 5;
    
    // Styles (reste identique)
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    let currentY = 110;
    let titleIndex = 0;
    
    while (titleIndex < rowTitles.length) {
        const title = rowTitles[titleIndex];
        
        if (title === 'X') {
            // Dessiner la grande cellule de titre (rowspan 5)
            const mergedHeight = cellHeight * xRowSpan;
            doc.rect(centerTableX, currentY, titleCellWidth, mergedHeight, 'S');
            doc.setFont('helvetica', 'bold');
            doc.text('X', centerTableX + titleCellWidth/2, currentY + mergedHeight/2 + 2, { align: 'center' });
            
            // Dessiner les cellules de données pour les 5 lignes
            for (let j = 0; j < xRowSpan; j++) {
                const rowY = currentY + (j * cellHeight);
                for (let col = 0; col < 25; col++) {
                    const x = centerTableX + titleCellWidth + (col * dataCellWidth);
                    doc.rect(x, rowY, dataCellWidth, cellHeight, 'S');
                    doc.text('', x + dataCellWidth/2, rowY + cellHeight/2 + 2, { align: 'center' });
                }
            }
            
            currentY += cellHeight * xRowSpan;
            titleIndex++;
        } else {
            // Cellule de titre
            doc.rect(centerTableX, currentY, titleCellWidth, cellHeight, 'S');
            doc.setFont('helvetica', 'bold');
            
            // Cas spécial pour X̄ (X barre)
            if (title === 'X̄') {
                const xPos = centerTableX + titleCellWidth/2;
                const yPos = currentY + cellHeight/2 + 2;
                
                // Afficher le X
                doc.text('X', xPos, yPos, { align: 'center' });
                
                // Dessiner la barre avec épaisseur normale
                const xWidth = 5;
                doc.setLineWidth(normalLineWidth);
                doc.line(
                    xPos - xWidth/2, 
                    yPos - 4,
                    xPos + xWidth/2,
                    yPos - 4
                );
            } else {
                doc.text(title, centerTableX + 2, currentY + cellHeight/2 + 2);
            }
            
            // Cellules de données
            for (let col = 0; col < 25; col++) {
                const x = centerTableX + titleCellWidth + (col * dataCellWidth);
                doc.rect(x, currentY, dataCellWidth, cellHeight, 'S');
                
                if (title === 'Nr courant') {
                    doc.text((col + 1).toString(), x + dataCellWidth/2, currentY + cellHeight/2 + 2, { align: 'center' });
                  } else {
                    doc.text('', x + dataCellWidth/2, currentY + cellHeight/2 + 2, { align: 'center' });
                  }
            }
            
            currentY += cellHeight;
            titleIndex++;
        }
    }
    
// ========== TABLEAU DE DROITE ==========
const rightTableX = pageWidth * 0.81;
const rightColumns = [
    { header: 'Nr.', width: 8 },
    { header: 'No. de collier', width: 11 },
    { header: 'Axe de serrage', width: 11 },
    { header: 'Semaine', width: 12 },
    { header: 'Décision', width: 12 }
];

const rightBodyData = Array.from({ length: 25 }, (_, i) => [
    i + 1, '', '', '', ''
]);

autoTable(doc, {
    head: [rightColumns.map(col => col.header)],
    body: rightBodyData,
    startY: 30,
    margin: { 
        left: rightTableX,
        right: margin
    },
    styles: {
        fontSize: 6,
        cellPadding: 1.5, // Ajusté pour meilleur espacement
        halign: 'center',
        valign: 'middle',
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.2
    },
    columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { 
            cellWidth: 11,
            halign: 'left', // Alignement à gauche pour mieux remplir
            fontStyle: 'bold',
            cellPadding: { left: 1, right: 1, top: 1, bottom: 1 }
        },
        2: { 
            cellWidth: 11,
            halign: 'left',
            fontStyle: 'bold',
            cellPadding: { left: 1, right: 1, top: 1, bottom: 1 }
        },
        3: { 
            cellWidth: 12,
            halign: 'left',
            fontStyle: 'bold',
            cellPadding: { left:4, right: 1, top: 1, bottom: 1 }
        },
        4: { 
            cellWidth: 12,
            halign: 'left',
            fontStyle: 'bold',
            cellPadding: { left: 4, right: 1, top: 1, bottom: 1 }
        }
    },
    headStyles: {
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        minCellHeight: 8,
        valign: 'middle'
    },
    bodyStyles: {
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.2
    },
    alternateRowStyles: {
        fillColor: [255, 255, 255]
    }
});

   return doc;
}

}
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OperatorDetailsModalComponent } from '../operator-details-modal/operator-details-modal.component';
import { PistoletJauneService } from 'src/app/services/PDF/Pistolet Jaune/pistolet-jaune.service';
import { PlanActionPdfService } from 'src/app/services/PDF/Plan d\'action/plan-action-pdf.service';
interface Operateur {
  id: number;
  nom: string;
}

interface PDEKData {
  reference: string;
  operateur: Operateur;
  process: string;
  segment: string;
  machine : string ; 
  status: string;
  planAction: string | null; // Accepte soit string soit null
}
@Component({
  selector: 'app-liste-pdek',
imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './liste-pdek.component.html',
  styleUrl: './liste-pdek.component.scss'
})
export class ListePDEKComponent {
pdfUrl: string | null = null;
displayedColumns: string[] = [
    'reference',
    'operateurs',
    'process',
    'segment',
    'machine',
    'status',
    'planAction',
    'action'
  ];

  dataSource: MatTableDataSource<PDEKData>;

  // Options des filtres
  processTypes: string[] = ['Torsadage', 'Sertissage', 'Sertissage IDC' ,'Soudure' ,'Pistolet'];
  segments: string[] = ['VW', 'BM'];
  machines: string[] = ['D306', 'D295'];
// Dans votre composant.ts
statuses: string[] = ['en cours', 'Valider', 'Rejeter'];
  // Filtres actuels
  currentProcessFilter: string[] = [];
  currentSegmentFilter: string[] = [];
  currentStatusFilter: string[] = [];
  searchFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog , private pistoletJauneService: PistoletJauneService
            , private planActionPdfService : PlanActionPdfService
  ) {
    this.dataSource = new MatTableDataSource(this.generateDemoData(50));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  generateDemoData(count: number): PDEKData[] {
    const data: PDEKData[] = [];
    const operateurs: Operateur[] = [
      { id: 1, nom: 'Équipe Alpha' },
      { id: 2, nom: 'Équipe Beta' },
      { id: 3, nom: 'Équipe Gamma' }
    ];
  
    for (let i = 1; i <= count; i++) {
      data.push({
        reference: `REF-${1000 + i}`,
        operateur: operateurs[Math.floor(Math.random() * operateurs.length)],
        process: this.processTypes[Math.floor(Math.random() * this.processTypes.length)],
        segment: this.segments[Math.floor(Math.random() * this.segments.length)],
        machine: this.machines[Math.floor(Math.random() * this.machines.length)],
        status: this.statuses[Math.floor(Math.random() * this.statuses.length)],
        planAction: Math.random() > 0.5 ? `Plan-${i}` : null // Correct avec l'interface mise à jour
      });
    }
    return data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchFilter = filterValue.trim().toLowerCase();
    this.applyAllFilters();
  }

  applyProcessFilter(selectedProcesses: string[]) {
    this.currentProcessFilter = selectedProcesses;
    this.applyAllFilters();
  }

  applySegmentFilter(selectedSegments: string[]) {
    this.currentSegmentFilter = selectedSegments;
    this.applyAllFilters();
  }

  applyStatusFilter(selectedStatuses: string[]) {
    this.currentStatusFilter = selectedStatuses;
    this.applyAllFilters();
  }

  applyAllFilters() {
    this.dataSource.filterPredicate = (data: PDEKData, filter: string) => {
      // Filtre de recherche texte
      const searchMatch = !this.searchFilter || 
        data.reference.toLowerCase().includes(this.searchFilter) ||
        data.operateur.nom.toLowerCase().includes(this.searchFilter) ||
        data.process.toLowerCase().includes(this.searchFilter) ||
        data.segment.toLowerCase().includes(this.searchFilter) ||
        data.status.toLowerCase().includes(this.searchFilter);

      // Filtres des listes déroulantes
      const processMatch = this.currentProcessFilter.length === 0 || 
                         this.currentProcessFilter.includes(data.process);
      
      const segmentMatch = this.currentSegmentFilter.length === 0 || 
                         this.currentSegmentFilter.includes(data.segment);
      
      const statusMatch = this.currentStatusFilter.length === 0 || 
                         this.currentStatusFilter.includes(data.status);
      
      return searchMatch && processMatch && segmentMatch && statusMatch;
    };
    
    this.dataSource.filter = 'trigger';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewFilePDEK(row: PDEKData) {
      this.pistoletJauneService.openPDFInNewWindow();
  }
  viewPlanAction(){
    this.planActionPdfService.openPDFInNewWindow();

  }
  printRow(row: PDEKData) {
    console.log('Imprimer:', row);
  }
  getStatusClass(status: string): string {
    // Convertit le statut en format de classe CSS valide
    const statusClass = status.toLowerCase().replace(/ /g, '-').replace('é', 'e');
    return `status-${statusClass}`;
  }

/******************************************************************************************/
viewOperatorsDetails(row: PDEKData) {
  // Données factices pour la démo - à remplacer par vos vraies données
  const operatorsData = [
    {
      matricule: 'EMP123',
      nom: 'Jean Dupont',
      plant: 'Plant A',
      segments: ['Segment 1', 'Segment 2']
    },
    {
      matricule: 'EMP456',
      nom: 'Marie Martin',
      plant: 'Plant B',
      segments: ['Segment 3']
    }
  ];

  this.dialog.open(OperatorDetailsModalComponent, {
    width: '500px',
    data: {
      operators: operatorsData
    }
  });
}

}